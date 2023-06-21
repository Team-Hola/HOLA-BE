import { IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class S3PreSignUrlRequestDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
