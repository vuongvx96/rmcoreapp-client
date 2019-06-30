import React, { Suspense } from 'react'
import { observer, inject } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import uuid from 'uuid/v4'
import { map } from 'lodash'

import { LoadingOnSite, WrapLazy } from '../../components/util'
import { listRoutesAuthen, routesNotAuthen } from '../../config'
import NewLayout from './layout'
import 'ag-grid-enterprise'
import 'ag-grid-enterprise/chartsModule'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import './index.less'

@inject('authStore', 'accountStore')
@observer
class Dashboard extends React.Component {
  componentDidMount() {
    document.title = 'Lịch phòng máy - ' + this.props.route.displayName
  }
  render() {
    const { isLogin, onLogout } = this.props.authStore
    return (
      <Router>
        <NewLayout onLogout={onLogout}>
          <Suspense fallback={<LoadingOnSite />}>
            <Switch>
              {map(listRoutesAuthen, route => (
                <Route
                  key={uuid()}
                  exact={route.exact}
                  path={route.path}
                  render={() => {
                    const Comp = WrapLazy(import(`../../components/${route.component}`), 350)
                    return isLogin ? <Comp route={route} permission={this.props.accountStore} /> : <Redirect to={routesNotAuthen[0].path} />
                  }}
                />
              ))}
            </Switch>
          </Suspense>
        </NewLayout>
      </Router>
    )
  }
}

export default Dashboard
