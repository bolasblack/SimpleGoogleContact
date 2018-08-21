import { Action } from 'redux'
import { Epic } from 'redux-observable'
import { Container } from 'inversify'

export type Epic<
  State = any,
  Input extends Action = any,
  Output extends Input = Input
> = Epic<Input, Output, State, Container>

export type SFCProps<T = {}> = T & { children?: React.ReactNode }
