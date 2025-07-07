import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  time: string;

  @IsString()
  description: string;
}
// export class GetTaskDto {
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   page?: number;
// }
