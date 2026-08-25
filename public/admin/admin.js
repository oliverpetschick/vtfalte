(() => {
  const { CMS, L, createClass, h } = window;

  const fieldValue = (value, key) => {
    if (!value) return '';
    return typeof value.get === 'function' ? value.get(key) ?? '' : value[key] ?? '';
  };

  const categories = [
    'Sporthalle',
    'Jugendclub',
    'Senior*innenzentrum',
    'Kaufhalle',
    'Gleichrichterunterwerk',
    'Umformerstation',
    'Mehrzweckhalle/Individualbau',
    'Abriss',
  ];

  const CategoryControl = createClass({
    render() {
      const value = String(this.props.value ?? '');
      return h('div', { className: 'vt-category-options' },
        categories.map(label => h('label', { key: label },
          h('input', {
            type: 'radio',
            name: this.props.forID,
            checked: value === label,
            onChange: () => this.props.onChange(label),
          }),
          label,
        )),
      );
    },
  });

  const CoordinateControl = createClass({
    getInitialState() {
      const longitude = String(fieldValue(this.props.value, 'longitude'));
      const latitude = String(fieldValue(this.props.value, 'latitude'));
      return {
        paste: longitude && latitude ? latitude + ', ' + longitude : '',
        error: '',
        longitude,
        latitude,
      };
    },

    componentDidMount() {
      const longitude = Number(this.state.longitude);
      const latitude = Number(this.state.latitude);
      const hasPoint = Number.isFinite(longitude) && Number.isFinite(latitude) && this.state.longitude !== '' && this.state.latitude !== '';
      this.map = L.map(this.mapNode).setView(hasPoint ? [latitude, longitude] : [0, 0], hasPoint ? 15 : 1);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap-Mitwirkende',
      }).addTo(this.map);
      this.map.on('click', event => this.setPoint(event.latlng.lng, event.latlng.lat));
      if (hasPoint) this.setMarker(longitude, latitude);
    },

    componentWillUnmount() {
      this.map?.remove();
    },

    setMarker(longitude, latitude) {
      if (!this.marker) {
        this.marker = L.marker([latitude, longitude], { draggable: true }).addTo(this.map);
        this.marker.on('dragend', event => {
          const point = event.target.getLatLng();
          this.setPoint(point.lng, point.lat);
        });
      } else {
        this.marker.setLatLng([latitude, longitude]);
      }
    },

    setPoint(longitude, latitude) {
      const next = {
        longitude: Number(longitude).toFixed(7).replace(/0+$/, '').replace(/\.$/, ''),
        latitude: Number(latitude).toFixed(7).replace(/0+$/, '').replace(/\.$/, ''),
      };
      this.setState({ ...next, paste: next.latitude + ', ' + next.longitude, error: '' });
      this.setMarker(Number(next.longitude), Number(next.latitude));
      this.props.onChange({ longitude: Number(next.longitude), latitude: Number(next.latitude) });
    },

    handlePaste(event) {
      const paste = event.target.value;
      const coordinates = window.VTAdminUtils.parseGoogleCoordinates(paste);
      if (!coordinates) {
        this.setState({ paste, error: paste ? 'Bitte im Format Breitengrad, Längengrad einfügen.' : '' });
        return;
      }
      this.setState({ paste, error: '' });
      this.setPoint(coordinates.longitude, coordinates.latitude);
      this.map.setView([coordinates.latitude, coordinates.longitude], Math.max(this.map.getZoom(), 12));
    },

    render() {
      return h('div', {},
        h('div', { className: 'vt-coordinate-paste' },
          h('input', {
            type: 'text', value: this.state.paste, placeholder: 'Breitengrad, Längengrad',
            'aria-label': 'Breitengrad, Längengrad',
            onChange: event => this.handlePaste(event),
          }),
          this.state.error && h('span', { className: 'vt-coordinate-error' }, this.state.error),
        ),
        h('div', { className: 'vt-coordinate-map', ref: node => { this.mapNode = node; } }),
      );
    },
  });

  CMS.registerWidget('vt_category', CategoryControl);
  CMS.registerWidget('vt_coordinates', CoordinateControl);
  CMS.registerEventListener({
    name: 'preSave',
    handler: ({ entry }) => {
      const data = entry.get('data');
      const address = String(data.get('address') ?? '').trim();
      const coordinates = data.get('coordinates');
      const longitude = fieldValue(coordinates, 'longitude');
      const latitude = fieldValue(coordinates, 'latitude');
      return data.set('title', address || `${longitude}, ${latitude}`);
    },
  });

  const loadBitmap = async file => {
    if ('createImageBitmap' in window) return createImageBitmap(file, { imageOrientation: 'from-image' });
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const prepareImage = async file => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Bitte nur JPEG- oder PNG-Dateien auswählen.');
    }
    const image = await loadBitmap(file);
    const width = image.width || image.naturalWidth;
    const height = image.height || image.naturalHeight;
    const targetWidth = Math.min(width, 1920);
    const targetHeight = Math.round(height * targetWidth / width);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d', { willReadFrequently: file.type === 'image/png' });
    context.drawImage(image, 0, 0, targetWidth, targetHeight);
    image.close?.();

    if (file.type === 'image/png') {
      const pixels = context.getImageData(0, 0, targetWidth, targetHeight).data;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] !== 255) throw new Error('PNG-Dateien mit Transparenz können nicht veröffentlicht werden.');
      }
    }

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(result => result ? resolve(result) : reject(new Error('Das Bild konnte nicht verarbeitet werden.')), 'image/jpeg', 0.75);
    });
    const base = file.name.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'foto';
    const suffix = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    return new File([blob], `upload-${Date.now()}-${suffix}-${base}.jpg`, { type: 'image/jpeg' });
  };

  let redispatching = false;
  document.addEventListener('change', async event => {
    const input = event.target;
    if (redispatching || input?.type !== 'file' || !input.files?.length) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    try {
      const prepared = await Promise.all(Array.from(input.files).map(prepareImage));
      const transfer = new DataTransfer();
      prepared.forEach(file => transfer.items.add(file));
      input.files = transfer.files;
      redispatching = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (error) {
      input.value = '';
      window.alert(error.message);
    } finally {
      redispatching = false;
    }
  }, true);

  const localMode = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const statusElement = document.getElementById('vt-publish-status');
  const nativeConfirm = window.confirm.bind(window);
  let publishPending = false;
  let groupedHash = '';

  const setPublishStatus = (state, message, url) => {
    publishPending = state === 'pending';
    statusElement.hidden = !message;
    statusElement.dataset.state = state;
    statusElement.replaceChildren(document.createTextNode(message));
    queueMicrotask(adaptAdmin);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = ' Details';
      statusElement.append(link);
    }
  };

  const pollPublishStatus = async (attempt = 0) => {
    try {
      const response = await fetch('https://api.github.com/repos/oliverpetschick/vtfalte/commits/cms-content/status', {
        cache: 'no-store',
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const result = await response.json();
      const status = result.statuses.find(item => item.context === 'vtfalte/content-publish');
      if (status?.state === 'success') {
        setPublishStatus('success', 'Veröffentlicht.', status.target_url);
        return;
      }
      if (['failure', 'error'].includes(status?.state)) {
        setPublishStatus('failure', status.description || 'Änderung wurde zurückgenommen.', status.target_url);
        return;
      }
      setPublishStatus('pending', 'Prüfung läuft …', status?.target_url);
    } catch (error) {
      if (attempt > 0) setPublishStatus('pending', 'Prüfstatus wird geladen …');
    }
    if (attempt < 18) setTimeout(() => pollPublishStatus(attempt + 1), 5000);
  };

  const activateCategoryGrouping = () => {
    if (!window.location.hash.includes('/collections/locations') || groupedHash === window.location.hash) return;
    const groupButton = Array.from(document.querySelectorAll('button, [role="button"]'))
      .find(button => button.textContent.trim() === 'Gruppieren nach');
    if (!groupButton) return;
    groupedHash = window.location.hash;
    groupButton.click();
    setTimeout(() => {
      const categoryButton = Array.from(document.querySelectorAll('button, [role="menuitem"]'))
        .find(button => button.textContent.trim() === 'Kategorie');
      categoryButton?.click();
    }, 0);
  };

  const orderCategoryGroups = () => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const groups = categories.map(category =>
      headings.find(heading => heading.textContent.trim() === `Kategorie ${category}`)?.parentElement,
    ).filter(Boolean);
    const parent = groups[0]?.parentElement;
    if (!parent) return;
    const current = Array.from(parent.children).filter(child => groups.includes(child));
    const alreadyOrdered = current.length === groups.length &&
      current.every((group, index) => group === groups[index]);
    if (!alreadyOrdered) groups.forEach(group => parent.append(group));
  };

  const adaptAdmin = () => {
    for (const link of document.querySelectorAll('a[href*="/collections/locations/new"]')) {
      if (link.textContent.trim() !== 'Eintrag hinzufügen') link.textContent = 'Eintrag hinzufügen';
    }
    for (const button of document.querySelectorAll('button, [role="button"]')) {
      const label = button.textContent.trim();
      if (['Veröffentlichen', 'Lokal speichern'].includes(label)) {
        const publishLabel = localMode ? 'Lokal speichern' : 'Veröffentlichen';
        const disabled = !localMode && publishPending;
        if (button.dataset.vtPublish !== 'true') button.dataset.vtPublish = 'true';
        if (button.textContent !== publishLabel) button.textContent = publishLabel;
        if (button.disabled !== disabled) button.disabled = disabled;
        button.setAttribute('aria-disabled', String(disabled));
      } else if (localMode && label === 'Login') {
        button.textContent = 'Lokal öffnen';
      } else if (label === 'Überprüfen ob eine Vorschau vorhanden ist') {
        button.classList.add('vt-admin-hidden');
      } else if (button.tagName === 'BUTTON' && label === 'Veröffentlicht') {
        button.hidden = true;
      } else if (/^Lösche (veröffentlichten )?Beitrag$/.test(label)) {
        button.textContent = 'Eintrag löschen';
      }
    }
    if (window.location.hash.includes('/entries/')) {
      for (const image of document.querySelectorAll('img[src^="blob:"]')) {
        image.classList.add('vt-photo-preview');
        image.parentElement?.classList.add('vt-photo-preview-wrapper');
      }
    }
    activateCategoryGrouping();
    orderCategoryGroups();
  };

  window.confirm = message => {
    if (String(message).includes('Beitrag wirklich gelöscht')) {
      return nativeConfirm('Eintrag und alle ausschließlich zugehörigen Fotos endgültig löschen?');
    }
    return nativeConfirm(message);
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-vt-publish="true"]');
    if (!button) return;
    if (!localMode && publishPending) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    setTimeout(() => {
      const publishNow = Array.from(document.querySelectorAll('button, [role="menuitem"]'))
        .find(item => item.textContent.trim() === 'Jetzt veröffentlichen');
      publishNow?.click();
    }, 0);
  }, true);

  CMS.registerEventListener({
    name: 'postSave',
    handler: () => {
      if (localMode) {
        setPublishStatus('success', 'Lokal gespeichert – Vorschau wird aktualisiert.');
      } else {
        setPublishStatus('pending', 'Prüfung läuft …');
        pollPublishStatus();
      }
    },
  });

  new MutationObserver(adaptAdmin).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => {
    groupedHash = '';
    adaptAdmin();
  });
  if (!localMode) pollPublishStatus();
  CMS.init();
})();
