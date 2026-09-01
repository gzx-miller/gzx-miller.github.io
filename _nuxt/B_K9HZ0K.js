import{d as S,b as n,e,v as c,F as i,E as d,a0 as T,A as r,r as _,o,M as u,f as l,I as y}from"./DutfXOOr.js";const b={class:"demo-card"},k={class:"tabs"},H=["onClick"],L={key:0,class:"step-content"},g={key:1,class:"step-content"},h={class:"cert-list"},E={class:"mini-code"},C={key:2,class:"step-content"},N={key:3,class:"step-content"},P={class:"tls-list"},x={class:"tls-version"},A={class:"tls-note"},w={class:"tls-badge"},D=S({__name:"D23Https",setup(V){const a=_("overview"),p=["overview","create","config","verify"],f=[{name:"自签名证书",desc:"开发环境使用，浏览器会显示不安全警告",cmd:"openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes"},{name:"Let's Encrypt",desc:"生产环境免费证书，需验证域名所有权",cmd:"certbot certonly --standalone -d example.com"},{name:"通配符证书",desc:"支持所有子域名，需 DNS 验证",cmd:"certbot certonly --manual --preferred-challenges dns -d *.example.com"}],m=[{version:"TLS 1.2",secure:!0,note:"推荐最低版本"},{version:"TLS 1.3",secure:!0,note:"推荐，性能更好"},{version:"TLS 1.1",secure:!1,note:"已废弃，不安全"},{version:"TLS 1.0",secure:!1,note:"已废弃，不安全"}];return(j,t)=>(o(),n("div",b,[t[4]||(t[4]=e("p",null,[c("HTTPS 服务器需要 "),e("code",null,"TLS/SSL"),c(" 证书。Node.js 使用 "),e("code",null,"https"),c(" 模块（基于 OpenSSL）提供安全通信。")],-1)),e("div",k,[(o(),n(i,null,d(p,s=>e("button",{key:s,class:u({active:a.value===s}),onClick:v=>a.value=s},l({overview:"概览",create:"创建证书",config:"服务器配置",verify:"安全验证"}[s]),11,H)),64))]),a.value==="overview"?(o(),n("div",L,[...t[0]||(t[0]=[T('<h4 data-v-b923c30f>HTTP vs HTTPS</h4><div class="compare" data-v-b923c30f><div class="col bad" data-v-b923c30f><strong data-v-b923c30f>HTTP</strong><ul data-v-b923c30f><li data-v-b923c30f>明文传输</li><li data-v-b923c30f>易被窃听/篡改</li><li data-v-b923c30f>无服务器身份验证</li></ul></div><div class="col good" data-v-b923c30f><strong data-v-b923c30f>HTTPS</strong><ul data-v-b923c30f><li data-v-b923c30f>加密传输（TLS）</li><li data-v-b923c30f>防窃听/中间人攻击</li><li data-v-b923c30f>证书验证服务器身份</li></ul></div></div>',2)])])):r("",!0),a.value==="create"?(o(),n("div",g,[t[1]||(t[1]=e("h4",null,"获取证书的方式",-1)),e("div",h,[(o(),n(i,null,d(f,(s,v)=>e("div",{key:v,class:"cert-item"},[e("strong",null,l(s.name),1),e("p",null,l(s.desc),1),e("pre",E,[e("code",null,l(s.cmd),1)])])),64))])])):r("",!0),a.value==="config"?(o(),n("div",C,[...t[2]||(t[2]=[e("h4",null,"Node.js HTTPS 服务器配置",-1),e("pre",{class:"mini-code"},[e("code",null,`const https = require('node:https')
const fs = require('node:fs')

const options = {
  key: fs.readFileSync('key.pem'),   // 私钥
  cert: fs.readFileSync('cert.pem'),  // 证书
  minVersion: 'TLSv1.2',             // 最低 TLS 版本
  ciphers: [                          // 加密套件优先级
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256',
  ].join(':'),
}

const server = https.createServer(options, (req, res) => {
  res.writeHead(200)
  res.end('Hello HTTPS!')
})
server.listen(443)`)],-1)])])):r("",!0),a.value==="verify"?(o(),n("div",N,[t[3]||(t[3]=e("h4",null,"TLS 版本安全性",-1)),e("div",P,[(o(),n(i,null,d(m,s=>e("div",{key:s.version,class:u("tls-item "+(s.secure?"secure":"insecure"))},[e("span",x,l(s.version),1),e("span",A,l(s.note),1),e("span",w,l(s.secure?"✓ 安全":"✗ 不安全"),1)],2)),64))])])):r("",!0),t[5]||(t[5]=e("small",null,"要点：生产环境务必使用 HTTPS；Let's Encrypt 提供免费自动续期证书；Node.js 18+ 支持自动读取证书而无需手动配置。",-1))]))}}),F=y(D,[["__scopeId","data-v-b923c30f"]]);export{F as default};
