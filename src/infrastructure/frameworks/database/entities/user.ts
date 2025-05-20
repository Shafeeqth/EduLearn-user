import { IUser } from '@/domain/interfaces/user';
import { UserRoles } from '@/shared/types/user-types';
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

  @Column({ nullable: true })
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 128, nullable: true })
  headline?: string;

  @Column({ type: 'text', nullable: true })
  biography?: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  language?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  facebook?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  instagram?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  linkedin?: string;

  @Column('timestamp with time zone')
  lastLogin: Date;

  @Column({ type: 'varchar', nullable: true })
  phone?: string | undefined;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | undefined;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { cascade: true })
  refreshTokens!: RefreshToken[];
}
