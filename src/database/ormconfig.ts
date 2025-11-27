import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: ['./src/**/*.entity.{ts,js}'],
  migrations: ['./src/database/migrations/*.{ts,js}'],
  logging: true,
  synchronize: false,
});
