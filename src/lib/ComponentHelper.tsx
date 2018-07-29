export interface StateUpProps<State = any> {
  state: State
  setState(patcher: Partial<State> | ((state: State) => State)): void
}

export type SetState = (patch: any | (<T>(state: T) => T)) => void

export function stateBinding<T>(
  context: T | (() => T),
  setContextState: SetState,
): StateUpProps<T>
export function stateBinding<T extends object, SN extends keyof T>(
  context: T | (() => T),
  setContextState: SetState,
  statePropertyName: SN,
): StateUpProps<T[SN]>
export function stateBinding<T, SN extends keyof T>(
  context: T | (() => T),
  setContextState: SetState,
  statePropertyName?: SN,
) {
  const getState = () => {
    if (typeof context === 'function') {
      return statePropertyName ? context()[statePropertyName] : context()
    } else {
      return statePropertyName ? context[statePropertyName] : context
    }
  }

  const setState: StateUpProps<T[SN]>['setState'] = (patch: any) => {
    let newSubState: T[SN]
    if (typeof patch === 'function') {
      newSubState = patch(getState())
    } else {
      newSubState = Object.assign(
        {},
        getState(),
        patch,
      )
    }
    if (statePropertyName) {
      setContextState({ [statePropertyName]: newSubState })
    } else {
      setContextState(newSubState)
    }
  }

  return {
    state: getState(),
    setState,
  }
}

export type StateUpComponentType<State, Props extends StateUpProps<State>> = React.ComponentType<Props> & {
  getInitialState(): State
}

export type WithoutStateUpProps<Props> = {
  [K in Exclude<keyof Props, 'state' | 'setState'>]: Props[K]
}

export function wrapStateUp<State, Props extends StateUpProps<State>>(Component: StateUpComponentType<State, Props>) {
  return class extends React.PureComponent<WithoutStateUpProps<Props>, State> {
    static displayName = `StateUpWrapped(${Component.displayName || Component.name})`

    state: State = Component.getInitialState()

    render() {
      return (
        <Component
          {...stateBinding(
            this.state,
            this.setState.bind(this),
          )}
          {...this.props}
        />
      )
    }
  }
}