import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import countriesConfig from './configs/app.config';
import { databaseConfig } from './configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { CacheService } from './cache/cache.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [countriesConfig], }),
    TypeOrmModule.forRootAsync(databaseConfig),
    CountriesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [CacheService],
})
export class AppModule { }
