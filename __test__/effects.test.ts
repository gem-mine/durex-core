import { addEffect, effects } from '../src/effects'

export const getNumber = () => new Promise((resolve) => {
  // const number = Math.ceil(Math.random() * 100)
  resolve(2021)
})

test('测试 addEffect 方法', () => {
  const handler = async () => {
    const number = await getNumber()
    console.log(number)
  }
  addEffect(effects)('GET', handler)
  expect(effects.GET).toEqual(handler)
})
