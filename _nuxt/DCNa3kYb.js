import{b as c,e,F as v,E as _,f as o,M as d,v as a,r as l,o as m}from"./DutfXOOr.js";const b={class:"demo-card"},f={class:"toggle-row"},g=["onClick"],w={class:"mini-code"},x={class:"mini-code"},N={__name:"D15Database",setup(k){const r=l("orm"),t=l(!1),u={raw:{label:"原生 SQL",code:`SELECT u.name, c.title
  FROM users u
  JOIN courses c ON c.user_id = u.id
 WHERE c.status = 'active'`},query:{label:"查询构建器",code:`db.table('users')
  .join('courses', 'users.id', 'courses.user_id')
  .where('courses.status', 'active')
  .select('users.name', 'courses.title')`},orm:{label:"ORM",code:`const users = await User.query()
  .withGraphFetched('courses')
  .where('courses.status', 'active')`}},p=l(`// migrations/20240101_create_courses.js
exports.up = (knex) =>
  knex.schema.createTable('courses', (t) => {
    t.increments('id').primary()
    t.string('title').notNullable()
    t.integer('user_id').references('users.id')
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })
exports.down = (knex) =>
  knex.schema.dropTable('courses')`);return(E,s)=>(m(),c("div",b,[s[1]||(s[1]=e("p",null,"数据库访问有三种模式：原生 SQL 灵活高效、查询构建器可链式组合、ORM 提供模型抽象。",-1)),e("div",f,[(m(),c(v,null,_(u,(i,n)=>e("button",{key:n,class:d({active:r.value===n}),onClick:y=>r.value=n},o(i.label),11,g)),64))]),e("pre",w,[e("code",null,o(u[r.value].code),1)]),s[2]||(s[2]=e("hr",null,null,-1)),s[3]||(s[3]=e("strong",null,"迁移工作流",-1)),e("pre",x,[e("code",null,o(p.value),1)]),e("button",{onClick:s[0]||(s[0]=i=>t.value=!t.value)},o(t.value?"回滚 (down)":"执行迁移 (up)"),1),e("p",{class:d(t.value?"test-pass":"test-fail")},o(t.value?"✓ courses 表已创建，包含 id / title / user_id / created_at 字段":"○ courses 表尚未创建"),3),s[4]||(s[4]=e("small",null,[a("迁移文件按时间戳排序，"),e("code",null,"up"),a(" 应用变更、"),e("code",null,"down"),a(" 回滚变更，确保数据库版本可控。")],-1))]))}};export{N as default};
