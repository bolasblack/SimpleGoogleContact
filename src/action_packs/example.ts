import { createStandardAction, ActionType, isOfType } from 'typesafe-actions'
import { createSelector } from 'reselect'
import { filter, debounceTime, map } from 'rxjs/operators'
import { produce } from 'immer'
import { Epic } from '../types'

export type Actions = ActionType<typeof actionCreators>

export interface State {
  example?: {
    data?: number
  }
}

export enum ActionTypes {
  start = 'example:start',
  set = 'example:set',
}

export const actionCreators = {
  start: createStandardAction(ActionTypes.start)(),
  set: createStandardAction(ActionTypes.set)<number>(),
}

export namespace selectors {
  export const data = (state: State) =>
    (state.example && state.example.data) || 0

  export const plusOne = createSelector(data, num => num + 1)
}

export const reducer = produce<State, Actions>((state, action) => {
  switch (action.type) {
    case ActionTypes.set:
      state.example = state.example || {}
      state.example.data = action.payload
      break
  }
})

export const epic: Epic<State, Actions> = (action$, state$, container) =>
  action$.pipe(
    filter(isOfType(ActionTypes.start)),
    debounceTime(1000),
    map(action => actionCreators.set(selectors.plusOne(state$.value))),
  )
