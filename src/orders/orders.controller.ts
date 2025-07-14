import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const product = await firstValueFrom(
        this.client.send('createOrder', createOrderDto || {}),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrder', orderPaginationDto);
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return await firstValueFrom(
        this.client.send('findAllOrder', {
          ...paginationDto,
          status: statusDto.status,
        }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(this.client.send('findOneOrder', { id }));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return await firstValueFrom(
        this.client.send('changeOrderStatus', {
          id,
          status: statusDto.status,
        }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
