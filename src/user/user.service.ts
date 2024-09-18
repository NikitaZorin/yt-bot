import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserData } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {

    }
    async createUpdateUser(userData: UserData): Promise<string> {
        let user = await this.userModel.findOne({ chatId: userData.chat_id });

        if (!user) {
            user = await this.userModel.create({
                chatId: userData.chat_id,
                type: userData.type,
                createdAt: new Date(),
            });
        } else {
            user.type = userData.type;
        }

        await user.save();

        return 'success';
    }
    async getUser(chat_id: number): Promise<string> {
        const user = await this.userModel.findOne({ chatId: chat_id });

        const userType = user?.type || 'yt';

        return userType;
    }
}
