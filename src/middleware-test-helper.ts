import { Dispatch, Store, AnyAction } from 'redux'

import { MiddlewareFactory } from './middleware-factory'

export interface ActionTypeToMethod {
  actionType: string
  methods: string | string[]
}

export const middlewareTestHelper = <T>(
  cut: MiddlewareFactory<T>,
  actionTypes: ActionTypeToMethod[]
) => {
  describe('toMiddleware', () => {
    let methods: string[] = []
    const middleware = cut.toMiddleware()
    const store: Store<T> = {
      dispatch: jest.fn(),
      getState: jest.fn(() => {
        return { editor: '', theme: {} }
      }),
      replaceReducer: jest.fn(),
      subscribe: jest.fn()
    }
    let next: Dispatch
    let action: AnyAction

    beforeEach(() => {
      for (const type of actionTypes) {
        methods = methods.concat(type.methods)
      }
      methods = union(methods)
      methods.forEach(method => (cut[method] = jest.fn()))
      next = jest.fn()
    })

    describe('not relevant action', () => {
      it('should call only next(action)', () => {
        // given
        action = { type: '' }

        // when
        middleware(store)(next)(action)

        // then
        expect(next).toHaveBeenCalledWith(action)
        expect(next).toHaveBeenCalledTimes(1)

        methods.forEach(method => {
          expect(cut[method]).not.toHaveBeenCalled()
        })
      })
    })

    describe('relevant actions', () => {
      for (const type of actionTypes) {
        const methodsThatShouldBeCalled: string | string[] = type.methods

        describe(`for action ${type.actionType}`, () => {
          beforeEach(() => {
            // given
            action = { type: type.actionType }

            // when
            middleware(store)(next)(action)
          })

          it(`should call ${methodsThatShouldBeCalled}, `, () => {
            // then
            if (typeof methodsThatShouldBeCalled === 'string') {
              expect(cut[methodsThatShouldBeCalled]).toHaveBeenCalledTimes(1)
            } else {
              methodsThatShouldBeCalled.forEach(method => {
                expect(cut[method]).toHaveBeenCalledTimes(1)
              })
            }
          })

          it(`should call next(action)`, () => {
            // then
            expect(next).toHaveBeenCalledWith(action)
            expect(next).toHaveBeenCalledTimes(1)
          })
        })
      }
    })
  })
}

const union = (methods: string[]) => {
  const res: string[] = []
  methods.forEach(method => {
    if (res.indexOf(method) === -1) {
      res.push(method)
    }
  })
  return res
}
