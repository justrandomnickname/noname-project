import React, { Suspense } from 'react'
import { mount } from 'enzyme'
import { Route, Switch } from 'react-router-dom'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router'
import 'jest-styled-components'
// import { MainMenu } from '../routes/MainMenu'
// import MainMenu from '../../modules/UI/views/MainMenu'
import AppRouter from '../router'

// Enzyme.configure({ adapter: new Adapter() })

// const test: React.FC = () => <div>Hello!</div>

// describe('(Router)(LAZY) expects to be rendered', () => {
//   it('rendered lazily', async () => {
//     const wrapper = await mount(
//       <MemoryRouter initialEntries={['/', '/map']}>
//         <AppRouter />
//       </MemoryRouter>,
//     )

//     await MainMenu
//     expect(wrapper.children().length).toBe(1)
//     expect(wrapper.find(test)).toHaveLength(0)
//     expect(wrapper.find(Route)).toHaveLength(1)
//   })

//   it('mock expects to be rendered', async () => {
//     const wrapper = await mount(
//       <MemoryRouter initialEntries={['/']}>
//         <Suspense fallback={<FallbackMock />}>
//           <Switch>
//             <Route exact path="/" component={MainMenu} />
//           </Switch>
//         </Suspense>
//       </MemoryRouter>,
//     )

//     await MainMenu
//     expect(wrapper.find(MainMenu)).toHaveLength(1)
//     expect(wrapper.find(test)).toHaveLength(0)
//   })
// })
