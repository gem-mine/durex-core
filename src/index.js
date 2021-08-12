import model from './model'
import { actions } from './actions'
import hook from './hook'
import defaults, { options, addMiddleware, addReducer } from './defaults'
import { createStore, updateStore } from './store'
import { store as _store } from './middleware'

const getState = function () {
  return _store.getState()
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
  createStore,
  updateStore
}

export { model, actions, hook, defaults, options, addMiddleware, addReducer, getState, createStore, updateStore }
