import { Middleware, Store } from 'redux'
import { MiddlewareFactory } from './middleware-factory'

interface TestState {
  test: string
}

class TestMiddlewareFactory extends MiddlewareFactory<TestState> {
  onAfterAction = jest.fn()
  onBeforeAction = jest.fn()
  onCreateMiddleware = jest.fn()
}

describe('middleware-factory', () => {
  let testMiddlewareFactory: TestMiddlewareFactory
  let middleware: Middleware
  let store: Store<TestState>

  beforeEach(() => {
    testMiddlewareFactory = new TestMiddlewareFactory()
    middleware = testMiddlewareFactory.toMiddleware()
    store = {
      dispatch: jest.fn() as any,
      getState: jest.fn() as any,
      subscribe: jest.fn() as any,
      replaceReducer: jest.fn() as any
    }
  })

  it('should call onCreateMiddleware', () => {
    middleware(store)
    expect(testMiddlewareFactory.onCreateMiddleware).toHaveBeenCalled()
  })

  it('should call onBeforeAction', () => {
    middleware(store)(action => action)({ type: 'TEST' })
    expect(testMiddlewareFactory.onBeforeAction).toHaveBeenCalled()
  })

  it('should call onAfterAction', () => {
    middleware(store)(action => action)({ type: 'TEST' })
    expect(testMiddlewareFactory.onAfterAction).toHaveBeenCalled()
  })
})
