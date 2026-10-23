const e=`<script setup lang="ts">
import N17Testing from './N17Testing.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把课程接口的 <code>capacity</code> 改名为 <code>seats</code>，单元测试全绿，上线后 e2e 却整片失败。为什么那 24 个跑得飞快的单元测试没有拦住这次字段改名？三种测试到底各该负责什么？
    </div>

    <h2>一次字段改名暴露的分工问题</h2>
    <p>
      单元测试直接调用 <code>CourseService.findOne(42)</code>，断言它返回了对象、抛出了异常，它根本不知道 HTTP 层的字段叫什么。字段改名发生在控制器或 DTO 的序列化边界上，而这条边界从来没有被单元测试覆盖。
    </p>
    <p>
      这说明问题不在「测试写得不够多」，而在<strong>每一层测试验证的东西不一样</strong>。用单元测试去覆盖 HTTP 契约，会写出一堆又慢又脆的用例；只靠 e2e 去覆盖每个分支，则每次改动都要等整条链路启动。测试策略的核心，是让每层只做它最擅长的事。
    </p>

    <h2>测试金字塔的三层职责</h2>
    <p>
      测试金字塔按数量与成本分层：底部是大量快速、隔离的单元测试，中部是少量验证模块装配的集成测试，顶部是极少数走真实链路的 e2e 测试。
    </p>
    <table>
      <thead>
        <tr><th>层级</th><th>启动范围</th><th>替换边界</th><th>主要验证</th><th>速度</th></tr>
      </thead>
      <tbody>
        <tr><td>单元测试</td><td>单个类或 Provider</td><td>所有外部依赖</td><td>分支、边界值、异常路径</td><td>毫秒级</td></tr>
        <tr><td>集成测试</td><td>一个真实模块</td><td>数据库、第三方服务</td><td>依赖注入装配、路由映射、参数传递</td><td>百毫秒到秒级</td></tr>
        <tr><td>e2e 测试</td><td>完整应用</td><td>外部系统与测试数据库</td><td>HTTP 契约、守卫、管道、过滤器组合行为</td><td>秒级</td></tr>
      </tbody>
    </table>
    <p>
      数量应当<strong>自下而上递减</strong>：一个 Service 有十条分支，就该有十条单元测试；而「下单成功后能查到订单」这种跨层流程，一条 e2e 就够，不必为每个分支复制一份 HTTP 请求。
    </p>

    <h2>createTestingModule 与依赖替换</h2>
    <p>
      NestJS 的测试工具用 <code>Test.createTestingModule</code> 建一个独立的 DI 容器：传入与真实模块相同的 <code>providers</code>、<code>controllers</code>，再 <code>compile()</code>，就能得到可用的模块实例。测试里通过 <code>moduleRef.get(CourseService)</code> 取出被测对象。
    </p>
    <p>
      关键是<strong>替换边界依赖</strong>。Nest 提供三种替换方式，按场景选择：
    </p>
    <ul>
      <li><code>useValue</code>：直接给一个现成对象，最适合手工构造的 mock，如 <code>{ findById: async () =&gt; null }</code>。</li>
      <li><code>useClass</code>：用一个假类替换真类，适合需要复用同一套假实现的多个测试。</li>
      <li><code>overrideProvider(CourseRepository).useValue(...)</code>：在 <code>imports</code> 了真实模块之后，覆盖模块内部已经注册的 Provider，集成测试最常用。</li>
    </ul>
    <p>
      只测一个类时，不要 <code>imports</code> 整个业务模块——那会把数据库连接、配置、其它服务全部拉起来。直接把被测类和一个假仓储放进 <code>providers</code>，测试就只依赖它真正需要的东西。
    </p>

    <h2>集成测试与 e2e 的边界</h2>
    <p>
      集成测试<strong>装配真实模块</strong>，验证「容器能不能把依赖接对」。例如 <code>imports: [CourseModule]</code> 之后覆盖掉仓储，再检查 <code>CourseController</code> 能否被解析、路由前缀是否与预期一致。它抓的是单元测试看不见的问题：Provider 漏注册、模块忘记导出、构造器参数顺序写错。
    </p>
    <p>
      e2e 测试再往前走一步：<code>moduleRef.createNestApplication()</code> 启动完整应用，<code>app.init()</code> 之后用 <code>supertest</code> 的 <code>request(app.getHttpServer())</code> 发真实 HTTP 请求。它验证的是<strong>整条链路的组合行为</strong>：路由匹配、守卫放行、管道转换、控制器返回、异常过滤器格式化、序列化字段名。开头那次字段改名，就应该由 e2e 拦下来。
    </p>

    <h2>mock 行为而非实现细节</h2>
    <p>
      测试最容易写坏的地方，是把断言绑在内部实现上：断言仓储的 <code>findById</code> 被调用了一次、断言私有方法按某个顺序执行。这样的测试在重构时必然失败，可生产行为其实没变，团队只能不断改测试，最后干脆不再信任它。
    </p>
    <p>
      更稳的做法是<strong>只断言可观察的行为</strong>：输入什么、返回什么、抛了什么异常、对外部边界产生了什么副作用。例如「课程不存在时抛 <code>NotFoundException</code>」应当断言异常类型与消息，而不是断言仓储调用次数。mock 的返回值也要按真实契约构造，避免测试里返回一个生产环境不可能出现的形状。
    </p>
    <p>
      同理，不要为了测试去暴露私有方法或添加仅测试可用的分支。测试应当通过公开接口驱动代码，这样它验证的是使用者真正依赖的行为。
    </p>

    <h2>测试数据库与事务回滚</h2>
    <p>
      涉及数据库的集成测试和 e2e 测试，需要解决用例之间的数据污染。最常见的做法是每个用例开始前开启事务，结束后回滚：
    </p>
    <ol class="lesson-steps">
      <li>用 <code>dataSource.createQueryRunner()</code> 创建查询运行器，<code>connect()</code> 后 <code>startTransaction()</code>。</li>
      <li>测试中的仓储操作统一使用这个运行器的 <code>manager</code>，所有写入都落在同一事务里。</li>
      <li>用例结束后 <code>rollbackTransaction()</code> 并 <code>release()</code>，数据恢复原状。</li>
      <li>无法共享事务的场景（如 e2e 通过独立连接访问数据库），改用独立测试库，并在每个用例前清空相关表。</li>
    </ol>
    <p>
      事务回滚的前提是「测试代码和应用代码使用同一条连接」。如果 e2e 启动的应用自己建了连接池，事务隔离就失效了，此时应当给测试环境配置独立的数据库，而不是强行共享事务。
    </p>

    <figure class="lesson-figure">
      <figcaption>切换三层测试，查看用例构成、通过率与耗时，并重新运行当前层。</figcaption>
      <N17Testing />
    </figure>

    <div class="lesson-box warn">
      <strong>两个最容易踩的坑：</strong>其一，用 <code>overrideProvider</code> 覆盖了仓储却忘了它只对当前测试模块生效，e2e 启动 <code>AppModule</code> 时仍会连真实数据库；覆盖必须写在创建测试模块的链式调用里。其二，只断言 mock 的调用次数，重构内部实现后测试全红，却没有任何真实行为发生变化——这类测试维护成本高、保护价值低。
    </div>

    <div class="lesson-term">
      <span class="term-name">「测试策略」</span>按测试金字塔分层：单元测试用 <code>Test.createTestingModule</code> 只装配被测类，边界依赖用 <code>useValue</code> / <code>useClass</code> 替换；集成测试 <code>imports</code> 真实模块并用 <code>overrideProvider</code> 替换外部依赖，验证依赖注入装配；e2e 用 <code>createNestApplication</code> 启动完整应用，通过 <code>supertest</code> 打真实 HTTP 链路。断言应针对可观察行为而非实现细节；数据库测试用事务回滚或独立测试库隔离数据。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
