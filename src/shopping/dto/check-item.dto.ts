import { IsUUID, IsBoolean } from 'class-validator';

export class CheckItemDto {
  @IsUUID()
  id: string;

  @IsBoolean()
  bought: boolean;
}
