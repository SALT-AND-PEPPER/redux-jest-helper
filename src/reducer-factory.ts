import { Action, AnyAction } from 'redux'

export abstract class ReducerFactory<S, A extends Action = AnyAction> {
  [key: string]: any
  onAction: (state: S | undefined, action: A) => S

  toReducer = (): ((state: S | undefined, action: A) => S) => {
    return (state: S | undefined, action: A): S => {
      return this.onAction(state, action)
    }
  }
}
