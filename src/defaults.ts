import type { Middleware, Reducer } from 'redux'
import { effects, addEffect as defaultAddEffect } from './effects'
import { isObject, each } from './utils'

import type { DefaultOptions, Options } from './@types/default'

export const options: Options = {
  // global initial state
  // state: undefined,

  // A list of the standard Redux middleware
  middlewares: [],

  // `options.reducers` will be directly handled by `combineReducers`,
  // so reducers defined here must be standard Redux reducer:
  //
  // reducers: {
  //   add: (state, action) => {}
  // }
  //
  reducers: {},

  // An overwrite of the existing effect handler
  addEffect: defaultAddEffect(effects)
}

export function addReducer(reducer: Reducer): void {
  Object.assign(options.reducers, reducer)
}

export function addMiddleware(middleware: Middleware): void {
  options.middlewares.push(middleware)
}

export default function defaults(opts: DefaultOptions): void {
  const { middlewares, reducers, addEffect } = opts

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`middlewares "${middlewares}" is invalid, must be an Array!`)
  }

  if (reducers && !isObject(reducers)) {
    throw new Error(`middlewares "${reducers}" is invalid, must be an Object!`)
  }

  if (addEffect) {
    if (typeof addEffect !== 'function' || typeof addEffect({}) !== 'function') {
      throw new Error(`addEffect "${addEffect}" is invalid, must be a function that returns a function`)
    } else {
      // create effects handler with initial effects object
      opts.addEffect = opts.addEffect(effects)
    }
  }

  each(opts, (key) => {
    if (key === 'reducers') {
      options[key] = {
        ...options[key],
        ...opts[key]
      }
    } else if (key === 'middlewares') {
      options[key] = options[key].concat(opts[key])
    } else {
      options[key] = opts[key]
    }
  })
}
