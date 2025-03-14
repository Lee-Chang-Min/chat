import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsArray()
  @IsString({ each: true })
  readonly participants: string[]; // 채팅방 참여자 ID 배열 (필수)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly blockedUsers?: string[]; // 차단된 사용자 ID 배열 (선택)

  @IsOptional()
  @IsString()
  readonly lastMessageText?: string; // 마지막 메시지 내용 (선택)

  @IsOptional()
  @IsString()
  readonly lastMessageSenderId?: string; // 마지막 메시지 보낸 사용자 ID (선택)
}