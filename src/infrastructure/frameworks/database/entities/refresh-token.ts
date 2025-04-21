import { IRefreshToken } from '@/domain/interfaces/refresh-token';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user';

@Entity('Refresh Token')
export class RefreshToken implements IRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  token: string;

  @Index()
  @Column({ nullable: false, unique: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;
}
