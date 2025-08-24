import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { CreateAddressDto } from '@/interfaces/addresses/dto/create-address.dto';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { UserEntity } from '@core/users/entities/user.entity';
import { CreateAddressUseCase } from '@application/address/create-address.use-case';
import { AddressViewModel } from '@/interfaces/addresses/address.view.model';

@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly createAddress: CreateAddressUseCase) {}
  @Post()
  async create(@Body() dto: CreateAddressDto, @CurrentUser() user: UserEntity) {
    dto.userId = user.id;
    const { address } = await this.createAddress.execute(dto);

    return AddressViewModel.toHTTP(address);
  }
}
