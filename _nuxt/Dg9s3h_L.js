const e=`<script setup lang="ts">
import U10RequestStorage from './U10RequestStorage.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表页每次进来都要白屏一两秒等接口，退出去再进来又是白屏；你想「把上次的数据先显示出来」，可同事在存之前把对象拼进了字符串，写进 <code>uni.setStorageSync</code> 后再读出来，只剩下 <code>"[object Object]"</code>。
    </div>

    <h2>服务器数据与本地缓存</h2>
    <p>
      这里其实有两个需求碰在一起：<strong>数据从服务器来</strong>——异步、可能失败、要带登录态；<strong>页面又希望打开就有内容</strong>——同步、在本地、能持久。最原始的做法是每个页面各写各的。
    </p>
    <p>
      代价是三份重复。第一，<strong>每个请求都要重拼一遍 baseURL、塞 token、写 success 和 fail 两个回调</strong>，回调还会一层套一层。第二，<strong>401 要跳登录、超时要提示</strong>，这些逻辑散落在每个页面，漏改一处，某些接口就不跳登录了。第三，缓存要在多个页面复用，却有人先把对象拼成字符串再 <code>uni.setStorageSync</code>，读回来只剩 <code>"[object Object]"</code>，结构与类型都丢了。
    </p>
    <p>
      问题于是变得很清楚：<strong>请求能不能像普通函数一样 <code>await</code>？缓存又该用什么形态存、有什么边界？</strong>
    </p>

    <h2>回调式请求调用</h2>
    <p>
      先直接用回调式的 <code>uni.request</code>：<code>uni.request({ url, success, fail })</code>，在 <code>success</code> 里给列表赋值。
    </p>
    <p>
      这个方案做对了一件事：<strong>它完成了最核心的那一步——把请求发出去、把结果收回来</strong>。只有一个接口、没有依赖时，这样写完全说得过去。
    </p>

    <h2>嵌套回调与配置重复</h2>
    <ul>
      <li>多个接口有先后依赖时（先拿列表再拿详情），回调一层层嵌套，错误没法统一处理。</li>
      <li>每个调用点都要重复设置 baseURL、header 里的 token、超时时间与失败提示，改一处要改一片。</li>
      <li>登录过期（401）要在每个 <code>success</code> 里判断一次，漏了就成了「有的接口跳登录、有的不跳」。</li>
      <li>缓存对象时若先做字符串拼接，内容会变成 <code>"[object Object]"</code>；<code>uni.setStorageSync</code> 本身支持原生类型和可 JSON 序列化的对象，但 Date 等类型经序列化后不会还原成原对象。</li>
      <li>同步存储在大数据量写入时会阻塞主线程；各平台还有容量上限（微信小程序单个 key 约 1MB、总量约 10MB），超了会直接抛错。</li>
    </ul>

    <h2>异步请求统一封装</h2>
    <p>
      第一层，把回调包成 Promise。写一个函数，内部用 <code>new Promise</code> 包住 <code>uni.request</code>，<code>success</code> 里 <code>resolve(res.data)</code>，<code>fail</code> 里 <code>reject(err)</code>。调用点就能 <code>await request(...)</code>，用 <code>try/catch</code> 统一兜错，有依赖的请求也就变回了顺序代码。
    </p>
    <p>
      第二层，统一出入口。把 baseURL、header、token 的拼接收进这个封装里，调用点只传业务参数（url、method、data）。<strong>于是 token 只在一个地方注入，改动只改一处。</strong>
    </p>
    <p>
      第三层，加上拦截。在封装里做三件对所有接口都生效的事：
    </p>
    <ol class="lesson-steps">
      <li>发请求前统一注入 token 和公共参数。</li>
      <li>拿到响应后按业务约定判断（例如业务码不为 0 就抛错）。</li>
      <li>遇到 401 就清缓存并跳登录。</li>
    </ol>
    <p>
      这几步合起来就是<strong>请求拦截与响应拦截</strong>——同一套规则集中一处，不再散在页面里。
    </p>
    <p>
      第四层，落到本地缓存。登录态、列表快照这类数据用 <code>uni.setStorageSync</code> / <code>getStorageSync</code> 读写。要点只有一个：<strong>它支持原生类型与可 JSON 序列化的对象</strong>，完整对象可以直接存；如果自己做了 <code>JSON.stringify</code>，读取时就要 <code>JSON.parse</code>。Date 等类型经序列化后会丢掉原型，需要在使用处还原。同时记住它有容量上限，别当数据库用，敏感数据也别明文存，登录态最好配一个过期时间。
    </p>
    <p>
      第五层，同步还是异步，以及「先缓存后刷新」。同步 API 写起来顺手，但大数据量下会阻塞 UI，这时换异步的 <code>uni.setStorage</code> / <code>getStorage</code> 更稳。把两者合起来，就能做体验优化：<strong>进入页面先同步读缓存、立刻渲染，再发请求，回来后覆盖</strong>——这正是开场「白屏一两秒」的解药。
    </p>
    <div class="lesson-box hint">
      <strong>还差一步的边界：</strong><code>uni.request</code> 默认超时要按业务显式设 <code>timeout</code>；不同小程序平台对请求域名有白名单要求，跨端上线前记得把后端域名配进各平台后台，否则真机上直接失败。
    </div>

    <h2>缓存先行异步刷新</h2>
    <figure class="lesson-figure">
      <figcaption>先点「加载课程」看 Promise 封装后的请求过程，再点「保存登录态」把 token 写进本地；然后「清空列表」再加载一次，就能看到「先读缓存、再异步刷新」的差别。</figcaption>
      <U10RequestStorage />
    </figure>

    <h2>远端近端数据分流</h2>
    <p>
      请求与缓存处理的是两类数据来源：<strong>远的</strong>交给 Promise 封装后的 <code>uni.request</code>，把 baseURL、token、错误与 401 收进一处；<strong>近的</strong>用本地存储持久化，但要记住它存的是可 JSON 序列化的值、有容量、同步版会阻塞。把「先读缓存、再异步刷新」串起来，页面就不再每次都白屏。
    </p>
    <div class="lesson-term">
      <span class="term-name">「拦截器」</span>在请求真正发出前、以及响应回来后被统一调用的一层钩子：请求拦截器可注入 token、baseURL、公共参数，响应拦截器可统一判业务码、抛错、处理 401 跳登录。边界：<code>uni.request</code> 本身不内置拦截器，需要在 Promise 封装里自行实现；拦截器里抛出的错误要能被调用方 <code>catch</code> 到，否则会变成静默失败。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
