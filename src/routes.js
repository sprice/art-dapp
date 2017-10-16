import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Homepage from './Homepage'
import About from './About'
import Highlights from './Highlights'
import Page from './Page'
import NotFound from './NotFound'

const Routes = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route exact path="/about" component={About}/>
        <Route exact path="/highlights" component={Highlights}/>
        <Route path="/a/:id/:editionId" component={Page}/>
        <Route path="/a/:id" component={Page}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </Router>
)

export default Routes
