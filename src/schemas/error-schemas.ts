import { ApiProperty } from '@nestjs/swagger';

class RegistrationErrorSchema {
  @ApiProperty({ type: 'string' })
  message: string;
}

class CreateRoleErrorSchema {
  @ApiProperty({ type: 'string' })
  message: string;
}

export { RegistrationErrorSchema, CreateRoleErrorSchema };


