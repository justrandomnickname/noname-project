import React from 'react'
import './inversify.config'
import GameScreen from '@Game/GameScreen'
import AppRouter from './Router/router'
import { ThemeProvider } from 'styled-components'
import * as style from 'Modules/UI/scss/variables.scss'
import { Waiter } from 'react-wait'

const App: React.FC = () => {
  return (
    <ThemeProvider theme={style}>
      <GameScreen>
        <Waiter>
          <AppRouter />
        </Waiter>
      </GameScreen>
    </ThemeProvider>
  )
}

export default App
