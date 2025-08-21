## Environment Variables

Im set default .env in this repo, but if u need your special variables look at table:

| Variable              | Description                                                                                  | Example Value                          |
|-----------------------|----------------------------------------------------------------------------------------------|----------------------------------------|
| `NAGER_API_BASE`      | Base URL for the Nager public holidays API.                                                  | `https://date.nager.at/api/v3`         |
| `COUNTRIES_API_BASE`  | Base URL for the countries information API.                                                  | `https://countriesnow.space/api/v0.1/countries` |
| `API_PORT`            | Port on which the application API server will run.                                           | `3001`                                 |
| `POSTGRES_PORT`       | Port used by the PostgreSQL database container.                                              | `5432`                                 |
| `POSTGRES_HOST`       | Hostname for the PostgreSQL database (usually the service name in Docker Compose).           | `database`                             |
| `POSTGRES_USER`       | Username for the PostgreSQL database.                                                        | `postgres`                             |
| `POSTGRES_PASSWORD`   | Password for the PostgreSQL database.                                                        | `password`                             |
| `POSTGRES_DB`         | Name of the PostgreSQL database to use.                                                      | `dev_db`                               |
| `REDIS_PORT`          | Port used by the Redis container.                                                            | `6379`                                 |
| `REDIS_URL`           | Connection URL for the Redis instance.                                                       | `redis://redis:6379`                   |



## Running the Application

To run application and view logs, run:
```sh
docker compose up --build
```

To run the app in detached mode (without logs in the terminal):
```
docker compose up --build -d
```

## API Documentation

The API is documented using Swagger and is available at [`/api/docs`](http://localhost:3001/api/docs) when the application is running. You can use this interface to explore and test all available endpoints interactively.
