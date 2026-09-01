import{d as v,b as t,e as n,M as i,A as a,f as m,r,o,I as g}from"./DutfXOOr.js";const f={class:"demo-container"},k={class:"dialog-types"},_={class:"demo-buttons"},b={key:0,class:"result"},x={class:"code-block"},y={key:0},D={key:1},w={key:2},C=v({__name:"E08Dialog",setup(h){const l=r(""),e=r("open");function d(){l.value="已选择文件: /Users/xxx/Documents/report.pdf"}function c(){l.value="保存位置: /Users/xxx/Desktop/output.json"}function p(){l.value="用户点击了: OK"}return(S,s)=>(o(),t("div",f,[s[4]||(s[4]=n("h2",null,"🌰 文件对话框",-1)),s[5]||(s[5]=n("p",{class:"desc"},"使用 dialog 模块打开文件选择、保存对话框和消息框。",-1)),n("div",k,[n("button",{class:i({active:e.value==="open"}),onClick:s[0]||(s[0]=u=>e.value="open")},"打开文件",2),n("button",{class:i({active:e.value==="save"}),onClick:s[1]||(s[1]=u=>e.value="save")},"保存文件",2),n("button",{class:i({active:e.value==="message"}),onClick:s[2]||(s[2]=u=>e.value="message")},"消息框",2)]),n("div",_,[e.value==="open"?(o(),t("button",{key:0,class:"btn",onClick:d},"打开文件对话框")):a("",!0),e.value==="save"?(o(),t("button",{key:1,class:"btn",onClick:c},"打开保存对话框")):a("",!0),e.value==="message"?(o(),t("button",{key:2,class:"btn",onClick:p},"显示消息框")):a("",!0)]),l.value?(o(),t("div",b,m(l.value),1)):a("",!0),n("div",x,[s[3]||(s[3]=n("h3",null,"Dialog API 示例",-1)),e.value==="open"?(o(),t("pre",y,`// 打开文件对话框
const result = await dialog.showOpenDialog(mainWindow, {
  title: '选择文件',
  defaultPath: app.getPath('documents'),
  filters: [
    { name: 'JSON', extensions: ['json'] },
    { name: '所有文件', extensions: ['*'] }
  ],
  properties: ['openFile', 'multiSelections']
})

if (!result.canceled) {
  console.log(result.filePaths)
}`)):a("",!0),e.value==="save"?(o(),t("pre",D,`// 保存文件对话框
const result = await dialog.showSaveDialog(mainWindow, {
  title: '保存文件',
  defaultPath: 'output.json',
  filters: [
    { name: 'JSON', extensions: ['json'] }
  ]
})

if (!result.canceled) {
  fs.writeFileSync(result.filePath, data)
}`)):a("",!0),e.value==="message"?(o(),t("pre",w,`// 消息框
const result = await dialog.showMessageBox(mainWindow, {
  type: 'question',
  title: '确认',
  message: '是否保存更改?',
  buttons: ['保存', '不保存', '取消'],
  defaultId: 0,
  cancelId: 2
})

console.log(result.response) // 0, 1, 2`)):a("",!0)])]))}}),I=g(C,[["__scopeId","data-v-bafd4e38"]]);export{I as default};
