import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

export type UserRole = 'passenger' | 'driver' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  phone!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'varchar', length: 16, default: 'passenger' })
  role!: UserRole;

  @Column({ type: 'float', default: 5 })
  ratingAvg!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  static async hashPassword(plain: string) {
    return bcrypt.hash(plain, 10);
  }

  async comparePassword(plain: string) {
    return bcrypt.compare(plain, this.passwordHash);
  }
}
