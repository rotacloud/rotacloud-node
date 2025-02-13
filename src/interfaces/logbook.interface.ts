export interface LogbookCategory {
  id: number;
  name: string;
  deleted: boolean;
  /** Date and time in ISO 8601 format  */
  createdAt: string;
  createdBy: number;
}

export interface LogbookEntry {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  /** Date of entry in ISO 8601 format  */
  date: string;
  time: string | null;
  /** Date and time in ISO 8601 format  */
  createdAt: string | null;
  createdBy: number;
  /** Date and time in ISO 8601 format  */
  updatedAt: string | null;
  updatedBy: number | null;
  userId: number;
}

export interface LogbookQueryParameters {
  userId: number;
  /** Date in ISO 8601 format */
  date?: string;
}
