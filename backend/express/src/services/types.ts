export interface Requester {
  name: string;
  org?: string;
  email?: string;
}

export interface DateRange {
  start?: string;
  end?: string;
}

export interface Extension {
  apply: boolean;
  reasons: string[];
}

export interface CPRARequest {
  requester: Requester;
  receivedDate: string;
  matter: string;
  description: string;
  recordTypes: string[];
  custodians: string[];
  preferredFormatDelivery: string;
  range?: DateRange;
  departments: string[];
  extension: Extension;
}

export interface TimelineItem {
  label: string;
  due: string;
}

export interface Timeline {
  determinationDue: string;
  extensionDue?: string;
  milestones: TimelineItem[];
}

export interface CPRARequestDraft {
  request: CPRARequest;
  confidences: Record<string, number>;
}

export interface LetterArtifact {
  html: string;
  docxBase64?: string;
  pdfBase64?: string;
}
