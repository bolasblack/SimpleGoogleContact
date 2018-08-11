import { Injectable } from 'react.di'
import loadjs from 'loadjs'
import { BehaviorSubject } from 'rxjs'

const CLIENT_ID =
  '867154717118-u28ti694rr7kksi7kgo9b5mmcklugl4q.apps.googleusercontent.com'

const SCOPES = ['profile', 'https://www.googleapis.com/auth/contacts'].join(' ')

@Injectable
export class GapiService {
  public isSignedIn$ = new BehaviorSubject(false)

  private loadPromise: Promise<typeof gapi> | null = null

  constructor() {
    this.initIsSignedIn$()
  }

  private _initedIsSignedIn$ = false
  private async initIsSignedIn$() {
    if (this._initedIsSignedIn$) return
    this._initedIsSignedIn$ = true

    const gapi = await this.load()

    const isSignedIn = await this.isSignedIn()
    this.isSignedIn$.next(isSignedIn)

    gapi.auth2.getAuthInstance()!.isSignedIn.listen(isSignedIn => {
      this.isSignedIn$.next(isSignedIn)
    })
  }

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

  getAuthInstance() {
    return gapi.auth2.getAuthInstance()
  }

  async logout() {
    if (!(await this.isSignedIn())) return
    const gapi = await this.load()
    await gapi.auth2.getAuthInstance()!.signOut()
  }

  async isSignedIn() {
    const gapi = await this.load()
    return gapi.auth2.getAuthInstance()!.isSignedIn.get()
  }

  async request<T>(arg: gapi.client.RequestOptions) {
    return (await this.load()).client.request<T>(arg)
  }
}
