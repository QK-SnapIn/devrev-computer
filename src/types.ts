export interface Slide {
  id: number;
  numberStr: string;
  eyebrow: string;
  title: string;
  description: string;
  category: string;
}

export interface NodeItem {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  details: string;
  color?: string;
}

export interface SyncMessage {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  target: string;
  status: 'pending' | 'success' | 'warn' | 'error';
  payload: string;
}

export interface ReplayLog {
  time: string;
  action: 'click' | 'fetch' | 'console.error' | 'toast' | 'input' | 'warning';
  detail: string;
  status?: string;
  color: string;
}

export interface AlertInstance {
  id: string;
  timestamp: string;
  service: string;
  source: 'Dynatrace' | 'Qtrac' | 'Splunk' | 'PLuG SDK' | 'AWS' | 'Kube';
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

export interface Persona {
  role: string;
  name: string;
  avatar: string;
  question: string;
  metricLabel: string;
  metricVal: string;
  metricSub: string;
  traversal: string[];
  response: string;
}
