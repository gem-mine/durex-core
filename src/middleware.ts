import { effects } from './effects'
import { hooks, Subscriber } from './hook'
import { Middleware, MiddlewareAPI, Dispatch } from './types/middleware'

const warning: any = () => {
  throw new Error(
    'You are calling "dispatch" or "getState" without applying middleware! '
    + 'Please create your store with middleware first!'
  )
}

// eslint-disable-next-line import/no-mutable-exports
export let dispatch = warning

// eslint-disable-next-line import/no-mutable-exports
export let getState = warning

export const store: MiddlewareAPI = {
  dispatch,
  getState
}

// 只在 store.ts 中被使用
export default function createMiddleware(): Middleware {
  return (middlewareAPI: MiddlewareAPI) => {
    dispatch = middlewareAPI.dispatch
    getState = middlewareAPI.getState
    store.dispatch = dispatch
    store.getState = getState

    return (next: Dispatch) => (action: Dispatch extends Dispatch<infer A> ? A : never) => {
      let effectResult: any
      // 异步的话这里其实只是为了最终能到 reducer，日志中能看到 dispatch，并无实际作用
      const result = next(action)

      // 处理 effects
      if (typeof effects[action.type] === 'function') {
        effectResult = effects[action.type](action.data, getState)
      }

      hooks.forEach((hook: Subscriber) => hook(action, getState))

      return effectResult || result
    }
  }
}
