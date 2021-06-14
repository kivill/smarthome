import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

    @ApiProperty({
        example: '602cf0a5bd377d0d1ccbe6d2',
        description: '_id of the User',
        format: 'string',
    })
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

    // fullName
    @ApiProperty({
        example: 'pejman hadavi',
        description: 'The name of the User',
        format: 'string',
        minLength: 6,
        maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    // Email
    @ApiProperty({
        example: 'pejman@gmail.com',
        description: 'The email of the User',
        format: 'email',
        uniqueItems: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    // Password
    @ApiProperty({
        example: 'secret password change me!',
        description: 'The password of the User',
        format: 'string',
    })
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly password: string;
    readonly roles: string;
}
