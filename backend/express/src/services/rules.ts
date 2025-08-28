import type { CPRARequest, Timeline, TimelineItem } from './types.js';

function toDate(s: string): Date {
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return new Date(iso.getFullYear(), iso.getMonth(), iso.getDate());
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
  throw new Error(`Unrecognized date format: ${s}`);
}

function rollForward(d: Date): Date {
  const day = d.getDay();
  if (day === 6) return new Date(d.getTime() + 2 * 86400000);
  if (day === 0) return new Date(d.getTime() + 1 * 86400000);
  return d;
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function computeTimeline(req: CPRARequest, adjustForHolidays = true): Timeline {
  if (!req || !req.requester || !req.receivedDate || !req.description) {
    throw new Error('Invalid CPRARequest');
  }
  const received = toDate(req.receivedDate);
  let determination = new Date(received.getTime() + 10 * 86400000);
  let extensionDue: Date | undefined;
  if (req.extension && req.extension.apply) {
    extensionDue = new Date(determination.getTime() + 14 * 86400000);
  }
  if (adjustForHolidays) {
    determination = rollForward(determination);
    if (extensionDue) extensionDue = rollForward(extensionDue);
  }
  const prodBase = extensionDue ? extensionDue : determination;
  const milestones: TimelineItem[] = [
    { label: 'Search kickoff', due: fmt(rollForward(new Date(received.getTime() + 1 * 86400000))) },
    { label: 'Privilege review', due: fmt(rollForward(new Date(prodBase.getTime() - 3 * 86400000))) },
    { label: 'Draft production', due: fmt(rollForward(new Date(prodBase.getTime() - 1 * 86400000))) },
  ];
  return {
    determinationDue: fmt(determination),
    extensionDue: extensionDue ? fmt(extensionDue) : undefined,
    milestones,
  };
}
