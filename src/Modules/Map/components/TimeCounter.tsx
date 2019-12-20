import React, { useLayoutEffect, useState } from 'react'
import UI from '@Core/UI'
import TimeController from '@Controllers/TimeController'
import { Time } from 'assembly/Time'

const TimeCounter: React.FC<{}> = () => {
  const timeController = new TimeController()
  const [time, setTime] = useState<{ Month: Time.Months; Hour: number; Day: number }>(timeController.GetTime())
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
        Month {time.Month} - Day {time.Day} - Hour {time.Hour}
      </UI.RegularText>
    </UI.Title>
  )
}

export default TimeCounter
