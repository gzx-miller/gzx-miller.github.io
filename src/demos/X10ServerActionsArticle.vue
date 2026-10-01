<script setup lang="ts">
import X10ServerActions from './X10ServerActions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>发布文章明明只是「提交一份表单」，为什么要先写一个接口、再在客户端 fetch 调用、最后手动刷新列表——三步全是我们自己写的胶水代码？
    </div>

    <h2>表单提交链路</h2>
    <p>
      课程站要加「新建课程」的功能：一个表单，填标题和简介，点提交后写入数据库。按单页应用的惯性，这件事会拆成三份工作：写一个 <code>POST /api/courses</code> 接口；在表单里阻止默认提交、用 <code>fetch</code> 调这个接口；接口成功后再想办法把页面上的课程列表刷新一遍，让新数据出现。
    </p>
    <p>
      三步里真正和业务有关的只有「写库」那一步，另外两步都是在「客户端」和「服务端」之间来回搬运数据。一旦需要提交的表单变多，这套搬运代码就会成倍增长。
    </p>

    <h2>前端手写提交</h2>
    <p>
      最朴素的版本就是上面那三步，全部手写在浏览器侧：<code>onSubmit</code> 里先 <code>e.preventDefault()</code>，把表单数据拼成 JSON 用 <code>fetch</code> 发出去，成功后调用一个 <code>refresh()</code> 再拉一次列表。
    </p>
    <p>
      它抓住了问题的关键——<strong>数据的写入必须在服务端完成</strong>，浏览器只能发起一次请求。只要这一步立住了，业务数据就是安全的。
    </p>

    <h2>样板与渐进增强</h2>
    <ul>
      <li>样板过多：接口、序列化、错误处理、加载状态，每个表单都要重来一遍。</li>
      <li>无 JS 不可用：脚本没加载出来，表单就完全提交不了。</li>
      <li>刷新靠手写：接口写成功后，缓存并不知道数据变了，页面可能还是旧的。</li>
      <li>安全要自理：CSRF 防护、参数校验都得自己补，漏一处就是漏洞。</li>
    </ul>

    <h2>服务端函数直调</h2>
    <p>
      换一个思路：既然写入本来就要去服务端，那<strong>干脆让表单直接提到服务端的一个函数</strong>，把「接口」这一层省掉。这就是 Server Action。在单独的文件顶部写上 <code>'use server'</code>，导出的函数就变成只能在服务端执行的服务端函数：
    </p>
    <p>
      <code>export async function createCourse(formData: FormData)</code> 里，用 <code>formData.get('title')</code> 取字段、直接操作数据库，执行完调用 <code>revalidatePath('/courses')</code>。
    </p>
    <p>
      表单这一侧只需要把 action 指向它：写成 <code>&lt;form action={createCourse}&gt;</code>，花括号里填服务端函数。浏览器会把提交<strong>自动 POST 到当前路由</strong>，服务端函数被调用，返回后页面上的数据被重新验证刷新——我们一行 <code>fetch</code> 都没写。
    </p>
    <p>
      这套机制还顺手解决了两件事：因为走的是标准表单提交，<strong>脚本没加载时表单依然能用</strong>；Next.js 也会为 Server Action 自动加上 CSRF 防护，参数会被自动序列化。安全与可用性不再依赖开发者记得去写。
    </p>
    <p>
      接下来补交互细节。提交过程中想禁用按钮，用 <code>useFormStatus()</code> 拿到 <code>pending</code>；想根据返回值展示校验提示，需要把 action 包一层来跟踪 state。这里要注意版本差异：
    </p>
    <div class="lesson-box hint">
      <strong>版本提示：</strong>React 19 用 <code>useActionState</code> 取代了旧的 <code>useFormState</code> 来跟踪返回值，<code>useFormStatus</code> 则专门跟踪提交状态。两者都要写在 Client Component 里，服务的部分仍然留在 Server Action。
    </div>
    <p>
      更进一步，想让界面「点完立刻有反馈」，可以用 <code>useOptimistic</code>：先乐观地把点赞数加一渲染出来，再等待真实执行结果，失败时再回滚。它把「等待网络」这段时间的空窗填上了，交互因此显得即时。
    </p>
    <p>
      Server Action 不必只绑定表单，也能被程序式调用：在客户端组件里直接 <code>const result = await updateUser(...)</code>，就像调用一个本地异步函数。但有一条硬约束：
    </p>
    <div class="lesson-box warn">
      <strong>务必记住：</strong>Server Action 的参数与返回值<strong>必须可序列化</strong>。类实例、函数、<code>Map</code> 这类结构要先转换成普通对象或数组再传递，否则会在跨越服务端与客户端边界时出错。
    </div>
    <p>
      还有两个落地细节值得先说清：<code>'use server'</code> 既可以写在独立文件顶部，让这个文件导出的都是服务端函数，也可以只写在单个函数体内，但只有前者能让客户端组件安全地导入使用；其次，Server Action 本质上是 POST 到「当前路由」，表单所在的页面地址就是它的调用地址，不需要额外配置任何路由规则。理解这一点，就不难明白它为什么天然支持无 JS 提交。
    </p>

    <h2>提交直达服务端</h2>
    <figure class="lesson-figure">
      <figcaption>点一下模拟提交，看表单如何不经手写 API 直达服务端并刷新页面。</figcaption>
      <X10ServerActions />
    </figure>

    <h2>请求往返合并</h2>
    <p>
      Server Action 的核心，是把「客户端打包请求、服务端处理、客户端刷新」这条往返链路，收成一次<strong>到服务端函数的直接调用</strong>。表单 action 指向服务端函数，提交自动完成，缓存随 <code>revalidatePath</code> 刷新；再配合 <code>useFormStatus</code>、<code>useActionState</code>、<code>useOptimistic</code> 补上交互细节。我们只需记住「参数和返回值要可序列化」这一条边界，就换来了更少的胶水代码和更稳的安全默认值。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Server Action」</span>是用 <code>'use server'</code> 声明的服务端函数，前端通过 POST 调用。可绑定到 <code>&lt;form action={...}&gt;</code> 实现无 JS 也能提交的表单，并自带 CSRF 防护与参数序列化；执行后用 <code>revalidatePath</code> 或 <code>revalidateTag</code> 刷新缓存。React 19 下用 <code>useActionState</code> 跟踪返回值、<code>useFormStatus</code> 跟踪提交状态、<code>useOptimistic</code> 做乐观更新，参数与返回值必须可序列化。
    </div>
  </LessonArticle>
</template>
