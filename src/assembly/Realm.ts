/* eslint-disable @typescript-eslint/no-var-requires */
const remote = require('electron').remote
const electronFs = remote.require('fs')
import path from 'path'

class Realm {
  private static Folder = path.dirname('') + '/realms'
  public static Path = process.env.NODE_ENV === 'development' ? 'realms/dev/' : 'realms/'
  public static Map = 'Map.realm'
  public static FileNames = ['Map.realm', 'Map.realm.lock']

  public static initDevRealm() {
    const files: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electronFs.readdirSync(Realm.Folder + '/dev').forEach((element: any) => {
      files.push(element)
    })

    const isValid = Realm.FileNames.reduce((accumulator: boolean, file: string) => {
      if (accumulator) {
        if (files.includes(file)) {
          accumulator = true
        } else {
          accumulator = false
        }
      }
      return accumulator
    }, true)

    if (!isValid) {
      Realm.FileNames.forEach((filename: string) => {
        const data = electronFs.readFileSync(Realm.Folder + '/' + filename)
        if (data) {
          electronFs.writeFileSync(Realm.Folder + '/dev/' + filename, data)
        }
      })
    }
  }
}

Realm.initDevRealm()

export default Realm
