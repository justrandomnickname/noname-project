import Realm from 'realm'
import { Session } from '../assembly/Session'
import { getConfiguration } from '../../realms/configs'
import { IController } from './interfaces/IController'

export class SessionController implements IController {
  public async Save(name: string): Promise<void> {
    const app = require('electron').remote.app
    const dirname = app.getAppPath()
    const path = dirname + `/saves/${name}/${name}`
    const session = new Session()
    await Realm.open({ ...getConfiguration(), path, schema: [Session.Schema] })
      .then(realm => {
        realm.write(() => {
          realm.create(Session.Schema.name, { name, id: session.id })
        })
        return realm
      })
      .then(realm => realm.close())
    session.SaveData()
  }
  public Load(sessionId: string) {
    const session = new Session()
    session.LoadData(sessionId)
  }
  public async GetSaveFiles(): Promise<SessionController.ISaveFile[]> {
    const saves: SessionController.ISaveFile[] = []
    await Realm.open({ ...getConfiguration(), schema: [Session.Schema] })
      .then(realm => {
        const sessionRealmObjects = realm.objects(Session.Schema.name)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sessionRealmObjects.forEach((obj: any) => {
          saves.push({ name: obj.name, id: obj.id })
        })
        return realm
      })
      .then(realm => realm.close())
    return saves
  }
  public Mount(): void {
    return
  }
  public Unmount(): void {
    return
  }
}

export namespace SessionController {
  export interface ISaveFile {
    name: string
    id: string
  }
}
