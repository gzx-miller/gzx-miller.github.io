import{d as p,b as i,e as s,v as o,K as u,L as v,f as l,F as g,E as _,r as f,g as b,o as d,I as C}from"./DutfXOOr.js";const I={class:"demo-card"},k={class:"cli-input"},L={class:"parse-result"},x={class:"mini-code"},y={class:"lib-compare"},j={class:"lib-list"},B={class:"lib-name"},D={class:"lib-stars"},N={class:"lib-desc"},V=p({__name:"D24Cli",setup(h){const r=f("--name 栗子 --age 3 --verbose"),c=b(()=>{const t=r.value.trim().split(/\s+/).filter(Boolean),e={};let n=0;for(;n<t.length;)if(t[n].startsWith("--")){const a=t[n].slice(2);n+1<t.length&&!t[n+1].startsWith("--")?(e[a]=t[n+1],n+=2):(e[a]=!0,n+=1)}else n+=1;return e}),m=[{name:"commander",stars:"12.8k",desc:"最流行的 CLI 框架，Express 风格 API"},{name:"yargs",stars:"8.5k",desc:"功能全面，支持命令组、补全、国际化"},{name:"minimist",stars:"2.1k",desc:"轻量级参数解析，无依赖"},{name:"cac",stars:"1.2k",desc:"Vue CLI 使用的轻量 CLI 框架"}];return(t,e)=>(d(),i("div",I,[e[4]||(e[4]=s("p",null,[o("Node.js CLI 工具需要解析命令行参数。"),s("code",null,"process.argv"),o(" 提供原始参数，但实际项目使用 "),s("code",null,"commander"),o(" 等库。")],-1)),s("div",k,[e[1]||(e[1]=s("label",null,[o("模拟命令行输入 "),s("code",null,"node cli.js")],-1)),u(s("input",{"onUpdate:modelValue":e[0]||(e[0]=n=>r.value=n),placeholder:"--name 栗子 --age 3 --verbose"},null,512),[[v,r.value]])]),s("div",L,[e[2]||(e[2]=s("strong",null,"解析结果：",-1)),s("pre",x,[s("code",null,"process.argv = ['node', 'cli.js', ${inputArgs.split(' ').map(a => `'${a}'`).join(', ')}]\n→ 解析为：\n"+l(JSON.stringify(c.value,null,2)),1)])]),s("div",y,[e[3]||(e[3]=s("strong",null,"常用 CLI 库对比：",-1)),s("div",j,[(d(),i(g,null,_(m,n=>s("div",{key:n.name,class:"lib-item"},[s("div",B,[o(l(n.name)+" ",1),s("span",D,"★ "+l(n.stars),1)]),s("div",N,l(n.desc),1)])),64))])]),e[5]||(e[5]=s("pre",{class:"mini-code"},[s("code",null,`// 使用 commander 构建 CLI 工具
const { program } = require('commander')

program
  .name('my-cli')
  .description('我的命令行工具')
  .version('1.0.0')

program.command('greet <name>')
  .description('问候某人')
  .option('-v, --verbose', '详细输出')
  .action((name, options) => {
    console.log(\\\`Hello \\\${name}!\\\`)
    if (options.verbose) console.log('(详细模式)')
  })

program.parse()`)],-1)),e[6]||(e[6]=s("small",null,[o("要点："),s("code",null,"process.argv[0]"),o(" 是 node 路径，"),s("code",null,"process.argv[1]"),o(" 是脚本路径，实际参数从 "),s("code",null,"process.argv[2]"),o(" 开始。")],-1))]))}}),E=C(V,[["__scopeId","data-v-43a551ff"]]);export{E as default};
