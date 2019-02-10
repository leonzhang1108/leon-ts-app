import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import App from './App'
import './index.less'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import initReactFastclick from 'react-fastclick'
import store from './store'
initReactFastclick()

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
