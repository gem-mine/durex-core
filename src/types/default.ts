import { Middleware } from './middleware'
import { Reducer, ReducersMapObject } from './reducers'
import { Effects } from './effects'
import { PreloadedState } from './store'

export { ReducersMapObject }

export interface BaseOptions {
  middlewares: Middleware[],
  reducers: ReducersMapObject,
  initialState: PreloadedState<any>
}

// 函数重载，暂时解决类型覆盖问题
function addEffect(effects: Effects)
function addEffect(name: any, handler: Function)
function addEffect(arg1: Effects | any, arg2?: Function) {
}

export interface Options extends BaseOptions {
  addEffect: (name: any, handler: Reducer) => void
}

export interface UserOptions extends BaseOptions {
  addEffect: typeof addEffect
}
