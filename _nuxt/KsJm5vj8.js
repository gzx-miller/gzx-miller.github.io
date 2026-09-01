import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as o,o as r}from"./DutfXOOr.js";const a=`import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

function App() {
  const [form, setForm] = useState({ name: '', direction: 'frontend' })
  const [submitted, setSubmitted] = useState('')
  const nameError = form.name.trim().length > 0 && form.name.trim().length < 2

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (form.name.trim().length < 2) return
    setSubmitted(\`\${form.name} 已报名 \${form.direction === 'frontend' ? '前端' : '全栈'}方向\`)
  }

  return h('form', { className: 'app', onSubmit: submit },
    h('header', null,
      h('p', { className: 'kicker' }, '受控表单'),
      h('h3', null, '训练营报名'),
    ),
    h('div', { className: 'field' },
      h('label', { htmlFor: 'name' }, '姓名'),
      h('input', { id: 'name', name: 'name', value: form.name, onChange: updateField, placeholder: '至少输入 2 个字' }),
      nameError && h('span', { className: 'error' }, '姓名至少需要 2 个字'),
    ),
    h('div', { className: 'field' },
      h('label', { htmlFor: 'direction' }, '学习方向'),
      h('select', { id: 'direction', name: 'direction', value: form.direction, onChange: updateField },
        h('option', { value: 'frontend' }, '前端'),
        h('option', { value: 'fullstack' }, '全栈'),
      ),
    ),
    h('button', { type: 'submit', disabled: form.name.trim().length < 2 }, '提交报名'),
    submitted && h('p', { className: 'success', role: 'status' }, submitted),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,u=n({__name:"R04ControlledForm",setup(m){return(c,i)=>(r(),t(e,{title:"React 受控表单演示",code:o(a)},null,8,["code"]))}});export{u as default};
