import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import whenDOMReady from 'when-dom-ready'
import App from './App'
import { createStore } from './store'
import registerServiceWorker from './utils/registerServiceWorker'
import './index.css'

void Promise.all([
  whenDOMReady(),
  createStore(),
]).then(([_, store]) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  )
  registerServiceWorker()
})
