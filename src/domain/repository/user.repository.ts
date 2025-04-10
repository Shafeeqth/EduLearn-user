import { IUser } from '../interfaces/user';

export default interface IUserRepository {
  /**
   * Finds a user by their ID.
   * @param userId - The ID of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  findById(userId: string): Promise<IUser | null>;

  /**
   * Finds a user by their email.
   * @param email - The email of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  findByEmail(email: string): Promise<IUser | null>;

  /**
   * Retrieves all users with pagination.
   * @param offset - The offset to retrieve.
   * @param limit - The number of users per offset.
   * @returns A promise that resolves to an array of users, or an empty array if no users are found.
   */
  getAllUsers(offset: number, limit: number): Promise<IUser[] | []>;

  /**
   * Deletes a user by their ID.
   * @param userId - The ID of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   */
  delete(userId: string): Promise<void>;

  /**
   * Updates a user by their ID.
   * @param userId - The ID of the user to update.
   * @param data - The data to update the user with.
   * @returns A promise that resolves to the updated user if successful, or null if not found.
   */
  update(userId: string, data: Partial<IUser>): Promise<IUser | null>;

  /**
   * Retrieves all instructors.
   * @param offset - The offset number to retrieve.
   * @param limit - The number of users per page.
   * @returns A promise that resolves to an array of instructors, or an empty array if no instructors are found.
   */
  getAllInstructors(page: number, limit: number): Promise<IUser[] | []>;

  /**
   * Creates a new user.
   * @param user - The user to create.
   * @returns A promise that resolves to the created user.
   */
  create(user: IUser): Promise<IUser>;
}
