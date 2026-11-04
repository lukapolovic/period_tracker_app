import { describe, expect, it } from '@jest/globals';

import { ALL_RIBBONS, KNOTS, RIBBONS, ribbonOffsets } from '../world';

const PAGES = [0, 1, 2, 3];

describe('ribbon shapes', () => {
  it('keeps every stretch inside its ribbon', () => {
    for (const ribbon of ALL_RIBBONS) {
      for (const span of ribbon.spans) {
        expect(span.from).toBeGreaterThanOrEqual(0);
        expect(span.to).toBeLessThanOrEqual(ribbon.points.length - 1);
        expect(span.from).toBeLessThan(span.to);
      }
    }
  });

  it('runs background ribbons slower than the content, so they read as further away', () => {
    for (const ribbon of RIBBONS) expect(ribbon.parallax).toBeLessThan(1);
  });

  it('keeps knots off screen whenever a page is at rest, so they never sit over text', () => {
    for (const knot of KNOTS) {
      const half = knot.width / 2;
      for (const page of PAGES) {
        const xs = knot.points.map(([x]) => x - page * knot.parallax);
        const clearOfLeft = Math.max(...xs) + half < 0;
        const clearOfRight = Math.min(...xs) - half > 1;
        expect(clearOfLeft || clearOfRight).toBe(true);
      }
    }
  });

  it('starts and ends every knot strand beyond the top and bottom of the screen', () => {
    for (const knot of KNOTS) {
      expect(knot.points[0][1]).toBeLessThan(0);
      expect(knot.points.at(-1)![1]).toBeGreaterThan(1);
    }
  });

  it('gives each ribbon its own run of points in the flattened arrays', () => {
    const offsets = ribbonOffsets(ALL_RIBBONS);
    ALL_RIBBONS.forEach((ribbon, i) => {
      const next = offsets[i + 1];
      if (next !== undefined) expect(next - offsets[i]).toBe(ribbon.points.length);
    });
  });
});
