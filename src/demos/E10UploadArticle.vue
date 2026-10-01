<script setup lang="ts">
import E10Upload from './E10Upload.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户传了个 8MB 的 PDF 上去，转了一分钟才收到「文件过大」的报错——为什么不能在选中的那一刻就拦住？还有那个 <code>accept</code>，明明写了却挡不住用户改后缀？
    </div>

    <h2>提出问题</h2>
    <p>
      后台里几乎都绕不开上传：课程资料、发票、头像、批量导入表格。你希望的是一个「拖进来就收下」的区域，用户把文件往上一扔，页面立刻开始处理。可真正要写出这段体验，要考虑的事情比想象中多得多。
    </p>
    <p>
      <strong>不掌控这些细节的代价是双向的</strong>：对用户，是选了不合适的大文件、等半天才被告知失败，白白浪费网速和时间；对系统，是一个不该进来的文件已经跑到了服务端的校验层才被拒，白白占了带宽和存储。真正划算的拦截应该发生在文件「还没离开浏览器」的时候——而这正是上传组件必须做对的核心。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：放一个 <code>input type="file"</code>，监听它的 change 事件拿到 <code>files</code>，再自己拼一个表单数据发出去，同时用一串 <code>span</code> 把已选文件列出来。
    </p>
    <p>
      它做对了一件最基本的事：<strong>把本地文件和浏览器里的数据接上了</strong>。用户选中文件、代码拿到 File 对象，这就有了后续一切——校验、上传、展示列表，全都建立在「先拿到这个对象」之上。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>原生 input 只能点选，想支持把文件拖进来还得自己接一整套拖放事件。</li>
      <li>已选文件的列表要自己写、自己维护，删除某一条也要自己同步数组。</li>
      <li>没有「最多几个文件」的概念，用户能无限往里塞。</li>
      <li>类型和大小全没有校验，坏文件要等到服务端才被拒。</li>
      <li>「先选好、确认后再统一提交」这种流程没法自然表达。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「先拿到 File 对象」，而是把这一整套交给 <code>el-upload</code>，你只需在几个钩子上填业务判断。
    </p>
    <p>
      第一步，选择进入的方式。组件同时支持点击选择与 <code>drag</code> 拖拽两种——加上 <code>drag</code> 就得到一个可拖放的区域。用 <code>accept</code> 限定可选类型，让选择器默认帮用户过滤掉明显不合适的文件。<strong>但要记住：<code>accept</code> 只是选择器的过滤提示，不是强制校验</strong>——用户完全可以把后缀改掉再选进来，所以它拦不住任何东西。
    </p>
    <p>
      第二步，把真正的拦截写在 <code>before-upload</code> 里。这个钩子在<strong>每个文件真正开始上传之前</strong>执行，你在里面读 <code>file.type</code> 与 <code>file.size</code> 做判断：返回 <code>false</code> 立即阻止这个文件，返回<strong>一个被拒绝的 Promise</strong> 可以承载异步校验（比如先问一下后端文件名是否合法），返回 <code>true</code> 则放行。这一层才是「不合格文件根本没离开浏览器」的关卡，和开场那个等一分钟才报错的场景，差别全在这里。
    </p>
    <p>
      第三步，管住数量。用 <code>limit</code> 限制最多能选几个，超过上限时触发 <code>on-exceed</code>——在这里提示用户「最多可传 3 个」，而不是让第 4 个文件默默消失。已选文件列表用 <code>v-model:file-list</code> 双向管理，组件会替你维护它；要从列表里移除时，用 <code>on-remove</code> 同步清理对应的业务记录。
    </p>
    <p>
      第四步，处理「先攒后传」的流程。有些场景不希望用户一选文件就立刻发出去——比如要先填表单、要凑齐一批再统一提交。这时把 <code>auto-upload</code> 设为 <code>false</code>，文件先进入 <code>file-list</code> 待命，等业务时机到了再调用 <code>submit()</code> 手动触发。
    </p>
    <div class="lesson-box warn">
      <strong>一个最容易误解的点：</strong><code>auto-upload=false</code> 只是「暂不上传」，<strong>文件此刻已经进入列表了</strong>，并不是不接收。最终仍必须显式发起上传，否则用户选完了、界面也显示了，服务端却什么都没收到——这种「看着像成功、其实没提交」的错最坑人。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>把文件拖进区域，试试超 5MB 或类型不符时会不会当场被拦下，再试着一次放进第 4 个文件。</figcaption>
      <E10Upload />
    </figure>

    <h2>总结</h2>
    <p>
      文件上传的核心不是那个拖拽区域好不好看，而是<strong>把校验提前到文件离开浏览器之前</strong>：类型与大小交给 <code>before-upload</code> 拦截，数量交给 <code>limit</code> 与 <code>on-exceed</code>，列表交给 <code>file-list</code> 托管。记住 <code>accept</code> 只管过滤提示、<code>auto-upload=false</code> 不等于不上传，就不会写出「看着传了、其实没传」的流程。
    </p>
    <div class="lesson-term">
      <span class="term-name">「文件上传」</span>用 <code>el-upload</code> 支持点击与 <code>drag</code> 拖拽两种进入方式。用 <code>before-upload</code> 在每个文件上传前校验类型与大小——返回 <code>false</code> 立即阻止，返回被拒绝的 Promise 可做异步校验，返回 <code>true</code> 放行；<code>limit</code> 限制数量，超出触发 <code>on-exceed</code>。<code>v-model:file-list</code> 双向管理已选文件，<code>on-remove</code> 处理移除；<code>auto-upload=false</code> 时文件先入列表、需业务手动 <code>submit()</code>。注意 <code>accept</code> 只是选择器过滤提示，真正拦截必须写在 <code>before-upload</code>。
    </div>
  </LessonArticle>
</template>
