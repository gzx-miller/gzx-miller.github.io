import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import K38DefineModel from './K38DefineModel.vue'

describe('K38DefineModel', () => {
  it('切换开关时向父组件发出 update:enabled 事件', async () => {
    const wrapper = mount(K38DefineModel, {
      props: { enabled: false, frequency: 1, label: '' },
    })

    await wrapper.get('input[type="checkbox"]').setValue(true)

    expect(wrapper.emitted('update:enabled')?.[0]).toEqual([true])
  })

  it('选择频率时向父组件发出 update:frequency 事件', async () => {
    const wrapper = mount(K38DefineModel, {
      props: { enabled: false, frequency: 1, label: '' },
    })

    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1].setValue(true)

    expect(wrapper.emitted('update:frequency')?.[0]).toEqual([2])
  })

  it('备注输入在启用 trim 修饰符时自动去除首尾空格', async () => {
    const wrapper = mount(K38DefineModel, {
      props: {
        enabled: false,
        frequency: 1,
        label: '',
        labelModifiers: { trim: true },
      },
    })

    await wrapper.get('input[placeholder="给提醒加个备注"]').setValue('  进阶计划  ')

    expect(wrapper.emitted('update:label')?.[0]).toEqual(['进阶计划'])
  })
})