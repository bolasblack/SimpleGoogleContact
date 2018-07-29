import { Injectable } from 'react.di'
import loadjs from 'loadjs'
import { Store } from '../store'
import { googleLogin } from '../action_packs'

const CLIENT_ID =
  '867154717118-u28ti694rr7kksi7kgo9b5mmcklugl4q.apps.googleusercontent.com'

const SCOPES = ['profile', 'https://www.googleapis.com/auth/contacts'].join(' ')

@Injectable
export class GapiService {
  private loadPromise: Promise<typeof gapi> | null = null

  async renderSigninButton(id: string) {
    const gapi = await this.load()
    gapi.signin2.render(id, {
      scope: SCOPES,
    })
  }

  async load() {
    if (this.loadPromise) return this.loadPromise
    return (this.loadPromise = new Promise<typeof gapi>((resolve, reject) => {
      try {
        loadjs(['https://apis.google.com/js/api.js'], 'gapi', {
          success() {
            resolve(gapi)
          },
          error(depsNotFound: string) {
            reject(new Error('gapi load failed'))
          },
        })
      } catch (err) {
        if (err === 'LoadJS') {
          resolve(gapi)
        } else {
          reject(err)
        }
      }
    }).then(
      gapi =>
        new Promise<typeof gapi>((resolve, reject) => {
          gapi.load('client:auth2:signin2', () => {
            gapi.auth2.init({ client_id: CLIENT_ID })

            resolve(gapi)
          })
        }),
    ))
  }

  async logout() {
    if (!(await this.isSignedIn())) return
    await gapi.auth2.getAuthInstance()!.signOut()
  }

  async setupAutoTriggerSignStatus(store: Store) {
    const gapi = await this.load()
    gapi.auth2.getAuthInstance()!.isSignedIn.listen(isSignedIn => {
      if (isSignedIn) {
        store.dispatch(
          googleLogin.actionCreators.signIn(gapi.auth2.getAuthInstance()!),
        )
      } else {
        store.dispatch(googleLogin.actionCreators.signedOut())
      }
    })
  }

  async isSignedIn() {
    const gapi = await this.load()
    return gapi.auth2.getAuthInstance()!.isSignedIn.get()
  }

  async request<T>(arg: gapi.client.RequestOptions) {
    return (await this.load()).client.request<T>(arg)
  }
}
