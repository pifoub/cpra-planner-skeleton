import { randomUUID } from 'crypto';

function icsEvent(dtstart_date: string, summary: string, uid?: string, description = ''): string {
  const id = uid || randomUUID();
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return `BEGIN:VEVENT\nUID:${id}\nDTSTAMP:${dtstamp}\nDTSTART;VALUE=DATE:${dtstart_date.replace(/-/g,'')}\nSUMMARY:${summary}\nDESCRIPTION:${description}\nEND:VEVENT`;
}

export function createTaskSync(payload: any) {
  const tl = payload.timeline || {};
  const events: string[] = [];
  if (tl.determinationDue) events.push(icsEvent(tl.determinationDue, 'CPRA Determination Due'));
  if (tl.extensionDue) events.push(icsEvent(tl.extensionDue, 'CPRA Extension Due'));
  for (const m of tl.milestones || []) {
    if (m.label === 'Draft production') events.push(icsEvent(m.due, 'CPRA Draft Production'));
  }
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CPRA Planner//EN\n${events.join('\n')}\nEND:VCALENDAR\n`;
  return {
    createdEvents: [{ provider: 'ics', id: 'local', url: '' }],
    icsFileBase64: Buffer.from(ics).toString('base64'),
    emailsSent: 0,
  };
}
