import { Roles } from './../auth/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { UserService } from './user.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiBearerAuth,
    ApiHeader,
    ApiOperation,
    ApiParam
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Добавление пользователя', })
    @ApiCreatedResponse({})
    async register(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
        return await this.userService.create(req, createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Авторизация пользователя по логину и паролю', })
    @ApiOkResponse({})
    async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
        return await this.userService.login(req, loginUserDto);
    }

    @Get('auth-by-token')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Авторизация пользователя по токену', })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async findAll(@Req() req: Request) {
        return await this.userService.loginByAuth(req);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin', 'helper', 'legal')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Получение информации о конкретном пользователе', })
    @ApiParam({ name: 'id', description: 'user id', example: '602cf0a5bd377d0d1ccbe6d2' })
    @ApiOkResponse({})
    async appById(@Param() params) {
        return await this.userService.getUserById(params.id);
    }

    @Post(':id')
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Обновление информации о пользователе', })
    @ApiCreatedResponse({})
    async updateUser(@Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(updateUserDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin', 'helper')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение списка пользователей', })
    async getAllUsers(@Req() req: Request) {
        return await this.userService.getAllUsers(req)
    }
}
