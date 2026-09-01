import{d as x,b as d,e,v as p,K as m,a1 as _,F as z,E as f,L as S,f as n,r as g,g as T,o as c,M as k,I as w}from"./DutfXOOr.js";const B={class:"demo-card"},h={class:"zlib-controls"},q=["value"],C={class:"compress-result"},D={class:"result-row"},E={class:"result-row"},G={class:"result-row"},H={class:"saved"},P={class:"method-compare"},M=["onClick"],R={class:"ext"},V=x({__name:"D27Zlib",setup(y){const a=g("Hello 栗子🌰".repeat(100)),o=g("gzip"),i=T(()=>{const l=new Blob([a.value]).size,s={gzip:.35,deflate:.33,brotli:.25}[o.value],r=Math.floor(l*s),v=l-r,b=(v/l*100).toFixed(1);return{originalSize:l,compressedSize:r,saved:v,savedPercent:b,ratio:s}}),u=[{id:"gzip",name:"Gzip",ext:".gz",note:"最常用，兼容性最好"},{id:"deflate",name:"Deflate",ext:".deflate",note:"比 Gzip 稍快，压缩率略高"},{id:"brotli",name:"Brotli",ext:".br",note:"现代算法，压缩率最高（需 HTTPS）"}];return(l,t)=>(c(),d("div",B,[t[6]||(t[6]=e("p",null,[e("code",null,"zlib"),p(" 模块提供压缩/解压功能，用于减少网络传输大小和文件存储体积。")],-1)),e("div",h,[e("label",null,[t[2]||(t[2]=p("压缩方法 ",-1)),m(e("select",{"onUpdate:modelValue":t[0]||(t[0]=s=>o.value=s)},[(c(),d(z,null,f(u,s=>e("option",{key:s.id,value:s.id},n(s.name),9,q)),64))],512),[[_,o.value]])]),e("label",null,[t[3]||(t[3]=p("模拟文本 ",-1)),m(e("input",{"onUpdate:modelValue":t[1]||(t[1]=s=>a.value=s),placeholder:"输入要压缩的文本"},null,512),[[S,a.value]])])]),e("div",C,[e("div",D,[t[4]||(t[4]=e("span",null,"原始大小",-1)),e("strong",null,n(i.value.originalSize)+" 字节",1)]),e("div",E,[e("span",null,"压缩后大小（"+n(o.value)+"）",1),e("strong",null,n(i.value.compressedSize)+" 字节",1)]),e("div",G,[t[5]||(t[5]=e("span",null,"节省空间",-1)),e("strong",H,n(i.value.saved)+" 字节（"+n(i.value.savedPercent)+"%）",1)])]),e("div",P,[(c(),d(z,null,f(u,s=>e("div",{key:s.id,class:k("method-item "+(o.value===s.id?"active":"")),onClick:r=>o.value=s.id},[e("strong",null,n(s.name),1),e("span",R,n(s.ext),1),e("p",null,n(s.note),1)],10,M)),64))]),t[7]||(t[7]=e("pre",{class:"mini-code"},[e("code",null,`const zlib = require('node:zlib')
const fs = require('node:fs')

// 压缩文件
const input = fs.createReadStream('input.txt')
const output = fs.createWriteStream('input.txt.gz')
input.pipe(zlib.createGzip()).pipe(output)

// 解压
const compressed = fs.createReadStream('input.txt.gz')
const decompressed = fs.createWriteStream('output.txt')
compressed.pipe(zlib.createGunzip()).pipe(decompressed)

// HTTP 响应压缩
const http = require('node:http')
const server = http.createServer((req, res) => {
  const acceptEncoding = req.headers['accept-encoding']
  if (acceptEncoding?.includes('gzip')) {
    res.writeHead(200, { 'Content-Encoding': 'gzip' })
    fs.createReadStream('data.txt').pipe(zlib.createGzip()).pipe(res)
  } else {
    fs.createReadStream('data.txt').pipe(res)
  }
})`)],-1)),t[8]||(t[8]=e("small",null,"要点：HTTP 响应压缩是 zlib 最常见的用途；Brotli 压缩率最高但压缩速度较慢；Node.js 18+ 支持流式压缩，内存占用小。",-1))]))}}),N=w(V,[["__scopeId","data-v-78b8e963"]]);export{N as default};
