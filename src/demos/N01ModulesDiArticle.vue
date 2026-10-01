<script setup lang="ts">
import N01ModulesDi from './N01ModulesDi.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程控制器里写着 <code>this.courseService = new CourseService()</code>，一开始跑得好好的，可一旦要给 <code>CourseService</code> 换一个测试用的假实现，你就得改遍每一处 <code>new</code>——为什么 NestJS 非要我把依赖写成构造器参数，而不是自己动手创建？
    </div>

    <h2>服务依赖链路</h2>
    <p>
      你在写一个课程管理服务：<code>CourseController</code> 接收请求，交给 <code>CourseService</code> 处理业务，Service 再通过 <code>CourseRepository</code> 访问数据库。最直觉的写法是在控制器里直接 <code>new CourseService()</code>。可当你在另一个模块 <code>UserService</code> 里也要用到课程数据时，同样的 <code>new</code> 又得抄一遍。
    </p>
    <p>
      麻烦会一层层叠加。<code>CourseService</code> 自己依赖 <code>CourseRepository</code>，而 Repository 又需要一条数据库连接——装配一个对象，得先知道它背后整条依赖链怎么拼。<strong>每一次使用的成本，都等于把整条依赖链重新走一遍</strong>。更糟的是单元测试：你想把一个假的 Service 塞进去，却因为它被 <code>new</code> 写死在类里而换不掉。这就是「不引入依赖注入」要付出的代价。
    </p>

    <h2>就地创建对象</h2>
    <p>
      最省事的做法：谁用谁创建。控制器构造函数里直接 <code>new CourseService()</code>，用完即走，不欠人情。
    </p>
    <p>
      这个方案做对了最基础的一件事：<strong>对象确实被造出来了，功能真的能跑</strong>。在一个只有一两个类、依赖只有一层的小脚本里，手动创建完全够用，不必上任何框架。问题只在规模变大之后才浮现——而工程里的代码几乎总会变大。
    </p>

    <h2>重复拼装的代价</h2>
    <ul>
      <li>依赖链一深，每个使用者都要重复拼装。同一段「造 Repository、造 Service」的逻辑会散落在控制器、别的服务、测试代码里。</li>
      <li>想替换实现做不到：测试要用假 Service、生产要用真 Service，可类名被 <code>new</code> 写死，无法在运行时替换。</li>
      <li>生命周期无人统一管理。每次 <code>new</code> 都产生一个新实例，连接池这类昂贵对象会被反复创建，彼此还不共享状态。</li>
      <li>模块边界不可见。「谁依赖谁」只能靠人肉读代码，架构一复杂就成了一团说不清的线。</li>
    </ul>

    <h2>创建与使用解耦</h2>
    <p>
      不推翻「对象需要被创建」这件事，而是把<strong>「创建」和「使用」拆开</strong>：使用方只声明「我需要一个 <code>CourseService</code>」，至于它从哪来、依赖谁、什么时候造，交给一个统一的容器负责。使用方不再伸手去造对象，而是等着对象被<strong>注入</strong>进来——这就是依赖注入（DI）。
    </p>
    <p>
      NestJS 把这层声明做成了显式的模块。<code>@Module</code> 用四个数组把「谁依赖谁」画成一张地图：
    </p>
    <table>
      <thead>
        <tr><th>数组</th><th>职责</th></tr>
      </thead>
      <tbody>
        <tr><td><span class="lesson-kv">controllers</span></td><td>注册路由处理器，接收请求并返回响应。</td></tr>
        <tr><td><span class="lesson-kv">providers</span></td><td>登记可被注入的依赖（服务、仓储等）。</td></tr>
        <tr><td><span class="lesson-kv">imports</span></td><td>引入其它模块，从而获得对方 <code>exports</code> 出来的 Provider。</td></tr>
        <tr><td><span class="lesson-kv">exports</span></td><td>决定哪些 Provider 对模块外部可见，可被其它模块复用。</td></tr>
      </tbody>
    </table>
    <p>
      接着把依赖写成构造器参数：
      <code>constructor(private readonly courseRepo: CourseRepository) {}</code>。启动时，DI 容器扫描每个模块的 <code>providers</code>，读取构造器的参数类型，再递归地去解析 <code>CourseRepository</code> 的依赖，自底向上把整棵依赖树实例化完成后注入进来。使用方从此只声明「要什么」，不再关心「怎么造」。
    </p>
    <p>
      装配是分层的。<strong>根模块 <code>AppModule</code> 通常不做业务，只负责组装</strong>，它 <code>imports</code> 进来 <code>CourseModule</code>、<code>UserModule</code> 这些业务模块。业务模块内部再各自 <code>controllers</code>、<code>providers</code>；当一个模块希望把自己的服务给别人用时，就写进 <code>exports</code>，别的模块 <code>imports</code> 它之后即可注入。
    </p>
    <div class="lesson-box warn">
      <strong>两个最容易踩的坑：</strong>其一，<code>@Injectable()</code> 只是把类<strong>标记为候选</strong>，它还必须出现在某个模块的 <code>providers</code> 里，容器才会真正托管它——只在控制器里注入、却忘了登记，应用启动时会直接抛出 <code>Nest can not resolve dependencies</code>。其二，<code>@Injectable()</code> 与 <code>providers</code> 缺一不可，只写其中一个都不行。
    </div>
    <p>
      还有三个进阶细节值得记住。模块<strong>默认是单例作用域（Singleton）</strong>，整棵依赖树共享同一批实例，这既省去了重复创建，也让连接池这类对象得以复用。若两个模块互相依赖（A 依赖 B、B 又依赖 A），需要 <code>forwardRef</code> 显式处理这个循环。若某个模块的导出希望对所有模块可见，用 <code>@Global()</code> 声明为全局模块，它 <code>exports</code> 的内容就不必被每个模块逐一 <code>imports</code>。
    </p>

    <h2>模块四要素对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换四个模块，看它们的 imports / controllers / providers / exports 分别在管什么。</figcaption>
      <N01ModulesDi />
    </figure>

    <h2>依赖关系显影</h2>
    <p>
      模块与依赖注入，本质是给「谁依赖谁」发一张显式的地图：<code>@Module</code> 的四个数组划清模块边界，构造器注入把「创建对象」的活儿从使用方手里收走、交给容器。代价是你要记住 <code>@Injectable()</code> 与 <code>providers</code> 缺一不可，换来的是可替换、可测试、可复用的对象关系。
    </p>
    <div class="lesson-term">
      <span class="term-name">「依赖注入」</span>指由容器负责创建对象并把依赖注入给使用方，使用方只声明「需要什么」、不管「怎么造」。NestJS 中要注入的类必须同时带 <code>@Injectable()</code> 并登记到某个模块的 <code>providers</code>；容器启动时按构造器参数类型递归解析依赖，默认单例作用域；跨模块复用靠 <code>exports</code> / <code>imports</code>，循环依赖用 <code>forwardRef</code>，全局模块用 <code>@Global()</code>。
    </div>
  </LessonArticle>
</template>
