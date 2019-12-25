/* eslint-disable @typescript-eslint/no-var-requires */
const remote = require('electron').remote
const electronFs = remote.require('fs')
const path = require('path')

/**
 * Class for managing realms AKA db instances as files. It doesn't provide any implementation.
 * Responsible for READ, COPY and CREATE db instances through electron fs library. Every process should be synced with main thread.
 * @static
 */
class Realm {
  private static Folder = path.dirname('') + '/realms'
  public static Path = process.env.NODE_ENV === 'development' ? 'realms/dev/' : 'realms/'
  public static FileNames = ['Map.realm', 'Map.realm.lock']
  public static Map = 'Map.realm'

  /**
   * Initializing dev folder, if isn't exist. Every object, created in development mode will be stored into dev realm files.
   */
  public static initDevRealm() {
    const files: string[] = []
    electronFs.readdirSync(Realm.Folder + '/dev').forEach((element: string) => {
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

export default Realm
