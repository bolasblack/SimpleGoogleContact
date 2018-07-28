export interface StateUpProps<State = any> {
  state: State
  setState(patcher: Partial<State> | ((state: State) => State)): void
}

export type SetState = (patch: any | (<T>(state: T) => T)) => void

export function stateBinding<T extends object, SN extends keyof T>(
  context: T,
  setContextState: SetState,
  statePropertyName: SN,
) {
  const setState: StateUpProps<T[SN]>['setState'] = (patch: any) => {
    let newSubState: T[SN]
    if (typeof patch === 'function') {
      newSubState = patch(context[statePropertyName])
    } else {
      newSubState = Object.assign(
        {},
        context[statePropertyName],
        patch,
      )
    }
    setContextState({ [statePropertyName]: newSubState })
  }

  return {
    state: context[statePropertyName],
    setState,
  }
}
