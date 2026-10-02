import{d as A,b4 as D,b as d,e as t,f as n,y as r,K as y,L as k,v as K,A as C,a0 as Q,aZ as Z,r as g,g as u,o as i,M as P,F as j}from"./CfJSWYGO.js";const H={class:"demo-card"},J={class:"stat-row"},O={class:"stat-card"},U={class:"stat-num"},W={class:"stat-card"},X={class:"stat-num"},Y={class:"stat-card"},tt={class:"stat-num"},et={class:"stat-card cart"},st={class:"stat-num"},ot={class:"filter-tabs"},at=["onClick"],nt={class:"product-grid"},rt={class:"price"},ct=["onClick","disabled"],lt={key:0,class:"cart-box"},dt=["onClick"],ut={class:"cart-total"},it={class:"code-toggle"},pt={key:1,class:"code-block"},vt=A({__name:"S18PiniaGetters",setup(mt){const f=Z("shop",()=>{const c=g([{id:1,name:"枫叶红茶",price:28,category:"饮品",stock:50},{id:2,name:"栗子蛋糕",price:38,category:"甜点",stock:20},{id:3,name:"蜂蜜坚果",price:45,category:"零食",stock:35},{id:4,name:"南瓜浓汤",price:32,category:"汤品",stock:15},{id:5,name:"苹果派",price:25,category:"甜点",stock:40},{id:6,name:"肉桂拿铁",price:30,category:"饮品",stock:60},{id:7,name:"烤红薯",price:18,category:"零食",stock:25},{id:8,name:"蘑菇奶油汤",price:28,category:"汤品",stock:10}]),e=g([]),o=u(()=>c.value.length),m=u(()=>c.value.length===0?0:Math.round(c.value.reduce((s,a)=>s+a.price,0)/c.value.length)),S=u(()=>[...new Set(c.value.map(s=>s.category))]),M=u(()=>c.value.filter(s=>s.stock<20)),b=u(()=>e.value.map(s=>{const a=c.value.find(l=>l.id===s.id);return a?{...a,qty:s.qty,subtotal:a.price*s.qty}:null}).filter(s=>s!==null)),N=u(()=>b.value.reduce((s,a)=>s+a.subtotal,0)),V=u(()=>e.value.reduce((s,a)=>s+a.qty,0)),$=u(()=>{const s={};return S.value.forEach(a=>{s[a]=c.value.filter(l=>l.category===a)}),s});function E(s){const a=e.value.find(l=>l.id===s);a?a.qty++:e.value.push({id:s,qty:1})}function L(s){const a=e.value.findIndex(l=>l.id===s);a>-1&&e.value.splice(a,1)}function R(s,a){const l=e.value.find(z=>z.id===s);l&&(l.qty=Math.max(1,a))}return{products:c,cartIds:e,totalProducts:o,averagePrice:m,categories:S,lowStockProducts:M,cartItems:b,cartTotal:N,cartCount:V,productsByCategory:$,addToCart:E,removeFromCart:L,updateQty:R}})(),{products:q,totalProducts:w,averagePrice:I,categories:x,lowStockProducts:G,cartItems:_,cartTotal:T,cartCount:h,productsByCategory:B}=D(f),p=g("全部"),v=g(!1),F=u(()=>p.value==="全部"?q.value:B.value[p.value]||[]);return(c,e)=>(i(),d("div",H,[e[7]||(e[7]=t("h4",null,"🍂 Pinia Getters 与派生状态",-1)),e[8]||(e[8]=t("p",null,"秋日森林小铺 — 演示 Getters 计算派生数据：统计、筛选、分组、购物车金额",-1)),t("div",J,[t("div",O,[t("span",U,n(r(w)),1),e[1]||(e[1]=t("span",{class:"stat-label"},"商品总数",-1))]),t("div",W,[t("span",X,"¥"+n(r(I)),1),e[2]||(e[2]=t("span",{class:"stat-label"},"均价",-1))]),t("div",Y,[t("span",tt,n(r(G).length),1),e[3]||(e[3]=t("span",{class:"stat-label"},"库存告急",-1))]),t("div",et,[t("span",st,n(r(h)),1),e[4]||(e[4]=t("span",{class:"stat-label"},"购物车",-1))])]),t("div",ot,[(i(!0),d(y,null,k(["全部",...r(x)],o=>(i(),d("button",{key:o,class:P({active:p.value===o}),onClick:m=>p.value=o},n(o),11,at))),128))]),t("div",nt,[(i(!0),d(y,null,k(F.value,o=>(i(),d("article",{key:o.id,class:P(["product-card",{low:o.stock<20}])},[t("strong",null,n(o.name),1),t("p",rt,"¥"+n(o.price),1),t("small",null,"分类: "+n(o.category)+" | 库存: "+n(o.stock),1),t("button",{onClick:m=>r(f).addToCart(o.id),disabled:o.stock===0},"加入购物车",8,ct)],2))),128))]),r(_).length?(i(),d("div",lt,[t("h5",null,"🛒 购物车 ("+n(r(h))+"件)",1),t("ul",null,[(i(!0),d(y,null,k(r(_),o=>(i(),d("li",{key:o.id,class:"cart-item"},[t("span",null,n(o.name)+" × "+n(o.qty),1),t("span",null,"¥"+n(o.subtotal),1),t("button",{class:"mini-btn",onClick:m=>r(f).removeFromCart(o.id)},"移除",8,dt)]))),128))]),t("p",ut,[e[5]||(e[5]=K("合计: ",-1)),t("strong",null,"¥"+n(r(T)),1)])])):C("",!0),t("div",it,[t("button",{onClick:e[0]||(e[0]=o=>v.value=!v.value)},n(v.value?"收起代码":"查看 Store 代码"),1)]),v.value?(i(),d("div",pt,[...e[6]||(e[6]=[t("pre",null,[t("code",null,`// Setup Store 中的 Getters (computed)
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
})`)],-1)])])):C("",!0),e[9]||(e[9]=Q('<div class="knowledge-points" data-v-62a90f2d><h5 data-v-62a90f2d>💡 知识点</h5><ul data-v-62a90f2d><li data-v-62a90f2d><strong data-v-62a90f2d>Getters 即 computed</strong>：Setup Store 中直接用 <code data-v-62a90f2d>computed()</code> 定义，自动缓存</li><li data-v-62a90f2d><strong data-v-62a90f2d>组合派生</strong>：Getters 可以引用其他 Getters，形成派生链</li><li data-v-62a90f2d><strong data-v-62a90f2d>带参数访问</strong>：返回函数的 Getter 可接收参数，但不会缓存</li><li data-v-62a90f2d><strong data-v-62a90f2d>性能优化</strong>：频繁访问的派生数据优先放 Store 层共享计算结果</li></ul></div>',1))]))}}),yt=j(vt,[["__scopeId","data-v-62a90f2d"]]);export{yt as default};
