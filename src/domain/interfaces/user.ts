import { UserRoles } from '@/shared/types/user-roles';

export interface IUser {
  id: string;
  email: string;
  role: UserRoles;
  firstName?: string;
  lastName?: string;
  password: string;
  isVerified: boolean;
  avatar?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
