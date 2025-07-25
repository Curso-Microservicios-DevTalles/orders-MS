/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from 'generated/prisma';
import { RpcException } from '@nestjs/microservices';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  create(createOrderDto: CreateOrderDto) {
    const newOreder = this.order.create({
      data: createOrderDto,
    })

    return newOreder;
  }

  async findAll(paginationOrderDto: PaginationOrderDto) {
    const totalPages = await this.order.count({
      where: {
        status: paginationOrderDto.status,
      }
    })

    const currentPage = paginationOrderDto.page || 1;
    const perPage = paginationOrderDto.limit || 10;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: paginationOrderDto.status,
        },
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        last_page: Math.ceil(totalPages / perPage),
      }
    }
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: {
        id,
      }
    })

    if(!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id #${id} not found.`,
      })
    }

    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto){
    const {id, status} = changeOrderStatusDto;
    const order = await this.findOne(id);

    if(order.status === status){
      return order;
    }

    if(!order){
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id #${id} not found.`,
      })
    }

    return this.order.update({
      where: {id},
      data: {status}
    })
  }
}
