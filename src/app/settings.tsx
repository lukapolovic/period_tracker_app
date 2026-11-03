import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LengthSetting } from '@/components/length-setting';
import {
  Button,
  Card,
  IconButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  Segmented,
  Text,
  TextButton,
} from '@/components/ui';
import { useToday } from '@/hooks/use-today';
import { RULES } from '@/lib/cycle';
import { goBack } from '@/lib/navigation';
import { useAppStore, type ThemePreference } from '@/store/app-store';
import { space } from '@/theme';

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const WEEK_STARTS: { value: 0 | 1; label: string }[] = [
  { value: 1, label: 'Monday' },
  { value: 0, label: 'Sunday' },
];

export default function SettingsScreen() {
  const today = useToday();
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const deleteAllData = useAppStore((s) => s.deleteAllData);
  const loadDemoData = useAppStore((s) => s.loadDemoData);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title="Settings"
        left={<IconButton icon="chevron-back" label="Back" onPress={goBack} />}
      />

      <Card title="Your cycle">
        <Text variant="caption" tone="secondary">
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

      <Card title="Appearance">
        <Segmented label="Theme" options={THEMES} value={settings.theme} onChange={(theme) => updateSettings({ theme })} />
      </Card>

      <Card title="Calendar">
        <SectionTitle>Week starts on</SectionTitle>
        <Segmented
          label="Week starts on"
          options={WEEK_STARTS}
          value={settings.weekStartsOn}
          onChange={(weekStartsOn) => updateSettings({ weekStartsOn })}
        />
      </Card>

      <Card title="Your data">
        <Text variant="body">
          Everything you log is stored only on this device. There&apos;s no account and no sync.
        </Text>
        {confirmingDelete ? (
          <View style={styles.confirm}>
            <Text variant="bodyBold" tone="strong">
              Delete everything? This removes all periods, logs and settings from this device. It can&apos;t be undone.
            </Text>
            <Button variant="period" label="Yes, delete everything" icon="trash-outline" onPress={deleteAllData} />
            <Button variant="secondary" label="Cancel" onPress={() => setConfirmingDelete(false)} />
          </View>
        ) : (
          <Button variant="danger" label="Delete all data" icon="trash-outline" onPress={() => setConfirmingDelete(true)} />
        )}
      </Card>

      <Card title="About">
        <View style={styles.start}>
          <TextButton label="How predictions work" onPress={() => router.push('/how-it-works')} />
        </View>
        <Text variant="caption" tone="secondary">
          Predictions are estimates based on the cycles you&apos;ve logged. This app is not a method of contraception
          and can&apos;t diagnose any condition. If you have concerns about your cycle, talk to a healthcare
          professional.
        </Text>
        <Text variant="caption" tone="secondary">
          Version {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </Card>

      {__DEV__ ? (
        <Card title="Developer">
          <Text variant="caption" tone="secondary">
            Only visible in development builds. Replaces your periods and logs with sample data.
          </Text>
          <Button
            variant="secondary"
            label="Load demo data"
            icon="flask-outline"
            onPress={() => {
              loadDemoData(today);
              goBack();
            }}
          />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  start: { alignItems: 'flex-start' },
  confirm: { gap: space.sm },
});
