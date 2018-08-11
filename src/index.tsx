import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as DiProvider } from 'react.di'
import { MuiThemeProvider } from '@material-ui/core'
import whenDOMReady from 'when-dom-ready'
import { GapiService } from './services/GapiService'
import { theme } from './styles/theme'
import { container } from './utils/di'
import { App } from './containers/App'
import { createStore } from './store'
import registerServiceWorker from './utils/registerServiceWorker'
import './index.scss'

void container.get(GapiService).load()

void Promise.all([whenDOMReady(), createStore()]).then(([_, store]) => {
  ReactDOM.render(
    <ReduxProvider store={store}>
      <DiProvider container={container}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </DiProvider>
    </ReduxProvider>,
    document.getElementById('root')!,
  )

  registerServiceWorker()
})
