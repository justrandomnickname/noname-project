import React from 'react'
import Time, { MonthEnum } from '../assembly/Time'

interface ITimeController<T> {
  time: T
}

class TimeController implements ITimeController<Time> {
  public time = new Time()

  public RunTime() {
    this.time.RunTime()
  }

  public StopTime() {
    this.time.StopTime()
  }

  public SetTime() {
    return this.time.SetTime
  }

  public GetTime() {
    return this.time.GetTime()
  }

  public SubscribeOnTimeChange(
    name: string,
    callback: React.Dispatch<
      React.SetStateAction<{
        month: MonthEnum
        hour: number
        day: number
      }>
    >,
  ) {
    this.time.RegisterEvent({ name, event: callback })
  }
}

export default TimeController
