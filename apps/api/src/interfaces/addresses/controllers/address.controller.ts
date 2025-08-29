import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { CreateAddressDto } from '@/interfaces/addresses/dto/create-address.dto';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { UserEntity } from '@core/users/entities/user.entity';
import { CreateAddressUseCase } from '@application/address/create-address.use-case';
import { AddressViewModel } from '@/interfaces/addresses/address.view.model';
import { FindAddressByIdUseCase } from '@application/address/find-address-by-id.use-case';
import { FindAddressesByUserIdUseCase } from '@application/address/find-addresses-by-user-id.use-case';
import { UpdateAddressDto } from '@/interfaces/addresses/dto/update-address.dto';
import { UpdateAddressUseCase } from '@application/address/update-address.use-case';
import { DeleteAddressUseCase } from '@application/address/delete-address.use-case';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(
    private readonly createAddress: CreateAddressUseCase,
    private readonly findById: FindAddressByIdUseCase,
    private readonly findAddressesByUserId: FindAddressesByUserIdUseCase,
    private readonly updateAddress: UpdateAddressUseCase,
    private readonly deleteAddress: DeleteAddressUseCase,
  ) {}
  @Post()
  async create(@Body() dto: CreateAddressDto, @CurrentUser() user: UserEntity) {
    dto.userId = user.id;
    const { address } = await this.createAddress.execute(dto);

    return AddressViewModel.toHTTP(address);
  }

  @Get(':id')
  async find(@Param() params: { id: string }) {
    const { id } = params;
    const { address } = await this.findById.execute(id);

    return AddressViewModel.toHTTP(address);
  }

  @Get()
  async findAll(@CurrentUser() user: UserEntity) {
    const { id } = user;
    const { addresses } = await this.findAddressesByUserId.execute({ id });

    return addresses.map((address) => AddressViewModel.toHTTP(address));
  }

  @Patch(':id')
  async update(@Body() dto: UpdateAddressDto, @Param() params: { id: string }) {
    const { id } = params;

    const { address } = await this.updateAddress.execute(dto, id);

    return AddressViewModel.toHTTP(address);
  }

  @Delete(':id')
  async delete(@Param() params: { id: string }) {
    const { id } = params;

    await this.deleteAddress.execute(id);
  }
}
