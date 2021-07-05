import durex from '../src/index'

const { options } = durex

const ADD = 'ADD'
const SUB = 'SUB'

const add = (num) => ({ type: ADD, num })

const sub = (num) => ({ type: SUB, num })

function operator(state = 0, action) {
  switch (action.type) {
    case ADD:
      return state + action.num
    case SUB:
      return state - action.num
    default:
      return state
  }
}

const logger = (store) => (next) => (action) => {
  console.log('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  return result
}

const logger2 = (store) => (next) => (action) => {
  console.log('this is middleware2')
  const result = next(action)
  return result
}

describe('addReducer/addMiddleware 中间件', () => {
  test('addReducer 添加 Reducer', () => {
    const reducer = { operator }
    durex.addReducer(reducer)
    expect(options.reducers).toEqual(reducer)
  })

  test('addMiddleware 添加 middleware', () => {
    durex.addMiddleware(logger)
    expect(options.middlewares).toHaveLength(1)
    expect(options.middlewares[0]).toEqual(logger)
  })
})

test('defaults 配置', () => {
  durex.defaults({
    reducers: { operator },
    middlewares: [logger2]
  })
  expect(options.reducers).toEqual({ operator })
  expect(options.middlewares).toHaveLength(2)
  expect(options.middlewares[1]).toEqual(logger2)
})
