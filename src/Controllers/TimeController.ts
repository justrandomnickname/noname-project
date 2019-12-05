import React from 'react'
import { Time } from '../assembly/Time'

interface ITimeController<T> {
  TimeHandler: T
}

/**
 * Controller for [[Time]]
 */
class TimeController implements ITimeController<Time> {
  public TimeHandler = new Time()

  public RunTime() {
    this.TimeHandler.RunTime()
  }

  public StopTime() {
    this.TimeHandler.StopTime()
  }

  public SetTime(time: { Month: Time.Months; Day: number; Hour: number }) {
    this.TimeHandler.CurrentTime = time
  }

  public GetTime(): { Month: Time.Months; Day: number; Hour: number } {
    return this.TimeHandler.CurrentTime
  }

  /**
   * Subscrubes on time change. Will provide a new time value every tick in callback if time is currently running.
   * @param name
   * @param callback
   */
  public SubscribeOnTimeChange(
    name: string,
    callback: React.Dispatch<
      React.SetStateAction<{
        Month: Time.Months
        Hour: number
        Day: number
      }>
    >,
  ) {
    this.TimeHandler.RegisterEvent({ name, event: callback })
  }
}

export default TimeController
