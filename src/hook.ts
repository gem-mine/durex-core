import { Dispatch } from './types/middleware'

export type Subscriber = (
  action?: Dispatch extends Dispatch<infer A> ? A : never,
  getState?: Function
) => void

export const hooks: Subscriber[] = []

export default function hook(subscriber: Subscriber): () => void {
  if (typeof subscriber !== 'function') {
    throw new Error('Invalid hook, must be a function!')
  }

  hooks.push(subscriber)

  return () => {
    hooks.splice(hooks.indexOf(subscriber), 1)
  }
}
