import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import countriesConfig from './configs/app.config';
import { databaseConfig } from './configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [countriesConfig], }),
    TypeOrmModule.forRootAsync(databaseConfig),
    CountriesModule
  ],
  controllers: [],
  providers: [CacheService],
})
export class AppModule { }
