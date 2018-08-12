import { Action } from 'redux'
import { Epic } from 'redux-observable'
import { Container } from 'inversify'
import { RootState } from '../store'

export type Epic<
  Input extends Action = any,
  Output extends Input = Input
> = Epic<Input, Output, RootState, Container>

export type SFCProps<T = {}> = T & { children?: React.ReactNode }
