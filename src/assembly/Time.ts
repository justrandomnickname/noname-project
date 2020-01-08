import ERROR from './Error'
/**
 * Basic instance, which implementing unified time. Main goal is provide solid structure across session.
 * Class uses the events system, which are processed every [[Tick]]. Do not forget to unregister unneccessary events through [[Time.UnregisterEvent]]
 * Controller: [[TimeController]]
 * @protected
 */
export class Time implements Time.ITime {
  protected static Month = 0
  protected static Day = 0
  protected static Hour = 0
  protected static TimeSpeed: Time.Tick = 0
  private static Events: Time.EventType = {}
  private static Interval: number | null = 0
  constructor() {
    Time.TimeSpeed = Time.TimeSpeed === 0 ? Time.Tick.Default : Time.TimeSpeed
  }
  get CurrentTime(): { Month: Time.Months; Day: number; Hour: number } {
    return {
      Month: Time.Month,
      Day: Time.Day,
      Hour: Time.Hour,
    }
  }
  set CurrentTime(time: { Month: Time.Months; Day: number; Hour: number }) {
    Time.Hour = time.Hour
    Time.Day = time.Day
    time.Month = time.Month
  }
  public RunTime(): void {
    if (!Time.Interval) {
      const tick = Time.Tick.Multiplier * Time.TimeSpeed //5 seconds
      Time.Interval = window.setInterval(() => {
        this.ChangeTimeOnTick()
      }, tick)
    } else console.warn(new ERROR('assembly/Time.ts', 'Time is already running').EVENT())
  }

  public StopTime(): void {
    if (Time.Interval) clearInterval(Time.Interval)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public RegisterEvent(payload: { name: string; event: (payload: any) => void }): void {
    const event = Time.Events[payload.name]
    if (event) event.isActive = true
    else Time.Events = Object.assign({}, Time.Events, { [payload.name]: { callback: payload.event, isActive: true } })
    // if (event) throw Error(new ERROR(`${payload.name}`, 'Name is already registered.').OBJECT())
  }

  public static UnregisterEvent(name: string) {
    if (Time.Events[name]) Time.Events[name].isActive = false
  }

  private ChangeTimeOnTick(): void {
    if (Time.Hour < Time.TimeNumerals.HoursInDay) Time.Hour++
    if (Time.Hour >= Time.TimeNumerals.HoursInDay) {
      Time.Hour = 0
      Time.Day++
    }
    this.RunEvents()
  }

  private RunEvents(): void {
    Object.values(Time.Events).forEach(event => (event.isActive ? event.callback(this.CurrentTime) : null))
  }
}

export namespace Time {
  export interface ITime {
    CurrentTime: { Day: number; Hour: number; Month: Time.Months }
    StopTime: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RegisterEvent: (payload: { name: string; event: (payload: any) => void }) => void
    RunTime: () => void
  }
  export enum Tick {
    'Multiplier' = 1000,
    'Default' = 5,
  }
  export enum TimeNumerals {
    'HoursInDay' = 24,
    'DaysInJanuray' = 30,
    'DaysInFebruary' = 30,
    'DaysInMarch' = 30,
    'DaysInApril' = 30,
    'DaysInMay' = 30,
    'DaysInJune' = 30,
    'DaysInJuly' = 30,
    'DaysInAugust' = 30,
    'DaysInSeptember' = 30,
    'DaysInOctober' = 30,
    'DaysInNovember' = 30,
    'DaysInDecember' = 30,
  }
  export enum Months {
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
  export type EventType = {
    [name: string]: {
      callback: (payload?: { Month: Time.Months; Day: number; Hour: number }) => void
      isActive: boolean
    }
  }
}
