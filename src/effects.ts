// Registry of namespaced effects
import { Effects } from './types/effects'

export const addEffect = (effects: Effects) => (name: any, handler: Function) => {
  effects[name] = handler
}

export const effects: Effects = {}
