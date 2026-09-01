import{d,b as l,e as t,M as a,f as s,v as m,r as i,o as v}from"./DutfXOOr.js";const p={class:"demo-card"},x={style:{"margin-bottom":"8px"}},f={class:"mini-code"},C=`// Vuex 模块
const store = {
  state: () => ({ items: [], count: 0 }),
  mutations: {
    ADD_ITEM(s, item) {
      s.items.push(item); s.count++
    }
  },
  actions: {
    async addItem({ commit }, item) {
      commit('ADD_ITEM', item)
    }
  }
}
// 使用: dispatch('addItem', course)`,I=`// Pinia Store
const useCart = defineStore('cart', () => {
  const items = ref([])
  const count = ref(0)
  function addItem(item) {
    items.value.push(item)
    count.value++          // 直接修改！
  }
  return { items, count, addItem }
})
// 使用: cart.addItem(course)`,V=d({__name:"S11VuexMigration",setup(_){const n=i("vuex"),o=i(0);function u(){o.value++}function c(){o.value=0}return(b,e)=>(v(),l("div",p,[e[3]||(e[3]=t("h4",null,"🌰 Vuex 到 Pinia 迁移",-1)),t("div",x,[t("button",{onClick:e[0]||(e[0]=r=>n.value="vuex"),class:a({active:n.value==="vuex"})},"Vuex 模式",2),t("button",{onClick:e[1]||(e[1]=r=>n.value="pinia"),class:a({active:n.value==="pinia"})},"Pinia 模式",2)]),t("pre",f,[t("code",null,s(n.value==="vuex"?C:I),1)]),t("p",null,[e[2]||(e[2]=m("购物车数量: ",-1)),t("strong",null,s(o.value),1)]),t("button",{onClick:u},s(n.value==="vuex"?"dispatch('addItem')":"cart.addItem()"),1),t("button",{onClick:c},"重置")]))}});export{V as default};
