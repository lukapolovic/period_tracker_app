import { describe, expect, it } from '@jest/globals';

import { STOPS } from '../stops';
import { ALL_RIBBONS, KNOTS, RIBBONS, ribbonOffsets, WORLD_PAGES } from '../world';

const PAGES = Array.from({ length: WORLD_PAGES }, (_, i) => i);

describe('pages', () => {
  it('draws the world for exactly as many pages as there are stops', () => {
    expect(STOPS).toHaveLength(WORLD_PAGES);
    expect(new Set(STOPS.map((stop) => stop.key)).size).toBe(STOPS.length);
  });

  it('runs every background ribbon across the screen from the first page to the last', () => {
    for (const ribbon of RIBBONS) {
      const xs = ribbon.points.map(([x]) => x);
      expect(Math.min(...xs)).toBeLessThanOrEqual(0);
      expect(Math.max(...xs) - (WORLD_PAGES - 1) * ribbon.parallax).toBeGreaterThanOrEqual(1);
    }
  });

  it('ties one knot into each gap between pages', () => {
    // Each knot is two strands: one under the content, one over it.
    expect(KNOTS).toHaveLength((WORLD_PAGES - 1) * 2);
  });
});

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
