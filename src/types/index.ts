import { Action } from 'redux'
import { Epic } from 'redux-observable'
import { Container } from 'inversify'
import { Store, State } from '../store'

export type Epic<Input extends Action = any, Output extends Input = Input> = Epic<Input, Output, State, Container>

export type SetupStore = (store: Store, contaienr: Container) => void | Promise<void>
