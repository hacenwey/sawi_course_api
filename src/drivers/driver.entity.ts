// src/drivers/entities/driver.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ length: 32, nullable: true })
  clientPhone!: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  userId!: number;

  @Column({ default: false })
  isAvailable!: boolean;

  @Column('double precision', { nullable: true })
  latitude!: number | null;

  @Column('double precision', { nullable: true })
  longitude!: number | null;

  @Column({ type: 'text', nullable: true })
  currentLocationAddress!: string | null;

  // --- New Car Info ---
  @Column({ type: 'varchar', length: 64, nullable: true })
  carModel!: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  carPlate!: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  carColor!: string | null;

  @Column({ type: 'text', nullable: true })
  carImage!: string | null;   // رابط لصورة السيارة

  @Column({ type: 'text', nullable: true })
  insuranceDocument!: string | null; // رابط صورة التأمين

  @Column({ type: 'text', nullable: true })
  licenseDocument!: string | null;   // رابط صورة الرخصة

  @Column({ type: 'text', nullable: true })
  vintDocument!: string | null; 
  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

