import { ReducerFactory } from './reducer-factory'
import { Action } from 'redux'
import { reducerTestHelper } from './reducer-test-helper'

interface TestState {
  count: number
}

const initialState: TestState = {
  count: 1
}

enum ActionType {
  INCREMENT = 'INC',
  DECREMENT = 'DEC'
}

interface IncrementAction extends Action {
  type: ActionType.INCREMENT
  amount: number
}

interface DecrementAction extends Action {
  type: ActionType.DECREMENT
  amount: number
}

class TestReducerFactory extends ReducerFactory<TestState> {
  onIncrement = (state: TestState, action: IncrementAction) => {
    return {
      ...state,
      count: state.count + action.amount
    }
  }

  onDecrement = (state: TestState, action: DecrementAction) => {
    return {
      ...state,
      count: state.count - action.amount
    }
  }

  onAction = (state: TestState = initialState, action: Action) => {
    let newState = state

    switch (action.type) {
      case ActionType.DECREMENT:
        newState = this.onDecrement(state, action as DecrementAction)
        break
      case ActionType.INCREMENT:
        newState = this.onIncrement(state, action as IncrementAction)
        break
    }

    return newState
  }
}

describe('reducerTestHelper', () => {
  reducerTestHelper(new TestReducerFactory(), initialState, [
    { actionType: ActionType.INCREMENT, actionValue: { amount: 1 }, methods: 'onIncrement' },
    { actionType: ActionType.DECREMENT, actionValue: { amount: 1 }, methods: 'onDecrement' }
  ])
})
