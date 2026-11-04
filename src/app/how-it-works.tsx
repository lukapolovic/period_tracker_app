import { StyleSheet, View } from 'react-native';

import { Card, Placeholder, Text } from '@/components/ui';
import { Sheet, useSheet } from '@/flow/sheet';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { RULES, type Prediction } from '@/lib/cycle';
import { formatRange, plural } from '@/lib/dates';
import { radius, space, useTheme } from '@/theme';

/** The transparency screen from §12.3: the user's own numbers, in plain words. */
function basisText(p: Prediction): string {
  const n = p.usedLengths.length;
  switch (p.basis) {
    case 'history': {
      const spread =
        n >= RULES.minCyclesSpread
          ? `They vary by about ${plural(p.spread, 'day')}, so the window is ±${plural(p.spread, 'day')}.`
          : `Until there are ${RULES.minCyclesSpread} cycles, the window is ±${RULES.defaultSpread} days.`;
      return `Based on your last ${n} cycles — ${p.usedLengths.join(', ')} days — the median is ${p.baseLength} days. ${spread}`;
    }
    case 'typical':
      return `You told us your cycle is usually about ${p.baseLength} days. Once you've logged two cycles, predictions switch to your own history.`;
    case 'single-cycle':
      return `So far there's one complete cycle (${p.baseLength} days), so that's the starting point. One more and your own median takes over.`;
    case 'default':
      return `We don't know your cycle length yet, so we start from ${p.baseLength} days — a common starting point, even though only about 1 in 8 real cycles is exactly 28 days.`;
  }
}

const METHOD = [
  `We use the median of your most recent cycles (up to ${RULES.maxCyclesUsed}), so one unusual cycle doesn't throw everything off.`,
  'The window gets wider when your cycles vary and narrower when they are regular.',
  `Cycles shorter than ${RULES.minValidCycle} or longer than ${RULES.maxValidCycle} days are left out unless you count them in History — they usually mean a missed log.`,
  'You can leave out any cycle, for example one affected by illness, travel or stress.',
  'Predictions further ahead get wider, because uncertainty adds up.',
];

function Bullet({ children }: { children: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.bullet}>
      <View style={[styles.dot, { backgroundColor: colors.structure }]} />
      <Text variant="paragraph" style={styles.bulletText}>
        {children}
      </Text>
    </View>
  );
}

export default function HowItWorksScreen() {
  const today = useToday();
  const p = usePrediction(today);
  const sheet = useSheet();

  return (
    <Sheet sheet={sheet} title="How predictions work">
      <Placeholder brief="A character with a pencil beside a diagram: past cycles, median, likely window" height={150} />

      <Card title="Your prediction">
        <Text variant="paragraph">{basisText(p)}</Text>
        {p.next ? (
          <Text variant="bodyStrong">Your next period is likely to start {formatRange(p.next.from, p.next.to)}.</Text>
        ) : (
          <Text variant="bodyStrong">Log a period and your first prediction appears.</Text>
        )}
      </Card>

      <Card title="The method">
        {METHOD.map((line) => (
          <Bullet key={line}>{line}</Bullet>
        ))}
      </Card>

      <Card title="Good to know">
        <Text variant="paragraph">
          Predictions are estimates based on the cycles you&apos;ve logged — a window, not a promise. This app is not a
          method of contraception and can&apos;t diagnose any condition. If you have concerns about your cycle, talk to
          a healthcare professional.
        </Text>
      </Card>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  bullet: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start' },
  dot: { width: 10, height: 10, borderRadius: radius.full, marginTop: 8 },
  bulletText: { flex: 1 },
});
