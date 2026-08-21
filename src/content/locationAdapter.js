const placeholderPhoto = {
  src: 'images/placeholder.jpg',
  credit: 'Johanna Knigge',
};

export const getLocationId = filename => {
  const value = filename.replace(/^\.\//, '').replace(/\.json$/, '');
  return /^\d+$/.test(value) ? Number(value) : value;
};

export const compareLocations = (left, right) => {
  const leftOrder = left.location.galleryOrder;
  const rightOrder = right.location.galleryOrder;

  if (leftOrder != null && rightOrder != null && leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }
  if (leftOrder != null) return -1;
  if (rightOrder != null) return 1;

  return String(left.location.createdAt ?? left.id).localeCompare(
    String(right.location.createdAt ?? right.id),
  );
};

export const locationToFeature = ({ id, location }) => {
  const photos = location.photos?.length ? location.photos : [placeholderPhoto];
  const images = Object.fromEntries(
    photos.map((photo, index) => [
      `image_${index}`,
      {
        src: photo.src,
        author_lastname: photo.credit.split(/\s+/).slice(1).join(' '),
        author_firstname: photo.credit.split(/\s+/)[0] ?? '',
      },
    ]),
  );
  const links = location.links?.length
    ? Object.fromEntries(
        location.links.map((link, index) => [`link_${index}`, { url: link.url }]),
      )
    : null;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [location.coordinates.longitude, location.coordinates.latitude],
    },
    properties: {
      id,
      category_id: location.categoryId,
      images,
      address: location.address ?? '',
      type: location.type ?? '',
      useage: location.usage ?? '',
      former_useage: location.formerUsage ?? '',
      condition: location.condition ?? '',
      links,
    },
  };
};

export const buildFeatureCollection = modules => ({
  type: 'FeatureCollection',
  features: modules
    .map(({ filename, location }) => ({ id: getLocationId(filename), location }))
    .filter(({ location }) => !location.archived)
    .sort(compareLocations)
    .map(locationToFeature),
});
