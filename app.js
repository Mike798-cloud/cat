(()=>{
'use strict';
const C=window.RenShengCore;
const KEY='rensheng_web_v3';
function readStored(){try{return C.normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){return C.fresh();}}
function mergeState(a,b){
  const x=C.normalize(a),y=C.normalize(b);
  const seen={...x.seen,...y.seen};
  const merged=C.normalize({seen,visits:Math.max(x.visits||0,y.visits||0),hintLevel:0});
  merged.hintLevel=x.stage===y.stage?Math.max(x.hintLevel||0,y.hintLevel||0):0;
  return merged;
}
function save(s){
  const merged=mergeState(readStored(),s);
  state=merged;
  try{localStorage.setItem(KEY,JSON.stringify(merged));}catch(e){}
  return merged;
}
let state=readStored();
const mark=document.body.dataset.mark;
if(mark){state=save(C.mark(readStored(),mark));}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
const SupportWall={
  PAID_KEY:'_cat_support_paid_v1',
  SESSION_KEY:'_cat_support_session_v1',
  COOKIE_KEY:'_cat_support_flag_v1',
  AUTO_KEY:'_cat_support_auto_seen_v1',
  qr:'https://mike798-cloud.github.io/songtao-grainstation/paycode.png',
  hasPaid(){
    try{return !!(localStorage.getItem(this.PAID_KEY)||sessionStorage.getItem(this.SESSION_KEY)||this._getCookie(this.COOKIE_KEY));}catch(e){return false;}
  },
  markPaid(){
    const token=this._token();
    try{localStorage.setItem(this.PAID_KEY,token);localStorage.setItem(this.AUTO_KEY,'1');}catch(e){}
    try{sessionStorage.setItem(this.SESSION_KEY,token);}catch(e){}
    this._setCookie(this.COOKIE_KEY,token,365);
  },
  markSeen(){try{localStorage.setItem(this.AUTO_KEY,'1');}catch(e){}},
  hasSeen(){try{return localStorage.getItem(this.AUTO_KEY)==='1';}catch(e){return false;}},
  _token(){const raw=`${Date.now()}_${Math.random().toString(36).slice(2,10)}_cat`;try{return btoa(raw);}catch(e){return raw;}},
  _setCookie(name,value,days){try{const d=new Date();d.setTime(d.getTime()+days*86400000);document.cookie=`${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;}catch(e){}},
  _getCookie(name){try{const key=name+'=';for(const part of document.cookie.split(';')){const c=part.trim();if(c.startsWith(key))return c.slice(key.length);}}catch(e){}return '';},
  show(opts={}){
    if(opts.auto&&this.hasSeen())return;
    if(opts.auto)this.markSeen(); else if(!this.hasSeen())this.markSeen();
    if(this.hasPaid()){this._toast('谢谢你之前的支持。旧网页还在，继续往下查吧。');return;}
    let overlay=document.getElementById('paywall-overlay');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.id='paywall-overlay';
      overlay.className='paywall-overlay';
      overlay.innerHTML=`<div class="paywall-card" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
        <button class="paywall-close" type="button" aria-label="关闭支持页面">×</button>
        <div class="paywall-card-inner">
          <header class="paywall-header">
            <div class="paywall-title-row"><span class="paywall-heart">♡</span><strong id="paywall-title" class="paywall-title">支持这部网页调查</strong><span class="paywall-heart">♡</span></div>
            <div class="paywall-subtitle">1元自愿支持 · 不影响后续内容</div>
          </header>
          <div class="paywall-body">
            <div class="paywall-qr-wrapper"><img src="${this.qr}" alt="1元支持收款码" class="paywall-qr-img" referrerpolicy="no-referrer"><div class="paywall-qr-glow"></div></div>
            <div class="paywall-qr-tip">用支付宝扫码支持 1 元</div>
            <div class="paywall-message">
              <p class="paywall-msg-warm">旧报、校史、论坛这些页面，都是一点点磨出来的。</p>
              <p class="paywall-msg-body">如果你在调查里碰到过哪一句让你停了一下，或者只是觉得这趟翻旧网页还算值得，<br>愿意的话，可以用 <strong>1元</strong> 支持后续创作。</p>
              <p class="paywall-msg-cute">不支持也能完整玩下去。关掉这一页，调查照常继续。</p>
              <p class="paywall-msg-warm2">谢谢你愿意把时间留给这些旧网页。</p>
            </div>
          </div>
          <footer class="paywall-footer">
            <div class="paywall-hint">这个提示只会自动出现一次；之后可用右下角“支持作者”再次打开。</div>
            <div class="paywall-btns"><button class="paywall-btn paywall-btn-support" type="button">已完成支持 ♡</button><button class="paywall-btn paywall-btn-later" type="button">先继续调查</button></div>
          </footer>
        </div>
      </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('.paywall-close').addEventListener('click',()=>this.hide());
      overlay.querySelector('.paywall-btn-later').addEventListener('click',()=>this.hide());
      overlay.querySelector('.paywall-btn-support').addEventListener('click',()=>{this.markPaid();this.hide();this._toast('谢谢。先把这页收好，继续往下查。');});
      overlay.addEventListener('click',e=>{if(e.target===overlay)this.hide();});
      overlay.querySelector('.paywall-qr-img').addEventListener('error',e=>{e.currentTarget.alt='收款码暂时没有加载出来，请稍后再试';e.currentTarget.classList.add('qr-error');});
    }
    overlay.style.display='flex';
    document.documentElement.classList.add('paywall-open');
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('paywall-show')));
    setTimeout(()=>overlay.querySelector('.paywall-close')?.focus(),80);
  },
  hide(){
    const overlay=document.getElementById('paywall-overlay');if(!overlay)return;
    overlay.classList.add('paywall-closing');overlay.classList.remove('paywall-show');
    document.documentElement.classList.remove('paywall-open');
    setTimeout(()=>{overlay.style.display='none';overlay.classList.remove('paywall-closing');},320);
  },
  _toast(text){
    document.querySelector('.paywall-toast')?.remove();
    const t=document.createElement('div');t.className='paywall-toast';t.textContent=text;document.body.appendChild(t);
    requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),350);},2600);
  },
  maybeAuto(stage){
    if(this.hasSeen()||this.hasPaid())return;
    if(document.body.dataset.site!=='archive'||stage<4)return;
    setTimeout(()=>{if(!this.hasSeen()&&!this.hasPaid())this.show({auto:true});},1100);
  }
};
window.CatSupport=SupportWall;
let renderInvestigator=()=>{};
function buildInvestigator(){
  const host=document.getElementById('investigator-ui'); if(!host)return;
  const render=()=>{
    const wasOpen=!!host.querySelector('.investigator-panel.open');
    const st=C.status(state); const pct=Math.round(Math.min(st.stage,st.total)/st.total*100);
    host.innerHTML=`<div class="investigator-actions"><button class="investigator-toggle" aria-expanded="false" title="调查便笺（?）">调查便笺</button><button class="support-toggle" type="button" title="自愿支持作者">支持作者 1元</button></div><section class="investigator-panel" aria-hidden="true"><button class="investigator-close" aria-label="关闭">×</button><div class="memo-title">随手记</div><div class="investigator-progress"><span>已记 ${Math.min(st.stage,st.total)} / ${st.total}</span><i><b style="width:${pct}%"></b></i></div><dl><dt>抄下来的</dt><dd>${esc(st.known)}</dd><dt>我还想核的</dt><dd>${esc(st.question)}</dd></dl><div class="hint-slot"></div><button class="investigator-hint" type="button">有点卡住</button><button class="investigator-reset" type="button">重新开始</button></section>`;
    const t=host.querySelector('.investigator-toggle'),p=host.querySelector('.investigator-panel');
    host.querySelector('.support-toggle')?.addEventListener('click',()=>SupportWall.show({auto:false}));
    const setOpen=v=>{p.classList.toggle('open',v);p.setAttribute('aria-hidden',v?'false':'true');t.setAttribute('aria-expanded',v?'true':'false');};
    t.addEventListener('click',()=>setOpen(!p.classList.contains('open')));
    host.querySelector('.investigator-close').addEventListener('click',()=>setOpen(false));
    host.querySelector('.investigator-hint').addEventListener('click',()=>{const r=C.hint(mergeState(state,readStored()));state=save(r.state);host.querySelector('.hint-slot').textContent=r.text;});
    host.querySelector('.investigator-reset').addEventListener('click',()=>{if(confirm('清除本机调查进度并从晚报首页重新开始？')){localStorage.removeItem(KEY);const depth=Number(document.body.dataset.depth||0);location.href=depth===0?'index.html':'../'.repeat(depth)+'index.html';}});
    if(wasOpen)setOpen(true);
  };
  renderInvestigator=render;
  render();
}
function setupFilters(){
  document.querySelectorAll('[data-filter-input]').forEach((inp,idx)=>{
    const target=document.querySelector(inp.dataset.filterTarget); if(!target)return;
    const items=[...target.querySelectorAll('.filter-item')];
    const min=Math.max(0,Number(inp.dataset.filterMin||0));
    const prompt=inp.dataset.filterPrompt||'输入关键词后显示匹配条目。';
    let note=null;
    const showNote=text=>{
      if(!note){note=document.createElement('div');note.className='filter-message';note.dataset.filterMessage=String(idx);const anchor=target.closest('table')||target;anchor.insertAdjacentElement('afterend',note);}
      note.textContent=text;
    };
    const clearNote=()=>{if(note){note.remove();note=null;}};
    const run=()=>{
      const q=inp.value.trim().toLowerCase();
      if(q.length<min){items.forEach(it=>it.hidden=true);showNote(prompt);return;}
      let shown=0;
      items.forEach(it=>{const ok=!q||(it.dataset.search||it.textContent).toLowerCase().includes(q);it.hidden=!ok;if(ok)shown++;});
      if(!shown)showNote('没有找到符合条件的条目。可以换年份、地名或更短的词。'); else clearNote();
    };
    inp.addEventListener('input',run);
    inp.addEventListener('keydown',e=>{if(e.key==='Escape'){inp.value='';run();}});
    run();
  });
}
function setupExternal(){document.querySelectorAll('[data-external]').forEach(a=>{a.target='_blank';a.rel='noopener';a.addEventListener('click',()=>{state=save(C.mark(readStored(),'visit_'+a.dataset.external));});});}
function setupStateSync(){
  window.addEventListener('storage',e=>{
    if(e.key!==KEY)return;
    if(e.newValue===null){state=C.fresh();renderInvestigator();return;}
    try{state=mergeState(state,JSON.parse(e.newValue));renderInvestigator();}catch(err){}
  });
  window.addEventListener('focus',()=>{
    if(localStorage.getItem(KEY)===null){if(Object.keys(state.seen||{}).length){state=C.fresh();renderInvestigator();}return;}
    const merged=mergeState(state,readStored());
    if(C.computeStage(merged)!==C.computeStage(state)||Object.keys(merged.seen||{}).length!==Object.keys(state.seen||{}).length){state=merged;renderInvestigator();}
  });
}
function setupKeyboard(){document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('paywall-overlay')?.classList.contains('paywall-show')){SupportWall.hide();return;}if(e.key==='?'&&!/input|textarea/i.test(document.activeElement?.tagName||'')){e.preventDefault();document.querySelector('.investigator-toggle')?.click();}});}
function setupCounter(){document.querySelectorAll('[data-fake-counter]').forEach((el,i)=>{const base=Number(el.dataset.fakeCounter)||32800;const day=new Date().getDate();el.textContent=String(base+day*7+i*13).padStart(6,'0');});}
function once(selector,make){if(document.querySelector(selector))return;make();}
function enhanceNews(){
  const head=document.querySelector('.news-head'),nav=document.querySelector('.news-nav'); if(!head||!nav)return;
  const depth=Number(document.body.dataset.depth||0);
  const newsBase=depth===0?'news/':'';
  const homeHref=depth===0?'index.html':'../index.html';
  const map={首页:homeHref,本地:newsBase+'local.html',社会:newsBase+'local.html#social',民生:newsBase+'life.html',教育:newsBase+'education.html',文化:newsBase+'education.html#culture',数字报刊:newsBase+'archive.html'};
  nav.querySelectorAll('a').forEach(a=>{const t=a.textContent.trim();if(map[t])a.href=map[t];});
  const shownDate=(head.querySelector('.news-date')?.textContent||'2026年9月13日　星期日').trim();
  once('.news-utility',()=>head.insertAdjacentHTML('beforebegin',`<div class="legacy-strip news-utility"><span>${esc(shownDate)}　鹤宁：多云转阴 17～24℃</span><span>设为首页　|　加入收藏　|　投稿信箱　|　报社简介　|　联系我们</span></div>`));
  once('.news-ticker',()=>nav.insertAdjacentHTML('afterend',`<div class="news-ticker"><b>滚动：</b>供热注水试压陆续开始　·　南关老市场消防检查结束　·　数字报历史目录继续补录</div>`));
  const home=document.querySelector('.news-home');
  if(home&&!home.classList.contains('has-rail')){
    home.classList.add('has-rail');
    home.insertAdjacentHTML('afterbegin',`<aside class="news-left-rail"><section><h3>新闻频道</h3><a href="news/local.html">本地</a><a href="news/local.html#social">社会</a><a href="news/life.html">民生</a><a href="news/education.html">教育</a><a href="news/education.html#culture">文化</a><a href="news/archive.html">历史报刊</a></section><section><h3>便民查询</h3><a href="news/bus.html">公交调整</a><a href="news/heating.html">供热通知</a><a href="news/library-hours.html">图书馆</a><span>天气预报</span></section><section class="news-smallad"><b>报料热线</b><strong>0437-6210***</strong><small>新闻线索经核实采用后与提供人联系</small></section></aside>`);
    const cols=home.querySelector('.news-columns');
    if(cols)cols.insertAdjacentHTML('afterend',`<div class="news-linkbar"><b>友情链接：</b><span>鹤宁市人民政府</span><span>市教育局</span><span>市公交公司</span><span>鹤宁广播电视台</span></div>`);
  }
  const article=document.querySelector('.article-page');
  if(article&&!article.querySelector('.article-tools')){
    const meta=article.querySelector('.article-meta');
    meta?.insertAdjacentHTML('afterend',`<div class="article-tools"><span>稿件来源：鹤宁晚报</span><span>【字体：<button type="button" data-font="s">小</button> <button type="button" data-font="m">中</button> <button type="button" data-font="l">大</button>】　<button type="button" data-print>打印本页</button></span></div>`);
  }
}
function enhanceSchool(){
  const head=document.querySelector('.school-head'),nav=document.querySelector('.school-nav'); if(!head||!nav)return;
  once('.school-utility',()=>head.insertAdjacentHTML('beforebegin',`<div class="legacy-strip school-utility"><span>今天是：2012年06月28日　星期四</span><span>设为首页　|　加入收藏　|　网站地图　|　校长信箱　|　旧版入口</span></div>`));
  once('.school-sitebar',()=>nav.insertAdjacentHTML('afterend',`<div class="school-sitebar"><b>校园公告：</b>暑期前请各班完成安全检查　　<span>★</span>　红领巾广播站本周五停播　　<span>★</span>　运动会照片正在整理上传</div>`));
  const side=document.querySelector('.school-side');
  if(side&&!side.querySelector('.school-side-extra'))side.insertAdjacentHTML('beforeend',`<div class="school-side-extra"><b>常用栏目</b><span>作息时间</span><span>值周安排</span><span>下载专区</span><span>家长学校</span><span>校园安全</span><small>网站维护：信息技术组<br>页面最佳显示：1024×768</small></div>`);
  const main=document.querySelector('.school-main');
  if(main&&main.querySelector('.school-boxes')&&!main.querySelector('.school-badge-row'))main.insertAdjacentHTML('beforeend',`<div class="school-badge-row"><span>文明单位</span><span>平安校园</span><span>语言文字规范校</span><span>少先队示范校</span></div>`);
}
function enhanceArchive(){
  const head=document.querySelector('.archive-head'),nav=document.querySelector('.archive-nav'); if(!head||!nav)return;
  once('.archive-utility',()=>head.insertAdjacentHTML('beforebegin',`<div class="legacy-strip archive-utility"><span>鹤宁市地方文献馆　网上服务平台</span><span>馆务公开　|　办事指南　|　资料征集　|　联系我们</span></div>`));
  once('.archive-noticebar',()=>nav.insertAdjacentHTML('afterend',`<div class="archive-noticebar"><b>馆内公告：</b>地方文献阅览室周一闭馆整理；旧报缩微胶卷、门牌簿等资料须凭证登记调阅，网上目录仅供检索。</div>`));
  const side=document.querySelector('.archive-side');
  if(side&&!side.querySelector('.archive-side-extra'))side.insertAdjacentHTML('beforeend',`<div class="archive-side-extra"><b>服务信息</b><span>开放时间 09:00—16:30</span><span>周一闭馆整理</span><span>复制资料请先登记</span><span>咨询 0437-6118***</span></div>`);
}
function hashName(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;}
function enhanceForum(){
  const nav=document.querySelector('.forum-nav'); if(!nav)return;
  once('.forum-loginbar',()=>nav.insertAdjacentHTML('afterend',`<div class="forum-loginbar"><span>用户名：<input aria-label="用户名" disabled>　密码：<input aria-label="密码" type="password" disabled>　<button type="button" disabled>登录</button></span><span>今日 27　|　昨日 63　|　主题 1,437　|　会员 3,086</span></div><div class="forum-adbar">[便民] 南关疏通下水道 24小时　　[转让] 凤凰自行车一辆　　[通知] 旧帖区已于2026年9月2日转为静态只读，注册与回复功能关闭</div>`));
  document.querySelectorAll('.forum-post aside').forEach(as=>{
    if(as.querySelector('.user-stats'))return;
    const name=as.querySelector('b')?.textContent.trim()||'游客', h=hashName(name);
    const posts=18+h%680, year=2002+h%9;
    as.insertAdjacentHTML('beforeend',`<small class="user-stats">UID ${1000+h%8900}<br>注册 ${year}-${String(1+h%12).padStart(2,'0')}<br>帖子 ${posts}</small>`);
  });
}
function enhanceNotes(){
  const head=document.querySelector('.notes-head'); if(!head)return;
  once('.notes-webhost',()=>head.insertAdjacentHTML('beforebegin',`<div class="legacy-strip notes-webhost"><span>个人页面 / sy0718</span><span>首页　|　留言　|　友情链接　|　旧帖备份</span></div>`));
  const about=document.querySelector('.notes-about');
  if(about&&!about.querySelector('.notes-counter'))about.insertAdjacentHTML('beforeend',`<div class="notes-counter">页面访问：<span data-fake-counter="013740"></span><br>最后整理：2026-09-08 23:48<br><small>部分链接来自互联网存档，失效不再补。</small></div>`);
}
function enhanceLegacy(){const s=document.body.dataset.site;if(s==='news')enhanceNews();else if(s==='school')enhanceSchool();else if(s==='archive')enhanceArchive();else if(s==='forum')enhanceForum();else if(s==='notes')enhanceNotes();}
function setupArticleTools(){
  document.querySelectorAll('[data-font]').forEach(b=>b.addEventListener('click',()=>{const a=b.closest('.article-page');if(!a)return;a.classList.remove('font-s','font-l');if(b.dataset.font==='s')a.classList.add('font-s');if(b.dataset.font==='l')a.classList.add('font-l');}));
  document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
}
buildInvestigator();
enhanceLegacy();
setupFilters();setupExternal();setupKeyboard();setupCounter();setupArticleTools();setupStateSync();
SupportWall.maybeAuto(C.computeStage(mergeState(state,readStored())));
})();
