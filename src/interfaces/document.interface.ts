export interface Document {
  id: number;
  account_id: number;
  name: string;
  user: number;
  users: number[];
  folder_id: number | null;
  expires: number | null;
  public: boolean;
  created_at: number;
  created_by: number | null;
  deleted: boolean;
  deleted_at: number | null;
  deleted_by: number | null;
  size_kb: number;
  extension: string;
  bucket: string;
  key: string;
  requires_acknowledgement: boolean;
  shared: boolean;
  acknowledgements: {
    id: number;
    accountId: number;
    user: number;
    /** Date in ISO 8601 format  */
    acknowledged_at: string;
  }[];
  requires_signing: boolean;
  signature: {
    signature: string;
    /** Date in ISO 8601 format  */
    signed_at: string;
    /** IPv4 address */
    ip: string;
  } | null;
}
