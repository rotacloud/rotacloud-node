export interface Message {
  id: number;
  /** Unix timestamp in seconds */
  sent_at: number;
  sent_by: number;
  subject: string;
  message: string;
  /** User recipients of the message */
  users: {
    /** ID of user */
    user: number;
    sent: boolean;
    opened: boolean;
    /** Unix timestamp in seconds */
    opened_at: boolean;
    error: null | unknown;
  }[];
  attachments: {
    name: string;
    extension: string;
    type: string;
    /** rounded integer value */
    size_kb: number;
    bucket: string;
    key: string;
  }[];
}
