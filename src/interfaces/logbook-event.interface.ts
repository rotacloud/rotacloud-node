export interface ApiLogbookEvent {
  id: number;
  created_at: number;
  created_by: number;
  updated_at: string;
  updated_by: string;
  deleted: boolean;
  deleted_at: string;
  deleted_by: string;
  user: number;
  category: number;
  date: string;
  time: string;
  name: string;
  description: string;
}
