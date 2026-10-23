const n=`<script setup lang="ts">
import N18OpenApi from './N18OpenApi.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>前端照着接口文档联调，后端把课程等级从字符串改成枚举，顺手删了一个字段，文档却还停在三个月前。等联调报错时，双方才发现「文档」和「代码」从来不是同一份东西——能不能让接口契约直接从代码里长出来？
    </div>

    <h2>文档与代码的两次演化</h2>
    <p>
      手写文档的问题不是「写得不够认真」，而是它<strong>和代码各自演化</strong>。控制器改一个字段名，文档不会自动跟着变；DTO 新增一个必填项，文档也不会提醒调用方。时间一长，文档描述的是过去某个版本的接口，而真正决定行为的是代码。
    </p>
    <p>
      接口契约的价值在于「双方共同相信同一份描述」。一旦这份描述靠人工同步，它迟早会失真。解决办法不是要求每个人更勤奋，而是把契约的生成<strong>挂到代码本身</strong>：类型、字段、必填性、取值范围都写在 DTO 和控制器上，工具再据此导出标准的 OpenAPI 文档。
    </p>

    <h2>从装饰器生成 OpenAPI</h2>
    <p>
      <code>@nestjs/swagger</code> 在应用启动时扫描控制器路由、方法装饰器和 DTO 元数据，生成一份符合 OpenAPI 规范的文档对象。典型流程只有三步：
    </p>
    <ol class="lesson-steps">
      <li>用 <code>DocumentBuilder</code> 配置标题、描述、版本、鉴权方式等全局信息。</li>
      <li>调用 <code>SwaggerModule.createDocument(app, config)</code> 生成文档对象。</li>
      <li>用 <code>SwaggerModule.setup('docs', app, document)</code> 把文档和调试界面挂到指定路径。</li>
    </ol>
    <p>
      控制器上的 <code>@ApiTags</code>、<code>@ApiOperation</code>、<code>@ApiParam</code>，以及 DTO 上的 <code>@ApiProperty</code>，都会被收进这份文档。生成的是<strong>机器可读的 JSON</strong>，不只是给人看的页面——它可以被用来生成前端客户端、做契约测试、做版本对比。
    </p>
    <p>
      文档对象应当在应用启动阶段生成一次，而不是每次请求都重新扫描。调试界面适合在开发和内网环境开放，生产环境要么关闭，要么加上鉴权，避免把内部接口结构完整暴露出去。
    </p>

    <h2>用 DTO 把契约写完整</h2>
    <p>
      只有 TypeScript 类型还不够：类型在编译后被擦除，运行时元数据里拿不到字段说明。所以需要在 DTO 属性上补装饰器：
    </p>
    <table>
      <thead>
        <tr><th>装饰器</th><th>补全的信息</th></tr>
      </thead>
      <tbody>
        <tr><td><code>@ApiProperty</code></td><td>必填字段的类型、描述、示例、最小值等约束。</td></tr>
        <tr><td><code>@ApiPropertyOptional</code></td><td>可选字段，文档中标记为非必填。</td></tr>
        <tr><td><code>enum</code> 与 <code>enumName</code></td><td>把枚举的可选值列出来，并生成可复用的 schema。</td></tr>
        <tr><td><code>example</code> 与 <code>default</code></td><td>给出调用方可以直接照抄的样例值。</td></tr>
      </tbody>
    </table>
    <p>
      这些装饰器不是「文档专用」的重复劳动，它们和 <code>class-validator</code> 的校验规则一起，构成字段的完整约束。<strong>示例值尤其重要</strong>：一个正确的 <code>example</code> 能省掉调用方大量猜测，也能在调试界面里直接发起请求。
    </p>

    <h2>三种版本化策略</h2>
    <p>
      接口一旦对外发布，变更就不能再靠「直接改」完成。NestJS 的 <code>enableVersioning</code> 提供三种版本定位方式，区别只在「版本号放在哪里」：
    </p>
    <table>
      <thead>
        <tr><th>策略</th><th>版本位置</th><th>请求形态</th><th>特点</th></tr>
      </thead>
      <tbody>
        <tr><td><code>VersioningType.URI</code></td><td>URL 路径</td><td><code>/v2/courses</code></td><td>最直观，便于日志、缓存与网关分流；路径会随版本变化。</td></tr>
        <tr><td><code>VersioningType.HEADER</code></td><td>自定义请求头</td><td><code>X-API-Version: 2</code></td><td>路径保持稳定，适合不想改 URL 的客户端；调试时容易漏带。</td></tr>
        <tr><td><code>VersioningType.MEDIA_TYPE</code></td><td><code>Accept</code> 媒体类型</td><td><code>application/vnd.course.v2+json</code></td><td>符合内容协商语义，对网关和缓存友好；客户端配置成本较高。</td></tr>
      </tbody>
    </table>
    <p>
      选定策略后，控制器用 <code>@Controller({ path: 'courses', version: '2' })</code> 声明自己属于哪个版本；也可以把版本写在单个方法上。未声明版本的控制器默认归入默认版本，需要跨版本共享的接口用 <code>VERSION_NEUTRAL</code> 标记。
    </p>

    <h2>破坏性变更与过渡期</h2>
    <p>
      判断一次变更是否需要升版本，关键看<strong>旧客户端还能不能按原契约工作</strong>：
    </p>
    <ul>
      <li><strong>破坏性变更：</strong>删除或重命名字段、收窄类型、把可选字段改成必填、删除枚举值、改变路径或 HTTP 方法、新增强制鉴权。</li>
      <li><strong>兼容性变更：</strong>新增可选字段、新增独立接口、放宽校验范围。它们通常可以在当前版本内完成。</li>
    </ul>
    <p>
      破坏性变更必须升到新版本，并且<strong>保留旧版本一段过渡期</strong>。过渡期内旧接口继续可用，在文档里标记 <code>deprecated: true</code>，并通过响应头或公告告知下线时间。新旧版本可以共用同一个 Service，差异只放在控制器和 DTO 层，避免业务逻辑复制两份。
    </p>
    <p>
      版本号一旦发布就不要复用。把 v2 的字段改回 v1 的语义，再声称「还是 v2」，会让已经升级的客户端陷入无法判断的状态。
    </p>

    <h2>把契约纳入 CI</h2>
    <p>
      文档生成出来只是第一步，真正防止契约漂移的是<strong>持续校验</strong>。常见做法是在构建阶段导出一份 <code>openapi.json</code>，提交到仓库作为基线；CI 中重新生成并与基线做差异比对。
    </p>
    <ul>
      <li>新增可选字段可以放行，但要在变更说明里记录。</li>
      <li>删除字段、改类型、增加必填项等破坏性差异直接让流水线失败，要求作者显式升版本。</li>
      <li>用同一份文档生成前端类型或 SDK，让调用方在编译期就发现字段不匹配。</li>
      <li>把文档差异作为评审材料，接口变更不再只体现在代码 diff 里。</li>
    </ul>
    <p>
      这样，「文档」不再是某个人的记忆，而是<strong>每次提交都必须通过的一道门</strong>。
    </p>

    <figure class="lesson-figure">
      <figcaption>切换 v1 与 v2，再看三种版本化策略下路径和请求形态的变化。</figcaption>
      <N18OpenApi />
    </figure>

    <div class="lesson-box warn">
      <strong>两个最容易踩的坑：</strong>其一，只在 TypeScript 接口上写类型、不在 DTO 上加 <code>@ApiProperty</code>，生成的文档里字段会缺少描述、示例和枚举，调用方仍然只能猜。其二，把破坏性变更直接塞进当前版本，只更新文档不升版本——已经上线的客户端不会因为文档更新而自动适配。
    </div>

    <div class="lesson-term">
      <span class="term-name">「OpenAPI 契约与版本化」</span><code>@nestjs/swagger</code> 从控制器与 DTO 装饰器生成 OpenAPI 文档，<code>DocumentBuilder</code> 配置全局信息，<code>SwaggerModule.createDocument</code> 生成文档对象，<code>SwaggerModule.setup</code> 挂载调试界面。DTO 用 <code>@ApiProperty</code> / <code>@ApiPropertyOptional</code> 补类型、示例与枚举。版本化用 <code>enableVersioning</code> 选择 URI、HEADER 或 MEDIA_TYPE 策略；破坏性变更必须升版本并保留过渡期，兼容性变更可在当前版本内完成。导出的文档应纳入 CI 比对，让契约漂移在合并前暴露。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
