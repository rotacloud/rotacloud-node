/** Creates a `Partial<T>` where all properties specified by `K` are required
 *
 * e.g.
 * `RequirementsOf<{id: number, user: number, location: number}, "id" | "user">` is
 * equivalent to `{id: number, user: number, location?: number}`
 * */
export type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;
