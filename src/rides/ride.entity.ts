import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type RideStatus = 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

@Entity('rides')
export class Ride {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' ,nullable: true })
  riderId!: number | null;

  @Column({ type: 'int', nullable: true })
  driverId!: number | null;

  @Column({ type: 'int' })
  clientPhone!: number;
  
  @Column({ type: 'varchar', length: 32, default: 'requested' })
  status!: RideStatus;

  @Column('float')
  originLat!: number;

  @Column('float')
  originLng!: number;

  @Column('float')
  destLat!: number;

  @Column('float')
  destLng!: number;

  @Column({ type: 'float', default: 0 })
  price!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  originAddress!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
 destAddress!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
