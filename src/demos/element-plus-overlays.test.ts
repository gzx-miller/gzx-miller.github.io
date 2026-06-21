import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import E04Dialog from './E04Dialog.vue'
import E05Message from './E05Message.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Element Plus 弹层演示', () => {
  it('点击按钮后将对话框渲染到页面中', async () => {
    const wrapper = mount(E04Dialog, { attachTo: document.body })
    const openButton = wrapper.findAll('button').find((button) => button.text() === '基础对话框')

    await openButton?.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.el-dialog')).not.toBeNull()
    expect(document.body.textContent).toContain('欢迎学习')
    wrapper.unmount()
  })

  it('点击成功按钮后显示消息提示', async () => {
    const wrapper = mount(E05Message, { attachTo: document.body })
    const successButton = wrapper.findAll('button').find((button) => button.text() === '成功')

    await successButton?.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.el-message')).not.toBeNull()
    expect(document.body.textContent).toContain('课程创建成功！')
    wrapper.unmount()
  })

  it('点击确认按钮后显示消息对话框', async () => {
    const wrapper = mount(E05Message, { attachTo: document.body })
    const confirmButton = wrapper.findAll('button').find((button) => button.text() === '确认对话框')

    await confirmButton?.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.el-message-box')).not.toBeNull()
    expect(document.body.textContent).toContain('积分提示')
    wrapper.unmount()
  })
})
