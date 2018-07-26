import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { App as AppComponent } from '../components/App'
import { State } from '../store'
import { googleLogin } from '../actionPacks'

export const mapStateToProps = (state: State) => ({
  userinfo: googleLogin.selectors.basicProfile(state),
  isSigningOut: googleLogin.selectors.isSigningOut(state),
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSignOut() {
    dispatch(googleLogin.actionCreators.signOut())
  },
})

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent)
