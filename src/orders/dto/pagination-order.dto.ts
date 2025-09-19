import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { OrderStatusList } from '../enum/order.enuum';
import { OrderStatus } from '@prisma/client';

export class PaginationOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Valid status are: ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
