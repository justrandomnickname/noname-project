import { Guid } from 'guid-typescript'

/**
 * not implemented yet...
 */
class Session {
  public static SESSION_ID: string = Guid.create().toJSON().value
  public static START_SESSION_DATE: Date = new Date()

  // public static setSessionId() {}
}

export default Session
