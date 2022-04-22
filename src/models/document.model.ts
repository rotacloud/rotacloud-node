export class Document {
  public id: number;
  public deleted: boolean;
  public created_at: number;
  public created_by: number;
  public name: string;
  public public: boolean;
  public extension: string;
  public size_kb: number;
  public user: number;
  public users: number[];
}
