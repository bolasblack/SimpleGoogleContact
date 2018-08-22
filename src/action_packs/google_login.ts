import { createStandardAction, ActionType, isOfType } from 'typesafe-actions'
import { filter, debounceTime, flatMap } from 'rxjs/operators'
import produce from 'immer'
import { createSelector } from 'reselect'
import { Epic } from '../types'
import { GapiService } from '../services/GapiService'
import { combineEpics } from 'redux-observable'

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
  signOutCanceled = 'google_login:signOut:canceled',
  signedOut = 'google_login:signOut:end',
}

export const actionCreators = {
  signIn: createStandardAction(ActionTypes.signIn).map(
    (gAuth: gapi.auth2.GoogleAuth) => ({
      payload: pickGoogleAuthInfo(gAuth),
    }),
  ),
  signOut: createStandardAction(ActionTypes.signOut)(),
  signOutCanceled: createStandardAction(ActionTypes.signOutCanceled)(),
  signedOut: createStandardAction(ActionTypes.signedOut)(),
}

export type Actions = ActionType<typeof actionCreators>

export namespace selectors {
  const getGoogleLogin = (state: State) => state.google_login

  export const basicProfile = createSelector(
    getGoogleLogin,
    info => info && info.basicProfile,
  )

  export const authResponse = createSelector(
    getGoogleLogin,
    info => info && info.authResponse,
  )

  export const isSignedIn = createSelector(authResponse, Boolean)

  export const isSigningOut = createSelector(getGoogleLogin, info =>
    Boolean(info && info.signOutStartdAt),
  )
}

export const reducer = produce<State, Actions>((state, action) => {
  switch (action.type) {
    case ActionTypes.signIn:
      state.google_login = { ...action.payload }
      break
    case ActionTypes.signOut:
      state.google_login = state.google_login || {}
      state.google_login.signOutStartdAt = Date.now()
      break
    case ActionTypes.signOutCanceled:
      delete state.google_login!.signOutStartdAt
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

export const signInStatusEpic: Epic<State, Actions> = (
  action$,
  state$,
  container,
) => {
  const gapiService = container.get(GapiService)
  return gapiService.isSignedIn$.pipe(
    flatMap(async isSignedIn => {
      if (isSignedIn) {
        return actionCreators.signIn(gapiService.getAuthInstance()!)
      } else {
        return actionCreators.signedOut()
      }
    }),
  )
}

export const signOutEpic: Epic<State, Actions> = (action$, state$, container) =>
  action$.pipe(
    filter(isOfType(ActionTypes.signOut)),
    debounceTime(1000),
    flatMap(async action => {
      if (confirm('确认要登出吗？')) {
        const gapiService = container.get(GapiService)
        await gapiService.logout()
        return actionCreators.signedOut()
      } else {
        return actionCreators.signOutCanceled()
      }
    }),
  )

export const epic = combineEpics(signInStatusEpic, signOutEpic)

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
