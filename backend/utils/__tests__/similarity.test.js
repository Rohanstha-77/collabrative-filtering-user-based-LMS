import { cosineSimilarity } from '../similarity';

describe('cosineSimilarity', () => {
  test('should return 1 for identical vectors', () => {
    const vecA = [1, 2, 3];
    const vecB = [1, 2, 3];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1);
  });

  test('should return 0 for orthogonal vectors', () => {
    const vecA = [1, 0, 0];
    const vecB = [0, 1, 0];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0);
  });

  test('should return -1 for diametrically opposite vectors', () => {
    const vecA = [1, 1];
    const vecB = [-1, -1];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(-1);
  });

  test('should handle vectors with different magnitudes but same direction', () => {
    const vecA = [1, 2];
    const vecB = [2, 4];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1);
  });

  test('should handle zero vectors', () => {
    const vecA = [0, 0, 0];
    const vecB = [1, 2, 3];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0);
  });

  test('should handle empty vectors', () => {
    const vecA = [];
    const vecB = [];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0);
  });

  test('should handle negative values', () => {
    const vecA = [1, -1];
    const vecB = [-1, 1];
    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(-1);
  });
});
