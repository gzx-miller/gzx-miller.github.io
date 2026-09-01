import{d as v,k as m,b as s,e as a,v as f,F as p,E as u,a0 as g,r as i,o,f as c,I as b}from"./DutfXOOr.js";const _={class:"demo-card"},h={class:"os-info"},x={key:0,class:"loading"},w={key:1,class:"info-grid"},C={class:"info-key"},y={class:"info-value"},P=v({__name:"D28Os",setup(U){const t=i({}),d=i(!0);return m(()=>{t.value={操作系统:navigator.platform||"未知","CPU 架构":navigator.userAgent.includes("x86")?"x86_64":"未知","CPU 核心数":String(navigator.hardwareConcurrency||"未知"),内存大小:(()=>{const n=navigator.deviceMemory;return n?`${n} GB`:"未知"})(),语言:navigator.language||"未知","User Agent":navigator.userAgent.slice(0,80)+"..."},d.value=!1}),(n,e)=>(o(),s("div",_,[e[1]||(e[1]=a("p",null,[a("code",null,"os"),f(" 模块提供操作系统相关信息，用于资源监控、健康检查、平台适配等场景。")],-1)),a("div",h,[e[0]||(e[0]=a("h4",null,"浏览器端可获取的系统信息（模拟）",-1)),d.value?(o(),s("div",x,"加载中...")):(o(),s("div",w,[(o(!0),s(p,null,u(t.value,(l,r)=>(o(),s("div",{key:r,class:"info-item"},[a("span",C,c(r),1),a("span",y,c(l),1)]))),128))]))]),e[2]||(e[2]=g(`<div class="os-node" data-v-16be79fa><h4 data-v-16be79fa>Node.js 中可获取的系统信息</h4><pre class="mini-code" data-v-16be79fa><code data-v-16be79fa>const os = require(&#39;node:os&#39;)

// 平台信息
os.platform()  // &#39;darwin&#39; | &#39;linux&#39; | &#39;win32&#39;
os.arch()      // &#39;x64&#39; | &#39;arm64&#39; | &#39;ia32&#39;

// CPU 信息
os.cpus()      // 返回 CPU 核心详情数组
os.cpus().length  // CPU 核心数

// 内存信息
os.totalmem()  // 总内存（字节）
os.freemem()   // 空闲内存（字节）

// 系统信息
os.hostname()   // 主机名
os.type()       // &#39;Darwin&#39; | &#39;Linux&#39; | &#39;Windows_NT&#39;
os.release()    // 操作系统版本
os.uptime()    // 系统运行时间（秒）

// 网络信息
os.networkInterfaces()  // 网络接口详情

// 家目录
os.homedir()   // 用户家目录
os.tmpdir()    // 临时文件目录</code></pre></div><div class="os-usecases" data-v-16be79fa><h4 data-v-16be79fa>常见使用场景</h4><div class="usecase-list" data-v-16be79fa><div class="usecase-item" data-v-16be79fa><strong data-v-16be79fa>资源监控</strong><p data-v-16be79fa>定时采集 CPU、内存使用率，超出阈值时告警。</p><pre class="mini-code" data-v-16be79fa><code data-v-16be79fa>setInterval(() =&gt; {
  const mem = os.freemem() / os.totalmem()
  if (mem &lt; 0.1) console.warn(&#39;内存不足！&#39;)
}, 5000)</code></pre></div><div class="usecase-item" data-v-16be79fa><strong data-v-16be79fa>平台适配</strong><p data-v-16be79fa>根据操作系统选择不同的命令或路径分隔符。</p><pre class="mini-code" data-v-16be79fa><code data-v-16be79fa>const pathSep = os.platform() === &#39;win32&#39; ? &#39;\\\\\\\\&#39; : &#39;/&#39;
const openCmd = os.platform() === &#39;darwin&#39; ? &#39;open&#39; : &#39;xdg-open&#39;</code></pre></div><div class="usecase-item" data-v-16be79fa><strong data-v-16be79fa>健康检查</strong><p data-v-16be79fa>提供 HTTP 接口返回系统状态，供负载均衡器探测。</p><pre class="mini-code" data-v-16be79fa><code data-v-16be79fa>app.get(&#39;/health&#39;, (req, res) =&gt; {
  res.json({
    uptime: os.uptime(),
    memory: { total: os.totalmem(), free: os.freemem() },
    cpus: os.cpus().length,
  })
})</code></pre></div></div></div><small data-v-16be79fa>要点：<code data-v-16be79fa>os.cpus().length</code> 是设置 cluster 工作进程数的常用依据；<code data-v-16be79fa>os.freemem()</code> 可用于实现内存告警。</small>`,3))]))}}),I=b(P,[["__scopeId","data-v-16be79fa"]]);export{I as default};
