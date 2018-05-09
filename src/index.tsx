import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import './index.less'
import registerServiceWorker from './registerServiceWorker'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from '@reducers'

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
