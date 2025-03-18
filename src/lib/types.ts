
import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  department?: string;
  position?: string;
  villageCode?: string;
  villageName?: string;
  createdAt: Timestamp | Date;
}

export type UserRole = "admin" | "staff" | "operator" | "viewer";

export interface Letter {
  id: string;
  letterNumber: string;
  number: number;
  year: number;
  month: string;
  type: LetterType;
  subject: string;
  content: string;
  recipients: string[];
  attachments?: Attachment[];
  status: LetterStatus;
  createdBy: string;
  createdAt: Timestamp | Date;
  approvedBy?: string;
  approvedAt?: Timestamp | Date;
  sentAt?: Timestamp | Date;
  signatureURL?: string;
  notes?: string;
  priority?: "low" | "medium" | "high";
}

export type LetterType = 
  "UMUM" | 
  "KETERANGAN" | 
  "REKOMENDASI" | 
  "PENGUMUMAN" | 
  "UNDANGAN";

export type LetterStatus = 
  "draft" | 
  "pending" | 
  "approved" | 
  "rejected" | 
  "sent" | 
  "archived";

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Timestamp | Date;
}

export interface VillageSettings {
  id: string;
  name: string;
  code: string;
  address: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  headName: string;
  headPosition: string;
  headSignature?: string;
  letterhead?: string;
  footer?: string;
}

// Helper functions to work with Timestamp
export const isTimestamp = (value: any): value is Timestamp => {
  return value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function';
};

export const toDate = (value: Timestamp | Date): Date => {
  if (isTimestamp(value)) {
    return value.toDate();
  }
  return value;
};

// Application state types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

// API responses
export interface ApiResponse<T> {
  data?: T;
  error?: Error | unknown;
  success: boolean;
}
