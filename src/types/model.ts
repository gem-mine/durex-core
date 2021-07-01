import { Reducer } from './reducers'
import { Effects } from './effects'

export interface Model {
  name: string;
  reducer: Reducer;
}

export type State = {
  [k: string]: any
} | undefined

export interface ModelReducers {
  setField?: Function;
  resetState?: Function;
  [k: string]: any;
}

export interface ModelObj {
  name: string;
  state?: State;
  reducers?: ModelReducers;
  effects?: Effects;
}
