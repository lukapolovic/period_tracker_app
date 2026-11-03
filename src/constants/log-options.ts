import type { Flow } from '@/lib/cycle';

export type LogOption = { id: string; label: string };

/** `drops` gives each level a shape cue so flow is never shown by colour alone. */
export const FLOWS: { id: Flow; label: string; drops: number }[] = [
  { id: 'spotting', label: 'Spotting', drops: 0 },
  { id: 'light', label: 'Light', drops: 1 },
  { id: 'medium', label: 'Medium', drops: 2 },
  { id: 'heavy', label: 'Heavy', drops: 3 },
];

export const SYMPTOMS: LogOption[] = [
  { id: 'cramps', label: 'Cramps' },
  { id: 'headache', label: 'Headache' },
  { id: 'bloating', label: 'Bloating' },
  { id: 'breast-tenderness', label: 'Breast tenderness' },
  { id: 'back-pain', label: 'Back pain' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'acne', label: 'Acne' },
  { id: 'cravings', label: 'Cravings' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'sleep', label: 'Sleep problems' },
  { id: 'dizziness', label: 'Dizziness' },
  { id: 'digestion', label: 'Upset stomach' },
  { id: 'aches', label: 'Body aches' },
  { id: 'hot-flushes', label: 'Hot flushes' },
  { id: 'pain-relief', label: 'Took pain relief' },
];

export const MOODS: LogOption[] = [
  { id: 'happy', label: 'Happy' },
  { id: 'calm', label: 'Calm' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'irritable', label: 'Irritable' },
  { id: 'anxious', label: 'Anxious' },
  { id: 'sad', label: 'Sad' },
  { id: 'stressed', label: 'Stressed' },
];

/** Shown as one-tap chips on Today. */
export const QUICK_SYMPTOMS = ['cramps', 'headache', 'bloating', 'fatigue'];
export const QUICK_MOODS = ['happy', 'irritable'];
