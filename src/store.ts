import {
  createStore as _createStore, applyMiddleware, combineReducers, compose
} from 'redux'
import { options } from './defaults'
import { models } from './model'
import createMiddleware from './middleware'
import { StoreEnhancer } from './types/store'
import { ReducersMapObject, Reducer } from './types/reducers'
import { Model } from './types/model'

export default function createStore() {
  const { initialState, middlewares, reducers } = options

  const middleware = applyMiddleware(...middlewares, createMiddleware())

  const enhancers = [middleware]
  let composeEnhancers = compose

  if (process.env.NODE_ENV !== 'production') {
    // Redux devtools extension support.
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  const reducer = createReducer(models, reducers)
  const enhancer = composeEnhancers(...enhancers) as StoreEnhancer
  return _createStore(reducer, initialState, enhancer)
}

// eslint-disable-next-line @typescript-eslint/no-shadow
function createReducer(models: Model[], reducers: ReducersMapObject): Reducer {
  const ModelReducers: ReducersMapObject = models.reduce((acc, cur) => {
    acc[cur.name] = cur.reducer
    return acc
  }, {})

  return combineReducers({
    ...reducers,
    ...ModelReducers
  })
}
