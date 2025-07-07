import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterDto } from "./dto/user.dto";

@Controller('user')
export class UserController{
    constructor(private userService:UserService){}

    // @Post()
    // async signup(@Body() userDto: RegisterDto){
    //     return this.userService.addOneUser(userDto);
    // }
}
