/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  plan: 'free' | 'premium' | 'pending';
}

export interface CycleLog {
  id: string;
  date: string;
  title: string;
  mood: string;
  symptoms: string[];
  intensity: number;
  notes: string;
  water: number;
  sleep: number;
  flow: 'none' | 'light' | 'medium' | 'heavy';
  products?: ('pad' | 'tampon' | 'cup' | 'disc')[];
  temperature?: number;
  mucus?: string;
}

export interface NotificationSettings {
  cycleStart: { enabled: boolean; daysBefore: number; time: string };
  ovulation: { enabled: boolean; daysBefore: number; time: string };
  fertileWindow: { enabled: boolean; daysBefore: number; time: string };
}

export interface UserProfile {
  age: number;
  cycleLength: number;
  periodLength: number;
  language?: 'pt' | 'en' | 'es';
  notifications?: NotificationSettings;
  dietPreference?: 'omnivore' | 'vegetarian' | 'vegan';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface AIChatSession {
  id: string;
  userId: string;
  messages: Message[];
  title?: string;
  createdAt: any;
  updatedAt: any;
}

export const STORAGE_KEYS = {
  USER: 'luna_user',
  PROFILE: 'luna_profile',
  LOGS: 'luna_logs',
  STATE: 'luna_state'
};
