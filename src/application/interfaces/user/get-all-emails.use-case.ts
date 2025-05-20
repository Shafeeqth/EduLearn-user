/**
 * Interface representing the use case to fetch all registered emails
 */
export interface IGetAllEmailsUseCase {
  /**
   * @returns A Promise resolve to `string[]`
   */
  execute(): Promise<string[]>;
}
