import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserData } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  let userModelMock: any;
  const testChatId = 123456789;

  beforeEach(async () => {
    userModelMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create or update user', async () => {
    const userData: UserData = { chat_id: testChatId, type: 'yt' };
    userModelMock.findOne.mockResolvedValueOnce(null);

    userModelMock.create.mockResolvedValue({
      save: jest.fn().mockResolvedValueOnce(null),
    });

    const result = await service.createUpdateUser(userData);

    expect(userModelMock.findOne).toHaveBeenCalledWith({
      chatId: userData.chat_id,
    });
    expect(userModelMock.create).toHaveBeenCalledWith({
      chatId: userData.chat_id,
      type: userData.type,
      createdAt: expect.any(Date),
    });
    expect(result).toBe('success');
  });

  it('get user from db', async () => {
    const userMock = { chat_id: testChatId, type: 'yt' };

    userModelMock.findOne.mockResolvedValueOnce(userMock);

    const result = await service.getUser(testChatId);

    expect(userModelMock.findOne).toHaveBeenCalledWith({ chatId: testChatId });
    expect(result).toBe('yt');
  });
});
