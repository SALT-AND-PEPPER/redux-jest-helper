import { Action, Dispatch, MiddlewareAPI, Middleware, AnyAction } from 'redux'

export abstract class MiddlewareFactory<S, D extends Dispatch = Dispatch, A extends Action = AnyAction> {
  [key: string]: any
  onBeforeAction?: (api: MiddlewareAPI<D, S>, action: A) => void
  onAfterAction?: (api: MiddlewareAPI<D, S>, action: A, prevState: S) => void
  onCreateMiddleware?: (api: MiddlewareAPI<D, S>) => void

  toMiddleware = (): Middleware<{}, S, D> => {
    return (api: MiddlewareAPI<D, S>) => {
      if (this.onCreateMiddleware) {
        this.onCreateMiddleware(api)
      }
      return next => action => {
        if (this.onBeforeAction) {
          this.onBeforeAction(api, action)
        }
        const prevState = api.getState()
        const result = next(action)
        if (this.onAfterAction) {
          this.onAfterAction(api, action, prevState)
        }

        return result
      }
    }
  }
}
