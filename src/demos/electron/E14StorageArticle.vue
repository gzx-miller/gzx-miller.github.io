<script setup lang="ts">
import E14Storage from './E14Storage.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把用户设置写进 <code>path.join(__dirname, 'config.json')</code>，在开发机上一直好好的。打包成安装版发给用户，他改了主题、重启——设置全没了。去翻安装目录才发现，文件根本写不进去，那个目录在 Windows 上是 <code>Program Files</code> 下的只读位置。
    </div>

    <h2>提出问题</h2>
    <p>
      桌面应用总要「记住」点什么：窗口大小、上次登录的用户、离线缓存的数据。看着都是「存个文件」，可旧办法到处是坑。
    </p>
    <p>
      第一是<strong>路径硬编码</strong>：开发时和安装后的目录不一样，而且安装目录（打包后 <code>resources</code> 下那类）通常是只读的，往里写要么失败、要么下次升级就被覆盖。第二是<strong>自己处理 JSON</strong>：解析、并发写、文件损坏后的恢复，全得手写，稍不留神就写坏一个文件。第三是<strong>不分数据形态</strong>：一份几十字节的配置和几万条离线记录，用同一套读写方式，迟早一边被拖垮。第四是<strong>多窗口并发写</strong>：两个窗口同时改同一个文件，后写的把先写的盖掉。
    </p>
    <p>
      所以真正的问题是：不同形态的本地数据，各自该落在哪、用什么存，才能兼顾正确的落点、合适的性能和并发安全？
    </p>

    <h2>最小方案</h2>
    <p>
      配置这类小对象，用 <code>electron-store</code>。它默认把 JSON 落到 <code>app.getPath('userData')</code>——一个各平台都正确的、当前用户可写的目录——然后给你键路径读写：<code>store.set('user.name', 'Alice')</code>、<code>store.get('user.name')</code>，存对象就是 <code>store.set('settings', { theme: 'dark' })</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「存到哪个平台的哪个目录」和「JSON 读写」这两件琐事标准化了</strong>。你不再猜路径，也不再手写解析和写盘。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>electron-store</code> 是<strong>整文件读写</strong>：数据量一大、或写入很频繁时，每次都要序列化整个文件，效率跟不上。</li>
      <li>它默认<strong>不加密</strong>：密码、令牌这类敏感字段得自己处理，别以为落进 userData 就安全了。</li>
      <li>渲染进程里的 <code>localStorage</code> / <code>IndexedDB</code> 主进程<strong>访问不到</strong>：想让主进程也读同一份数据，必须经 IPC。</li>
      <li><code>userData</code> 在 Windows 与 macOS 上路径不同：硬编码磁盘路径，换个平台就错。</li>
      <li>多窗口并发写同一个文件：没有串行化，就会互相覆盖。</li>
      <li>数据结构升级了（比如配置里新增一个字段）却没有版本号：老用户的数据读出来可能直接崩。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先按数据形态分路，这是本课的主干：配置 / 设置这类小对象用 <code>electron-store</code>，图的是简单、落点正确；需要异步访问的高结构化数据（离线缓存）用 <code>IndexedDB</code>，浏览器标准的异步存储；临时的小键值数据用 <code>localStorage</code>，同步、简单，但只适合临时数据；有复杂查询、多表关联需求的，才用 <code>better-sqlite3</code> 或 <code>sql.js</code> 这类 SQLite，关系型、支持事务。
    </p>
    <p>
      接着把落点统一。所有落盘位置都从 <code>app.getPath('userData')</code> 取——Windows 在 <code>AppData\Roaming</code> 下、macOS 在 <code>~/Library/Application Support</code> 下，代码里<strong>绝不硬编码</strong>。顺带记住一条边界：这个目录名跟 <code>productName</code> / <code>appId</code> 绑定，产品名改一次，老用户的数据就可能「找不到」了。
    </p>
    <p>
      然后是跨进程共享。把各存储方案封装成主进程里的服务模块，统一经 IPC 对外——渲染进程不直接持有文件句柄，主进程是数据的<strong>单一事实来源</strong>。这样做还有个附带好处：以后想换存储实现，只动主进程这一层。
    </p>
    <p>
      再解决并发。多窗口写同一份数据时，把写入<strong>串行化到主进程</strong>里排队，而不是让每个窗口各写各的文件；用 SQLite 的话，事务和 <code>better-sqlite3</code> 的同步 API 本身就是串行的，天然安全。
    </p>
    <p>
      最后加迁移与容错。给数据配一个 schema 版本号，启动时比对版本号决定要不要迁移；读文件用 <code>try / catch</code> 兜住，遇到损坏就先备份原文件、重建一份默认值，别让一个坏文件把应用卡死在启动阶段。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>对照四张存储卡片，比较 electron-store / IndexedDB / SQLite / localStorage 各自的定位，再读 <code>electron-store</code> 的键路径读写示例，体会「配置用 store、大数据用 SQLite」这套取舍。</figcaption>
      <E14Storage />
    </figure>

    <h2>总结</h2>
    <p>
      本地存储的取舍，本质是先分清数据形态，再各归各的落点：配置走 <code>electron-store</code>、异步结构化数据走 <code>IndexedDB</code>、复杂查询走 SQLite、临时数据走 <code>localStorage</code>；落点一律用 <code>app.getPath('userData')</code>，跨进程共享统一经主进程，多窗口写入串行化，并给数据留一个版本号来做迁移。
    </p>
    <div class="lesson-term">
      <span class="term-name">「userData 目录」</span>是 Electron 约定的「每个用户、每个应用可写数据目录」，由 <code>app.getPath('userData')</code> 返回（Windows 在 <code>AppData\Roaming\&lt;应用名&gt;</code>，macOS 在 <code>~/Library/Application Support/&lt;应用名&gt;</code>）。边界：安装目录（打包后 <code>resources</code> 下）通常<strong>只读</strong>，绝不能往里写业务数据；该目录名与 <code>productName</code> / <code>appId</code> 绑定，改名或换 <code>appId</code> 会让老数据看似「丢失」，需要自己处理迁移。
    </div>
  </LessonArticle>
</template>
