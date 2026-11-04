/**
 * Every file in assets/art is a placeholder, drawn for this project to hold each spot until the real art arrives.
 * To swap one, replace the file and update its ratio here.
 */
export const ART = {
  ball: { source: require('@/assets/art/ball.webp'), ratio: 320 / 320 },
  cheer: { source: require('@/assets/art/cheer.webp'), ratio: 407 / 640 },
  climb: { source: require('@/assets/art/climb.webp'), ratio: 387 / 640 },
  dial: { source: require('@/assets/art/dial.webp'), ratio: 280 / 280 },
  folder: { source: require('@/assets/art/folder.webp'), ratio: 340 / 276 },
  group: { source: require('@/assets/art/group.webp'), ratio: 760 / 483 },
  leap: { source: require('@/assets/art/leap.webp'), ratio: 640 / 552 },
  shrug: { source: require('@/assets/art/shrug.webp'), ratio: 608 / 640 },
  sit: { source: require('@/assets/art/sit.webp'), ratio: 535 / 640 },
  'sit-wave': { source: require('@/assets/art/sit-wave.webp'), ratio: 516 / 640 },
  skip: { source: require('@/assets/art/skip.webp'), ratio: 609 / 640 },
  'spark-coral': { source: require('@/assets/art/spark-coral.webp'), ratio: 150 / 150 },
  'spark-green': { source: require('@/assets/art/spark-green.webp'), ratio: 150 / 150 },
  'spark-lilac': { source: require('@/assets/art/spark-lilac.webp'), ratio: 150 / 150 },
} as const;

export type ArtName = keyof typeof ART;
