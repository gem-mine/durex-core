import creatStore from '../src/store'
import durex, { actions } from '../src/index'
import { getNumber } from './effects.test'

durex.model({
  name: 'demo',
  state: {
    count: 1
  },
  reducers: {
    increase() {
      return this.setField({
        count: (prev) => prev + 1
      })
    }
  }
})
durex.model({
  name: 'demo2',
  state: {
    name: 'Tom',
    score: 0,
  },
  reducers: {
    setScore(score) {
      console.log('demo2/setScore: 获取当前 model 的 state', this.getState())
      return this.setField({ score })
    }
  },
  effects: {
    async getId(_, getState) {
      console.log('demo2/getId: 获取到全局的 store', getState())
      console.log('demo2/getId: 获取当前 model 的 state', this.getState())
      const id = await getNumber()
      this.setField({ id })
    }
  }
})

test('hook 监控', () => {
  durex.hook((action, getState) => {
    console.log(action, getState)
  })
})

test('getState 获取全局的 store，从而获取到其他 model 的信息', () => {
  const store = creatStore()
  expect(store.getState()).toHaveProperty('demo', {
    count: 1
  })
  expect(store.getState()).toHaveProperty('demo2', {
    name: 'Tom',
    score: 0,
  })
})

describe('actions 调用', () => {
  test('通过 actions[name].xxx 调用 reducers / effects', async () => {
    const store = creatStore()
    // reducers
    actions.demo.increase()
    const demoState = store.getState().demo
    expect(demoState.count).toBe(2)

    // effects
    await actions.demo2.getId()
    expect(store.getState().demo2).toHaveProperty('id', 2021)
  })

  test('通过 actions[name].setField 将某个 model 中的 state 进行简单修改', () => {
    const store = creatStore()
    actions.demo.setField({ count: (count) => count + 1 })
    const demoState = store.getState().demo
    expect(demoState.count).toBe(2)
  })

  test('actions[name].resetState 将某个 model 的数据进行重置，恢复到初始状态', () => {
    const store = creatStore()
    actions.demo2.setScore(100)
    expect(store.getState().demo2.score).toBe(100)

    actions.demo2.resetState()
    expect(store.getState().demo2.score).toBe(0)
  })
})
