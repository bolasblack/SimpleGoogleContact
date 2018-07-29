import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { createStructuredSelector } from 'reselect'
import { wrapStateUp } from "../lib/ComponentHelper"
import { App as AppComponent } from '../components/App'
import { googleLogin } from '../actionPacks'

export const mapStateToProps = createStructuredSelector({
  isSignedIn: googleLogin.selectors.isSignedIn,
  userinfo: googleLogin.selectors.basicProfile,
  isSigningOut: googleLogin.selectors.isSigningOut,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSignOut() {
    dispatch(googleLogin.actionCreators.signOut())
  },
})

export const App = connect(mapStateToProps, mapDispatchToProps)(wrapStateUp(AppComponent))
