import { Test, TestingModule } from '@nestjs/testing';
import { YtController } from './yt.controller';
import { YoutubeService } from '../yt.service';
import { InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';

describe('YtController', () => {
  let controller: YtController;
  let service: YoutubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YtController],
      providers: [
        {
          provide: YoutubeService,
          useValue: {
            getSongUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<YtController>(YtController);
    service = module.get<YoutubeService>(YoutubeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSongUrl', () => {
    it('return a list of songs from service', async () => {
      const mockSongs: InlineQueryResultArticle[] = [
        {
          type: 'article',
          id: '1',
          title: 'Artist 1 - test song',
          input_message_content: {
            message_text: 'https://youtube.com/1',
          },
          thumbnail_url: 'https://image.com/1',
        },
      ];

      jest.spyOn(service, 'getSongUrl').mockResolvedValue(mockSongs);

      const result = await controller.getSongUrl('test song');
      expect(result).toEqual(mockSongs);
      expect(service.getSongUrl).toHaveBeenCalledWith('test song');
    });

    it('should throw an error if the service throws', async () => {
      jest.spyOn(service, 'getSongUrl').mockRejectedValue(new Error('Service error'));
  
      await expect(controller.getSongUrl('test song')).rejects.toThrow('Service error');
    });
  });
});
