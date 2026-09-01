import{d as D,b4 as L,b as u,e as t,f as c,y as n,F as f,E as b,v as Q,A as C,a0 as Z,aZ as j,r as g,g as d,o as i,M as P,I as H}from"./DutfXOOr.js";const J={class:"demo-card"},K={class:"stat-row"},O={class:"stat-card"},U={class:"stat-num"},W={class:"stat-card"},X={class:"stat-num"},Y={class:"stat-card"},tt={class:"stat-num"},et={class:"stat-card cart"},st={class:"stat-num"},ot={class:"filter-tabs"},at=["onClick"],ct={class:"product-grid"},nt={class:"price"},rt=["onClick","disabled"],lt={key:0,class:"cart-box"},ut=["onClick"],dt={class:"cart-total"},it={class:"code-toggle"},pt={key:1,class:"code-block"},vt=D({__name:"S18PiniaGetters",setup(mt){const y=j("shop",()=>{const r=g([{id:1,name:"枫叶红茶",price:28,category:"饮品",stock:50},{id:2,name:"栗子蛋糕",price:38,category:"甜点",stock:20},{id:3,name:"蜂蜜坚果",price:45,category:"零食",stock:35},{id:4,name:"南瓜浓汤",price:32,category:"汤品",stock:15},{id:5,name:"苹果派",price:25,category:"甜点",stock:40},{id:6,name:"肉桂拿铁",price:30,category:"饮品",stock:60},{id:7,name:"烤红薯",price:18,category:"零食",stock:25},{id:8,name:"蘑菇奶油汤",price:28,category:"汤品",stock:10}]),e=g([]),o=d(()=>r.value.length),m=d(()=>r.value.length===0?0:Math.round(r.value.reduce((s,a)=>s+a.price,0)/r.value.length)),h=d(()=>[...new Set(r.value.map(s=>s.category))]),F=d(()=>r.value.filter(s=>s.stock<20)),S=d(()=>e.value.map(s=>{const a=r.value.find(l=>l.id===s.id);return a?{...a,qty:s.qty,subtotal:a.price*s.qty}:null}).filter(s=>s!==null)),M=d(()=>S.value.reduce((s,a)=>s+a.subtotal,0)),N=d(()=>e.value.reduce((s,a)=>s+a.qty,0)),V=d(()=>{const s={};return h.value.forEach(a=>{s[a]=r.value.filter(l=>l.category===a)}),s});function $(s){const a=e.value.find(l=>l.id===s);a?a.qty++:e.value.push({id:s,qty:1})}function R(s){const a=e.value.findIndex(l=>l.id===s);a>-1&&e.value.splice(a,1)}function z(s,a){const l=e.value.find(A=>A.id===s);l&&(l.qty=Math.max(1,a))}return{products:r,cartIds:e,totalProducts:o,averagePrice:m,categories:h,lowStockProducts:F,cartItems:S,cartTotal:M,cartCount:N,productsByCategory:V,addToCart:$,removeFromCart:R,updateQty:z}})(),{products:q,totalProducts:I,averagePrice:w,categories:x,lowStockProducts:G,cartItems:k,cartTotal:T,cartCount:_,productsByCategory:B}=L(y),p=g("全部"),v=g(!1),E=d(()=>p.value==="全部"?q.value:B.value[p.value]||[]);return(r,e)=>(i(),u("div",J,[e[7]||(e[7]=t("h4",null,"🍂 Pinia Getters 与派生状态",-1)),e[8]||(e[8]=t("p",null,"秋日森林小铺 — 演示 Getters 计算派生数据：统计、筛选、分组、购物车金额",-1)),t("div",K,[t("div",O,[t("span",U,c(n(I)),1),e[1]||(e[1]=t("span",{class:"stat-label"},"商品总数",-1))]),t("div",W,[t("span",X,"¥"+c(n(w)),1),e[2]||(e[2]=t("span",{class:"stat-label"},"均价",-1))]),t("div",Y,[t("span",tt,c(n(G).length),1),e[3]||(e[3]=t("span",{class:"stat-label"},"库存告急",-1))]),t("div",et,[t("span",st,c(n(_)),1),e[4]||(e[4]=t("span",{class:"stat-label"},"购物车",-1))])]),t("div",ot,[(i(!0),u(f,null,b(["全部",...n(x)],o=>(i(),u("button",{key:o,class:P({active:p.value===o}),onClick:m=>p.value=o},c(o),11,at))),128))]),t("div",ct,[(i(!0),u(f,null,b(E.value,o=>(i(),u("article",{key:o.id,class:P(["product-card",{low:o.stock<20}])},[t("strong",null,c(o.name),1),t("p",nt,"¥"+c(o.price),1),t("small",null,"分类: "+c(o.category)+" | 库存: "+c(o.stock),1),t("button",{onClick:m=>n(y).addToCart(o.id),disabled:o.stock===0},"加入购物车",8,rt)],2))),128))]),n(k).length?(i(),u("div",lt,[t("h5",null,"🛒 购物车 ("+c(n(_))+"件)",1),t("ul",null,[(i(!0),u(f,null,b(n(k),o=>(i(),u("li",{key:o.id,class:"cart-item"},[t("span",null,c(o.name)+" × "+c(o.qty),1),t("span",null,"¥"+c(o.subtotal),1),t("button",{class:"mini-btn",onClick:m=>n(y).removeFromCart(o.id)},"移除",8,ut)]))),128))]),t("p",dt,[e[5]||(e[5]=Q("合计: ",-1)),t("strong",null,"¥"+c(n(T)),1)])])):C("",!0),t("div",it,[t("button",{onClick:e[0]||(e[0]=o=>v.value=!v.value)},c(v.value?"收起代码":"查看 Store 代码"),1)]),v.value?(i(),u("div",pt,[...e[6]||(e[6]=[t("pre",null,[t("code",null,`// Setup Store 中的 Getters (computed)
const useShopStore = defineStore('shop', () => {
  const products = ref<Product[]>([...])
  const cartIds = ref<{ id: number; qty: number }[]>([])

  // 基础统计
  const totalProducts = computed(() => products.value.length)
  const averagePrice = computed(() => {
    if (products.value.length === 0) return 0
    return Math.round(
      products.value.reduce((sum, p) => sum + p.price, 0) / products.value.length
    )
  })

  // 筛选与分组
  const categories = computed(() =>
    [...new Set(products.value.map(p => p.category))]
  )
  const lowStockProducts = computed(() =>
    products.value.filter(p => p.stock < 20)
  )
  const productsByCategory = computed(() => {
    const map: Record<string, Product[]> = {}
    categories.value.forEach(cat => {
      map[cat] = products.value.filter(p => p.category === cat)
    })
    return map
  })

  // 组合派生
  const cartItems = computed(() =>
    cartIds.value.map(item => {
      const product = products.value.find(p => p.id === item.id)
      return product ? { ...product, qty: item.qty, subtotal: product.price * item.qty } : null
    }).filter(Boolean)
  )
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item: any) => sum + item.subtotal, 0)
  )

  return { products, totalProducts, averagePrice, categories,
           lowStockProducts, cartItems, cartTotal, ... }
})`)],-1)])])):C("",!0),e[9]||(e[9]=Z('<div class="knowledge-points" data-v-cebc9503><h5 data-v-cebc9503>💡 知识点</h5><ul data-v-cebc9503><li data-v-cebc9503><strong data-v-cebc9503>Getters 即 computed</strong>：Setup Store 中直接用 <code data-v-cebc9503>computed()</code> 定义，自动缓存</li><li data-v-cebc9503><strong data-v-cebc9503>组合派生</strong>：Getters 可以引用其他 Getters，形成派生链</li><li data-v-cebc9503><strong data-v-cebc9503>带参数访问</strong>：返回函数的 Getter 可接收参数，但不会缓存</li><li data-v-cebc9503><strong data-v-cebc9503>性能优化</strong>：频繁访问的派生数据优先放 Store 层共享计算结果</li></ul></div>',1))]))}}),ft=H(vt,[["__scopeId","data-v-cebc9503"]]);export{ft as default};
