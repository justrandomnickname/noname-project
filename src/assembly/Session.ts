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
  public async SaveData(path: string): Promise<void> {
    const sessionId = this.id
    new LivestockController().Save(sessionId, path)
    new PawnsController().Save(sessionId, path)
  }

  public LoadData(sessionId: string, path: string): void {
    new LivestockController().Load(sessionId, path)
    new PawnsController().Load(sessionId, path)
  }
}

export namespace Session {
  export interface ISession {
    id: string
    SaveData(path: string): void
    LoadData(sessionId: string, path: string): void
  }

  export const Schema: Realm.ObjectSchema = {
    name: 'Session',
    properties: {
      name: 'string',
      session_id: 'string',
      date: 'date',
    },
  }
}
