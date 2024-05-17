import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_DATABASE_HOST,
  port: parseInt(process.env.MYSQL_DATABASE_PORT, 10),
  username: process.env.MYSQL_DATABASE_USERNAME,
  password: process.env.MYSQL_DATABASE_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
