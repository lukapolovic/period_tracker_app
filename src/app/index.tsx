import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

import { Pages, useFlow } from '@/flow/flow-provider';
import { FlowStage } from '@/flow/flow-stage';
import { NavBar } from '@/flow/nav-bar';
import { CalendarPage } from '@/screens/calendar';
import { HistoryPage } from '@/screens/history';
import { SettingsPage } from '@/screens/settings';
import { TodayPage } from '@/screens/today';

const PAGES = [
  <TodayPage key="today" />,
  <CalendarPage key="calendar" />,
  <HistoryPage key="history" />,
  <SettingsPage key="settings" />,
];

/** The app is this one page. The nav pans along it; nothing navigates away. */
export default function Home() {
  const { page, goTo, jumpTo } = useFlow();

  useEffect(() => {
    jumpTo(Pages.today);
  }, [jumpTo]);

  // Android back returns to Today before it leaves the app.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (page === Pages.today) return false;
        goTo(Pages.today);
        return true;
      });
      return () => sub.remove();
    }, [page, goTo]),
  );

  return <FlowStage pages={PAGES} chrome={<NavBar />} />;
}
