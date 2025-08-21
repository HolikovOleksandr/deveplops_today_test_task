export default () => ({
  apiPort: process.env.API_PORT || 3001,
  nagerApiBase: process.env.NAGER_API_BASE,
  countriesApiBase: process.env.COUNTRIES_API_BASE,
  db: {
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST || 'database',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'dev_db',
  },
  redis: {
    port: process.env.REDIS_PORT || 6379,
    url: process.env.REDIS_URL || 'redis://redis:6379',
  }
});
