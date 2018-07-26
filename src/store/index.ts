import { applyMiddleware, compose, Store as ReduxStore, createStore as reduxCreateStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { container } from '../utils/di'
import { Actions, State, epic, reducer, setupStore } from '../actionPacks'

export type State = State

export type Store = ReduxStore<State>

const epicMiddleware = createEpicMiddleware<Actions, Actions, State, typeof container>({
  dependencies: container,
})

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export async function createStore() {
  const store = reduxCreateStore(
    reducer,
    {},
    composeEnhancers(
      applyMiddleware(epicMiddleware),
    ),
  )

  epicMiddleware.run(epic)

  await setupStore(store, container)

  return store
}
