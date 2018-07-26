import * as ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as DiProvider } from 'react.di'
import whenDOMReady from 'when-dom-ready'
import { GapiService } from './services/GapiService'
import { container } from './utils/di'
import { App } from './containers/App'
import { createStore } from './store'
import registerServiceWorker from './utils/registerServiceWorker'
import './index.css'

void container.get(GapiService).load()

void Promise.all([
  whenDOMReady(),
  createStore(),
]).then(([_, store]) => {
  ReactDOM.render(
    <ReduxProvider store={store}>
      <DiProvider container={container}>
        <App />
      </DiProvider>
    </ReduxProvider>,
    document.getElementById('root') as HTMLElement
  )

  registerServiceWorker()
})
