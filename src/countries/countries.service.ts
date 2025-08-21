import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Country } from './entities/country.entity';
import { CountryInfoDto } from './dto/country_info.dto';
import { PopulationHistoryDto } from './dto/population_history.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CountriesService {
  private readonly nagerApiBase: string;
  private readonly countriesApiBase: string;

  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    this.nagerApiBase = this.configService.get<string>('nagerApiBase') || '';
    this.countriesApiBase = this.configService.get<string>('countriesApiBase') || '';
  }

  // ----------------------
  // Available Countries
  // ----------------------
  async getAvailableCountries(): Promise<{ countryCode: string; name: string }[]> {
    const cacheKey = 'availableCountries';
    const cached = await this.cacheService.get<{ countryCode: string; name: string }[]>(cacheKey);
    if (cached) return cached;

    const countries = await this._fetchAvailableCountries();
    await this.cacheService.set(cacheKey, countries, 86400); // TTL = 1 day
    return countries;
  }

  private async _fetchAvailableCountries(): Promise<{ countryCode: string; name: string }[]> {
    try {
      const { data } = await axios.get(`${this.nagerApiBase}/AvailableCountries`);
      return data;
    } catch (err) {
      console.error('Failed to fetch available countries:', err.message);
      return [];
    }
  }

  // ----------------------
  // Country Info
  // ----------------------
  async getCountryInfo(countryCode: string): Promise<CountryInfoDto> {
    const cacheKey = `country:${countryCode}`;
    const cached = await this.cacheService.get<CountryInfoDto>(cacheKey);
    if (cached) return cached;

    // 1. Borders
    const borderData = await this._fetchCountryBorders(countryCode);
    if (!borderData) throw new NotFoundException(`Country ${countryCode} not found in Nager API`);

    const borders = Array.isArray(borderData.borders)
      ? borderData.borders.map((b: any) => ({
        commonName: b.commonName,
        officialName: b.officialName,
        countryCode: b.countryCode,
        region: b.region,
      }))
      : [];

    // 2. Population
    const countryNames = [borderData.name, borderData.officialName, borderData.commonName, countryCode].filter(Boolean);
    let populationResp = null;
    for (const name of countryNames) {
      populationResp = await this._fetchPopulation(name);
      if (populationResp) break;
    }
    const populationHistory = this._normalizePopulationData(populationResp);

    // 3. Flag
    const flagResp = await this._fetchFlags();
    const flagUrl = this._getFlagUrl(flagResp, countryCode);

    // 4. Update DB if exists
    let country = await this.countryRepo.findOne({ where: { countryCode } });
    if (country) {
      country.borders = borders;
      country.populationHistory = populationHistory;
      country.flagUrl = flagUrl;
      await this.countryRepo.save(country);
    }

    // 5. Cache
    const result: CountryInfoDto = { borders, populationHistory, flagUrl };
    await this.cacheService.set(cacheKey, result, 86400);

    return result;
  }

  // ----------------------
  // Private Helpers
  // ----------------------
  private async _fetchCountryBorders(countryCode: string) {
    try {
      const resp = await axios.get(`${this.nagerApiBase}/CountryInfo/${countryCode}`);
      return resp.data;
    } catch (err) {
      console.error(`Failed to fetch borders for ${countryCode}:`, err.message);
      return null;
    }
  }

  private async _fetchPopulation(countryName: string) {
    try {
      const resp = await axios.post(`${this.countriesApiBase}/population`, { country: countryName });
      if (resp.data?.error) throw new Error(resp.data.msg);
      return resp.data;
    } catch (err) {
      console.warn(`Population API failed for '${countryName}':`, err.message);
      return null;
    }
  }

  private async _fetchFlags() {
    try {
      const resp = await axios.get(`${this.countriesApiBase}/flag/images`);
      return resp.data;
    } catch (err) {
      console.error('Failed to fetch flags:', err.message);
      return null;
    }
  }

  private _normalizePopulationData(data: any): PopulationHistoryDto[] {
    if (!data?.data?.populationCounts || !Array.isArray(data.data.populationCounts)) return [];
    return data.data.populationCounts.map((p: any) => ({ year: p.year, value: p.value }));
  }

  private _getFlagUrl(data: any, countryCode: string): string | undefined {
    const flagData = data?.data?.find((c: any) => c.iso2?.toUpperCase() === countryCode.toUpperCase());
    return flagData?.flag ?? undefined;
  }
}
