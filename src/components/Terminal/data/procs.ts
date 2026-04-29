export interface Proc {
  pid: number;
  cmd: string;
  cpu: number;
  mem: number;
  time: string;
}

export const PROCS: Proc[] = [
  { pid: 1041, cmd: 'shopify-core', cpu: 41.2, mem: 18.4, time: '4y' },
  { pid: 4071, cmd: 'felt-api', cpu: 12.8, mem: 6.1, time: '8mo' },
  { pid: 5012, cmd: 'rails-console', cpu: 4.3, mem: 2.0, time: '2h' },
  { pid: 5118, cmd: 'pg-stat-monitor', cpu: 2.1, mem: 1.4, time: '1d' },
  { pid: 6601, cmd: 'claude-pair', cpu: 6.8, mem: 3.2, time: '3w' },
  { pid: 9999, cmd: 'coffee.sh', cpu: 0.4, mem: 0.1, time: '∞' },
];
