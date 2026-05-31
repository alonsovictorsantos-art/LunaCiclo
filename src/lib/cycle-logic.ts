/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CycleLog, UserProfile } from '../types';

export interface CycleStatus {
  currentDay: number;
  phase: 'Menstrual' | 'Folliculary' | 'Ovulatory' | 'Luteal';
  daysUntilNextPeriod: number;
  daysUntilNextOvulation: number;
  isFertile: boolean;
  nextPeriodDate: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export const calculateCycleStatus = (profile: UserProfile, logs: CycleLog[]): CycleStatus => {
  const today = new Date();
  
  // Find the most recent period start date (log with flow !== 'none')
  const flowLogs = logs
    .filter(l => l.flow !== 'none')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let lastPeriodStart = new Date();
  if (flowLogs.length > 0) {
    lastPeriodStart = new Date(flowLogs[0].date);
    if (isNaN(lastPeriodStart.getTime())) {
        lastPeriodStart = new Date();
        lastPeriodStart.setDate(today.getDate() - 15);
    }
  } else {
    lastPeriodStart = new Date();
    lastPeriodStart.setDate(today.getDate() - 15);
  }

  const diffTime = Math.abs(today.getTime() - lastPeriodStart.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const currentDay = (diffDays % profile.cycleLength) || 1;
  const cycleDay = currentDay;

  // Next Period
  const nextPeriodDate = new Date(lastPeriodStart);
  nextPeriodDate.setDate(lastPeriodStart.getDate() + profile.cycleLength);

  // Ovulation usually occurs cycleLength - 14 days
  const ovulationDay = profile.cycleLength - 14;
  const ovulationDate = new Date(lastPeriodStart);
  ovulationDate.setDate(lastPeriodStart.getDate() + ovulationDay - 1);

  // Fertile window: 5 days before ovulation + ovulation day
  const fertileWindowStart = new Date(ovulationDate);
  fertileWindowStart.setDate(ovulationDate.getDate() - 5);
  const fertileWindowEnd = new Date(ovulationDate);
  fertileWindowEnd.setDate(ovulationDate.getDate() + 1);

  const isFertile = today >= fertileWindowStart && today <= fertileWindowEnd;

  let phase: any = 'Luteal';
  if (cycleDay <= profile.periodLength) phase = 'Menstrual';
  else if (cycleDay < ovulationDay - 2) phase = 'Folliculary';
  else if (cycleDay <= ovulationDay + 1) phase = 'Ovulatory';

  return {
    currentDay: cycleDay,
    phase,
    daysUntilNextPeriod: Math.max(0, profile.cycleLength - cycleDay),
    daysUntilNextOvulation: Math.max(0, ovulationDay - cycleDay),
    isFertile,
    nextPeriodDate,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd
  };
};
