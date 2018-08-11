import {
  applyMiddleware,
  compose,
  Store as ReduxStore,
  createStore as reduxCreateStore,
} from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { BehaviorSubject } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Epic } from '../types'
import { container } from '../utils/di'
import { RootActions, ActionState, epic, reducer } from '../action_packs'

export type RootState = ActionState

export type Store = ReduxStore<ActionState>

const epicMiddleware = createEpicMiddleware<
  RootActions,
  RootActions,
  RootState,
  typeof container
>({
  dependencies: container,
})

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const epic$ = new BehaviorSubject(epic)
const hotReloadingEpic: Epic<RootActions> = (...args) =>
  epic$.pipe(switchMap(epic => epic(...args)))

export async function createStore() {
  const store = reduxCreateStore(
    reducer,
    {},
    composeEnhancers(applyMiddleware(epicMiddleware)),
  )

  epicMiddleware.run(hotReloadingEpic)

  if (module.hot) {
    module.hot.accept('../action_packs', () => {
      console.log('[Store HMR] triggered')

      const pack = require('../action_packs')

      store.replaceReducer(pack.reducer)
      console.log('[Store HMR] reducer replaced')

      epic$.next(pack.epic)
      console.log('[Store HMR] epic replaced')
    })
  }

  return store
}
