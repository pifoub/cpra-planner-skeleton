import type { CPRARequest, Timeline } from '../types';

function toDate(s: string): Date {
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) {
    return new Date(iso.getFullYear(), iso.getMonth(), iso.getDate());
  }
  const parts = s.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts.map(p => parseInt(p, 10));
    const d = new Date(year, month - 1, day);
    if (!isNaN(d.getTime())) return d;
  }
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  throw new Error('Unrecognized date format');
}

function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * 86400000);
}

function rollForward(d: Date) {
  const day = d.getDay();
  if (day === 6) return addDays(d, 2);
  if (day === 0) return addDays(d, 1);
  return d;
}

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

export type DateMath = {
  received: string;
  plus10: string;
  extensionBase?: string;
  determinationFinal: string;
  extensionFinal?: string;
};

export function computeTimeline(
  req: CPRARequest,
  opts: { applyExtension: boolean; adjustWeekends: boolean }
): { timeline: Timeline; math: DateMath } {
  const { applyExtension, adjustWeekends } = opts;
  if (!req || !req.receivedDate) throw new Error('Invalid request');
  const received = toDate(req.receivedDate);
  const plus10 = addDays(received, 10);
  const determination = adjustWeekends ? rollForward(plus10) : plus10;
  let extBase: Date | undefined;
  let extFinal: Date | undefined;
  if (applyExtension) {
    extBase = addDays(plus10, 14);
    extFinal = adjustWeekends ? rollForward(extBase) : extBase;
  }
  const roll = (d: Date) => (adjustWeekends ? rollForward(d) : d);
  const prodBase = extFinal ?? determination;
  const milestones = [
    { label: 'Search kickoff', due: fmt(roll(addDays(received, 1))) },
    { label: 'Privilege review', due: fmt(roll(addDays(prodBase, -3))) },
    { label: 'Draft production', due: fmt(roll(addDays(prodBase, -1))) },
  ];
  const timeline: Timeline = {
    determinationDue: fmt(determination),
    extensionDue: extFinal ? fmt(extFinal) : undefined,
    milestones,
  };
  const math: DateMath = {
    received: fmt(received),
    plus10: fmt(plus10),
    extensionBase: extBase ? fmt(extBase) : undefined,
    determinationFinal: fmt(determination),
    extensionFinal: extFinal ? fmt(extFinal) : undefined,
  };
  return { timeline, math };
}

