// https://developers.google.com/api-client-library/javascript/reference/referencedocs
declare namespace gapi.auth2 {
  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig */
  export interface ClientConfig {
    client_id: string
    cookie_policy?: 'none' | 'single_host_origin'
    scope?: string
    fetch_basic_profile?: boolean
    hosted_domain?: string
    openid_realm?: string
    ux_mode?: 'popup' | 'redirect'
    redirect_uri?: string
  }

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2signinoptions */
  export interface SignInOptions {
    app_package_name?: string
    prompt?: 'consent' | 'select_account' | 'none'
    scope?: string
    ux_mode?: 'popup' | 'redirect'
    redirect_uri?: string
  }

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2offlineaccessoptions */
  export interface OfflineAccessOptions {
    app_package_name?: string
    prompt?: 'consent' | 'select_account' | 'none'
    scope?: string
  }

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2authresponse */
  export interface AuthResponse {
    access_token: string
    id_token: string
    scope: string
    expires_in: number
    first_issued_at: number
    expires_at: number
  }

  export interface GoogleAuth {
    isSignedIn: {
      /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthissignedinget */
      get(): boolean

      /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthissignedinlistenlistener */
      listen(listener: (isSignedIn: boolean) => void): void
    }

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthsigninoptions */
    signIn(options?: SignInOptions): Promise<GoogleUser>

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthsignout */
    signOut(): Promise<void>

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthdisconnect */
    disconnect(): void

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthgrantofflineaccessoptions */
    grantOfflineAccess(
      options?: OfflineAccessOptions,
    ): Promise<{ code: string }>

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthattachclickhandlercontainer-options--onsuccess-onfailure */
    attachClickHandler(
      container: string | HTMLDivElement,
      options: SignInOptions,
      onsuccess: () => void,
      onfailure: () => void,
    ): void

    currentUser: {
      /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthcurrentuserget */
      get(): GoogleUser | null

      /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauthcurrentuserlistenlistener */
      listen(listener: (newUser: GoogleUser) => void): void
    }

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleauththenoninit-onerror */
    then: Promise<GoogleAuth>['then']
  }

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#users */
  export interface GoogleUser {
    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid */
    getId(): string

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleuserissignedin */
    isSignedIn(): boolean

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergethosteddomain*/
    getHostedDomain(): string

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetgrantedscopes */
    getGrantedScopes(): string

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetbasicprofile */
    getBasicProfile(): BasicProfile

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetauthresponseincludeauthorizationdata */
    getAuthResponse(includeAuthorizationData?: boolean): AuthResponse

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleuserreloadauthresponse */
    reloadAuthResponse(): Promise<AuthResponse>

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleuserhasgrantedscopesscopes */
    hasGrantedScopes(scopes: string): boolean

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergrantoptions */
    grant(options: SignInOptions): Promise<GoogleUser>

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergrantofflineaccessoptions */
    grantOfflineAccess(
      options?: OfflineAccessOptions,
    ): Promise<{ code: string }>

    /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleuserdisconnect */
    disconnect(): void
  }

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetbasicprofile */
  export interface BasicProfile {
    getId(): string
    getName(): string
    getGivenName(): string
    getFamilyName(): string
    getImageUrl(): string
    getEmail(): string
  }

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2initparams */
  export function init(config: ClientConfig): void

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2getauthinstance */
  export function getAuthInstance(): GoogleAuth | null
}

declare namespace gapi.signin2 {
  export interface RenderOptions {
    scope?: string
    width?: number
    height?: number
    longtitle?: boolean
    theme?: 'light' | 'dark'
    onsuccess?: (user: gapi.auth2.GoogleUser) => void
    onfailure?: () => void
    app_package_name?: string
  }

  /* https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapisignin2renderid-options */
  export function render(id: string, options?: RenderOptions): void
}

declare namespace gapi.client {
  export interface RequestOptions {
    path: string
    method?: string
    params?: any
    headers?: any
    body?: any
    callback?: () => any
  }

  export function request<T = any>(args: RequestOptions): HttpRequest<T>
}
