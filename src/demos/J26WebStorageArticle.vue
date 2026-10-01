<script setup lang="ts">
import J26WebStorage from './J26WebStorage.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 <code>localStorage</code> 里存了一个对象，刷新页面读回来，却变成一个字符串 <code>"[object Object]"</code>——那个对象去哪儿了？
    </div>

    <h2>刷新与状态留存</h2>
    <p>
      假设你正在做一个在线课程页面。用户切换了主题、把某节课标记成「已学完」、在表单里填了一半的报名信息后误撞了刷新键——这些状态如果只放在内存里，页面一重载就全没了。你希望的是：主题和进度刷新之后还在，哪怕关掉浏览器明天再来也在；而那份填了一半的表单，只在当前这个标签页里保留就够了，用户把标签页关掉就该丢弃。
    </p>
    <p>
      所以要解决的问题其实是两件：<strong>一是把数据留在浏览器里、让它活过这次页面刷新；二是决定它该活多久</strong>——是跨会话长存，还是随标签页生灭。选错了存储方式，要么用户明天回来发现设置丢了，要么用户在公共电脑上关掉页面后，隐私数据还残留在磁盘里。
    </p>

    <h2>本地键值存储</h2>
    <p>
      最省事的做法，用 <code>localStorage</code>：<code>localStorage.setItem('theme', 'dark')</code> 写入，<code>localStorage.getItem('theme')</code> 读回，<code>removeItem</code> 删一个、<code>clear</code> 清空。它按「键—值」成对存储，用法简单到几乎不需要学。
    </p>
    <p>
      这个方案做对了一件重要的事：<strong>数据没有跟着页面一起消失</strong>。刷新、关标签页、重启浏览器，写进去的东西都在，而且读取时是同步的——下一行代码就能立刻拿到值，不用 <code>await</code>。对于「用户偏好」这种小而重要的配置，这几乎是最顺手的形态。
    </p>

    <h2>字符串与过期限制</h2>
    <ul>
      <li><strong>只能存字符串</strong>。直接存对象，会被强制转成 <code>"[object Object]"</code>，读回来的东西已经不是原来那个对象了。</li>
      <li><strong>没有过期时间</strong>。<code>localStorage</code> 会一直留着，除非用户手动清；临时数据放进去就变成了「永久垃圾」。</li>
      <li><strong>同步读写会阻塞主线程</strong>。数据量大时，一次读写就能让页面卡顿一下。</li>
      <li><strong>容量有限</strong>。写超出配额时会直接抛出 <code>QuotaExceededError</code>，如果没接住这个异常，后续逻辑会当场中断。</li>
      <li><strong>同步不代表会通知自己</strong>。你在当前页改了值，<code>storage</code> 事件<strong>不会</strong>在当前页触发，只有其他同源标签页才能收到。</li>
    </ul>

    <h2>序列化与分区策略</h2>
    <p>
      先解决「只能存字符串」。既然它只认文本，那就约定：写入前用 <code>JSON.stringify()</code> 把对象序列化成字符串，读取时用 <code>JSON.parse()</code> 还原。这样对象、数组都能进出，代价是你必须保证「存进去和读出来用的是同一套约定」，读的时候还要考虑键不存在的情况。
    </p>
    <p>
      再解决「活多久」的问题。浏览器其实给了两个同源的键值仓库，用法完全一样，差别只在生命周期：<code>localStorage</code> 跨会话持久保存，<code>sessionStorage</code> 以标签页为单位，标签页一关就清空。于是把「长期偏好」和「临时表单进度」分开：主题、进度放前者，未提交的表单放后者。顺手记住一个反直觉点——<code>storage</code> 事件只在<strong>其他</strong>同源标签页触发，当前页监听不到自己的写入，所以自己写完要手动刷新一次界面。
    </p>
    <p>
      但无论怎么分，「同步阻塞」和「容量有限」这两条都治不了。它们注定只适合小而少的数据。当数据量大、结构复杂、还要按条件查询时，就必须换一套机制——<code>IndexedDB</code>。它是浏览器内置的<strong>异步、基于事务</strong>的数据库，数据存放在「对象仓库」（object store）里，可以建索引按字段检索，能容纳远超键值存储的数据量。它的每一次读写都在事务里完成，配合回调或 Promise 使用，因此不会阻塞主线程。
    </p>
    <p>
      三种方案各有位置，用「生命周期、容量、同步性」三个维度一对照就清楚了：
    </p>
    <table>
      <thead>
        <tr>
          <th>方案</th>
          <th>生命周期</th>
          <th>容量</th>
          <th>同步性</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>localStorage</code></td>
          <td>持久保存，跨会话、关浏览器仍在</td>
          <td>约 5MB</td>
          <td>同步，读写会阻塞主线程</td>
        </tr>
        <tr>
          <td><code>sessionStorage</code></td>
          <td>限于当前标签页，关闭即清除</td>
          <td>约 5MB</td>
          <td>同步，读写会阻塞主线程</td>
        </tr>
        <tr>
          <td><code>IndexedDB</code></td>
          <td>持久保存，由事务管理一致性</td>
          <td>远大于前者，按配额放开</td>
          <td>异步，基于事务，不阻塞主线程</td>
        </tr>
      </tbody>
    </table>

    <h2>存储寿命对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 localStorage 与 sessionStorage，写入后再关闭标签页重开，对比两者的留存差异。</figcaption>
      <J26WebStorage />
    </figure>

    <h2>寿命容量与选型</h2>
    <p>
      浏览器端存储要回答的从来不是「怎么存」，而是「存多久、存多少、要不要卡住页面」。小的长期配置交给 <code>localStorage</code>，临时会话数据交给 <code>sessionStorage</code>，量大又需要查询的交给 <code>IndexedDB</code>——按生命周期、容量、同步性三把尺子量一下，选型就不会错。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Web Storage」</span>指 <code>localStorage</code> 与 <code>sessionStorage</code> 这对键值接口：前者持久保存、跨会话可用，后者以标签页为单位、关闭即清除，二者都<strong>只能存字符串</strong>，存对象需 <code>JSON</code> 序列化。数据量大且结构复杂时应改用 <code>IndexedDB</code>——它是异步、基于事务、可建索引的浏览器数据库，数据放在对象仓库中。注意：<code>storage</code> 事件只在其他同源标签页触发；超配额会抛 <code>QuotaExceededError</code>；<code>localStorage</code> 的同步读写会阻塞主线程。
    </div>
  </LessonArticle>
</template>
