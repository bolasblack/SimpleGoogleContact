import { AppBar, Drawer } from '@material-ui/core'
import { PageHeader, PageHeaderProps } from '../PageHeader'
import { StateUpProps } from "../../lib/ComponentHelper"
import { ContactGroupSidebar } from '../../containers/ContactGroupSidebar'
import { GoogleLoginButton } from '../GoogleLoginButton'
import './style.scss'
import { ContactGroupResourceName } from '../../services/ContactGroupService'
import { ContactList } from "../../containers/ContactList"

export function App(props: App.Props) {
  const {
    userinfo,
    isSignedIn,
    isSigningOut,
    onSignOut
  } = props

  return (
    <div className="App">
      <AppBar className="App__header" position="fixed">
        <PageHeader
          userinfo={userinfo}
          isSigningOut={isSigningOut}
          onSignOut={onSignOut}
        />
      </AppBar>

      {isSignedIn ? renderContent(props) : renderGoogleLogin() }
    </div>
  )
}

const renderGoogleLogin = () => {
  return (
    <div className="App__container App__container--unsigned">
      <GoogleLoginButton />
    </div>
  )
}

const renderContent = ({ state, setState }: App.Props) => {
  return (
    <div className="App__container">
      <Drawer
        variant="permanent"
        classes={{
          paper: "App__sidebar",
        }}
      >
        <ContactGroupSidebar
          selectedResourceName={state.selectedContactGroupResourceName}
          onSelect={group => {
            setState({ selectedContactGroupResourceName: group.resourceName! })
          }}
        />
      </Drawer>
      <main>
        <ContactList selectedContactGroupResourceName={state.selectedContactGroupResourceName} />
      </main>
    </div>
  )
}

export namespace App {
  export interface Props extends StateUpProps<State>, PageHeaderProps {
    isSignedIn: boolean
  }

  export interface State {
    selectedContactGroupResourceName?: ContactGroupResourceName
  }

  export const getInitialState = (): State => ({
    selectedContactGroupResourceName: 'contactGroups/chatBuddies',
  })
}