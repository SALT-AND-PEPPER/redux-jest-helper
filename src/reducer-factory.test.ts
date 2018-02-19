import { Reducer, Action } from 'redux'

import { ReducerFactory } from './reducer-factory'

interface TestState {
  test: string
}

const initialState: TestState = {
  test: 'TEST'
}

class TestReducerFactory extends ReducerFactory<TestState> {
  onAction = (state: TestState = initialState, action: Action) => {
    return state
  }
}

describe('ReducerFactory', () => {
  let reducerFactory: TestReducerFactory
  let onActionSpy: jest.SpyInstance
  let reducer: Reducer<TestState>
  beforeEach(() => {
    reducerFactory = new TestReducerFactory()
    onActionSpy = jest.spyOn(reducerFactory, 'onAction')
    reducer = reducerFactory.toReducer()
  })

  it('should call onAction', () => {
    const testAction: Action = { type: 'TEST' }

    reducer(initialState, testAction)
    expect(onActionSpy).toHaveBeenCalledWith(initialState, testAction)
  })
})
