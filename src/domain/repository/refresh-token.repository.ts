import { IRefreshToken } from '../interfaces/refresh-token';

/**
 * Interface representing a repository for managing refresh tokens.
 */
export interface IRefreshTokenRepository {
  /**
   * Creates a Refresh token if not exist or update for a specific user
   * @param token An object which contains properties of refresh token
   * @return Promise that resolve  to void
   */
  upsertToken(token: IRefreshToken): Promise<void>;
  /**
   * Finds a refresh token by the associated user ID.
   *
   * @param userId - The ID of the user whose refresh token is being retrieved.
   * @returns A promise that resolves to the refresh token if found, or `undefined` if not found.
   */
  findByUserId(userId: string): Promise<IRefreshToken | null>;

  /**
   * Updates the refresh token for a specific user.
   *
   * @param userId - The ID of the user whose refresh token is being updated.
   * @param token - A partial object containing the properties of the refresh token to update.
   * @returns A promise that resolves when the update operation is complete.
   */
  updateToken(userId: string, token: Partial<IRefreshToken>): Promise<void>;
}
