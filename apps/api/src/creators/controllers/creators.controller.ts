import { Body, Controller, Post } from '@nestjs/common';

import { CreateCreatorDto } from '@/creators/dto/create-creator.dto';
import { CreatorsEntity } from '@core/creators/creators.entity';
import { CreateCreatorsService } from '@/creators/services/creators.service';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreateCreatorsService) {}
  @Post()
  async create(@Body() dto: CreateCreatorDto): Promise<CreatorsEntity> {
    return await this.creatorsService.create(dto);
  }
}
