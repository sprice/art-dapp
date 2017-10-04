import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Homepage from './Homepage'
import Page from './Page'
import NotFound from './NotFound'

const Routes = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route path="/a/:id" component={Page}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </Router>
)

export default Routes
