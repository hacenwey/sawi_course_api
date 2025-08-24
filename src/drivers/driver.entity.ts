// src/drivers/entities/driver.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('drivers')
export class Driver {
//   @PrimaryGeneratedColumn('uuid')
 @PrimaryGeneratedColumn()
  id!: string;

  @Index({ unique: true })
  @Column({ length: 32 , nullable: true})
  clientPhone!: string;

  @Index({ unique: true })
  @Column({ length: 32 , nullable: true})
  userId!: string;
  
  @Column({ default: false })
  isAvailable!: boolean;

  @Column('double precision', { nullable: true })
  latitude!: number | null;

  @Column('double precision', { nullable: true })
  longitude!: number | null;

  @Column({ type: 'text', nullable: true })
  currentLocationAddress!: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
