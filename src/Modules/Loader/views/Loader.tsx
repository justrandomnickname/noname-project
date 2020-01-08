import React, { useEffect, useRef, useState } from 'react'
import useInterval from '@use-it/interval'
import UI from '@Core/UI'
import { FadeWrapper } from '@Loader/components/FadeWrapper'
import { CanvasLoader } from '@Loader/components/CanvasLoader'
import { Wrapper } from '@Loader/components/Wrapper'

const Loader: React.FC<{ text: string }> = (props: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dotCount, setDots] = useState('')
  const width = 220
  const height = 220

  useInterval(() => {
    if (dotCount.length < 3) {
      setDots(dotCount + '.')
    }
    if (dotCount.length >= 3) {
      setDots('')
    }
  }, 500)

  useEffect(() => {
    let requestId = 0
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d') as CanvasRenderingContext2D
      const LoaderParams = {
        angle1: 0,
        angle2: 0,
        angle3: 0,
      }
      const draw = () => {
        const r1 = 100
        const r2 = r1 / 2
        const r3 = r2 / 2 - 0.5
        const r4 = r3 / 2
        context.clearRect(0, 0, width, height)
        context.beginPath()
        context.arc(width / 2, height / 2, r1, 0, 2 * Math.PI)
        context.fillStyle = '#F4EADE'
        context.fill()
        context.closePath()
        context.beginPath()
        const x2 = width / 2 + r2 * Math.cos((LoaderParams.angle1 * Math.PI) / 180)
        const y2 = height / 2 + r2 * Math.sin((LoaderParams.angle1 * Math.PI) / 180)
        const x3 = x2 + r3 * Math.cos((LoaderParams.angle2 * Math.PI) / 180)
        const y3 = y2 + r3 * Math.sin((LoaderParams.angle2 * Math.PI) / 180)
        const x4 = x3 + r4 * Math.cos((LoaderParams.angle3 * Math.PI) / 180)
        const y4 = y3 + r4 * Math.sin((LoaderParams.angle3 * Math.PI) / 180)
        context.arc(x2, y2, r2, 0, 2 * Math.PI)
        context.fillStyle = '#292826'
        context.fill()
        context.closePath()
        context.beginPath()
        context.fillStyle = '#F4EADE'
        context.arc(x3, y3, r3, 0, 2 * Math.PI)
        context.fill()
        context.closePath()
        context.beginPath()
        context.fillStyle = '#292826'
        context.arc(x4, y4, r4, 0, 2 * Math.PI)
        context.fill()
        context.closePath()

        LoaderParams.angle1 += 3.5
        LoaderParams.angle2 += 6.5
        LoaderParams.angle3 += 9
      }

      requestId = window.setInterval(draw, 20)
    }
    return () => {
      clearInterval(requestId)
    }
  }, [])
  return (
    <Wrapper>
      <CanvasLoader ref={canvasRef} id="loader" width={width} height={height} />
      <FadeWrapper>
        <UI.Title>
          {props.text}
          {dotCount}
        </UI.Title>
      </FadeWrapper>
    </Wrapper>
  )
}

export default Loader
