import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email : string;

    @Column()
    password: string;

    @Column({type:'timestamp'})
    CreatedAt:Date;

    @Column({type:'timestamp'})
    UpdatedAt:Date;
}