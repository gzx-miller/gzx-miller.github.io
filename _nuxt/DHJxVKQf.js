import{d as f,b as r,e,v as o,K as i,L as m,a1 as y,F as g,E as x,f as d,A as _,a0 as w,r as n,g as C,o as l,I as S}from"./DutfXOOr.js";const H={class:"demo-card"},k={class:"crypto-controls"},B=["value"],V={key:0,class:"hash-result"},q={class:"hash-label"},E={class:"hash-value"},N=f({__name:"D21Crypto",setup(A){const c=n("Hello 栗子🌰"),s=n("sha256"),p=n(!1),b=["sha256","md5","sha1","sha512"],u=C(()=>({md5:"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d (16 字节, 128 位)",sha1:"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d (20 字节, 160 位)",sha256:"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2 (32 字节, 256 位)",sha512:"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2 (64 字节, 512 位)"}));function h(){p.value=!0}return(v,a)=>(l(),r("div",H,[a[4]||(a[4]=e("p",null,[o("Node.js "),e("code",null,"crypto"),o(" 模块提供加密功能：哈希、HMAC、对称/非对称加密、签名等。")],-1)),e("div",k,[e("label",null,[a[2]||(a[2]=o("输入内容 ",-1)),i(e("input",{"onUpdate:modelValue":a[0]||(a[0]=t=>c.value=t),placeholder:"输入要哈希的内容"},null,512),[[m,c.value]])]),e("label",null,[a[3]||(a[3]=o("算法 ",-1)),i(e("select",{"onUpdate:modelValue":a[1]||(a[1]=t=>s.value=t)},[(l(),r(g,null,x(b,t=>e("option",{key:t,value:t},d(t),9,B)),64))],512),[[y,s.value]])]),e("button",{onClick:h},"计算哈希")]),p.value?(l(),r("div",V,[e("div",q,'crypto.createHash("'+d(s.value)+'").update("'+d(c.value)+'").digest("hex")',1),e("pre",E,d(u.value[s.value]),1)])):_("",!0),a[5]||(a[5]=w(`<div class="crypto-demos" data-v-33aba230><div class="crypto-item" data-v-33aba230><strong data-v-33aba230>密码存储（推荐 bcrypt/scrypt）</strong><pre class="mini-code" data-v-33aba230><code data-v-33aba230>// 不要直接存储密码哈希！
// 使用 bcrypt 处理盐值和成本因子
const bcrypt = require(&#39;bcrypt&#39;)
const hash = await bcrypt.hash(password, 12) // 12 轮盐值</code></pre></div><div class="crypto-item" data-v-33aba230><strong data-v-33aba230>HMAC 签名（防篡改）</strong><pre class="mini-code" data-v-33aba230><code data-v-33aba230>const crypto = require(&#39;node:crypto&#39;)
const hmac = crypto.createHmac(&#39;sha256&#39;, secret)
hmac.update(payload)
const signature = hmac.digest(&#39;hex&#39;)</code></pre></div><div class="crypto-item" data-v-33aba230><strong data-v-33aba230>AES-256 加密</strong><pre class="mini-code" data-v-33aba230><code data-v-33aba230>const cipher = crypto.createCipher(&#39;aes-256-gcm&#39;, key)
let encrypted = cipher.update(data, &#39;utf8&#39;, &#39;hex&#39;)
encrypted += cipher.final(&#39;hex&#39;)</code></pre></div></div><pre class="mini-code" data-v-33aba230><code data-v-33aba230>// 完整示例：验证密码
const crypto = require(&#39;node:crypto&#39;)

function hashPassword(password, salt = crypto.randomBytes(16).toString(&#39;hex&#39;)) {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, &#39;sha512&#39;).toString(&#39;hex&#39;)
  return { salt, hash }
}

function verifyPassword(password, storedHash, salt) {
  const { hash } = hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(hash, &#39;hex&#39;), Buffer.from(storedHash, &#39;hex&#39;))
}</code></pre><small data-v-33aba230>要点：使用 <code data-v-33aba230>crypto.timingSafeEqual()</code> 防止时序攻击；生产环境推荐使用 <code data-v-33aba230>bcrypt</code> 或 <code data-v-33aba230>scrypt</code> 处理密码。</small>`,3))]))}}),M=S(N,[["__scopeId","data-v-33aba230"]]);export{M as default};
