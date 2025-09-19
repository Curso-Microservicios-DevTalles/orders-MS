import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { OrderStatusList } from '../enum/order.enuum';

export class ChangeOrderStatusDto {
  @IsUUID(4)
  id: string;

  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
