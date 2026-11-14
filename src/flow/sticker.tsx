import { Image } from 'expo-image';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ART, type ArtName } from './art';
import { Drift } from './flow-page';

type StickerProps = {
  name: ArtName;
  width: number;
  /** See `Drift`. Characters usually sit closer than the cards, so the default is negative. */
  drift?: number;
  scroll?: number;
  /** Tilt in degrees. */
  rotate?: number;
  flip?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** A character placed on the page. Decorative, so it stays out of the accessibility tree. */
export function Sticker({ name, width, drift = -0.16, scroll = 0, rotate = 0, flip = false, style }: StickerProps) {
  const art = ART[name];
  return (
    <Drift amount={drift} scroll={scroll} arrive style={[styles.sticker, style]}>
      <Image
        source={art.source}
        contentFit="contain"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          width,
          height: width / art.ratio,
          transform: [{ rotate: `${rotate}deg` }, { scaleX: flip ? -1 : 1 }],
        }}
      />
    </Drift>
  );
}

const styles = StyleSheet.create({
  sticker: { position: 'absolute' },
});
