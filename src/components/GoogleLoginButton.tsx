import { Inject } from 'react.di'
import { GapiService } from '../services/GapiService'

export class GoogleLoginButton extends React.PureComponent {
  @Inject
  gapiService: GapiService

  public componentDidMount() {
    void this.gapiService.renderSigninButton('google-login')
  }

  render() {
    return <div id="google-login" />
  }
}
