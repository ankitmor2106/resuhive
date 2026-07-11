import { IsString, IsNotEmpty } from 'class-validator';

export class MatchJDDto {
  @IsString()
  @IsNotEmpty()
  jobDescription: string;
}
