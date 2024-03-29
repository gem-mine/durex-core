import { createStore as _createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { options } from './defaults'
import { models } from './model'
import createMiddleware from './middleware'

export let store

export function createStore() {
  const { initialState, middlewares, reducers } = options

  const middleware = applyMiddleware(...middlewares, createMiddleware())
  const enhancers = [middleware]
  let composeEnhancers = compose

  if (process.env.NODE_ENV !== 'production') {
    // Redux devtools extension support.
    if (global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  const reducer = createReducer(models, reducers)
  const enhancer = composeEnhancers(...enhancers)

  store = _createStore(reducer, initialState, enhancer)
  return store
}

function createReducer(models, reducers) {
  const modelReducers = models.reduce((acc, cur) => {
    acc[cur.name] = cur.reducer
    return acc
  }, {})

  return combineReducers({
    ...reducers,
    ...modelReducers
  })
}

