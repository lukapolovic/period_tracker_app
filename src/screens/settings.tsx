import Constants from 'expo-constants';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LengthSetting } from '@/components/length-setting';
import { Button, Card, SectionTitle, Segmented, Text, TextButton } from '@/components/ui';
import { Drift, FlowPage } from '@/flow/flow-page';
import { Pages, useFlow } from '@/flow/flow-provider';
import { openHowItWorks } from '@/flow/sheet';
import { Sticker } from '@/flow/sticker';
import { useToday } from '@/hooks/use-today';
import { RULES } from '@/lib/cycle';
import { useAppStore, type ThemePreference } from '@/store/app-store';
import { space } from '@/theme';

const PAGE = Pages.settings;

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const WEEK_STARTS: { value: 0 | 1; label: string }[] = [
  { value: 1, label: 'Monday' },
  { value: 0, label: 'Sunday' },
];

export function SettingsPage() {
  const { width, goTo } = useFlow();
  const today = useToday();
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const deleteAllData = useAppStore((s) => s.deleteAllData);
  const loadDemoData = useAppStore((s) => s.loadDemoData);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <FlowPage index={PAGE}>
      <View style={styles.stage}>
        <Sticker name="sit" page={PAGE} width={width * 0.3} drift={-0.16} style={styles.sitter} />
      </View>

      <Drift page={PAGE} amount={0.06}>
        <Card>
          <Text variant="headingLg" accessibilityRole="header">
            Settings
          </Text>
          <Text variant="body" tone="secondary">
            Used for predictions until you&apos;ve logged two cycles. After that, your own history takes over.
          </Text>
          <LengthSetting
            label="Cycle length"
            value={settings.typicalCycleLength}
            fallback={RULES.defaultCycle}
            min={RULES.minValidCycle}
            max={RULES.maxValidCycle}
            onChange={(typicalCycleLength) => updateSettings({ typicalCycleLength })}
          />
          <LengthSetting
            label="Period length"
            value={settings.typicalPeriodLength}
            fallback={RULES.defaultPeriod}
            min={1}
            max={14}
            onChange={(typicalPeriodLength) => updateSettings({ typicalPeriodLength })}
          />
        </Card>
      </Drift>

      <Drift page={PAGE} amount={0.09} style={styles.gap}>
        <Sticker name="dial" page={PAGE} width={56} drift={-0.2} rotate={-10} style={styles.dial} />
        <Card title="Appearance">
          <Segmented label="Theme" options={THEMES} value={settings.theme} onChange={(theme) => updateSettings({ theme })} />
          <SectionTitle>Week starts on</SectionTitle>
          <Segmented
            label="Week starts on"
            options={WEEK_STARTS}
            value={settings.weekStartsOn}
            onChange={(weekStartsOn) => updateSettings({ weekStartsOn })}
          />
        </Card>
      </Drift>

      <Drift page={PAGE} amount={0.11}>
        <Sticker name="folder" page={PAGE} width={84} drift={-0.2} style={styles.folder} />
        <Card title="Your data">
          <Text variant="paragraph">
            Everything you log is stored only on this device. There&apos;s no account and no sync.
          </Text>
          {confirmingDelete ? (
            <View style={styles.confirm}>
              <Text variant="bodyStrong">
                Delete everything? This removes all periods, logs and settings from this device. It can&apos;t be undone.
              </Text>
              <Button variant="destructive" label="Yes, delete everything" onPress={deleteAllData} />
              <Button variant="secondary" icon="close" label="Cancel" onPress={() => setConfirmingDelete(false)} />
            </View>
          ) : (
            <Button variant="destructive" label="Delete all data" onPress={() => setConfirmingDelete(true)} />
          )}
        </Card>
      </Drift>

      <Drift page={PAGE} amount={0.13}>
        <Card title="About">
          <View style={styles.start}>
            <TextButton label="How predictions work" onPress={openHowItWorks} />
          </View>
          <Text variant="body" tone="secondary">
            Predictions are estimates based on the cycles you&apos;ve logged. This app is not a method of contraception
            and can&apos;t diagnose any condition. If you have concerns about your cycle, talk to a healthcare
            professional.
          </Text>
          <Text variant="caption" tone="secondary">
            Version {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </Card>
      </Drift>

      {__DEV__ ? (
        <Card title="Developer">
          <Text variant="body" tone="secondary">
            Only visible in development builds. Replaces your periods and logs with sample data.
          </Text>
          <Button
            variant="secondary"
            label="Load demo data"
            icon="flask"
            onPress={() => {
              loadDemoData(today);
              goTo(Pages.today);
            }}
          />
        </Card>
      ) : null}
    </FlowPage>
  );
}

const styles = StyleSheet.create({
  stage: { height: 120 },
  sitter: { right: 20, top: -16 },
  gap: { zIndex: 1 },
  dial: { right: 22, top: -22, zIndex: 2 },
  folder: { right: 12, top: -30, zIndex: 2 },
  start: { alignItems: 'flex-start' },
  confirm: { gap: space[4] },
});
