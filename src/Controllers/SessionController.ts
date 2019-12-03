import { Guid } from 'guid-typescript'

class SessionController {
  private static Holder: SessionController
  public SessionId: Guid = Guid.create().toJSON().value
  constructor() {
    if (!SessionController.Holder) {
      SessionController.Holder = new SessionController()
    }
    return SessionController.Holder
  }
  public GetSessionId(): Guid {
    return SessionController.Holder.SessionId
  }
  public HookInstanceToCurrentSession(schema: string) {
    const { SessionId } = SessionController.Holder
  }
}

export default SessionController
