import * as deepFreeze from 'deep-freeze'
import { ReducerFactory } from './reducer-factory'
import { AnyAction } from 'redux';

export interface ActionTypeToMethod {
  actionType: string
  actionValue?: {}
  methods: string | string[]
}

export const reducerTestHelper = <T>(
  cut: ReducerFactory<T>,
  initialState: T,
  actionTypes: ActionTypeToMethod[]
) => {
  describe('toReducer', () => {
    let methods: string[] = []
    const reducer = cut.toReducer()
    let action: AnyAction

    beforeEach(() => {
      deepFreeze(initialState)

      for (const type of actionTypes) {
        methods = methods.concat(type.methods)
      }
      methods = union(methods)
      methods.forEach(method => (cut[method] = jest.spyOn(cut, method)))
    })

    describe('not relevant action', () => {
      it('should return unchanged state', () => {
        // given
        action = { type: '' }

        // when
        const newState = reducer(initialState, action)

        // then
        expect(newState).toBe(initialState)

        methods.forEach(method => {
          expect(cut[method]).not.toHaveBeenCalled()
        })
      })
    })

    describe('relevant actions', () => {
      for (const type of actionTypes) {
        const methodsThatShouldBeCalled: string | string[] = type.methods

        describe(`for action ${type.actionType}`, () => {
          let newState: T

          beforeEach(() => {
            // given
            action = { ...type.actionValue, type: type.actionType }

            // when
            newState = reducer(initialState, action)
          })

          it(`should call ${methodsThatShouldBeCalled} `, () => {
            // then
            if (typeof methodsThatShouldBeCalled === 'string') {
              expect(cut[methodsThatShouldBeCalled]).toHaveBeenCalledTimes(1)
            } else {
              methodsThatShouldBeCalled.forEach(method => {
                expect(cut[method]).toHaveBeenCalledTimes(1)
              })
            }
          })

          it(`should not mutate the original state`, () => {
            // then
            expect(newState).not.toBe(initialState)
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
