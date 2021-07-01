import { setIn } from '@gem-mine/immutable'
import { resolveReducers, addActions } from './actions'
import {
  Model, ModelObj, State, ModelReducers
} from './types/model'
import { Reducer, ReducersMapObject } from './types/reducers'
import { Effects } from './types/effects'

export const models: Model[] = []

export default function model(m: ModelObj): Model {
  // eslint-disable-next-line no-param-reassign
  m = validateModel(m)
  if (!m.reducers) {
    m.reducers = {}
  }
  // 为所有 model 的 reducer 注入 setField 方法，这样 可以使用 actions[name].setField
  m.reducers.setField = function setField(data: State) {
    return setIn(this.getState(), data)
  }
  // 为所有 model 的 reducer 注入 resetState 方法，这样 可以使用 actions[name].resetState
  m.reducers.resetState = function resetState() {
    return setIn(this.getState(), m.state)
  }

  const reducer = getReducer(resolveReducers(m.name, m.reducers), m.state)

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _model: Model = {
    name: m.name,
    reducer
  }

  models.push(_model)

  // 挂到 actions 和 effects
  addActions(m.name, m.reducers, m.effects)

  return _model
}

function validateModel(m: ModelObj) {
  const { name, reducers, effects } = m

  const isObject = (target) => Object.prototype.toString.call(target) === '[object Object]'

  if (!name || typeof name !== 'string') {
    throw new Error('Model name must be a valid string!')
  }

  if (models.some((item) => item.name === name)) {
    throw new Error(`Model "${name}" has been created, please select another name!`)
  }

  if (reducers !== undefined && !isObject(reducers)) {
    throw new Error('Model reducers must be a valid object!')
  }

  if (effects !== undefined && !isObject(effects)) {
    throw new Error('Model effects must be a valid object!')
  }

  if (reducers !== undefined) {
    m.reducers = filterReducers(reducers)
  }
  if (effects !== undefined) {
    m.effects = filterReducers(effects)
  }

  return m
}

/**
 * 生成了 redux 中标准的 reducer（就是switch分支的那个函数）
 * @param {Object} reducers
 * @param {Object} initialState
 */
// If initialState is not specified, then set it to undefined
function getReducer(reducers: ReducersMapObject, initialState: State = undefined): Reducer {
  return (state = initialState, action) => {
    if (typeof reducers[action.type] === 'function') {
      return reducers[action.type](state, action.data)
    }
    return state
  }
}

/**
 * 过滤 reducers 或 effects，去掉值非 function 的
 * @param {Object} reducers
 */
function filterReducers(reducers: ModelReducers | Effects) {
  if (!reducers) {
    return reducers
  }

  return Object.keys(reducers).reduce((acc, action) => {
    // Filter out non-function entries
    if (typeof reducers[action] === 'function') {
      acc[action] = reducers[action]
    }
    return acc
  }, {})
}