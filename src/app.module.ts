import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import countriesConfig from './configs/app.config';
import { databaseConfig } from './configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [countriesConfig], }),
    TypeOrmModule.forRootAsync(databaseConfig)
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
