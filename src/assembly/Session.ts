import { Guid } from 'guid-typescript'
import Realm from 'realm'

class Session {
  public static SESSION_ID: string = Guid.create().toJSON().value
  public static START_SESSION_DATE: Date = new Date()

  // public static setSessionId() {}
}

export default Session
