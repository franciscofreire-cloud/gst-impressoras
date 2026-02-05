
export enum InstallMode {
  USB = 'USB',
  NETWORK = 'Rede',
  BACKUP = 'Backup'
}

export enum CollectingStatus {
  YES = 'Sim',
  NO = 'Não'
}

export type UserRole = 'admin' | 'user';

export interface HistoryEntry {
  id: string;
  printerId: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: number;
}

export interface Printer {
  id: string;
  selb: string;
  serialNumber: string;
  model: string;
  installMode: InstallMode;
  ip?: string;
  collecting: CollectingStatus;
  station: string;
  address: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  isAuthenticated: boolean;
}
