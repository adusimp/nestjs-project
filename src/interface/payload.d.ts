import { Role } from "src/enums/role.enum";

interface Payload{
    sub:number;
    email:string;
    role:Role;
    iat:number;
    exp:number;
}