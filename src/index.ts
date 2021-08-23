import model from './model'
import { actions } from './actions'
import { hook } from './hook'
import defaults, { options, addMiddleware, addReducer } from './defaults'
import createStore from './store'
import { store } from './middleware'

const getState = function () {
  return store.getState()
}

export default {
  model,
  actions,
  hook,
  defaults,
  options,
  addMiddleware,
  addReducer,
  getState,
  createStore
}

export {
  model,
  actions,
  hook,
  defaults,
  options,
  addMiddleware,
  addReducer,
  getState,
  createStore
}
