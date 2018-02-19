import { Action } from 'redux'

export abstract class ReducerFactory<S> {
  [key: string]: any
  onAction: (state: S | undefined, action: Action) => S

  toReducer = (): ((state: S | undefined, action: Action) => S) => {
    return (state: S | undefined, action: Action): S => {
      return this.onAction(state, action)
    }
  }
}
