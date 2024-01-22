import { relations } from 'drizzle-orm'
import {
  boolean,
  float,
  int,
  json,
  mysqlEnum,
  mysqlSchema,
  varchar,
} from 'drizzle-orm/mysql-core'
import { BiggerReactorsControlRodDataBank } from 'reactord-schema/types/reactord'

export const reactordSchema = mysqlSchema('reactord')

export const devices = reactordSchema.table('devices', {
  id: int('id').primaryKey().autoincrement(),
  identifier: varchar('identifier', { length: 12 }),
  connected: boolean('connected').notNull().default(false),
  registered: boolean('registered').notNull().default(false),
})

export const mekanismReactors = reactordSchema.table('mekanism_reactors', {
  deviceId: int('device_id')
    .primaryKey()
    .references(() => devices.id),
  access_token: varchar('access_token', { length: 255 }),
  active: boolean('active').notNull().default(false),
})

export const biggerReactors = reactordSchema.table('bigger_reactors', {
  deviceId: int('device_id')
    .primaryKey()
    .references(() => devices.id),
  access_token: varchar('access_token', { length: 255 }).notNull(),
  active: boolean('active').notNull().default(false),
  apiVersion: varchar('api_version', { length: 255 }),
  ambientTemperature: float('ambient_temperature').notNull().default(0),
  casingTemperature: float('casing_temperature').notNull().default(0),
  connected: boolean('connected').notNull().default(false),
  controlRodCount: int('control_rod_count').notNull().default(0),
  fuelTemperature: float('fuel_temperature').notNull().default(0),
  stackTemperature: float('stack_temperature').notNull().default(0),
  type: mysqlEnum('type', ['active', 'passive', 'none'])
    .notNull()
    .default('none'),
  controlRodData:
    json('control_rod_data').$type<BiggerReactorsControlRodDataBank>(),
  // battery props
  capacity: float('capacity').default(0).notNull(),
  producedLastTick: float('produced_last_tick').notNull().default(0),
  stored: float('stored').notNull().default(0),
  // coolant props
  coolantCapacity: float('coolant_capacity').notNull().default(0),
  coldFluidAmount: float('cold_fluid_amount').notNull().default(0),
  hotFluidAmount: float('hot_fluid_amount').notNull().default(0),
  maxTransitionedLastTick: float('max_transitioned_last_tick')
    .notNull()
    .default(0),
  transitionedLastTick: float('transitioned_last_tick').notNull().default(0),
  // fuel props
  burnedLastTick: float('burned_last_tick').notNull().default(0),
  fuelCapacity: float('fuel_capacity').notNull().default(0),
  fuel: float('fuel').notNull().default(0),
  fuelReactivity: float('fuel_reactivity').notNull().default(0),
  totalReactant: float('total_reactant').notNull().default(0),
  wasteCapacity: float('waste_capacity').notNull().default(0),
})

export const mekanismReactorDeviceRelation = relations(
  mekanismReactors,
  ({ one }) => ({
    device: one(devices, {
      fields: [mekanismReactors.deviceId],
      references: [devices.id],
    }),
  }),
)

export const biggerReactorDeviceRelation = relations(
  biggerReactors,
  ({ one }) => ({
    device: one(devices, {
      fields: [biggerReactors.deviceId],
      references: [devices.id],
    }),
  }),
)
