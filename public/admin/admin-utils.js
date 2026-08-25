((root, factory) => {
  const utils = factory();
  if (typeof module === 'object' && module.exports) module.exports = utils;
  else root.VTAdminUtils = utils;
})(typeof globalThis === 'object' ? globalThis : this, () => {
  const coordinateNumber = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';

  const parseGoogleCoordinates = value => {
    const match = String(value).match(
      new RegExp(`^\\s*(${coordinateNumber})\\s*,\\s*(${coordinateNumber})\\s*$`),
    );
    if (!match) return null;
    return {
      latitude: Number(match[1]),
      longitude: Number(match[2]),
    };
  };

  return { parseGoogleCoordinates };
});
