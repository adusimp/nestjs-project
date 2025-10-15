import { Role } from "src/enums/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"users"})
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'user_name'})
    username : string;

    @Column()
    password: string;

    @CreateDateColumn({type:'timestamp',name:'created_at'})
    createdAt:Date;

    @UpdateDateColumn({type:'timestamp',name:'updated_at'})
    updatedAt:Date;
}