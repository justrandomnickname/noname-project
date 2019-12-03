import React, { useLayoutEffect, useState } from 'react'
import UI from '@Core/UI'
import TimeController from '@Controllers/TimeController'
import { MonthEnum } from 'assembly/Time'

const TimeCounter: React.FC<{}> = () => {
  const timeController = new TimeController()
  const [time, setTime] = useState<{ month: MonthEnum; hour: number; day: number }>(timeController.GetTime())
  useLayoutEffect(() => {
    timeController.SubscribeOnTimeChange('MainMapTime', setTime)
    timeController.RunTime()
    return () => {
      timeController.StopTime()
    }
  }, [])

  return (
    <UI.Title>
      TIME:
      <UI.RegularText>
        Month {time.month} - Day {time.day} - Hour {time.hour}
      </UI.RegularText>
    </UI.Title>
  )
}

export default TimeCounter
