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
  private static _saves: SessionController.ISaveFile[] = []
  private static _setState: React.Dispatch<React.SetStateAction<SessionController.ISaveFile[]>> | null
  constructor(setState?: React.Dispatch<React.SetStateAction<SessionController.ISaveFile[]>>) {
    this.remote = require('electron').remote
    this.app = this.remote.app
    this._dirname = this.app.getAppPath()
    if (setState) {
      SessionController._setState = setState
    }
  }

  private async FixSaveIds() {
    const savefiles = await this.GetSaveFiles()
    for (let i = 0; i < savefiles.length; i++) {
      let _flag = false
      for (let j = 0; j < savefiles.length; j++) {
        if (!_flag && savefiles[i] === savefiles[j]) {
          _flag = true
          continue
        } else if (_flag && savefiles[i] === savefiles[j]) {
          console.log('NON UNIQUE FOUND', savefiles[i], savefiles[j])
        }
      }
    }
  }

  public async LoadSaveFolder() {
    await this.FixSaveIds()
    const saves = await this.GetSaveFiles()
    SessionController._saves = saves
    this.Mount()
  }
  public async Save(name: string): Promise<void> {
    const path = this._dirname + `/saves/${name}/savefile.realm`
    const session = new Session()
    await Realm.open({ ...getConfiguration(), path, schema: [Session.Schema] })
      .then(realm => {
        realm.write(() => {
          realm.create(Session.Schema.name, { name, session_id: session.id, date: new Date() })
        })
        return realm
      })
      .then(realm => realm.close())
    session.SaveData(path)
    SessionController._saves = await this.GetSaveFiles()
    this.Mount()
  }
  public async Load(sessionId: string) {
    const session = new Session()
    const path = this._dirname + `/saves/`
    const savefiles = await this.GetSaveFiles()

    const savefile = savefiles.find(savefile => savefile.session_id === sessionId)
    if (savefile) {
      const pathToFile = path + savefile.name + '/' + 'savefile.realm'
      session.LoadData(sessionId, pathToFile)
      this.Mount()
    } else {
      throw Error('Savefile corrupted')
    }
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
      try {
        const pathToFile = path + filename + '/' + 'savefile.realm'
        const realm = new Realm({
          ...getConfiguration(),
          path: pathToFile,
          schema: [Session.Schema],
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessionObject: any = realm.objects(Session.Schema.name)
        const session: SessionController.ISaveFile = {
          name: sessionObject[0].name,
          session_id: sessionObject[0].session_id,
          date: sessionObject[0].date,
        }
        realm.close()
        saves.push(session)
      } catch (e) {
        console.error(e)
        require('rimraf').sync(path + '/' + filename)
      }
    })
    return saves.sort(
      (a: SessionController.ISaveFile, b: SessionController.ISaveFile) => b.date.getTime() - a.date.getTime(),
    )
  }
  public async Delete(sessionId: string) {
    const path = this._dirname + `/saves/`
    const saves = await this.GetSaveFiles()
    const save = saves.find(save => save.session_id === sessionId)
    if (save) {
      try {
        SessionController._saves = SessionController._saves.filter(save => save.session_id !== sessionId)
        const pathToFolder = path + save.name
        require('rimraf').sync(pathToFolder)
        this.Mount()
      } catch (e) {
        console.error(e)
      }
    }
  }
  public Mount(): void {
    if (SessionController._setState) SessionController._setState([...this.saves])
  }
  public Unmount(): void {
    SessionController._setState = null
  }
  get saves(): SessionController.ISaveFile[] {
    return SessionController._saves
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
    session_id: string
    date: Date
  }
}
