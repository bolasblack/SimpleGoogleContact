import { produce, Draft } from 'immer'

export interface StateUpProps<State = any> {
  state: State
  getState(): State
  setState(patcher: Partial<State> | ((state: State) => State)): void
}

export type StateUpComponentType<
  State,
  Props extends StateUpProps<State>
> = React.ComponentType<Props> & {
  getInitialState(): State | StateContext<State>
}

export type WithoutStateUpProps<Props> = {
  [K in Exclude<keyof Props, keyof StateUpProps>]: Props[K]
}

export function wrapStateUp<State, Props extends StateUpProps<State>>(
  Component: StateUpComponentType<State, Props>,
) {
  return class extends React.PureComponent<
    WithoutStateUpProps<Props>,
    { internalState: State | StateContext<State> }
  > {
    static displayName = `StateUpWrapped(${Component.displayName ||
      Component.name})`

    state = {
      internalState: Component.getInitialState(),
    }

    render() {
      const internalState = this.state
      const props =
        internalState instanceof StateContext
          ? internalState.stateBinding(
              () => this.state.internalState as StateContext<State>,
              (s: typeof internalState) => this.setState({ internalState: s }),
            )
          : stateBinding(() => this.state, this.setState.bind(this))

      return <Component {...props} {...this.props} />
    }
  }
}

/* -------- StateUp 第一版 -------- */

export type SetState = (patch: any | (<T>(state: T) => T)) => void

export function stateBinding<T>(
  getContextState: () => T,
  setContextState: SetState,
): StateUpProps<T>
export function stateBinding<T extends object, SN extends keyof T>(
  getContext: () => T,
  setContextState: SetState,
  statePropertyName: SN,
): StateUpProps<T[SN]>
export function stateBinding<T, SN extends keyof T>(
  getContext: () => T,
  setContextState: SetState,
  statePropertyName?: SN,
) {
  const getState = () => {
    return statePropertyName ? getContext()[statePropertyName] : getContext()
  }

  const setState: StateUpProps<T[SN]>['setState'] = (patch: any) => {
    let newSubState: T[SN]
    if (typeof patch === 'function') {
      newSubState = patch(getState())
    } else {
      newSubState = Object.assign({}, getState(), patch)
    }
    if (statePropertyName) {
      setContextState({ [statePropertyName]: newSubState })
    } else {
      setContextState(newSubState)
    }
  }

  return {
    state: getState(),
    getState,
    setState,
  }
}

/* -------- StateUp 第二版 -------- */

export class StateContext<State = any> {
  state!: State

  getState?: () => State
  setState?: (patcher: Partial<State> | ((state: State) => State)) => void

  constructor(state: State) {
    this.state = state
  }

  generateSetState(getState: () => State, setState: (newState: State) => void) {
    return (patcher: Partial<State> | ((state: State) => State)) => {
      const oldState = getState()
      let newState: State
      if (typeof patcher === 'function') {
        newState = patcher(oldState)
      } else {
        newState = Object.assign({}, oldState, patcher)
      }
      setState(newState)
    }
  }

  produce(producer: ((state: Draft<State>) => void | State)) {
    const newState = produce(this.state, producer)
    if (newState === this.state) return this
    return new StateContext<State>(newState)
  }

  stateBinding(
    getStateContext: () => StateContext<State>,
    setStateContext: (newStateContext: StateContext<State>) => void,
  ): StateUpProps<State>
  stateBinding<ContainerKey extends string>(
    getStateContextContainer: () => {
      [key in ContainerKey]: StateContext<State>
    },
    setStateContextContainer: (
      newContainerState: { [key in ContainerKey]: StateContext<State> },
    ) => void,
    containerKey: ContainerKey,
  ): StateUpProps<State>
  stateBinding(
    getCtx: () => any,
    setCtx: (newStateContext: any) => void,
    containerKey?: string,
  ) {
    if (!this.setState) {
      if (containerKey) {
        this.getState = () => getCtx()[containerKey].state
        this.setState = this.generateSetState(this.getState, s => {
          if (s === this.getState!()) return
          setCtx({ [containerKey]: new StateContext<State>(s) })
        })
      } else {
        this.getState = () => getCtx().state
        this.setState = this.generateSetState(this.getState, s => {
          if (s === getCtx().state) return
          setCtx(new StateContext<State>(s))
        })
      }
    }

    return {
      state: this.state,
      getState: this.getState!,
      setState: this.setState!,
    }
  }
}
