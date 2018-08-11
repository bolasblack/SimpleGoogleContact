import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { createStructuredSelector } from 'reselect'
import { compose } from 'ramda'
import { hot } from 'react-hot-loader'
import { wrapStateUp } from '../lib/StateUp'
import { App as Component } from '../components/App'
import { googleLogin } from '../action_packs'

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

export const App = compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  wrapStateUp,
)(Component) as React.ComponentClass
