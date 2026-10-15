<script setup lang="ts">
import D21Crypto from './D21Crypto.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你自信地把密码存成 <code>sha256</code> 摘要，明文永不落库；可一份审计报告指出，明面上是三千个账号，库里却只对应不到一百种哈希值——同一套「只存摘要」的做法，为什么会变成这样？
    </div>

    <h2>通用哈希的两个「性格」</h2>
    <p>
      你最初的写法大概是：注册时算一遍 <code>createHash('sha256')</code> 把摘要存库，登录时把输入的密码再算一遍，和库里的值比对。方向没有错——<strong>哈希是单向的，明文永远不落库</strong>，哪怕整库被拖走，攻击者拿到的也只是一串定长摘要，而不是用户的原始密码。这条底线必须守住。
    </p>
    <p>
      问题出在通用哈希函数与生俱来的两个「性格」上。它<strong>公开且确定</strong>：同样的输入永远得到同样的输出；它又<strong>为快而生</strong>：设计目标就是尽快算出结果。这两点合在一起，埋下三类只能由你来兜的成本：
    </p>
    <ul>
      <li>确定意味着可以预计算：常见密码的摘要是一张谁都能查的表，破一个就等于破一片。</li>
      <li>快意味着可以暴力枚举：主流 GPU 每秒能对 SHA-256 尝试数十亿次，短弱密码几小时就见底。</li>
      <li>没有随机意味着「相同密码得到相同摘要」：拖库后统计频次，就能把成批用同一密码的账号直接圈出来。</li>
    </ul>
    <p>
      <strong>有没有一种存法，既保留「不可逆」，又让「破一个」不再等于「破一批」，同时把暴力枚举拖慢到不划算？</strong>
    </p>

    <h2>相同摘要惹出的风险</h2>
    <ul>
      <li>两个用户都用了同一个弱密码，两行哈希一模一样，破一个等于破一双。</li>
      <li><code>sha256('123456')</code> 是全网皆知的定值，攻击者不必爆破，拿彩虹表查表即得明文。</li>
      <li>哈希太快：SHA-256 在消费级 GPU 上每秒可尝试数十亿次，八位小写字母的组合几小时就能穷举完。</li>
      <li>取巧会翻车：<code>md5</code> 与 <code>sha1</code> 已被证明存在碰撞，只能用于非安全的完整性校验，绝不能拿来存密码或签名。</li>
      <li>连比对方式都可能泄密：用 <code>===</code> 逐字节比较会在第一个不同字节处提前返回，耗时随匹配程度变化，留下时序攻击的缺口。</li>
    </ul>

    <h2>先加随机盐，再让它慢下来</h2>
    <p>
      先补<strong>随机盐</strong>。注册时用 <code>randomBytes(16)</code> 生成一段随机字节当盐，与密码一起送进哈希函数，最后把盐和摘要一并存储。之所以先补它：它正是「相同密码产生相同摘要」这个最致命问题的直接解药，改动还最小。盐不是秘密、不需要保密，它的作用只是让每个用户的计算结果都带上随机性——攻击者再想用一张彩虹表通吃，就得为每个盐各重算一张，成本瞬间爆炸。
    </p>
    <p>
      补完盐还差一件事：盐只防「预计算」，不防「在线暴力破解」，SHA-256 那个「快」的毛病还在。于是再补<strong>慢</strong>——改用刻意拖慢的密钥派生函数，把迭代次数（成本因子）显式调高，让单次校验耗时被人为拉到毫秒级，每秒可尝试次数就从数十亿压到几百。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>randomBytes(16)</code> 为这个用户生成独立随机盐。</li>
      <li>用 <code>pbkdf2Sync(password, salt, 10000, 64, 'sha512')</code> 或 <code>scryptSync</code> 反复迭代得到摘要。</li>
      <li>把盐与摘要一起入库；校验时用同一个盐重算，再用 <code>timingSafeEqual()</code> 比对。</li>
    </ol>
    <p>
      生产里更省心的做法是直接上 <code>bcrypt</code> 或 <code>argon2</code>：它们把盐与成本参数一起编码进结果字符串，你不用自己维护这两样。<code>timingSafeEqual()</code> 这一环也别漏——它做常数时间比较，不因内容不同而改变耗时，正是用来堵上前面那个时序缺口。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>一是以为「加了盐就安全」——盐只解决预计算，真正拉高暴力破解成本的是「慢」；二是随手在摘要上加一个固定字符串当盐——固定值等于全局共用一个盐，完全起不到随机化作用。<strong>盐必须每个用户独立、每次生成都随机。</strong>
    </div>

    <h2>摘要、HMAC、加密与签名各管一段</h2>
    <p>
      顺着「摘要用在哪」这条线，还有几处边界要分清。<strong>完整性校验</strong>用裸哈希就够：<code>createHash('sha256')</code> 算文件校验和，确认下载没被改动。<strong>消息认证</strong>则必须换成 <code>createHmac('sha256', secret)</code>——密钥参与运算，攻击者不知道密钥就伪造不出签名，这正是裸哈希与 HMAC 的分界：有没有密钥。
    </p>
    <p>
      而<strong>需要把数据解回来的机密性场景</strong>，用的是对称加密 <code>createCipheriv('aes-256-gcm', key, iv)</code>。GCM 自带认证标签（authTag），解密时校验它就能发现密文被改过；<strong>IV 每次加密都必须重新随机生成、绝不能复用</strong>，否则相同明文会被加密成相同密文，直接暴露规律。随机性本身交给 <code>randomBytes()</code>，需要一个不碰撞的标识就用 <code>randomUUID()</code>——它们都基于密码学安全的随机源，不要用 <code>Math.random()</code> 替代。
    </p>
    <p>
      若还需要「谁能加密、谁能解密」分离，就轮到签名与验签出场：用私钥签名 <code>crypto.sign('sha256', data, privateKey)</code>、用公钥验签 <code>crypto.verify(...)</code>，既证明「是谁发的」，也证明「内容没被改」。
    </p>

    <h2>密钥放在哪、以后怎么换</h2>
    <p>
      无论是 HMAC 的 secret、AES 的 key，还是签名的私钥，都<strong>一律通过环境变量或密钥管理服务提供，绝不硬编码进仓库</strong>——一旦提交，就等于把钥匙挂在了公开的门上，还得连带清理 Git 历史。方案设计时还要<strong>预留密钥轮换的路径</strong>：用带版本号的标识标记每条密文或签名，新数据用新密钥，旧密钥保留一段时间以便解开历史数据，轮换时才不会导致存量数据直接读不出。
    </p>

    <h2>各算法摘要位数</h2>
    <figure class="lesson-figure">
      <figcaption>输入任意内容，切换 <code>sha256</code> / <code>md5</code> / <code>sha1</code> / <code>sha512</code>，点「计算哈希」，看同一段文字在不同算法下摘要位数（长度）的差别；页面下方还把加盐密码校验、HMAC 签名与 AES-GCM 加密三段代码摆在一起对照。</figcaption>
      <D21Crypto />
    </figure>

    <h2>按用途挑算法</h2>
    <p>
      摘要算法的选型，本质是先分清「要不要能解回来、要不要证明真伪」：能解回来用加密，证明真伪用带密钥的 HMAC 或签名，而验证密码这个特殊场景要的既不是快也不是可逆，而是「不可逆 + 每个用户随机 + 慢到打败暴力枚举」。加盐慢哈希把这三点一次凑齐，密码存储才算真正立住；密钥则一律外置，并预留轮换路径。
    </p>
    <div class="lesson-term">
      <span class="term-name">「加盐慢哈希」</span>先用每个用户独立的随机盐参与运算，再交给一个刻意拖慢的密钥派生函数（<code>scrypt</code>、<code>PBKDF2</code>、<code>bcrypt</code>、<code>argon2</code>）反复迭代，产出定长摘要的密码存储方式。边界：盐不是密钥、无需保密，但要和摘要一起存；盐只解决「相同密码产生相同摘要」，真正拉开暴力破解成本的是「慢」；<code>md5</code> / <code>sha1</code> 这类快速哈希无论加不加盐都不能用于存密码或签名；比对必须用常数时间的 <code>timingSafeEqual()</code>。
    </div>
  </LessonArticle>
</template>
