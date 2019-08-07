import React from 'react'
import ReactDOM from 'react-dom'
import initReactFastclick from 'react-fastclick'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import App from './App'
import './index.less'
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
