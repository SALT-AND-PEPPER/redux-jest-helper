import { Action, Dispatch, Middleware, MiddlewareAPI } from 'redux'

export interface ExtendedMiddleware<T> extends Middleware {
  <S extends T>(api: MiddlewareAPI<S>): (next: Dispatch<S>) => Dispatch<S>
}

export abstract class MiddlewareFactory<S> {
  [key: string]: any
  onBeforeAction?: (api: MiddlewareAPI<S>, action: Action) => void
  onAfterAction?: (api: MiddlewareAPI<S>, action: Action, prevState: S) => void
  onCreateMiddleware?: (api: MiddlewareAPI<S>) => void

  toMiddleware = (): ExtendedMiddleware<S> => {
    return (api: MiddlewareAPI<S>) => {
      if (this.onCreateMiddleware) {
        this.onCreateMiddleware(api)
      }
      return (next: Dispatch<S>) => (action: Action): any => {
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
