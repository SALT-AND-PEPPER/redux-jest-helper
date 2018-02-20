# ReduxJestHelper

Provides an easy way to create and test Redux Reducers and Middlewares.

## Usage

### Middleware

Implement a `MiddlewareFactory<S>`. The abstract class provides an interface for 3 functions that
can be implemented:

-  `onBeforeAction?: (api: MiddlewareAPI<S>, action: Action) => void`
-  `onAfterAction?: (api: MiddlewareAPI<S>, action: Action, prevState: S) => void`
-  `onCreateMiddleware?: (api: MiddlewareAPI<S>) => void`

#### Example:

```typescript
import { MiddlewareFactory } from 'redux-jest-helper'

class CounterMiddlewareFactory extends MiddlewareFactory<CounterState> {
  onBeforeAction = (api: MiddlewareAPI<CounterState>, action: Action) => {
    switch (action.type) {
      case 'INCREMENT':
        this.onIncrement(action as IncrementAction) // do something before an INCREMENT action
        break
    }
  }

  onAfterAction = (api: MiddlewareAPI<CounterState>, action: Action, prevState: CounterState) => {
    switch (action.type) {
      case 'DECREMENT':
        this.afterDecrement(action as DecrementAction) // do something after a DECREMENT action
        break
    }
  }
}
```

#### Testing:

The following example will test, if the given methods are called on the given actions. 

```typescript
import { middlewareTestHelper } from 'redux-jest-helper'

middlewareTestHelper(new CounterMiddlewareFactory(), [
  { actionType: 'INCREMENT', methods: ['onIncrement'] },
  { actionType: 'DECREMENT', methods: ['afterDecrement'] }
])
```

Now that you tested if the methods are really called when the according action happens you only need
to unit-test the methods themselves.

### Reducer

Implement a `ReducerFactory<S>`. The abstract class provides an interface for 
`onAction: (state: S | undefined, action: Action) => S`.

#### Example:

```typescript
class CounterReducerFactory extends ReducerFactory<CounterState> {
  onIncrement = (state: CounterState, action: IncrementAction) => {
    return {
      ...state,
      count: state.count + action.amount
    }
  }

  onDecrement = (state: CounterState, action: DecrementAction) => {
    return {
      ...state,
      count: state.count - action.amount
    }
  }

  onAction = (state: CounterState = initialState, action: Action) => {
    let newState = state

    switch (action.type) {
      case 'DECREMENT':
        newState = this.onDecrement(state, action as DecrementAction)
        break
      case 'INCREMENT':
        newState = this.onIncrement(state, action as IncrementAction)
        break
    }

    return newState
  }
}
```

#### Testing:

The following example will test, if the given methods are called on the given actions with the given
payload.

```typescript
import { reducerTestHelper } from 'redux-jest-helper'

describe('reducerTestHelper', () => {
  reducerTestHelper(new TestReducerFactory(), initialState, [
    { actionType: 'INCREMENT', actionValue: { amount: 1 }, methods: 'onIncrement' },
    { actionType: 'DECREMENT', actionValue: { amount: 1 }, methods: 'onDecrement' }
  ])
})
```

Now that you tested if the methods are really called when the according action happens you only need
to unit-test the methods themselves.

### Adding everything to the store

```typescript
const counterReducerFactory = new CounterReducerFactory()
const counterMiddlewareFactory = new CounterMiddlewareFactory()

const rootReducer = combineReducers({
  counter: counterReducerFactory.toReducer()
})

createStore(rootReducer, applyMiddleware(counterMiddlewareFactory.toMiddleware()))
```