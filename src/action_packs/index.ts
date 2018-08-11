import { combineEpics } from 'redux-observable'
import { compose } from 'redux'
import * as googleLogin from './google_login'

export { googleLogin }

export const epic = combineEpics(googleLogin.epic)

export const reducer = compose(googleLogin.reducer)

// prettier-ignore
export type ActionState =
  | googleLogin.State

// prettier-ignore
export type RootActions =
  | googleLogin.Actions
