import { AppBar, Drawer } from '@material-ui/core'
import { PageHeader, PageHeaderProps } from '../PageHeader'
import { ContactGroupSidebar } from '../../containers/ContactGroupSidebar'
import { GoogleLoginButton } from '../GoogleLoginButton'
import './style.scss'

export interface AppProps extends PageHeaderProps {
  isSignedIn: boolean
}

export class App extends React.PureComponent<AppProps> {
  public render() {
    return (
      <div className="App">
        <AppBar className="App__header" position="fixed">
          <PageHeader
            userinfo={this.props.userinfo}
            isSigningOut={this.props.isSigningOut}
            onSignOut={this.props.onSignOut}
          />
        </AppBar>

        {this.props.isSignedIn ? this.renderContent() : this.renderGoogleLogin() }
      </div>
    );
  }

  private renderGoogleLogin() {
    return (
      <div className="App__container App__container--unsigned">
        <GoogleLoginButton />
      </div>
    )
  }

  private renderContent() {
    return (
      <div className="App__container">
        <Drawer
          variant="permanent"
          classes={{
            paper: "App__sidebar",
          }}
        >
          <ContactGroupSidebar />
        </Drawer>
        <main />
      </div>
    )
  }
}
