import { Injectable } from 'react.di'
// import { google } from 'googleapis'
import loadjs from 'loadjs'
import { Store } from '../store'
import { googleLogin } from '../actionPacks'

const CLIENT_ID = '867154717118-u28ti694rr7kksi7kgo9b5mmcklugl4q.apps.googleusercontent.com'

const SCOPES = [
  'profile',
  'https://www.googleapis.com/auth/contacts',
].join(' ')

@Injectable
export class GapiService {
  private loadPromise: Promise<typeof gapi>

  async renderSigninButton(id: string) {
    const gapi = await this.load()
    gapi.signin2.render(id, {
      scope: SCOPES,
    })
  }

  async load() {
    if (this.loadPromise) return this.loadPromise
    return this.loadPromise = new Promise<typeof gapi>((resolve, reject) => {
      try {
        loadjs(['https://apis.google.com/js/api.js'], 'gapi', {
          success() { resolve(gapi) },
          error(depsNotFound: string) {
            reject(new Error('gapi load failed'))
          },
        })
      } catch (err) {
        if (err === "LoadJS") {
          resolve(gapi)
        } else {
          reject(err)
        }
      }
    }).then(gapi => new Promise<typeof gapi>((resolve, reject) => {
      gapi.load("auth2:signin2", () => {
        gapi.auth2.init({ client_id: CLIENT_ID })

        resolve(gapi)
      })
    }))
  }

  async logout() {
    const gapi = await this.load()
    const gAuth = gapi.auth2.getAuthInstance()!
    if (!gAuth.isSignedIn.get()) return
    await gAuth.signOut()
  }

  async setupAutoTriggerSignStatus(store: Store) {
    const gapi = await this.load()
    gapi.auth2.getAuthInstance()!.isSignedIn.listen(isSignedIn => {
      if (isSignedIn) {
        store.dispatch(googleLogin.actionCreators.signIn(gapi.auth2.getAuthInstance()!))
      } else {
        store.dispatch(googleLogin.actionCreators.signedOut())
      }
    })
  }
}
