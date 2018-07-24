import { createStore as _createStore } from 'redux'
import { StoreState } from '../types'

export function composedReducer(state: StoreState): StoreState {
  return state
}

export async function createStore() {
  return _createStore(composedReducer, {})
}
