import { createStandardAction, ActionType, isOfType } from 'typesafe-actions'
import { filter, debounceTime, mergeMap } from 'rxjs/operators'
import produce from 'immer'
import { Epic, SetupStore } from '../types'
import { State } from '../store'
import { GapiService } from '../services/GapiService'

export interface State {
  google_login?: {
    signOutStartdAt?: number
    authResponse?: gapi.auth2.AuthResponse
    basicProfile?: {
      name: string
      imageUrl: string
      email: string
    }
  }
}

export enum ActionTypes {
  signIn = 'google_login:signIn',
  signOut = 'google_login:signOut:start',
  signedOut = 'google_login:signOut:end'
}

export const actionCreators = {
  signIn: createStandardAction(ActionTypes.signIn).map((gAuth: gapi.auth2.GoogleAuth) => ({
    payload: pickGoogleAuthInfo(gAuth),
  })),
  signOut: createStandardAction(ActionTypes.signOut)(),
  signedOut: createStandardAction(ActionTypes.signedOut)(),
}

export type Actions = ActionType<typeof actionCreators>

export const selectors = {
  basicProfile(state: State) {
    return state.google_login && state.google_login.basicProfile
  },
  authResponse(state: State) {
    return state.google_login && state.google_login.authResponse
  },
  isSignedIn(state: State) {
    return Boolean(selectors.authResponse(state))
  },
  isSigningOut(state: State) {
    console.log('isSigningOut', Boolean(state.google_login && state.google_login.signOutStartdAt))
    return Boolean(state.google_login && state.google_login.signOutStartdAt)
  },
}

export const reducer = (state: State, action: Actions) => produce(state, state => {
  switch(action.type) {
    case ActionTypes.signIn:
      state.google_login = { ...action.payload }
      break
    case ActionTypes.signOut:
      state.google_login = (state.google_login || {})
      state.google_login.signOutStartdAt = Date.now()
      break
    case ActionTypes.signedOut:
      if (selectors.isSigningOut(state)) {
        delete state.google_login!.signOutStartdAt
        delete state.google_login!.authResponse
        delete state.google_login!.basicProfile
      }
      break
  }
})

export const epic: Epic<Actions> = (action$, state$, container) =>
  action$.pipe(
    filter(isOfType(ActionTypes.signOut)),
    debounceTime(1000),
    mergeMap(async action => {
      const gapiService = container.get(GapiService)
      await gapiService.logout()
      return actionCreators.signedOut()
    }),
  )

export const setupStore: SetupStore = async (store, container) => {
  await container.get(GapiService).setupAutoTriggerSignStatus(store)
}

export function pickGoogleAuthInfo(gAuth: gapi.auth2.GoogleAuth) {
  if (!gAuth.isSignedIn.get()) throw new Error('unsigned in')

  const currUser = gAuth.currentUser.get()!
  const basicProfile = currUser.getBasicProfile()

  return {
    authResponse: currUser.getAuthResponse(),
    basicProfile: {
      name: basicProfile.getName(),
      imageUrl: basicProfile.getImageUrl(),
      email: basicProfile.getEmail(),
    },
  }
}
