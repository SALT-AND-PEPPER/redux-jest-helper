import { MiddlewareFactory } from './middleware-factory'
import { MiddlewareAPI, Action, Dispatch } from 'redux'
import { middlewareTestHelper } from './middleware-test-helper'

interface TestState {
  count: number
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

class TestMiddlewareFactory extends MiddlewareFactory<TestState> {
  onIncrement = (action: IncrementAction) => {}

  onDecrement = (action: DecrementAction) => {}

  onAfterIncrement = (action: IncrementAction) => {}

  onAfterDecrement = (action: DecrementAction) => {}

  onBeforeAction = (api: MiddlewareAPI<Dispatch>, action: Action) => {
    switch (action.type) {
      case ActionType.INCREMENT:
        this.onIncrement(action as IncrementAction)
        break
      case ActionType.DECREMENT:
        this.onDecrement(action as DecrementAction)
        break
    }
  }

  onAfterAction = (api: MiddlewareAPI<Dispatch>, action: Action, prevState: TestState) => {
    switch (action.type) {
      case ActionType.INCREMENT:
        this.onAfterIncrement(action as IncrementAction)
        break
      case ActionType.DECREMENT:
        this.onAfterDecrement(action as DecrementAction)
        break
    }
  }
}

describe('middlewareTestHelper', () => {
  middlewareTestHelper(new TestMiddlewareFactory(), [
    { actionType: ActionType.INCREMENT, methods: ['onIncrement', 'onAfterIncrement'] },
    { actionType: ActionType.DECREMENT, methods: ['onDecrement', 'onAfterDecrement'] }
  ])
})
