<script setup lang="ts">
import N03PipesValidation from './N03PipesValidation.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>报名接口的请求体里多塞了一个 <code>role: 'admin'</code> 字段，代码里没写它、也没校验它，它却一路透传到了业务逻辑——为什么框架不替我拦住这个「多出来的字段」？
    </div>

    <h2>提出问题</h2>
    <p>
      课程报名接口收到一份表单：姓名、邮箱、年龄、课程 ID。任何一条不合规，都不该进入业务逻辑——姓名不能为空、邮箱要有格式、年龄得在 18 到 99 之间、课程 ID 必须是合法的 UUID。
    </p>
    <p>
      如果在控制器里逐条 <code>if</code> 判断，会立刻遇到两个麻烦。第一是<strong>重复</strong>：同一个「邮箱格式」的规则，注册接口、报名接口、找回密码接口都要再写一遍，改一次漏一处。第二是<strong>穿透</strong>：请求体是个普通对象，前端多传一个业务没声明的字段，它会被原样带进后续流程。<strong>校验不只是「检查对错」，更是决定「哪些数据被允许进入系统」。</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：在控制器方法开头写一串 <code>if</code>。<code>if (!dto.name) throw new BadRequestException('姓名不能为空')</code>，一条条往下判，最后再调 Service。
    </p>
    <p>
      它做对了一件事：<strong>把「非法数据」挡在了业务逻辑之外</strong>。数据对不对、能不能进，在一个地方就说清了，不靠调用方自觉。接口只有一两个、规则只有两三条时，这种方式完全够用。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>规则散落在每个控制器里，同一个字段的规则被反复抄写，改一处就得同步改多处。</li>
      <li>校验与业务逻辑混在同一个函数里，控制器的核心业务被一堆 <code>if</code> 淹没。</li>
      <li>类型转换还得手写：<code>age</code> 从 JSON 到代码里可能是字符串，不显式转成数字就会带着错误类型往下走。</li>
      <li>请求体里的<strong>多余字段无人拦截</strong>，前端多传的参数会被静默带进业务，形成隐式的越权入口。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「先把非法数据挡在门外」，而是把<strong>规则从代码里挪到数据结构上</strong>。先定义一个 DTO（数据传输对象），用装饰器把每个字段的规则写在字段旁边：
    </p>
    <ul>
      <li><code>@IsNotEmpty</code> 保证姓名非空，<code>@MaxLength(20)</code> 限制长度。</li>
      <li><code>@IsEmail</code> 校验邮箱格式。</li>
      <li><code>@IsInt</code>、<code>@Min(18)</code>、<code>@Max(99)</code> 约束年龄是整数且落在区间内。</li>
      <li><code>@IsUUID('4')</code> 要求课程 ID 是合法的 UUID。</li>
    </ul>
    <p>
      规则写在 DTO 上，就<strong>与具体的控制器解耦了</strong>：同一份 <code>CreateEnrollmentDto</code> 可以被多个接口复用，改规则只改一处，所有引用它的地方一起生效。
    </p>
    <p>
      接着让框架去执行这份规则。管道（Pipe）在数据进入处理器之前执行，负责转换与校验。全局启用 <code>ValidationPipe</code> 后，整个流程变成：
    </p>
    <ol class="lesson-steps">
      <li>请求体 JSON 到达 <code>POST /enrollments</code>。</li>
      <li><code>ValidationPipe</code> 先把这个普通对象<strong>实例化</strong>成 <code>CreateEnrollmentDto</code> 类的实例（背后是 class-transformer）。</li>
      <li>class-validator 按装饰器规则逐字段校验，任一规则失败即中断。</li>
      <li>失败则返回 <code>400</code>，响应里的 <code>message</code> 数组<strong>一次性列出全部字段的失败原因</strong>；成功才进入控制器。</li>
    </ol>
    <p>
      这套机制真正改变的是「规矩放在哪里」。过去规矩活在控制器的 <code>if</code> 里，只有写它的人知道；现在规矩写在 DTO 上，<strong>DTO 就成了接口对外的契约</strong>——请求体长什么样、每个字段有什么要求，一眼可见。校验发生在「数据刚进来」这一层，下游的业务、持久化都不必再重复防守，因为它们拿到的已经是一个通过了契约的数据。
    </p>
    <p>
      顺带一提，管道不只服务 DTO。<code>ParseIntPipe</code>、<code>ParseUUIDPipe</code> 这类内置管道可以直接挂在某个参数上，把 <code>GET /courses/42</code> 里的字符串就地转成数字、或校验它是合法的 UUID，和 <code>ValidationPipe</code> 用的是同一套「进入处理器前先处理数据」的思路。
    </p>
    <p>
      开关还有几档调节。<code>whitelist: true</code> 会<strong>自动剥离</strong> DTO 里没有声明的多余字段，这正是拦住开头那个 <code>role: 'admin'</code> 的关键。与之配套的 <code>forbidNonWhitelisted: true</code> 更进一步，遇到多余字段直接判为 <code>400</code>，而不是静默丢弃——生产加固通常两个一起开。<code>transform: true</code> 则会让 <code>age</code> 这类数字字符串自动转成目标类型。若内置规则不够用，还可以用 <code>@Validate(ConstraintClass)</code> 或自定义装饰器扩展校验逻辑。
    </p>
    <div class="lesson-box warn">
      <strong>白名单不是可选项：</strong>未启用 <code>whitelist</code> 时，请求体里多余的字段会被原样透传到业务代码——前端传一个 <code>role: 'admin'</code>，就可能被写进用户记录，形成隐式的<strong>越权风险</strong>。DTO 校验必须配合白名单，校验的是「值对不对」，白名单防的是「字段该不该存在」。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>填表单并提交，试试留空姓名、填非法邮箱或年龄 12，看 ValidationPipe 返回的 400 结构。</figcaption>
      <N03PipesValidation />
    </figure>

    <h2>总结</h2>
    <p>
      管道把「校验」从控制器代码里搬到了数据结构的定义上：用 DTO 加装饰器声明规则，用 <code>ValidationPipe</code> 在数据进入处理器前统一执行，规则得以复用、错误响应格式统一。再配上 <code>whitelist</code> 拦截多余字段，非法数据和越权字段就都进不来。
    </p>
    <div class="lesson-term">
      <span class="term-name">「管道与数据校验」</span>管道（Pipe）在数据进入处理器前执行，负责<strong>转换</strong>与<strong>校验</strong>。<code>ValidationPipe</code> 基于 class-transformer 与 class-validator：先把请求体实例化为 DTO 类，再按 <code>@IsEmail</code> / <code>@Min</code> / <code>@IsUUID</code> 等装饰器规则逐字段校验，失败即返回 <code>400</code> 并附 <code>message</code> 数组。<code>whitelist</code> 剥离 DTO 未声明的多余字段，<code>forbidNonWhitelisted</code> 直接判 400，<code>transform: true</code> 自动转换类型。
    </div>
  </LessonArticle>
</template>
