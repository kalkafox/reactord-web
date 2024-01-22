import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '@/db/schema'
import config from '@/db/config'

const pool = mysql.createPool(config)

export const db = drizzle(pool, { mode: 'default', schema })
