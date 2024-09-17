import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserData } from '../schemas/user.schema';

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) { }

    @Post()
    async createUpdateUser(@Body() userData: UserData): Promise<string> {
        return this.service.createUpdateUser(userData);
    }

    @Get()
    async getUser(@Body() chat_id: number): Promise<string> {
        return this.service.getUser(chat_id);
    }
}
