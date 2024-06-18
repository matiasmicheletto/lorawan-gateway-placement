import { geoJSON2MapObjects, latlng2Canvas, haversine } from '../utils';

describe('geoJSON2MapObjects', () => {
  test('correctly processes empty GeoJSON', () => {
    const emptyGeoJSON = { features: [] };
    const result = geoJSON2MapObjects(emptyGeoJSON);
    expect(result).toEqual({ nodes: [], areas: [], links: [] });
  });

  // Add more tests for non-empty GeoJSON, including Points, Polygons, and LineStrings
});

describe('latlng2Canvas', () => {
  test('converts lat/lng to canvas coordinates', () => {
    const mapMock = { getSize: () => ({ x: 1000, y: 500 }) };
    const result = latlng2Canvas(0, 0, mapMock);
    expect(result).toEqual({ x: 500, y: 250 }); // Expected result for (0,0) on a 1000x500 map
  });

  // Add more tests with different lat/lng values and map sizes
});

describe('haversine', () => {
  test('calculates distance between two points', () => {
    const pos1 = { lat: 0, lng: 0 };
    const pos2 = { lat: 0, lng: 1 };
    const distance = haversine(pos1, pos2);
    // The expected distance should be close to the actual distance between these points
    expect(distance).toBeCloseTo(111.2, 1); // Using 1 decimal point precision
  });

  // Add more tests with different positions
});