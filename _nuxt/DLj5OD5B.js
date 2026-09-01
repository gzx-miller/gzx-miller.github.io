import{R as e}from"./Hhvd03iW.js";import{d as n,B as t,y as r,o as a}from"./DutfXOOr.js";const s=`import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { createRoot } from 'react-dom/client'

const h = React.createElement

const SearchInput = forwardRef(function SearchInput(props, ref) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')

  useImperativeHandle(ref, () => ({
    focus() { inputRef.current?.focus() },
    clear() { setQuery(''); inputRef.current?.focus() },
    getValue() { return query },
  }))

  return h('div', { className: 'field' },
    h('label', null, '课程搜索'),
    h('input', {
      ref: inputRef,
      value: query,
      placeholder: '输入课程关键词...',
      onChange: (event) => setQuery(event.target.value),
    }),
  )
})

function App() {
  const searchRef = useRef(null)
  const [lastQuery, setLastQuery] = useState('')

  return h('main', { className: 'app' },
    h('header', null,
      h('p', { className: 'kicker' }, 'useImperativeHandle'),
      h('h3', null, '限定组件暴露的命令式接口'),
    ),
    h('p', { className: 'muted' }, '父组件通过 ref 只能调用子组件显式暴露的方法，而不是整个 DOM 节点。'),
    h(SearchInput, { ref: searchRef }),
    h('div', { className: 'toolbar' },
      h('button', { onClick: () => searchRef.current?.focus() }, '聚焦搜索框'),
      h('button', { className: 'secondary', onClick: () => searchRef.current?.clear() }, '清空并聚焦'),
      h('button', { className: 'secondary', onClick: () => setLastQuery(searchRef.current?.getValue() || '') }, '读取当前值'),
    ),
    lastQuery && h('div', { className: 'panel' },
      h('strong', null, '当前搜索值'),
      h('p', { className: 'muted' }, lastQuery),
    ),
  )
}

createRoot(document.getElementById('root')).render(h(App))
`,p=n({__name:"R21ImperativeHandle",setup(c){return(u,o)=>(a(),t(e,{title:"React useImperativeHandle 演示",code:r(s)},null,8,["code"]))}});export{p as default};
