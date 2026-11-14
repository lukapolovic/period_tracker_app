import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { CycleBarChart } from '@/components/cycle-bar-chart';
import { Button, Card, Chip, Placeholder, Text, TextButton } from '@/components/ui';
import { Drift, FlowPage } from '@/flow/flow-page';
import { useFlow } from '@/flow/flow-provider';
import { RibbonHop } from '@/flow/ribbon-hop';
import { openHowItWorks } from '@/flow/sheet';
import { Sticker } from '@/flow/sticker';
import { Pages } from '@/flow/stops';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { RULES, type CycleInfo } from '@/lib/cycle';
import { formatDay, formatRange, parts, plural } from '@/lib/dates';
import { useAppStore } from '@/store/app-store';
import { radius, space, useTheme } from '@/theme';


const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type StatProps = { label: string; value: string; unit: string; fill: string; ink: string; wide?: boolean };

function Stat({ label, value, unit, fill, ink, wide }: StatProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value === '—' ? 'not enough data yet' : `${value} ${unit}`}`}
      style={[styles.stat, wide && styles.statWide, { backgroundColor: fill }]}>
      <Text variant="label" style={{ color: ink }} numberOfLines={1}>
        {label}
      </Text>
      <Text variant="headingSm" style={{ color: ink }} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text variant="caption" style={{ color: ink }}>
        {unit}
      </Text>
    </View>
  );
}

function flagFor(c: CycleInfo): string | null {
  if (!c.outOfRange || c.length === null) return null;
  return c.length < RULES.minValidCycle
    ? 'Unusually short — did you miss a log?'
    : 'Unusually long — did you miss a log?';
}

function CycleRow({ cycle, onToggle }: { cycle: CycleInfo; onToggle: () => void }) {
  const { colors } = useTheme();
  const flag = flagFor(cycle);
  return (
    <View style={[styles.row, { borderTopColor: colors.line }]}>
      <View style={styles.rowTop}>
        <View style={styles.rowText}>
          <Text variant="bodyStrong">{formatRange(cycle.start, cycle.end!, { year: true })}</Text>
          <Text variant="caption" tone="secondary">
            Period {plural(cycle.periodLength, 'day')}
            {cycle.periodEndEstimated ? ' (end estimated)' : ''}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            cycle.included ? { backgroundColor: colors.canvas } : { borderColor: colors.textSecondary, borderWidth: 1, borderStyle: 'dashed' },
          ]}>
          <Text variant="bodyStrong" tone={cycle.included ? 'default' : 'secondary'}>
            {plural(cycle.length!, 'day')}
          </Text>
        </View>
      </View>
      {flag ? (
        <View style={styles.flag}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.ink} />
          <Text variant="caption" style={styles.flagText}>
            {flag}
          </Text>
        </View>
      ) : null}
      <View style={styles.rowActions}>
        <Chip
          label="Count in predictions"
          selected={cycle.included}
          onPress={onToggle}
          accessibilityHint="Include or leave out this cycle, for example after illness or travel"
        />
      </View>
      {cycle.included && !cycle.usedForPrediction ? (
        <Text variant="caption" tone="secondary">
          Older than your last {RULES.maxCyclesUsed} cycles, so it isn&apos;t used right now.
        </Text>
      ) : null}
    </View>
  );
}

export function HistoryPage() {
  const { colors } = useTheme();
  const { width, goTo } = useFlow();
  const today = useToday();
  const prediction = usePrediction(today);
  const apply = useAppStore((s) => s.apply);

  const completed = prediction.cycles.filter((c) => c.length !== null);
  const current = prediction.cycles.find((c) => c.length === null) ?? null;
  const used = prediction.usedLengths;
  const personal = !prediction.earlyEstimate;
  const bars = completed.slice(-10).map((c) => ({
    key: c.start,
    value: c.length!,
    label: MONTHS_SHORT[parts(c.start).monthIndex],
    excluded: !c.included,
  }));
  const summary = `Cycle lengths, oldest to newest: ${bars.map((b) => `${b.value}${b.excluded ? ' (left out)' : ''}`).join(', ')} days.${
    personal ? ` Median ${prediction.baseLength} days.` : ''
  }`;

  const toggle = (c: CycleInfo) => apply({ type: 'count-cycle', start: c.start, counted: !c.included });

  return (
    <FlowPage>
      <View style={styles.stage}>
        <Sticker name="group" width={width * 0.62} drift={-0.14} style={styles.group} />
      </View>

      <Drift amount={0.06}>
        <RibbonHop tone="coral">
          <Card>
            <Text variant="headingLg" accessibilityRole="header">
              History
            </Text>
            <View style={styles.stats}>
              <Stat
                label="Cycle"
                value={personal ? String(prediction.baseLength) : '—'}
                unit="days"
                fill={colors.structure}
                ink={colors.onStructure}
              />
              <Stat
                wide
                label="Range"
                value={personal ? `${Math.min(...used)}–${Math.max(...used)}` : '—'}
                unit="days"
                fill={colors.action}
                ink={colors.onAction}
              />
              <Stat
                label="Period"
                value={String(prediction.periodLength)}
                unit="days"
                fill={colors.mood}
                ink={colors.onMood}
              />
            </View>
          </Card>
        </RibbonHop>
      </Drift>

      {completed.length === 0 ? (
        <Drift amount={0.1}>
          <Card>
            <Placeholder brief="A character reading an open notebook" height={160} />
            <Text variant="headingSm" align="center">
              Your history will show up here
            </Text>
            <Text variant="paragraph" tone="secondary" align="center">
              Log two periods and predictions become personal. You can add past periods in the calendar.
            </Text>
            <Button label="Open calendar" variant="secondary" onPress={() => goTo(Pages.calendar)} />
          </Card>
        </Drift>
      ) : (
        <View>
          <Drift amount={0.1}>
            <Card title="Cycle length">
              <CycleBarChart bars={bars} median={personal ? prediction.baseLength : null} summary={summary} />
            </Card>
          </Drift>
          <Sticker name="climb" width={width * 0.2} rotate={8} style={styles.climber} />
        </View>
      )}

      {current || completed.length ? (
        <Drift amount={0.13}>
          <Card title="Cycles">
            {current ? (
              <View style={styles.rowTop}>
                <View style={styles.rowText}>
                  <Text variant="bodyStrong">Current cycle</Text>
                  <Text variant="caption" tone="secondary">
                    Started {formatDay(current.start, { year: true })}
                  </Text>
                </View>
                {prediction.cycleDay ? (
                  <Text variant="bodyStrong" tone="secondary">
                    Day {prediction.cycleDay}
                  </Text>
                ) : null}
              </View>
            ) : null}
            {[...completed].reverse().map((c) => (
              <CycleRow key={c.start} cycle={c} onToggle={() => toggle(c)} />
            ))}
          </Card>
        </Drift>
      ) : null}

      <TextButton onCanvas label="How predictions work" onPress={openHowItWorks} />
    </FlowPage>
  );
}

const styles = StyleSheet.create({
  stage: { height: 170 },
  group: { left: 6, top: 8 },
  climber: { right: -6, top: -44 },
  stats: { flexDirection: 'row', gap: space[2] },
  stat: { flex: 1, borderRadius: radius.inset, paddingVertical: space[3], paddingHorizontal: space[3], gap: 2 },
  statWide: { flex: 1.45 },
  row: { borderTopWidth: 1, paddingTop: space[3], gap: space[2] },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  rowText: { flex: 1, gap: 2 },
  rowActions: { flexDirection: 'row' },
  badge: { borderRadius: radius.full, paddingHorizontal: space[3], paddingVertical: space[1] },
  flag: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  flagText: { flex: 1 },
});
