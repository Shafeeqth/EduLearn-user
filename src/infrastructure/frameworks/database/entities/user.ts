import { IUser } from '@/domain/interfaces/user';
import { UserRoles } from '@/shared/types/user-roles';
import { UserStatus } from '@/shared/types/user-status';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RefreshToken } from './refresh-token';

@Entity('users')
export default class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  firstName?: string | undefined;

  @Column({ type: 'varchar', nullable: true })
  lastName?: string | undefined;

  @Index()
  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role!: UserRoles;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'boolean' })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamp with time zone')
  lastLogin: Date;

  @Column({ type: 'varchar', nullable: true })
  phone?: string | undefined;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | undefined;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { cascade: true })
  refreshTokens!: RefreshToken[];
}
