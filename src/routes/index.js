import Loadable from 'react-loadable'
import MainView from 'views/MainView'
import SyncView from '../components/Sync/Sync'

const AsyncView = Loadable({
  loader: () => import('../components/Async/Async'),
  // if you have your own loading component,
  // you should consider add it here
  loading: () => null
})

export default [
  {
    path: '/',
    component: MainView,
    childRoutes: [
      {
        path: '/sync',
        component: SyncView
      },
      {
        path: '/async',
        component: AsyncView
      }
    ]
  }
]
