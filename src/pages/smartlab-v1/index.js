import React, { Component, PureComponent, Suspense } from 'react'
import { map } from 'lodash'
import uuid from 'uuid/v4'
import { Provider, observer, inject } from 'mobx-react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { Loading, WrapLazy, LoadableComponent } from '../../components/util'
import { routesNotAuthen, routesAuthen } from '../../config'
import { stores } from '../../tools'
import 'react-toastify/dist/ReactToastify.css'
import './index.less'

@inject('authStore')
@observer
class SmartLabV1 extends Component {
  render() {
    const { isLogin } = this.props.authStore
    return (
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <>
            <Switch>
              {map(routesNotAuthen, route => (
                <Route
                  key={uuid()}
                  exact={route.exact}
                  path={route.path}
                  render={() => {
                    const Comp = WrapLazy(import(`../../components/${route.component}`), 800)
                    return !isLogin ? <Comp route={route} /> : <Redirect to={routesAuthen[0].path} />
                  }}
                />
              ))}
              {map(routesAuthen, route => (
                <Route
                  key={uuid()}
                  exact={route.exact}
                  path={route.path}
                  render={() => {
                    const Comp = LoadableComponent(import(`../../components/${route.component}`))
                    return isLogin ? <Comp route={route} /> : <Redirect to={routesNotAuthen[0].path} />
                  }}
                />
              ))}
            </Switch>
            <ToastContainer
              position='bottom-left'
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
          </>
        </Suspense>
      </BrowserRouter>
    )
  }
}

class MobXInstant extends PureComponent {
  render() {
    return (
      <Provider {...stores}>
        <SmartLabV1 />
      </Provider>
    )
  }
}

export default MobXInstant
