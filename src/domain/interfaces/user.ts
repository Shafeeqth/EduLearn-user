import { AuthType, UserRoles } from '@/shared/types/user-types';
import { UserStatus } from '@/shared/types/user-status';

export interface IUser {
  id: string;
  email: string;
  role: UserRoles;
  firstName?: string;
  lastName?: string;
  password?: string;
  status: UserStatus;
  avatar?: string;
  authType?: AuthType;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  language?: string;
  website?: string;
  bio?: string;
  headline?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
