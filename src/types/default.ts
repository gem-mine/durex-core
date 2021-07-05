import { Middleware } from './middleware'
import { ReducersMapObject } from './reducers'
import { Effects } from './effects'
import { PreloadedState } from './store'

export { ReducersMapObject }

// 函数重载，暂时解决类型覆盖问题
function addEffect(effects: Effects)
function addEffect(name: any, handler: Function)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addEffect(arg1: Effects | any, arg2?: Function) {
}

export interface Options {
  middlewares: Middleware[];
  reducers: ReducersMapObject;
  initialState: PreloadedState<any>;
  addEffect: (name: any, handler: Function) => void;
}

export interface UserOptions {
  middlewares?: Middleware[];
  reducers?: ReducersMapObject;
  addEffect?: typeof addEffect;
}
