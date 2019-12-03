import { lazy } from 'react'

// export const MainMapLazy = lazy(() => {
//   return Promise.all([import('@Map/views/MainMap'), new Promise(resolve => setTimeout(resolve, 2000))]).then(
//     async ([moduleExports]) => {
//       return moduleExports
//     },
//   )
// })

export const MainMapLazy = lazy(() => import('@Map/views/MainMap'))
