const e=`<script setup lang="ts">
import N02ControllersRoutes from './N02ControllersRoutes.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我想加一个接口，第一反应是写一个 <code>router.get('/courses', handler)</code>——为什么 NestJS 里却要在类上写 <code>@Controller('courses')</code>、在方法上写 <code>@Get()</code>，还要给参数套一层 <code>@Param()</code>？这些装饰器到底替我省了什么？
    </div>

    <h2>手工注册路由混乱</h2>
    <p>
      你在做一个课程 API，需要五个接口：列表、详情、新建、更新、删除。用最原始的写法，你会一条条注册路由，然后在每个处理函数里手工从 <code>req.query</code>、<code>req.params</code>、<code>req.body</code> 里把数据抠出来，再判断类型、转成数字、拼成响应。<strong>路由声明、参数解析、类型转换、错误处理，四件事全糊在同一个函数里。</strong>
    </p>
    <p>
      当接口从五个长到五十个，这种写法会快速失控：同一个「把 <code>'42'</code> 转成数字」的动作，你要在每个用到 <code>id</code> 的地方重复一遍；一旦规则变了（比如都要限制分页参数），就得挨个函数改。代价不是「写不出来」，而是<strong>每加一个接口，都在复制一遍本应统一的规矩</strong>。
    </p>

    <h2>单函数绑定单路由</h2>
    <p>
      最省事的做法：一个函数处理一个路由，参数就在函数体里手动解析。比如 <code>app.get('/courses/:id', (req, res) =&gt; { const id = Number(req.params.id); ... })</code>，直接、直白、一眼能读懂。
    </p>
    <p>
      它做对了一件根本的事：<strong>把「HTTP 世界」和「业务逻辑」连了起来</strong>。请求怎么进来、参数叫什么名、返回什么，全在这一个函数里说清楚，不需要任何额外概念。接口少的时候，这种写法甚至比声明式更清爽。
    </p>

    <h2>参数解析重复</h2>
    <ul>
      <li>参数解析重复：每个接口都要手写 <code>Number(req.params.id)</code> 之类的转换，规则一改就四处漏改。</li>
      <li>路由和处理器绑死在注册语句里，代码按「注册顺序」散落，看不出一个业务模块到底有哪些接口。</li>
      <li>类型转换、校验、错误响应全靠手写，容易遗漏，一处没做就是一处 bug。</li>
      <li>想给一组接口统一加前缀或统一鉴权，没有统一的组织单位可挂，只能逐条重复。</li>
    </ul>

    <h2>路由与参数装饰器</h2>
    <p>
      不推翻「一个函数处理一个路由」，而是把两件事拆开：<strong>「路由长什么样」用装饰器声明，「请求数据怎么到手」用参数装饰器声明</strong>，函数体里只留业务。NestJS 用 <code>@Controller</code> 加方法装饰器把这两层的拼接规则固定了下来。
    </p>
    <p>
      先看路由怎么拼成一条。类上的 <code>@Controller('courses')</code> 定义<strong>路由前缀</strong>，方法上的 <code>@Get(':id')</code> 定义子路径，两者拼起来才是最终路由。于是 <code>@Controller('courses')</code> 配 <code>@Get(':id')</code>，得到的就是 <code>GET /courses/:id</code>。HTTP 方法也由装饰器绑定：<code>@Get</code>、<code>@Post</code>、<code>@Patch</code>、<code>@Delete</code> 各管一种，不再需要手写方法字符串。
    </p>
    <p>
      再看数据怎么到手。参数装饰器把请求的不同部位映射到方法参数上：
    </p>
    <ul>
      <li><code>@Param('id')</code> 取路径参数，<code>@Query('tag')</code> 取查询字符串。</li>
      <li><code>@Body()</code> 取请求体，通常直接绑定到一个 DTO 类型上。</li>
      <li><code>@Req()</code> / <code>@Res()</code> 直接访问原始的请求、响应对象，用于少数底层场景。</li>
    </ul>
    <p>
      类型转换不必再手写。给参数加上 <code>ParseIntPipe</code>，<code>@Param('id', ParseIntPipe) id: number</code>，框架会就地把字符串 <code>'42'</code> 转成数字 <code>42</code>，转不动就直接报错。控制器里的方法于是变得很干净：拉参数、调服务、返回值，<code>return this.courseService.findOne(id)</code> 的返回值会被框架自动序列化成 JSON。
    </p>
    <div class="lesson-box warn">
      <strong>混用 <code>@Res()</code> 会打破自动响应：</strong>一旦方法注入了原始的 <code>@Res()</code> 响应对象，Nest 就不再自动处理返回值——你必须自己调用 <code>res.json()</code>。若同时又 <code>return</code> 了数据，框架不会替你发送，结果是「响应被发送两次或彻底丢失」。<strong>两种模式只能选其一</strong>，别混用。
    </div>
    <p>
      还有几条组织上的规矩。路由<strong>按声明顺序匹配</strong>，所以通配路由（如 <code>*</code>）要放在具体路由之后，否则会把后面的精确路由提前吃掉。控制器的职责边界要收窄：<strong>它只负责参数绑定与响应，业务逻辑应下沉到 Service</strong>，这样接口层薄、业务层可复用。每个模块的控制器最好有自己的路由前缀，避免与其它模块的路径撞车。
    </p>

    <h2>五处理器签名对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换五个路由，看每个处理器的签名、参数来自哪里、返回什么。</figcaption>
      <N02ControllersRoutes />
    </figure>

    <h2>声明与绑定抽离</h2>
    <p>
      控制器把「路由声明」和「参数绑定」从业务函数里抽出来，交给装饰器统一表达：<code>@Controller</code> 加方法装饰器拼出路由，<code>@Param</code> / <code>@Query</code> / <code>@Body</code> 把请求数据映射成类型安全的参数。控制器保持轻薄，业务下沉到 Service，接口层才能随规模长大而不失控。
    </p>
    <div class="lesson-term">
      <span class="term-name">「控制器与路由」</span>控制器是请求入口：<code>@Controller('courses')</code> 定路由前缀，<code>@Get</code> / <code>@Post</code> 等方法装饰器定 HTTP 方法与子路径，二者拼成最终路由。参数装饰器负责取数——<code>@Param</code> 取路径、<code>@Query</code> 取查询串、<code>@Body</code> 取请求体、<code>@Req</code> / <code>@Res</code> 取原始对象；配合 <code>ParseIntPipe</code> 可就地转换类型。控制器只管绑定与响应，业务下沉到 Service。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
