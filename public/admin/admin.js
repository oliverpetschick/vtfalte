(() => {
  const { CMS, L, createClass, h } = window;

  const fieldValue = (value, key) => {
    if (!value) return '';
    return typeof value.get === 'function' ? value.get(key) ?? '' : value[key] ?? '';
  };

  const CoordinateControl = createClass({
    getInitialState() {
      return {
        longitude: String(fieldValue(this.props.value, 'longitude')),
        latitude: String(fieldValue(this.props.value, 'latitude')),
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
      this.setState(next);
      this.setMarker(Number(next.longitude), Number(next.latitude));
      this.props.onChange({ longitude: Number(next.longitude), latitude: Number(next.latitude) });
    },

    handleInput(key, event) {
      const next = { ...this.state, [key]: event.target.value };
      this.setState(next);
      const longitude = Number(next.longitude);
      const latitude = Number(next.latitude);
      if (next.longitude !== '' && next.latitude !== '' && Number.isFinite(longitude) && Number.isFinite(latitude)) {
        this.setMarker(longitude, latitude);
        this.map.setView([latitude, longitude], Math.max(this.map.getZoom(), 12));
        this.props.onChange({ longitude, latitude });
      }
    },

    render() {
      return h('div', {},
        h('div', { className: 'vt-coordinate-inputs' },
          h('label', {}, 'Längengrad', h('input', {
            type: 'number', step: 'any', value: this.state.longitude,
            onChange: event => this.handleInput('longitude', event),
          })),
          h('label', {}, 'Breitengrad', h('input', {
            type: 'number', step: 'any', value: this.state.latitude,
            onChange: event => this.handleInput('latitude', event),
          })),
        ),
        h('div', { className: 'vt-coordinate-map', ref: node => { this.mapNode = node; } }),
      );
    },
  });

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
    return new File([blob], `${Date.now()}-${suffix}-${base}.jpg`, { type: 'image/jpeg' });
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

  CMS.init();
})();
