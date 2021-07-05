import { effects, addEffect } from './effects'
import { Options, UserOptions } from './types/default'
import { ReducersMapObject } from './types/reducers'
import { Middleware } from './types/middleware'

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
  addEffect: addEffect(effects),

  initialState: {},
}

const isObject = (target: ReducersMapObject) => Object.prototype.toString.call(target) === '[object Object]'

export function addReducer(reducer: ReducersMapObject) {
  Object.assign(options.reducers, reducer)
}

export function addMiddleware(middleware: Middleware) {
  options.middlewares.push(middleware)
}

export default function defaults(opts: UserOptions) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { middlewares, reducers, addEffect } = opts

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`middlewares "${middlewares}" is invalid, must be an Array!`)
  }

  if (reducers && !isObject(reducers)) {
    throw new Error(`reducers "${reducers}" is invalid, must be an Object!`)
  }

  if (addEffect) {
    if (typeof addEffect !== 'function' || typeof addEffect({}) !== 'function') {
      throw new Error(`addEffect "${addEffect}" is invalid, must be a function that returns a function`)
    } else {
      // create effects handler with initial effects object
      opts.addEffect = addEffect(effects)
    }
  }

  Object.keys(opts).forEach((key) => {
    if (key === 'reducers') {
      options[key] = {
        ...options[key],
        ...opts[key]
      }
    } else if (key === 'middlewares') {
      options[key] = options[key].concat(opts[key] as Middleware[])
    } else {
      options[key] = opts[key]
    }
  })
}
