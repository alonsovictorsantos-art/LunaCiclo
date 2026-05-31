/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CycleLog } from '../types';

export interface WeeklySummary {
  avgSleep: number;
  dominantMood: string;
  moodCount: Record<string, number>;
  totalLogs: number;
}

export function calculateWeeklySummary(logs: CycleLog[]): WeeklySummary {
  // We take the last 7 logs as a representative week if date parsing is difficult
  const recentLogs = [...logs]
    .sort((a, b) => {
      // Try to sort by some criteria if date is not ISO
      // Logs are usually added in order, so slice(0, 7) from state is often enough
      return 0; 
    })
    .slice(0, 7);

  let totalSleep = 0;
  let totalLogsWithSleep = 0;
  const moods: Record<string, number> = {};

  recentLogs.forEach(log => {
    if (log.sleep !== undefined && log.sleep > 0) {
      totalSleep += log.sleep;
      totalLogsWithSleep++;
    }
    if (log.mood) {
      moods[log.mood] = (moods[log.mood] || 0) + 1;
    }
  });

  const dominantMood = Object.entries(moods).sort((a, b) => b[1] - a[1])[0]?.[0] || '---';

  return {
    avgSleep: totalLogsWithSleep > 0 ? totalSleep / totalLogsWithSleep : 0,
    dominantMood,
    moodCount: moods,
    totalLogs: recentLogs.length,
  };
}
