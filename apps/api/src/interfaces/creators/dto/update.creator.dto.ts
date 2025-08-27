import { PartialType } from '@nestjs/mapped-types';
import { CreateCreatorDto } from '@/interfaces/creators/dto/create-creator.dto';

export class UpdateCreatorDto extends PartialType(CreateCreatorDto) {
  bio?: string;
  socialLinks?: string[];
}
