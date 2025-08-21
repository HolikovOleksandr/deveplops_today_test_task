import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { AddHolidaysDto } from './dto/add_holyday.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(name: string): Promise<User> {
    const newUser = this.userRepository.create({ name });
    return this.userRepository.save(newUser);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async addNationalHolidays(userId: string, dto: AddHolidaysDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const { data: allHolidays } = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${dto.year}/${dto.countryCode}`
    );

    const selectedHolidays = dto.holidays
      ? allHolidays.filter(h => dto.holidays?.includes(h.localName))
      : allHolidays;

    const events = selectedHolidays.map(h => ({ name: h.localName, date: h.date }));

    // Додаємо без дублювання
    const existingDates = new Set(user.calendar?.map(c => c.date));
    const newEvents = events.filter(e => !existingDates.has(e.date));
    user.calendar = [...(user.calendar || []), ...newEvents];

    await this.userRepository.save(user);
    return newEvents;
  }
}
