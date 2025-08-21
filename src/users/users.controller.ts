import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ApiResponseDto } from 'src/common/api_response.dto';
import { CreateUserDto } from './dto/create_user.dto';
import { AddHolidaysDto } from './dto/add_holyday.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: ApiResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() body: CreateUserDto): Promise<ApiResponseDto<User>> {
    try {
      const user = await this.usersService.create(body.name);
      return new ApiResponseDto<User>(false, `Created a new user ${user.name}`, user);
    } catch (error) {
      return new ApiResponseDto<User>(true, error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Fetched all users', type: ApiResponseDto })
  async getAll(): Promise<ApiResponseDto<User[]>> {
    const users = await this.usersService.findAll();
    return new ApiResponseDto<User[]>(false, `Fetched all ${users.length} users`, users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Fetched user', type: ApiResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getOne(@Param('id') id: string): Promise<ApiResponseDto<User>> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return new ApiResponseDto<User>(false, `Fetched user ${user.name}`, user);
  }

  @Post(':id/calendar/holidays')
  @ApiOperation({ summary: 'Add holidays to user calendar' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: AddHolidaysDto })
  @ApiResponse({ status: 201, description: 'Added holidays', type: ApiResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async addHolidays(
    @Param('id') id: string,
    @Body() dto: AddHolidaysDto,
  ): Promise<ApiResponseDto<{ name: string; date: string }[]>> {
    try {
      const addedHolidays = await this.usersService.addNationalHolidays(id, dto);
      return new ApiResponseDto(false, `Added ${addedHolidays.length} holidays to user calendar`, addedHolidays);
    } catch (error) {
      return new ApiResponseDto(true, error.message);
    }
  }
}
