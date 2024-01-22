import { BiggerReactorsControlRodData } from './reactord'
import * as schema from '../db/schema'

export type BiggerReactorsControlRodData = {
  level: number
  name: string
  valid: boolean
}

export type BiggerReactorsControlRodDataBank = BiggerReactorsControlRodData[]

export type BiggerReactorsReactorData = Omit<
  Omit<InferSelectModel<typeof schema.biggerReactors>, 'deviceId'>,
  'access_token'
>

export type BiggerReactorsReactorMessage = {
  sentByDaemon: boolean
  data: BiggerReactorsReactorData
}

export type Req = {
  id?: number | string | null
  token?: string | null
  type?: 'BiggerReactors_Reactor' | 'mekanism-reactor'
}
