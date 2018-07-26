import { Inject } from 'react.di'
import { GapiService } from '../../services/GapiService'
import { PageHeader, PageHeaderProps } from '../PageHeader'
import './style.css'

export type AppProps = PageHeaderProps

export class App extends React.PureComponent<AppProps> {
  @Inject gapiService: GapiService

  public componentDidMount() {
    void this.gapiService.renderSigninButton('google-login')
  }

  public render() {
    return (
      <div className="app">
        <PageHeader
          userinfo={this.props.userinfo}
          isSigningOut={this.props.isSigningOut}
          onSignOut={this.props.onSignOut}
        />

        <div className="app-container">
          <div id="google-login" />
        </div>
      </div>
    );
  }
}
