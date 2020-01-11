import { Guid } from 'guid-typescript'
import Realm from 'realm'
import { LivestockController } from '@Controllers/LivestockController'
import { PawnsController } from '@Controllers/PawnsController'

/**
 * not implemented yet...
 */
export class Session implements Session.ISession {
  public static START_SESSION_DATE: Date = new Date()
  public id: string
  constructor() {
    this.id = Guid.create().toJSON().value
  }
  public async SaveData() {
    const sessionId = this.id
    new LivestockController().Save(sessionId)
    new PawnsController().Save(sessionId)
  }

  public LoadData(sessionId: string) {
    new PawnsController().Load(sessionId)
    new LivestockController().Load(sessionId)
  }

  // public static setSessionId() {}
}

export namespace Session {
  export interface ISession {
    id: string
    SaveData(): void
  }

  export const Schema: Realm.ObjectSchema = {
    name: 'Session',
    properties: {
      name: 'string',
      id: 'string',
    },
  }
}
