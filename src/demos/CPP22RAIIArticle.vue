<script setup lang="ts">
import CPP22RAII from './CPP22RAII.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一段打开文件、读几行、写几行的代码，正常路径里你老老实实写了 <code>close()</code>，可某个中间分支提前 <code>return</code> 了。程序没有任何报错，直到跑了几个小时突然抛出一句 <code>Too many open files</code>——那个文件句柄到底丢在哪条路径上？
    </div>

    <h2>资源的借还与泄漏</h2>
    <p>
      文件句柄、内存、互斥锁、网络连接，这些资源都有一个共同点：它们是<strong>借来的</strong>，用完了必须还。而「借」和「还」是两次相隔很远的调用，中间隔着你整个函数的逻辑。
    </p>
    <p>
      在只有「申请—使用—释放」三段直线代码的时候，手动配对不算难。可一旦逻辑变复杂，由人来回想「所有出口」就会漏，而且漏得悄无声息：
    </p>
    <ul>
      <li>函数里出现第二个、第三个 <code>return</code> 分支时，每加一条新出口，你都要重新把它和释放语句对照一遍，这是纯人工维护的账。</li>
      <li>中途有一步 <code>throw</code> 时，控制流不是「往下走」而是「直接跳走」，写在它后面的 <code>close()</code>、<code>unlock()</code> 根本不会被执行。</li>
      <li>临界区里抛了异常而锁没有释放，持有同一把锁的其它线程会一直等下去，程序从「一处出错」变成「整体死锁」。</li>
    </ul>
    <p>
      所以问题不是「怎么记得写释放语句」，而是：<strong>能不能让「释放」不再依附于某条代码路径，而是绑定到某个东西的生死上？</strong>
    </p>

    <h2>逐条出口的手动释放</h2>
    <p>
      最朴素的做法：每申请一个资源，就紧跟一句对应的释放调用，然后在写完函数后，从头到尾把所有 <code>return</code>、<code>break</code>、<code>throw</code> 的出口都人工过一遍，确认每一处都还上了。
    </p>
    <p>
      这个做法做对了一件根本的事：<strong>它承认了「获取」与「释放」必须严格成对</strong>——一次获取配一次释放，多也不行少也不行。这条铁律是对的，后面所有的机制都只是换一种方式去保障它。
    </p>

    <h2>提前返回与异常泄漏</h2>
    <ul>
      <li>出现 <code>if (bad) return -1;</code> 这样的提前返回时，释放语句在函数尾部，控制流直接跳过——一次资源泄漏。</li>
      <li>抛出异常时控制流跳到外层 <code>catch</code>，函数尾部那几行清理代码永远不执行，泄漏照旧，而且此时你正在处理另一个错误，很难注意到。</li>
      <li>互斥锁的例子更凶险：<code>lock()</code> 之后、<code>unlock()</code> 之前一旦抛异常，这把锁就再也没人解开，所有等它的线程一起卡死，比泄漏文件句柄严重得多。</li>
      <li>代码一改就得重新核对。你新加了一条 <code>continue</code> 分支，也就新增了一条出口，而没有任何工具会提醒你去补释放语句。</li>
    </ul>

    <h2>构造获取析构释放</h2>
    <p>
      不推翻「获取与释放必须成对」，而是换一个人来负责这件事：<strong>让编译器负责，办法是把资源的生死绑到对象的生死上</strong>。这就是 <strong>RAII</strong>——资源获取即初始化。规矩只有两条：<strong>在构造函数里获取资源</strong>，<strong>在析构函数里释放资源</strong>。
    </p>
    <p>
      为什么这样就一定可靠？因为局部对象离开作用域时，析构函数一定会被调用——正常走到作用域末尾会调用，<code>return</code> 会调用，<strong>抛异常也会调用</strong>。你再也不用列举出口，语言替你列举了。
    </p>
    <p>
      让「抛异常也会调用」成立的那个机制叫<strong>栈展开</strong>：异常从 <code>throw</code> 点出发、一路向外找匹配的 <code>catch</code> 的过程中，沿途所有已经构造完成的局部对象，会按构造的<strong>逆序</strong>依次被析构。RAII 对象就在这个过程中把资源还掉，哪怕你压根没写清理代码。
    </p>
    <p>
      顺着这条线索，还有四个必须补上的边界：
    </p>
    <ol class="lesson-steps">
      <li><strong>构造失败要抛异常。</strong>如果资源没拿到（比如文件打不开），构造函数应该直接抛异常，而不是留下一个「半死不活、还得另外检查状态」的对象。这样「拿到资源」和「对象构造成功」变成同一件事，不存在中间态。</li>
      <li><strong>析构函数绝不能抛异常。</strong>如果析构函数在栈展开期间又抛出一个异常，而此时已经有一个异常在处理中，程序会立即调用 <code>std::terminate</code> 终止。释放资源的动作本来就不该失败，真要报告问题也只能自己吞掉或记日志。</li>
      <li><strong>优先用标准库已经写好的 RAII 类型。</strong><code>std::unique_ptr</code> / <code>shared_ptr</code> 管内存，<code>std::lock_guard</code> / <code>unique_lock</code> 管锁，<code>std::ifstream</code> / <code>ofstream</code> 管文件，<code>std::vector</code> 管动态数组。它们都是「构造时获取、析构时释放」，自己再手写一遍只会引入 bug。</li>
      <li><strong>不是所有资源都天生 RAII，要自己包一层。</strong><code>std::thread</code> 就是反例：它必须在销毁前显式 <code>join()</code> 或 <code>detach()</code>，否则析构时直接 <code>std::terminate</code>。正确做法是写一个 RAII 包装，在它的析构里替你 join。同理，数据库连接、socket、图形 API 对象，都该包成 RAII 类。</li>
    </ol>
    <p>
      还有一个和上一课接得上的细节：RAII 类通常<strong>不可拷贝</strong>（两个对象释放同一份资源必然出错），但应该<strong>可移动</strong>，用移动语义把资源所有权交出去。至于要不要手写析构、拷贝、移动这些函数，还是那句 <strong>Rule of Zero</strong> 更好——成员全是 RAII 类型时，一个都别写。
    </p>
    <div class="lesson-box warn">
      <strong>两个会直接终止程序的操作：</strong>在析构函数里让异常逃出来（尤其栈展开期间），以及让一个既没 <code>join</code> 也没 <code>detach</code> 的 <code>std::thread</code> 对象被销毁。两者都会调用 <code>std::terminate</code>，不是「结果可能不对」，是当场崩掉。
    </div>

    <h2>句柄与锁的自动释放</h2>
    <figure class="lesson-figure">
      <figcaption>看两个 RAII 例子：<code>FileHandle</code> 在构造时打开文件、析构时自动关闭并打印「文件已关闭」，<code>std::lock_guard&lt;std::mutex&gt;</code> 在构造时加锁、离开作用域自动解锁——都没有一行手动清理。</figcaption>
      <CPP22RAII />
    </figure>

    <h2>作用域与释放时机</h2>
    <p>
      RAII 把「什么时候释放资源」这个问题，从「人要在每条退出路径上记得写」变成了「对象什么时候离开作用域」。获取放进构造函数，释放放进析构函数，于是正常返回、提前 return、抛异常三种情况共用同一条清理路径。你少写的那些 <code>close()</code> 和 <code>unlock()</code>，正是最容易漏、后果最重的那些。
    </p>
    <div class="lesson-term">
      <span class="term-name">「栈展开」</span>指异常从 <code>throw</code> 点向外寻找匹配 <code>catch</code> 的过程中，沿途所有<strong>已经构造完成</strong>的局部对象按构造的逆序被自动析构。RAII 正是靠它实现异常安全。边界要记牢：会析构的只有「已经构造完成」的对象；如果构造函数自己抛出异常，这个对象尚不算构造完成，它的析构不会被调用（但已构造完成的成员会）；另外栈展开期间若某个析构函数再抛异常，程序立即 <code>std::terminate</code>。
    </div>
  </LessonArticle>
</template>
