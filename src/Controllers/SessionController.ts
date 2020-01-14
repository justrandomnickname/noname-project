import Realm from 'realm'
import { Session } from '../assembly/Session'
import { getConfiguration } from '../../realms/configs'
import { IController } from './interfaces/IController'

export class SessionController implements SessionController.ISessionController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private app: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _dirname: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private remote: any
  constructor() {
    this.remote = require('electron').remote
    this.app = this.remote.app
    this._dirname = this.app.getAppPath()
  }
  public async Save(name: string): Promise<void> {
    const path = this._dirname + `/saves/${name}/${name}`
    const session = new Session()
    await Realm.open({ ...getConfiguration(), path, schema: [Session.Schema] })
      .then(realm => {
        realm.write(() => {
          realm.create(Session.Schema.name, { name, id: session.id })
        })
        return realm
      })
      .then(realm => realm.close())
    await Realm.open({ ...getConfiguration(), schema: [Session.Schema] })
      .then(realm => {
        realm.write(() => {
          realm.create(Session.Schema.name, { name, id: session.id })
        })
        return realm
      })
      .then(realm => realm.close())
    session.SaveData(path)
  }
  public async Load(sessionId: string) {
    const session = new Session()
    const fs = this.remote.require('fs')
    const path = this._dirname + `/saves/`
    const filenames = []

    fs.readdirSync(path).forEach((element: string) => {
      filenames.push(element)
    })

    await Realm.open({ ...getConfiguration(), schema: [Session.Schema] })
      .then((realm: Realm) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const savefile: any = realm.objects(Session.Schema.name).filtered('id = $0', sessionId)
        if (savefile.length !== 0 || savefile.length >= 2) {
          const name = savefile[0].name
          const pathToFile = path + name + '/' + name
          session.LoadData(sessionId, pathToFile)
        } else {
          //SHOULD GET NEW ID
          throw Error('savefile id duplicated')
        }
        return realm
      })
      .then(realm => realm.close())
  }
  public async GetSaveFiles(): Promise<SessionController.ISaveFile[]> {
    const saves: SessionController.ISaveFile[] = []
    const fs = this.remote.require('fs')
    const path = this._dirname + `/saves/`
    const filenames: string[] = []
    fs.readdirSync(path).forEach((element: string) => {
      filenames.push(element)
    })
    filenames.forEach(filename => {
      const pathToFile = path + filename + '/' + filename
      const realm = new Realm({
        ...getConfiguration(),
        path: pathToFile,
        schema: [Session.Schema],
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionObject: any = realm.objects(Session.Schema.name)
      const session: SessionController.ISaveFile = {
        name: sessionObject[0].name,
        id: sessionObject[0].id,
      }
      realm.close()
      saves.push(session)
    })
    return saves
  }
  public async Delete(sessionId: string) {
    const path = this._dirname + `/saves/`
    const saves = await this.GetSaveFiles()
    const save = saves.filter(file => file.id === sessionId)
    const pathToFolder = path + save[0].name
    require('rimraf').sync(pathToFolder)
  }
  public Mount(): void {
    return
  }
  public Unmount(): void {
    return
  }
}

export namespace SessionController {
  export interface ISessionController extends IController {
    Save(name: string): Promise<void>
    Delete(sessionId: string): Promise<void>
    Load(sessionId: string): Promise<void>
    GetSaveFiles(): Promise<ISaveFile[]>
  }
  export interface ISaveFile {
    name: string
    id: string
  }
}
