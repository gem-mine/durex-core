import { Store, PreloadedState, StoreEnhancer } from 'redux'

export { Store, PreloadedState, StoreEnhancer }

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}
