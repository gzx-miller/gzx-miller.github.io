import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as a,o as l}from"./DutfXOOr.js";const r=`import React, { useRef, forwardRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

const TextInput = forwardRef(function TextInput({ label, ...rest }, ref) {
  return h('div', { className: 'field' },
    h('label', null, label),
    h('input', { ref, ...rest }),
  )
})

function App() {
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const [submitted, setSubmitted] = useState(null)

  function handleSubmit() {
    const name = nameRef.current?.value || ''
    const email = emailRef.current?.value || ''
    if (!name.trim() || !email.trim()) {
      nameRef.current?.focus()
      return
    }
    setSubmitted({ name, email })
  }

  function handleReset() {
    nameRef.current.value = ''
    emailRef.current.value = ''
    nameRef.current?.focus()
    setSubmitted(null)
  }

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'forwardRef'),
      h('h3', null, '跨组件传递 Ref'),
    ),
    h('p', { className: 'muted' }, 'forwardRef 让自定义组件能够将 ref 转发给内部 DOM 节点，使父组件可直接操作底层元素。'),
    h('section', { className: 'panel' },
      h('strong', null, '课程报名表'),
      h(TextInput, { ref: nameRef, label: '姓名', placeholder: '请输入姓名' }),
      h(TextInput, { ref: emailRef, label: '邮箱', placeholder: '请输入邮箱', type: 'email' }),
      h('div', { className: 'toolbar' },
        h('button', { onClick: handleSubmit }, '提交'),
        h('button', { className: 'secondary', onClick: handleReset }, '重置'),
      ),
    ),
    submitted && h('div', { className: 'panel', style: { background: '#eef5f2' } },
      h('strong', null, '报名成功'),
      h('p', { className: 'muted' }, \`姓名：\${submitted.name}\`),
      h('p', { className: 'muted' }, \`邮箱：\${submitted.email}\`),
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,f=n({__name:"R22ForwardRef",setup(o){return(s,c)=>(l(),t(e,{title:"React forwardRef 演示",code:a(r)},null,8,["code"]))}});export{f as default};
