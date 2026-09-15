// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

window.URL.createObjectURL = window.URL.createObjectURL || jest.fn();

jest.mock('maplibre-gl', () => ({
  __esModule: true,
  Map: jest.fn(),
  setWorkerUrl: jest.fn(),
}), { virtual: true });
