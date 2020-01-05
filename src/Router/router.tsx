import React from 'react'
// import { Suspense, useEffect, useState } from 'react'
// import useInterval from '@use-it/interval'
import { Route, Switch } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'
// import { MainMenuLazy } from './routes/MainMenu'
// import { MainMapLazy } from './routes/MainMap'
// import Loader from '@UI/components/Loader'

import MainMenu from '@UI/views/MainMenu'
import MainMap from '@Map/views/MainMap'
import Hideout from '@Modules/Hideout/views/Hideout'

// export const FallbackMock: React.FC = () => {
//   const [message, setMessage] = useState(0)
//   useInterval(() => {
//     setMessage(message + 1)
//   }, 10)
//   return <div>{message}</div>
// }

const AppRouter: React.FC = () => (
  <MemoryRouter>
    {/* <Suspense fallback={<FallbackMock />}> */}
    <Switch>
      <Route exact path="/map">
        <MainMenu />
      </Route>

      <Route path="/map" component={MainMap} />
      <Route path="/" component={Hideout} />
      {/* <MainMap />
      </Route> */}
    </Switch>
    {/* </Suspense> */}
  </MemoryRouter>
)

export default AppRouter
