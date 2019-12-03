import ERROR from './Error'

export enum MonthEnum {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

type EventType = { [name: string]: (payload?: { month: MonthEnum; day: number; hour: number }) => void }

class Time {
  protected static Month = 0
  protected static Day = 0
  protected static Hour = 0
  public static Events: EventType = {}
  private static Interval: number | null = 0

  private ChangeTimeOnTick() {
    if (Time.Hour < 24) Time.Hour++
    if (Time.Hour >= 24) {
      Time.Hour = 0
      Time.Day++
    }
    this.RunEvents()
  }

  private RunEvents(): void {
    const { Month, Day, Hour } = Time
    Object.values(Time.Events).forEach(event => event({ month: Month, day: Day, hour: Hour }))
  }

  public GetTime(): { day: number; hour: number; month: MonthEnum } {
    return {
      day: Time.Day,
      month: Time.Month,
      hour: Time.Hour,
    }
  }
  public SetTime(payload: { day: number; hour: number; month: MonthEnum }) {
    Time.Month = payload.month
    Time.Day = payload.day
    Time.Hour = payload.hour
  }

  public RunTime() {
    if (!Time.Interval) {
      const tick = 1000 * 5 //5 seconds
      Time.Interval = setInterval(() => {
        this.ChangeTimeOnTick()
      }, tick)
    } else console.warn(ERROR.EVENT('assembly/Time.ts', 'Time is already running'))
  }

  public StopTime() {
    if (Time.Interval) clearInterval(Time.Interval)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public RegisterEvent(payload: { name: string; event: (payload: any) => void }): void {
    const event = Time.Events[payload.name]
    if (event) throw Error(ERROR.OBJECT(`${payload.name}`, 'Name is already registered.'))
    Time.Events = Object.assign({}, Time.Events, { [payload.name]: payload.event })
  }

  // public static UnregisterEvent() {}
}

export default Time
