import { Reducer } from './reducers'
import { Effects } from './effects'

export interface Model {
  name: string;
  reducer: Reducer;
}

export type State = {
  [k: string]: any
} | null

export interface ModelReducers {
  [k: string]: (data?: any, getState?: any) => State;
}

export interface ModelObj {
  name: string;
  state?: State;
  reducers?: ModelReducers;
  effects?: Effects;
}
