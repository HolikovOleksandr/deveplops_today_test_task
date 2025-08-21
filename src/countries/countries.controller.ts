import { Controller, Get, Param, Logger } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryInfoDto } from './dto/country_info.dto';
import { ApiResponseDto } from 'src/common/api_response.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  private readonly logger = new Logger(CountriesController.name);

  constructor(private readonly countriesService: CountriesService) { }

  @Get('')
  @ApiOperation({ summary: 'Get available countries' })
  @ApiOkResponse({
    description: 'List of available countries',
    type: ApiResponseDto,
    isArray: false,
  })
  async getAvailableCountries(): Promise<ApiResponseDto<{ countryCode: string; name: string }[] | undefined>> {
    try {
      const countries = await this.countriesService.getAvailableCountries();
      this.logger.log(`🦾 Successfully fetched ${countries.length} available countries`);
      return new ApiResponseDto(false, `Available ${countries.length} countries`, countries);
    } catch (error) {
      this.logger.error(`💥 Failed to get available countries`, error.stack);
      return new ApiResponseDto(true, 'Failed to retrieve the list of countries');
    }
  }

  @Get(':countryCode')
  @ApiOperation({ summary: 'Get country info by code' })
  @ApiOkResponse({
    description: 'Country info',
    type: ApiResponseDto,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'Country not found' })
  async getCountryInfo(@Param('countryCode') countryCode: string): Promise<ApiResponseDto<CountryInfoDto | undefined>> {
    try {
      const countryInfo = await this.countriesService.getCountryInfo(countryCode);
      this.logger.log(`🦾 Successfully fetched info for country: ${countryCode}`);

      return new ApiResponseDto(false, `Info for country: ${countryCode}`, countryInfo);
    } catch (error) {

      if (error.response?.status === 404) {
        return new ApiResponseDto(true, `Country not found: ${countryCode}`);
      } else {
        this.logger.error(`💥 Failed to get info for country code: ${countryCode}`, error.stack);
        return new ApiResponseDto(true, `Country not found: ${countryCode}`);
      }
    }
  }
}