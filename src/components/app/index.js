import React, { Suspense } from 'react'
import { observer, inject } from 'mobx-react'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import uuid from 'uuid/v4'
import { map } from 'lodash'

import { LoadingOnSite, WrapLazy } from '../util'
import { listRoutesAuthen, routesNotAuthen } from '../../config'
import NewLayout from './layout'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import './index.less'

@inject('authStore')
@observer
class App extends React.Component {
  render() {
    const { isLogin, onLogout } = this.props.authStore
    return (
      <Router>
      <NewLayout onLogout={onLogout}>
        <Suspense fallback={<LoadingOnSite />}>
          {map(listRoutesAuthen, route => (
              <Route
                key={uuid()}
                exact={route.exact}
                path={route.path}
                render={() => {
                  const Comp = WrapLazy(import(`../${route.component}`), 350)
                  return isLogin ? <Comp route={route} /> : <Redirect to={routesNotAuthen[0].path} />
                }}
              />
            ))}
        </Suspense>
      </NewLayout>
      </Router>
    )
  }
}

export default App
