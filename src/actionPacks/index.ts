import { combineEpics } from 'redux-observable'
import { compose } from 'redux'
import * as googleLogin from './google_login'
import { SetupStore } from '../types'

export { googleLogin }

export type State = googleLogin.State

export type Actions = googleLogin.Actions

export const epic = combineEpics(
  googleLogin.epic,
)

export const reducer = compose(
  googleLogin.reducer,
)

export const setupStore = composeSetupStores(
  googleLogin.setupStore,
)

function composeSetupStores(...fns: SetupStore[]): SetupStore {
  return (store, container) => {
    return Promise.all(fns.map(fn => fn(store, container))).then(_ => undefined)
  }
}
