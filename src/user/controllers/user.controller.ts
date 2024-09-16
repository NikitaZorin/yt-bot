import { Controller } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserData } from '../schemas/user.schema';

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) { }

    createUpdateUser(userData: UserData): Promise<string> {
        return this.service.createUpdateUser(userData);
    }

    getUser(chat_id: number): Promise<string> {
        return this.service.getUser(chat_id);
    }
}
