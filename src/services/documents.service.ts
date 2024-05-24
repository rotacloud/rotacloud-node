import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Document } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';
import { DocumentsQueryParams } from '../interfaces/query-params/index.js';

type RequiredProps = 'name' | 'bucket' | 'key';

export class DocumentsService extends Service<Document> {
  private apiPath = '/documents';

  create(data: RequirementsOf<Document, RequiredProps>): Promise<Document>;
  create(
    data: RequirementsOf<Document, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Document>>;
  create(data: RequirementsOf<Document, RequiredProps>, options: Options): Promise<Document>;
  create(data: RequirementsOf<Document, RequiredProps>, options?: Options) {
    return super
      .fetch<Document>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Document>;
  get<F extends keyof Document>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Document>,
  ): Promise<AxiosResponse<Pick<Document, F>>>;
  get<F extends keyof Document>(
    id: number,
    options: { fields: F[] } & OptionsExtended<Document>,
  ): Promise<Pick<Document, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Document>>;
  get(id: number, options?: OptionsExtended<Document>): Promise<Document>;
  get(id: number, options?: OptionsExtended<Document>) {
    return super
      .fetch<Document>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query?: DocumentsQueryParams): AsyncGenerator<Document>;
  list<F extends keyof Document>(
    query: DocumentsQueryParams,
    options: { fields: F[] } & OptionsExtended<Document>,
  ): AsyncGenerator<Pick<Document, F>>;
  list(query?: DocumentsQueryParams, options?: OptionsExtended<Document>): AsyncGenerator<Document>;
  async *list(query?: DocumentsQueryParams, options?: OptionsExtended<Document>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query?: DocumentsQueryParams): Promise<Document[]>;
  listAll<F extends keyof Document>(
    query: DocumentsQueryParams,
    options: { fields: F[] } & OptionsExtended<Document>,
  ): Promise<Pick<Document, F>[]>;
  listAll(query?: DocumentsQueryParams, options?: OptionsExtended<Document>): Promise<Document[]>;
  async listAll(query?: DocumentsQueryParams, options?: OptionsExtended<Document>) {
    const shifts = [] as Document[];
    for await (const shift of this.list(query, options)) {
      shifts.push(shift);
    }
    return shifts;
  }

  listByPage(query?: DocumentsQueryParams): AsyncGenerator<AxiosResponse<Document[]>>;
  listByPage<F extends keyof Document>(
    query: DocumentsQueryParams,
    options: { fields: F[] } & OptionsExtended<Document>,
  ): AsyncGenerator<AxiosResponse<Pick<Document, F>[]>>;
  listByPage(
    query?: DocumentsQueryParams,
    options?: OptionsExtended<Document>,
  ): AsyncGenerator<AxiosResponse<Document[]>>;
  listByPage(query?: DocumentsQueryParams, options?: OptionsExtended<Document>) {
    return super.iterator<Document>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(document: RequirementsOf<Document, 'id'>): Promise<Document>;
  update(
    document: RequirementsOf<Document, 'id'>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Document>>;
  update(document: RequirementsOf<Document, 'id'>, options: Options): Promise<Document>;
  update(
    documents: RequirementsOf<Document, 'id'>[],
  ): Promise<{ success: Document[]; failed: { id: number; error: string }[] }>;
  update(document: RequirementsOf<Document, 'id'>, options: Options): Promise<Document>;
  update(
    documents: RequirementsOf<Document, 'id'>[],
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<{ code: number; data?: Document; error?: string }[]>>;
  update(
    documents: RequirementsOf<Document, 'id'>[],
    options: Options,
  ): Promise<{ success: Document[]; failed: { id: number; error: string }[] }>;
  update(documents: RequirementsOf<Document, 'id'> | RequirementsOf<Document, 'id'>[], options?: Options) {
    if (!Array.isArray(documents)) {
      return super
        .fetch<Document>(
          {
            url: `${this.apiPath}/${documents.id}`,
            data: documents,
            method: 'POST',
          },
          options,
        )
        .then((res) => (options?.rawResponse ? res : res.data));
    }

    return super
      .fetch<{ code: number; data?: Document; error?: string }[]>(
        {
          url: this.apiPath,
          data: documents,
          method: 'POST',
        },
        options,
      )
      .then((res) => {
        if (options?.rawResponse) return res;

        const success: Document[] = [];
        const failed: { id: number; error: string }[] = [];
        for (let documentIdx = 0; documentIdx < res.data.length; documentIdx += 1) {
          const { data, error } = res.data[documentIdx];
          if (data) success.push(data);
          if (error) failed.push({ id: documents[documentIdx].id, error });
        }
        return { success, failed };
      });
  }

  delete(ids: number | number[]): Promise<number>;
  delete(ids: number | number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  delete(ids: number | number[], options: Options): Promise<number>;
  delete(ids: number | number[], options?: Options) {
    const params: AxiosRequestConfig = Array.isArray(ids)
      ? { url: this.apiPath, data: { ids }, method: 'DELETE' }
      : { url: `${this.apiPath}/${ids}`, method: 'DELETE' };

    return super.fetch<void>(params, options).then((res) => (options?.rawResponse ? res : res.status));
  }
}
