(()=>{
'use strict';
const C=window.RenShengCore;
const KEY='rensheng_v1_state';
let state=C.normalize(load());
let win=null;
let browserRoute='news';
let anchorOpen=false;
let historyStack=[];
let historyIndex=-1;
let idleTimer=null;
const app=document.getElementById('app');
const blackout=document.getElementById('blackout');

function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function reset(){localStorage.removeItem(KEY);state=C.fresh();win=null;browserRoute='news';historyStack=[];historyIndex=-1;render();}
function mark(k){const prev=state.stage;state=C.mark(state,k);save();if(state.stage!==prev) pulse();renderAnchor();}
function has(k){return C.has(state,k)}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function pulse(){try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=610;g.gain.setValueAtTime(.018,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.16);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.17)}catch(e){}}
function lowTone(){try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=62;g.gain.setValueAtTime(.04,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+2.2);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+2.3)}catch(e){}}
function clock(){const d=new Date();return d.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})}
function anchor(){return C.anchor(state)}
function armIdleHint(){
 clearTimeout(idleTimer);
 idleTimer=setTimeout(()=>{
  if(state.ended)return;
  anchorOpen=true;renderAnchor();
  const b=document.getElementById('anchorToggle'); if(b)b.classList.add('idle-hint');
 },180000);
}
function noteActivity(){armIdleHint()}

const normalNews=[
 ['1996-11-29','市公交公司增开冬季早班车','民生'],['1996-11-28','鹤宁纺织厂完成锅炉改造','经济'],['1996-11-27','南关多名儿童已与家属取得联系','社会'],['1996-11-26','校方提醒家长接送低年级学生','教育'],['1996-11-25','关于南关“怪老人”传言的情况说明','社会'],['1996-11-24','南关五名儿童一度与家长失去联系','社会'],['1996-11-23','冬储白菜进入集中上市期','民生'],['1996-11-22','青年宫周末开放乒乓球馆','文体'],['1996-11-21','鹤宁今冬首场降雪预计周末到来','天气'],['1996-11-20','市环卫处调整冬季清扫时间','民生'],['1996-11-18','二轻系统举办职工书画展','文体'],['1996-11-15','南关旧街路灯检修本周完成','民生'],['1996-11-14','市百货大楼冬装展销本周开幕','商业'],['1996-11-13','东河路部分路段夜间停电检修','民生'],['1996-11-12','市少年宫举办冬季美术班','教育'],['1996-11-11','南关菜市场完成排水沟整修','民生'],['1996-11-09','鹤宁队客场战平北川队','文体'],['1996-11-07','市图书馆延长周末开放时间','文化'],['1996-11-05','冬季供暖试压工作全面展开','民生']
];
const schoolNotices=[
 ['2012-06-28','关于暑期校舍安全检查的通知'],['2011-09-01','新学期开学工作安排'],['2010-12-03','冬季传染病防控告家长书'],['2009-05-12','校园消防疏散演练情况'],['2008-10-18','第十七届田径运动会成绩'],['2006-09-10','优秀教师表彰名单'],['2003-03-07','春季植树活动安排'],['1999-12-20','校史资料整理征集启事'],['1997-03-03','新学期教研组活动安排'],['1996-12-02','关于加强低年级放学管理的通知'],['1996-11-18','卫生室冬季常见病预防提示'],['1996-10-12','少先队大队委改选结果'],['1996-09-02','新学期值周安排'],['1996-06-28','暑假前安全教育安排'],['1996-05-31','庆“六一”文艺汇演节目单']
];
const forumThreads=[
 ['2010-10-04','南关早市附近昨天是不是在找孩子？','槐树下喝茶',18],['2010-09-28','二路车终点到底搬哪儿了','老何修车',9],['2008-04-12','求租南关一室一厅','小北风',12],['2005-11-21','说说九几年那个猫脸老太太到底怎么传起来的','锅炉房老李',47],['2003-06-07','鹤宁二小以前是不是有个后门？','南关照相馆',21],['2001-02-03','槐树巷拆迁前老门牌谁还记得','旧邮局',33],['1999-08-16','南关最好吃的糖糕是哪家','三轮车王师傅',26],['1998-12-11','寻找老同学：二小89级三班','梅子',14],['2009-12-02','南关哪家修收音机还行','东河口',7],['2007-06-18','早市搬了以后买菜真麻烦','小叶子',22],['2006-03-11','谁有旧二路车时刻表','二厂宿舍',5],['2004-09-19','求推荐给孩子补习作文的老师','秋雨',16],['2002-12-27','南关澡堂什么时候关门','老邢',11],['2000-05-14','街坊们有谁会修凤凰车','一把扳手',8]
];
const cultureEntries=[
 ['民俗','鹤宁旧俗中的守灵禁忌','2007-03-16'],['方言','南关街巷旧称与俗称小考','2008-09-21'],['庙会','城隍庙会旧照片整理（一）','2006-05-02'],['节气','冬至前后的家庭饮食习惯','2009-12-20'],['地方志','槐树巷、井台胡同旧门牌沿革','2011-07-04'],['民俗','儿童乳名与避讳称呼','2005-08-19'],['口述史','南关旧街居民生活片段','2010-02-11'],['非遗','鹤宁剪纸纹样采集记录','2008-01-08'],['馆讯','2009年地方资料捐赠目录','2010-01-16'],['方言','老城区儿童称谓小记','2007-11-02'],['街巷','东河路沿革简表','2011-03-14']
];
const libEntries=[
 ['HN-LD-1996-112','《鹤宁晚报》1996年11月合订本','报刊缩微'],['HN-NG-2001-017','《南关街道旧门牌对照表（1987-2000）》','地方文献'],['HN-EDU-1996-04','鹤宁第二小学 1996 年校务附件镜像','教育档案'],['HN-MEM-2010-09','南关居民口述资料第九辑','口述史'],['HN-MAP-1994-02','鹤宁市区街巷图 1994 修订版','地图'],['HN-ALM-2008-01','鹤宁地方习俗资料汇编','地方志'],['HN-BUS-1998-03','鹤宁市公共交通线路资料（1998）','交通史料'],['HN-IMG-2004-11','南关街道居民捐赠照片目录','图片目录'],['HN-COM-2007-06','旧城改造社区资料汇编','社区资料'],['HN-EDU-2002-18','鹤宁市小学名录（2002）','教育资料']
];

function render(){
 if(state.ended){renderEnd();return}
 app.innerHTML=desktopHTML()+(win?windowHTML(win):'');
 bindDesktop();
 renderAnchor();
 setTimeout(()=>document.getElementById('boot')?.classList.add('hide'),350);
}
function desktopHTML(){
 const a=anchor();
 const cacheReady=has('hehui');
 return `<div class="os"><div class="desktop">
   <div class="desk-icons">
    ${deskDecor('trash','回收站')}
    ${deskIcon('folder','folder','旧资料')}
    ${deskIcon('browser','browser','Internet')}
    ${deskIcon('doc','doc','备份说明.txt')}
    ${deskDecor('folder','工作')}
    ${deskIcon('photo','photo','IMG_2010_1004.jpg')}
    ${deskDecor('folder','照片备份')}
    ${deskIcon('sheet','timeline','旧事时间表.xlsx')}
    ${deskIcon('lock','private','调查备忘.lock')}
    ${deskDecor('misc','QQ')}
    ${deskDecor('folder','下载')}
    ${cacheReady?deskIcon('tmp','cache','cache_1127.tmp'):''}
   </div>
   <div class="desktop-note"><div class="note-title">沈妍 / 临时便签</div><b>${esc(a[0])}</b><br>${esc(a[1])}</div>
 </div>
 <div class="taskbar"><span class="start-orb" aria-hidden="true"></span><div class="task-app">文件夹</div><div class="task-app">浏览器</div><div class="anchor-mini">${esc(a[0])}</div><div class="tray"><span>▴　▥</span><div class="clock">${clock()}<br>2026/09/12</div></div></div>
 <button class="anchor-toggle" id="anchorToggle">沈妍便签</button><div id="anchorPanel" class="anchor-panel"><b>${esc(a[0])}</b><div class="sub">${esc(a[1])}</div><hr><div class="sub">这是沈妍留在桌面的临时核对项，不是系统提示。</div></div>
 </div>`;
}
function deskIcon(cls,id,label){return `<button class="desk-icon" data-open="${id}"><img class="desk-ico-img" src="assets/icons/${cls}.png" alt=""><span>${esc(label)}</span></button>`}
function deskDecor(cls,label){return `<div class="desk-decor"><img class="desk-ico-img" src="assets/icons/${cls}.png" alt=""><span>${esc(label)}</span></div>`}
function bindDesktop(){
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openWin(b.dataset.open));
 document.getElementById('anchorToggle').onclick=()=>{anchorOpen=!anchorOpen;renderAnchor()};
}
function renderAnchor(){const p=document.getElementById('anchorPanel');if(!p)return;const a=anchor();p.innerHTML=`<b>${esc(a[0])}</b><div class="sub">${esc(a[1])}</div><hr><div class="sub">这是沈妍留在桌面的临时核对项，不是系统提示。</div>`;p.classList.toggle('show',anchorOpen)}
function openWin(id){
 if(id==='browser'){openBrowser(browserRoute);return}
 if(id==='cache'){triggerBlackout();return}
 win=id;render();
}
function closeWin(){if(win==='timeline'&&has('final_date')&&has('final_photo')){state.ended=true;save();win=null;render();return}win=null;render()}
function windowHTML(id){
 let title='',body='',small=false,type='explorer',toolbar='';
 if(id==='doc'){title='备份说明.txt - 记事本';small=true;type='notepad';body=`<div class="note-paper">沈妍的电脑从旧教学楼带回来时屏幕已经裂了。家属只说把重要资料先备份出来，别删原文件。<br><br>她最近查得最多的是 1996 年南关那件事。<br><br><span class="muted">浏览器历史被保留下来；部分本地缓存损坏。Chrome 同步用户：sy0718（仅恢复书签与历史）。</span><br><br>— 维修点临时说明</div><div style="padding:12px 18px;background:#f4f4f4;border-top:1px solid #ddd"><button id="resetBtn">清除本地进度重新开始</button></div>`}
 if(id==='folder'){title='旧资料';type='explorer';toolbar='<div class="win-toolbar"><span>组织　▼</span><span>打开</span><span>新建文件夹</span><div class="crumbbox">计算机 › 本地磁盘 (C:) › Users › shenyan › Desktop › 旧资料</div></div>';body=folderHTML()}
 if(id==='photo'){title='IMG_2010_1004.jpg - Windows 照片查看器';type='photo-viewer';body=photoHTML()}
 if(id==='timeline'){title='旧事时间表.xlsx - Microsoft Excel';type='sheet-viewer';toolbar='<div class="excel-ribbon">文件　 开始　 插入　 页面布局　 公式　 数据　 审阅　 视图</div><div class="formula-bar"><span>fx</span><div>日期核对</div></div>';body=timelineHTML()}
 if(id==='private'){title='调查备忘.lock';type='private-window';body=privateLoginHTML()}
 return `<section class="window center ${small?'small ':''}${type}"><div class="titlebar"><strong>${esc(title)}</strong><button class="win-close" id="winClose">×</button></div>${toolbar}<div class="window-body">${body}</div></section>`;
}
function bindWindow(){document.getElementById('winClose')?.addEventListener('click',closeWin);document.getElementById('resetBtn')?.addEventListener('click',()=>confirm('确定清除当前进度？')&&reset())}
function folderHTML(){
 return `<table class="file-list"><thead><tr><th>名称</th><th>修改日期</th><th>类型</th><th>大小</th></tr></thead><tbody>
 <tr><td><button class="file-link" data-local="clip">剪报索引_1996.txt</button></td><td>2026/08/29 22:14</td><td>文本文档</td><td>3 KB</td></tr>
 <tr><td><button class="file-link" data-local="hehui">户籍摘录_何惠.txt</button></td><td>2026/08/30 00:31</td><td>文本文档</td><td>1 KB</td></tr>
 <tr><td><button class="file-link" data-local="notes">核对项_未整理.txt</button></td><td>2026/09/01 01:08</td><td>文本文档</td><td>2 KB</td></tr>
 <tr><td><button class="file-link" data-local="notice">寻人启事_排版稿.doc.txt</button></td><td>2009/10/02 19:42</td><td>文本文档</td><td>5 KB</td></tr>
 <tr><td>公交线路_旧二路.pdf</td><td>2026/08/27 23:03</td><td>Adobe PDF</td><td>624 KB</td></tr>
 <tr><td>南关地图_1994.jpg</td><td>2026/08/28 20:52</td><td>JPEG 图像</td><td>1.2 MB</td></tr>
 <tr><td>购物清单.txt</td><td>2026/08/14 18:27</td><td>文本文档</td><td>1 KB</td></tr>
 <tr><td>户外鞋对比.xlsx</td><td>2026/07/22 12:11</td><td>Excel 工作表</td><td>18 KB</td></tr>
 </tbody></table><div id="localPreview" style="padding:14px 16px;border-top:1px solid #dfe3e5"></div>`;
}
function localPreview(type){
 const el=document.getElementById('localPreview'); if(!el)return;
 if(type==='clip') el.innerHTML=`<div class="note-paper"><b>1996 剪报索引</b><br>11/24 南关 / 儿童 / 一度失联<br>11/25 南关 / 怪老人 / 辟谣<br>11/27 已与家属取得联系<br><br>晚报数字馆：<button class="file-link" data-web="news">archive.heningdaily.local</button></div>`;
 if(type==='hehui') el.innerHTML=`<div class="scan"><b>户籍资料摘录（沈妍手抄）</b><br><br>姓名：何惠<br>出生：1988-03-09<br>原住址：南关区东河路 42 号<br>1996 年底迁出。<br><br><span style="color:#766">妈从来没跟我说过她具体是哪天转学的。</span></div>`;
 if(type==='notes') el.innerHTML=`<div class="note-paper">妈说她小时候“走丢过半天”。晚报写的是 5 个孩子，可论坛里有人说那几天学校至少少了一个班那么多人。<br><br>先别信论坛。把学校、报纸、警方的口径拆开看。<br><br>还有：那个老太太到底是在抓孩子，还是在找谁？</div>`;
 if(type==='notice'){mark('shenyan_notice');el.innerHTML=`<div class="scan"><div style="text-align:center;font-size:23px;font-weight:700">寻 人 启 事</div><br>沈妍，女，6岁，身高约118cm。2009年10月2日下午在南关早市附近与家人走散。走失时穿浅灰外套、红色布鞋。<br><br>联系人：何女士　联系电话：——<br><br><div class="muted">文件属性：创建于 2009-10-02 19:42；未发现打印记录。</div></div>`}
 el.querySelectorAll('[data-web]').forEach(b=>b.onclick=()=>openBrowser(b.dataset.web));
}
function photoHTML(){
 const locked=state.stage<6;
 if(locked) return `<div class="photo-frame"><img src="assets/mother_child_photo.jpg" alt="一张低清母女合影"></div><div class="caption" style="color:#c5c9cb">预览图可读取。原始 EXIF 区块尚未完成恢复；照片本身不会发生变化。</div>`;
 mark('photo_meta');
 return `<div class="photo-frame"><img src="assets/mother_child_photo.jpg" alt="一张低清母女合影"></div><div class="caption" style="color:#c5c9cb">仍然是开机时那张照片。现在只是能读取原始元数据。</div><table class="meta-table"><tr><td>文件名</td><td>IMG_2010_1004.jpg</td></tr><tr><td>原始拍摄时间</td><td><b>2009-10-04 10:18:22</b></td></tr><tr><td>相机</td><td>Canon PowerShot A590 IS</td></tr><tr><td>用户备注</td><td>回家第二天。</td></tr></table><div class="evidence" style="text-align:left;background:#e8e8e5">文件名后来被整理成 2010，EXIF 仍是 2009。照片里的两个人、姿势和背景都没有变化。</div>`;
}
function timelineHTML(){
 const canFinal=state.stage>=7;
 return `<div class="timeline-wrap"><div style="padding:12px 2px 8px;font-size:12px;color:#627062">工作表：2009_时间核对</div><table class="timeline"><thead><tr><th style="width:160px">日期</th><th>事件</th><th style="width:90px">间隔</th></tr></thead><tbody>
 <tr><td>2009-10-02</td><td>南关早市走散；寻人稿创建</td><td>—</td></tr>
 <tr><td>2009-10-03</td><td>西郊旧二路终点附近被找到</td><td>+1 天</td></tr>
 <tr><td>${has('final_date')?'2009-10-04':canFinal?'<input id="finalDate" inputmode="numeric" placeholder="照片拍摄日期">':'（尚未核对）'}</td><td>母女合影</td><td>${has('final_date')?'<b>+1 天</b>':'—'}</td></tr>
 </tbody></table>${canFinal&&!has('final_date')?'<button id="finalSubmit" style="margin-top:14px">写入日期</button><div id="finalMsg" class="caption">请按照片原始信息填写，格式 YYYY-MM-DD。</div>':''}
 ${has('final_date')?`<div class="final-file-row"><span class="final-file-label">附件</span><button id="finalPhoto" class="final-photo-link"><img src="assets/mother_child_photo.jpg" alt="照片缩略图"><span>IMG_2010_1004.jpg</span></button></div>`:''}
 ${has('final_photo')?'<div class="photo-back"><div class="photo-back-label">照片背面</div><div class="photo-back-hand">第二天，肯吃饭了。</div></div><div class="caption">没有新的文件。表格保存后可以关闭。</div>':''}</div>`;
}
function privateLoginHTML(){
 if(has('private_notes')) return `<div class="memo"><h2>调查备忘 / 未整理</h2><p>我一直以为妈只是迷信。她不让我养猫，不许亲戚叫我小名，连南关都不愿回。小时候那几张照片也一直被她收在柜子最里面。</p><p>可她八岁那次回来以后，家里做过几乎一样的事。</p><p>我六岁那两天，她对学校说我发烧。请假单是两天。寻人启事却已经排好版。</p><p><b>我已经不知道自己是不是还想查下去了。</b></p><p>还有那张照片。她为什么一直记“肯吃饭了”？</p><hr><p class="muted">待核：2009 年请假记录 / 邻居旧帖 / 照片原图 / 妈的旧日历。</p></div>`;
 return `<div class="private-screen" style="margin:-18px;min-height:430px"><div class="login"><div style="font-size:20px;margin-bottom:18px">本地加密备忘</div><label>账号 <span>输入沈妍常用账号</span><input id="loginUser" autocomplete="off" placeholder="例如：sy0718"></label><label>校验 <span>请输入何惠生日（8 位）</span><input id="loginPass" inputmode="numeric" autocomplete="off" placeholder="YYYYMMDD"></label><button id="loginSubmit">读取本地备忘</button><div id="loginMsg" style="margin-top:12px;color:#aab1b6"></div></div></div>`;
}

function bindLocal(){
 bindWindow();
 document.querySelectorAll('[data-local]').forEach(b=>b.onclick=()=>localPreview(b.dataset.local));
 const fs=document.getElementById('finalSubmit'); if(fs)fs.onclick=()=>{const v=document.getElementById('finalDate').value.trim().replace(/[/.]/g,'-');if(v==='2009-10-04'||v==='20091004'){mark('final_date');win='timeline';render()}else document.getElementById('finalMsg').textContent='日期与原图信息对不上。'}; const fp=document.getElementById('finalPhoto'); if(fp)fp.onclick=()=>{mark('final_photo');win='timeline';render()};
 const ls=document.getElementById('loginSubmit'); if(ls)ls.onclick=()=>{const u=document.getElementById('loginUser').value.trim().toLowerCase();const p=document.getElementById('loginPass').value.trim();if((u==='sy0718'||u==='sheny0718'||u==='shenyan0718')&&p==='19880309'){mark('private_notes');win='private';render()}else document.getElementById('loginMsg').textContent='账号或校验信息不匹配。账号可在浏览器自动填充记录中找到。'};
}

function openBrowser(route,push=true){browserRoute=route||'news';win='browser';if(push){historyStack=historyStack.slice(0,historyIndex+1);historyStack.push(browserRoute);historyIndex=historyStack.length-1}renderBrowserShell()}
function nav(route){openBrowser(route,true)}
function renderBrowserShell(){
 const bb=browserRoute.split(':')[0]; const title=bb.startsWith('news')||bb==='police'?'鹤宁晚报数字报':bb.startsWith('school')||bb==='teacher'?'鹤宁第二小学':bb.startsWith('forum')||bb==='thread'?'南关人家':bb.startsWith('culture')?'鹤宁地方文化馆':bb.startsWith('library')||bb==='libdoc'?'鹤宁市图书馆':'网页';
 app.innerHTML=desktopHTML()+`<section class="browser-window"><div class="browser-tabs"><div class="browser-tab">${esc(title)}</div></div><div class="browser-top"><button class="navbtn" id="backBtn" ${historyIndex<=0?'disabled':''}>‹</button><button class="navbtn" id="fwdBtn" ${historyIndex>=historyStack.length-1?'disabled':''}>›</button><input id="address" class="address" value="http://${esc(routeUrl(browserRoute))}"><button id="goBtn" class="go">转到</button><button id="browserClose" class="close-browser">×</button></div><div class="bookmarkbar"><button data-nav="news">鹤宁晚报</button><button data-nav="school">鹤宁二小旧站</button><button data-nav="forum">南关人家</button><button data-nav="culture">地方文化馆</button><button data-nav="library">市图书馆</button></div><div id="browserContent" class="browser-content">${renderRoute(browserRoute)}</div><div class="browser-status">网页已从沈妍的浏览记录与本地镜像恢复 · 旧站链接可能失效</div></section><button class="anchor-toggle" id="anchorToggle">沈妍便签</button><div id="anchorPanel" class="anchor-panel"></div>`;
 bindBrowser();renderAnchor();
}
function routeUrl(r){const base=r.split(':')[0];if(base==='police')return'archive.heningdaily.local/attachment/ng-police-1996';if(base.startsWith('news'))return'archive.heningdaily.local/'+(base==='news'?'':'view/'+encodeURIComponent(r.split(':')[1]||'search'));if(base.startsWith('school')||base==='teacher')return'old.hn2ps.edu.local/'+(base==='school'?'':'archive/'+base);if(base.startsWith('forum')||base==='thread')return'bbs.nanguan.local/'+(base==='forum'?'':'thread/'+(r.split(':')[1]||'search'));if(base.startsWith('culture'))return'culture.hening.local/'+(base==='culture'?'':'data/'+(r.split(':')[1]||'search'));if(base.startsWith('library')||base==='libdoc')return'lib.hening.local/'+(base==='library'?'':'local/'+(r.split(':')[1]||'search'));return'local/'+r}
function fromAddress(v){v=v.toLowerCase();if(v.includes('heningdaily'))return'news';if(v.includes('hn2ps'))return'school';if(v.includes('bbs')||v.includes('nanguan'))return'forum';if(v.includes('culture'))return'culture';if(v.includes('lib.hening'))return'library';return browserRoute}
function bindBrowser(){
 document.getElementById('browserClose').onclick=()=>{win=null;render()};
 document.getElementById('anchorToggle').onclick=()=>{anchorOpen=!anchorOpen;renderAnchor()};
 document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>nav(b.dataset.nav));
 document.getElementById('goBtn').onclick=()=>nav(fromAddress(document.getElementById('address').value));
 document.getElementById('address').onkeydown=e=>{if(e.key==='Enter')nav(fromAddress(e.currentTarget.value))};
 document.getElementById('backBtn').onclick=()=>{if(historyIndex>0){historyIndex--;browserRoute=historyStack[historyIndex];renderBrowserShell()}};
 document.getElementById('fwdBtn').onclick=()=>{if(historyIndex<historyStack.length-1){historyIndex++;browserRoute=historyStack[historyIndex];renderBrowserShell()}};
 bindRoute(browserRoute);
}
function renderRoute(r){
 const [base,arg]=r.split(':');
 if(base==='news') return newsHome(); if(base==='newsarticle') return newsArticle(arg); if(base==='newssearch') return newsSearch(arg);
 if(base==='police') return policeDoc();
 if(base==='school') return schoolHome(); if(base==='schoolarchive') return schoolArchive(); if(base==='schoolstudent') return schoolStudent(); if(base==='teacher') return teacherRecord(); if(base==='schoolnotice') return schoolNotice(arg);
 if(base==='forum') return forumHome(); if(base==='forumsearch') return forumSearch(arg); if(base==='thread') return forumThread(arg);
 if(base==='culture') return cultureHome(); if(base==='culturesearch') return cultureSearch(arg); if(base==='culturearticle') return cultureArticle(arg);
 if(base==='library') return libraryHome(); if(base==='librarysearch') return librarySearch(arg); if(base==='libdoc') return libraryDoc(arg);
 return newsHome();
}
function siteHeader(type,title){return `<div class="${type}">`}
function newsHome(){return `<div class="site news"><div class="mast"><div class="brand">鹤宁晚报</div><div>鹤宁日报社历史报刊数字化中心 · 1958—2018</div></div><div class="subnav"><span>首页</span><span>本地</span><span>民生</span><span>社会</span><span>文体</span><span>旧报检索</span></div><div class="wrap"><h2>历史报刊检索</h2><div class="news-searchbox"><div class="search-row"><label>全文关键词<input id="newsKw" placeholder="街道、人名或事件"></label><label>起始日期<input id="newsFrom" value="1996-11-20" placeholder="YYYY-MM-DD"></label><label>结束日期<input id="newsTo" value="1996-11-30" placeholder="YYYY-MM-DD"></label><button class="action" id="newsSearch">检索</button></div><div class="archive-stat">馆藏 21,842 期 · 1990—2002 年版面 OCR 已完成 · 原版扫描可能存在污损、网点和错字</div></div><div style="margin-top:28px" class="main-grid"><div><h3 style="border-bottom:2px solid #222;padding-bottom:7px">1996 年 11 月整理批次</h3>${normalNews.slice(0,12).map(n=>`<div class="news-row"><div class="date">${n[0]}</div><div><button class="linklike" data-news="${n[0]}">${n[1]}</button><div class="muted">${n[2]} · 历史版面</div></div></div>`).join('')}</div><aside class="side"><b>检索说明</b><p>关键词来自 OCR 全文。旧报纸版面存在断字，建议同时尝试地名和日期。</p><hr><b>本月入库</b><p>1996 年 10—12 月胶片扫描 276 版。</p><hr><b>版权说明</b><p>仅供地方文献查阅，不代表当前报道状态。</p></aside></div></div></div>`}
function newsSearch(q=''){const raw=decodeURIComponent(q||'南关');const [kw0,from='',to='']=raw.split('|');const kw=kw0||'南关';const relevant=/南关|儿童|老人|猫脸|兰兰/.test(kw);let rows=relevant?normalNews.filter(n=>['1996-11-24','1996-11-25','1996-11-26','1996-11-27'].includes(n[0])):normalNews.slice(0,10);if(from)rows=rows.filter(n=>n[0]>=from);if(to)rows=rows.filter(n=>n[0]<=to);return `<div class="site news"><div class="mast"><div class="brand">鹤宁晚报</div><div>数字报刊资料库</div></div><div class="subnav"><span>旧报检索</span><span>版面浏览</span><span>馆藏说明</span></div><div class="wrap"><p><button class="linklike" data-nav="news">← 修改检索条件</button></p><h2>检索结果：${esc(kw)}</h2><div class="muted" style="margin:-10px 0 18px">${from||'不限'} 至 ${to||'不限'} · ${rows.length} 条结果</div><div class="news-list">${rows.map(n=>`<div class="news-row"><div class="date">${n[0]}</div><div><button class="linklike" data-news="${n[0]}">${n[1]}</button><div class="muted">${n[2]} · 第 3 版 · 版面扫描</div></div></div>`).join('')||'<p class="muted">没有匹配结果。</p>'}</div></div></div>`}
function newsArticle(date){
 const common=`<div class="site news"><div class="mast"><div class="brand">鹤宁晚报</div><div>数字报刊资料库</div></div><div class="wrap article"><button class="linklike" data-nav="news">← 返回数字报刊</button>`;
 if(date==='1996-11-24'){mark('news5');return common+`<h1 class="headline">南关五名儿童一度与家长失去联系</h1><div class="muted">1996-11-24 · 社会版</div><p>本报讯　昨日傍晚，南关一带有五名低龄儿童在放学及外出途中一度与家长失去联系。经家属、学校及辖区民警寻找，截至今晨已有两名儿童由家属接回，其余情况仍在核实。</p><p>鹤宁第二小学表示，当日学校正常上课，个别学生因病或家庭原因缺勤。校方已临时要求低年级学生放学后由家长接送。</p><p>近日民间关于“怪老人夜间找孩子”的说法较多，警方提醒市民不要传播未经证实的信息。</p><div class="evidence"><b>这里写的是“五名一度失联”。</b>报道没有说“五人全部立案”，也没有说学校只有五人缺课。</div><p>相关：<button class="linklike" data-news="1996-11-25">关于南关“怪老人”传言的情况说明</button></p></div></div>`}
 if(date==='1996-11-25')return common+`<h1 class="headline">关于南关“怪老人”传言的情况说明</h1><div class="muted">1996-11-25 · 社会版</div><p>南关街道办昨日表示，近期所谓“猫脸老人抓孩子”等说法与已掌握事实不符。居民确曾反映一名面部有旧疾的老妇人在夜间沿街寻找儿童，询问内容多为“有没有见过兰兰”。</p><p>记者核实，该老妇赵淑琴的外孙女冯小兰于 11 月 23 日傍晚走失。赵某于次日清晨突发疾病去世。</p><p>街道工作人员呼吁不要将老人外貌与儿童失联事件混为一谈。</p><div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap"><img src="assets/zhao_newsprint_photo.jpg" alt="旧报纸中的赵淑琴照片" style="width:145px;border:1px solid #777;background:#ddd;padding:3px"><div class="muted" style="max-width:420px">原报扫描中的照片网点严重，右半脸有重影和折痕。后来的网络转载多使用这一版低清图。</div></div></div></div>`;
 if(date==='1996-11-27')return common+`<h1 class="headline">南关多名儿童已与家属取得联系</h1><div class="muted">1996-11-27 · 社会版</div><p>截至昨晚，此前一度与家长失去联系的儿童已有四人与家属团聚，另有一名仍在寻找。辖区民警表示，部分家属在正式报案前已自行找到孩子，因此公开案号数量与早期媒体统计并不完全一致。</p><p>警方后续公开材料可见：<button class="linklike" data-nav="police">南关辖区 1996 年 11 月接处警摘要</button>。</p></div></div>`;
 return common+`<h1 class="headline">${esc(normalNews.find(n=>n[0]===date)?.[1]||'历史报道')}</h1><div class="muted">${esc(date)}</div><p>这是一篇与当前调查无直接关系的地方新闻。报纸档案中保留了大量同版民生、交通和文体内容。</p></div></div>`
}
function policeDoc(){mark('police4');return `<div class="site library"><div class="head"><div class="libname">鹤宁市公开资料镜像</div></div><div class="wrap"><div class="doc-view"><div style="text-align:center"><h2>南关辖区 1996 年 11 月接处警摘要</h2><div class="muted">公开摘录 / 后期数字化</div></div><table class="school-table" style="margin-top:24px"><tr><th>日期</th><th>编号</th><th>事项</th><th>结果</th></tr><tr><td>11/23</td><td>NG961123-07</td><td>儿童走失</td><td>转失踪登记</td></tr><tr><td>11/23</td><td>NG961123-11</td><td>儿童走失</td><td>次日家属带回</td></tr><tr><td>11/24</td><td>NG961124-02</td><td>儿童走失</td><td>转失踪登记</td></tr><tr><td>11/24</td><td>NG961124-04</td><td>儿童走失</td><td>继续查找</td></tr><tr><td>11/24</td><td>口头求助</td><td>何姓家属称女童未归</td><td><b>家属后电话称已找到，未生成正式案号</b></td></tr></table><div class="evidence">正式案号是 4 个；另有 1 起口头求助在立案前撤回。</div></div></div></div>`}

function schoolHome(){return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学</div><div>让每一个孩子平安、健康、会学习</div></div></div><div class="nav"><div class="wrap"><span>学校首页</span><span>学校概况</span><span>校务公开</span><span>教育教学</span><span>德育之窗</span><span>家校园地</span><span>校史资料</span></div></div><div class="wrap"><div class="school-hero"></div><div class="school-grid"><aside class="leftmenu"><h3>栏目导航</h3><div>学校简介</div><div>领导班子</div><div>师资队伍</div><div>校园荣誉</div><div>家长学校</div><div><button class="linklike" data-nav="schoolarchive">校史资料 / 旧附件</button></div><div>联系我们</div></aside><section><h2 style="font-size:18px;color:#174d75;border-bottom:2px solid #5e8cab;padding-bottom:5px">校园动态</h2><div class="ordinary-list">${schoolNotices.map((x,i)=>`<div><span class="date">[${x[0]}]</span><button class="linklike" data-schoolnotice="${i}">${x[1]}</button></div>`).join('')}</div><h3 style="font-size:15px;color:#174d75;margin-top:18px">通知公告</h3><div class="ordinary-list"><div><span class="date">[2012-06-30]</span><a href="javascript:void(0)">暑假值班表下载</a></div><div><span class="date">[2012-06-26]</span><a href="javascript:void(0)">期末家长会安排</a></div><div><span class="date">[2012-06-18]</span><a href="javascript:void(0)">图书室暑期闭馆通知</a></div></div></section></div><div class="old-counter">您是本站第 <b>0</b><b>3</b><b>7</b><b>8</b><b>1</b><b>2</b> 位访问者　|　建议使用 IE8 1024×768 浏览</div></div></div>`}
function schoolNotice(i){i=Number(i);const x=schoolNotices[i]||schoolNotices[0];return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学</div></div></div><div class="nav"><div class="wrap"><span>学校首页</span><span>校园动态</span><span>通知公告</span></div></div><div class="wrap"><div class="crumb">首页 &gt; 校园动态 &gt; 正文</div><p><button class="linklike" data-nav="school">返回首页</button></p><h2 style="text-align:center;font-size:20px">${esc(x[1])}</h2><div class="muted" style="text-align:center;border-bottom:1px dotted #aaa;padding-bottom:8px">发布日期：${x[0]}　来源：校办公室</div><div style="line-height:2;margin:20px 22px"><p>各班级、各位家长：</p><p>根据学校本学期工作安排，现将有关事项通知如下。请各班结合实际做好学生到校、离校、安全教育和家校沟通工作；值班教师按表签到，发现异常及时与家长联系。</p><p>请班主任于本周五前将反馈情况报送教导处。</p><p style="text-align:right">鹤宁第二小学<br>${x[0]}</p></div></div></div>`}
function schoolArchive(){return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学</div></div></div><div class="nav"><div class="wrap"><span>学校首页</span><span>校史资料</span><span>旧附件镜像</span></div></div><div class="wrap"><div class="crumb">首页 &gt; 校史资料 &gt; 旧附件镜像</div><h2 style="font-size:18px;color:#174d75">1996 年校务附件</h2><p>以下文件为 2009 年校史资料整理时建立的扫描索引。个别学籍字段由纸卡人工录入，缺项保留为空。</p><div class="main-grid"><div><h3 style="font-size:15px">附件目录</h3><div class="table-scroll"><table class="school-table"><tr><th>文件</th><th>日期</th><th>类型</th></tr><tr><td><button class="linklike attach" id="absenceOpen">1996-11-25_三年级考勤汇总.xls</button></td><td>1996-11-25</td><td>XLS</td></tr><tr><td><span class="attach">1996-11_低年级放学管理通知.doc</span></td><td>1996-11-26</td><td>DOC</td></tr><tr><td><span class="attach">1996-12_转学办理汇总.xls</span></td><td>1996-12-06</td><td>XLS</td></tr><tr><td><span class="attach">1996秋_值周记录_三年级.doc</span></td><td>1996-12-18</td><td>DOC</td></tr><tr><td><span class="attach">1996_校医室登记薄_目录.pdf</span></td><td>1997-01-04</td><td>PDF</td></tr></table></div><h3 style="margin-top:24px;font-size:15px">旧学籍查询</h3><div class="search-row"><label>学生姓名<input id="studentName" placeholder="请输入学生姓名"></label><label>出生日期<input id="studentDob" inputmode="numeric" placeholder="请输入何惠出生日期（YYYYMMDD）"></label><button class="action" id="studentSearch">查询</button></div><div id="studentMsg" class="caption"></div></div><aside class="side"><b>资料说明</b><p>旧系统只支持姓名与出生日期联合校验，不提供模糊查询。</p><p class="muted">数据整理：校史办公室<br>最后导入：2012-06-18</p></aside></div><div id="absenceArea" style="margin-top:22px"></div></div></div>`}
function absenceTable(){mark('school6');return `<div class="scan registry-scan"><b>三年级 11 月 25 日考勤异常汇总</b><table class="school-table" style="margin-top:14px"><tr><th>姓名</th><th>班级</th><th>连续缺勤</th><th>备注</th></tr><tr><td>何惠</td><td>三(2)</td><td>2 天</td><td>家属寻找</td></tr><tr><td>冯小兰</td><td>三(1)</td><td>3 天+</td><td>未归</td></tr><tr><td>周斌</td><td>三(4)</td><td>1 天</td><td>家属已接回</td></tr><tr><td>陈晓梅</td><td>三(3)</td><td>1 天</td><td>家属已接回</td></tr><tr><td>王涛</td><td>三(1)</td><td>2 天</td><td>家属寻找</td></tr><tr><td>李文杰</td><td>三(2)</td><td>3 天</td><td><b>市二院肺炎住院</b></td></tr></table><div class="evidence">学校记的是“6 人连续缺课”，其中李文杰从未失踪。</div></div>`}
function schoolStudent(){mark('hehui');return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学</div></div></div><div class="wrap"><p><button class="linklike" data-nav="schoolarchive">← 返回旧附件</button></p><h2>学生历史记录：何惠</h2><table class="school-table"><tr><th>姓名</th><td>何惠</td><th>出生</th><td>1988-03-09</td></tr><tr><th>原班级</th><td>三年级二班</td><th>状态</th><td>1996-11-29 转出</td></tr><tr><th>异常缺勤</th><td>11/23 傍晚起，约 41 小时</td><th>家属备注</th><td>11/25 上午已找到</td></tr></table><h3 style="margin-top:22px">关联附件</h3><p><button class="linklike" data-nav="teacher">班主任工作记录_1996-11-27.pdf</button></p><p>转学申请摘要：家属称学生受惊，近期不宜继续参加集体活动；申请尽快转学。</p><div class="evidence">何惠就是警方摘要里那起“家属先找到、未生成正式案号”的女童。</div></div></div>`}
function teacherRecord(){mark('address17');return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学 · 扫描附件</div></div></div><div class="wrap"><div class="scan stamp"><p>11月27日。何惠返校。</p><p>上午点名时叫“惠惠”无回应，叫全名后抬头。第一节前进教室，站到第三排靠窗座位旁，后由同学提醒回原位。</p><p>午后谈话，问“家住哪里”，先答：<b>槐树巷17号</b>。后其母进办公室，称孩子这两天受惊，不要再追问。</p><p>家长要求今后在校只叫大名。</p><p>11月29日办理转学。</p></div><div class="evidence">“槐树巷 17 号”不是何惠家的地址。它值得单独核对。</div></div></div>`}

function forumHome(){return `<div class="site forum"><div class="topline">南关人家 BBS　[游客]　登录　注册　帮助　老帖存档</div><div class="wrap"><div class="logo">南关人家 <span style="font-size:11px;font-weight:400">nanguanrenjia.cn</span></div><div class="forum-nav"><span>社区杂谈</span><span>衣食住行</span><span>校园往事</span><span>寻人寻物</span><span>老城记忆</span></div><div class="bbs-tools"><input id="forumKw" placeholder="帖子 / 用户 / 街道" style="height:27px;width:min(390px,72%)"><button id="forumSearch" class="action" style="height:27px">搜索老帖</button>　<span class="muted">今日 42　昨日 108　主题 18,642</span></div><div class="thread-list">${forumThreads.map((t,i)=>`<div class="thread-row"><div><button class="linklike" data-thread="${i}">${t[1]}</button><div class="muted">${t[0]}</div></div><div>最后：${t[2]}</div><div>${t[3]} 回复</div></div>`).join('')}</div><div class="pager">首页　1　2　3　4　…　下一页　　版主：南关照相馆 / 老何修车</div></div></div>`}
function forumSearch(q=''){const kw=decodeURIComponent(q||'');let inds=[];if(/兰兰|猫脸|老太太|老人/.test(kw))inds=[3];else if(/南关|孩子|早市|沈妍/.test(kw))inds=[0,3];else if(/槐树巷|门牌/.test(kw))inds=[5];else inds=[1,2,6];return `<div class="site forum"><div class="topline">南关人家 BBS · 搜索</div><div class="wrap"><p><button class="linklike" data-nav="forum">← 返回论坛</button></p><h3>搜索：${esc(kw)}</h3><div class="thread-list">${inds.map(i=>{const t=forumThreads[i];return `<div class="thread-row"><div><button class="linklike" data-thread="${i}">${t[1]}</button><div class="muted">${t[0]}</div></div><div>${t[2]}</div><div>${t[3]} 回复</div></div>`}).join('')}</div></div></div>`}
function forumThread(i){i=Number(i);if(i===3)mark('zhao');if(i===0)mark('neighbor');const t=forumThreads[i]||forumThreads[1];let posts='';if(i===3)posts=`${post('锅炉房老李','2005-11-21 21:08','九几年那阵都说是猫脸老太太抓小孩。我那时就在南关锅炉房值夜班，印象里根本不是这么回事。')} ${post('旧邮局','2005-11-21 21:44','我记得那个老太太脸确实有毛病，一边眼睛和嘴角往下。她前一天晚上一直在问人：“见没见兰兰？”不是追孩子。')} ${post('槐树下喝茶','2005-11-22 08:16','兰兰就是她外孙女冯小兰。孩子那晚没回来。老太太第二天清早就没了，后来守灵院里跑过一只黑猫，几件事才越传越邪。')} ${post('锅炉房老李','2005-11-22 09:03','学校也没停课，停的是晚自习。后来网上说成全城停课了。')}`;
else if(i===0)posts=`${post('槐树下喝茶','2010-10-04 07:21','昨天下午去西郊旧二路车终点买零件，看见一个女的抱着小姑娘哭。听旁边人说孩子前天下午在南关早市走散，昨天三点多才找到，算下来三十来个小时。')} ${post('南关照相馆','2010-10-04 09:18','是不是东河路何家的？早市那边前晚确实有人问。奇怪的是他们没贴寻人启事。')} ${post('槐树下喝茶','2010-10-04 10:40','应该是。小姑娘看着没受伤，就是一直不肯上她妈那辆车，后来还是抱走的。')}`;
else posts=`${post(t[2],t[0]+' 18:20','这是一条普通的南关生活讨论帖。')} ${post('南关照相馆',t[0]+' 19:03','顶一下，知道的邻居补充。')}`;
return `<div class="site forum"><div class="topline">南关人家 BBS</div><div class="wrap"><p><button class="linklike" data-nav="forum">← 论坛首页</button></p><h2 style="font-size:18px">${esc(t[1])}</h2>${posts}</div></div>`}
function post(user,time,body){return `<div class="post"><div class="post-user"><b>${esc(user)}</b><br><span class="muted">注册居民</span></div><div class="post-body"><span class="floor">${esc(time)}</span>${body}<div class="sig">住在南关，说南关的事。</div></div></div>`}

function cultureHome(){return `<div class="site culture"><div class="head"><div class="title">鹤宁地方文化馆</div><div>地方文化资料数字服务</div></div><div class="bar"><span>首页</span><span>馆务公开</span><span>地方志</span><span>民俗资料</span><span>口述史</span><span>资料下载</span></div><div class="wrap"><div class="culture-notice"><b>资料站公告：</b> 2011 年馆藏纸本目录已完成第二批录入。部分口述资料保留方言原句，引用请注明采集年份。</div><div class="main-grid" style="margin-top:16px"><div><h2 style="font-size:19px;border-bottom:2px solid #6d3b35;padding-bottom:6px">地方资料目录</h2>${cultureEntries.map((x,i)=>`<div class="entry"><button class="linklike" data-culture="${i}">${x[1]}</button><div class="muted">[${x[0]}]　${x[2]}</div></div>`).join('')}</div><aside class="side"><h3 style="font-size:15px">站内资料检索</h3><input id="cultureKw" placeholder="乳名 / 守灵 / 街巷" style="width:100%;height:29px"><button id="cultureSearch" class="action" style="margin-top:6px;width:100%">检索</button><p class="muted">可按街巷名、民俗词和年代检索。</p><hr><b>开放时间</b><p>周二至周日<br>09:00—16:30</p><b>资料电话</b><p>0716-228174</p></aside></div></div></div>`}
function cultureSearch(q=''){const kw=decodeURIComponent(q||'');let inds=/乳名|守灵|猫/.test(kw)?[0,5]:/槐树巷|门牌/.test(kw)?[4,1]:[1,2,3];return `<div class="site culture"><div class="head"><div class="title">鹤宁地方文化馆</div></div><div class="wrap"><p><button class="linklike" data-nav="culture">← 返回目录</button></p><h2>检索：${esc(kw)}</h2>${inds.map(i=>{const x=cultureEntries[i];return `<div class="entry"><button class="linklike" data-culture="${i}">${x[1]}</button><div class="muted">${x[0]}　${x[2]}</div></div>`}).join('')}</div></div>`}
function cultureArticle(i){i=Number(i);const x=cultureEntries[i]||cultureEntries[2];if(i===0||i===5)mark('folkname');if(i===4)mark('address17');let body='';if(i===0)body=`<p>鹤宁旧式丧俗中，守灵期间忌家畜近棺，并不只针对猫。南关一带老人尤其忌讳“猫蹿灵”后立即反复呼喊幼童乳名。</p><p>口述资料中常见一句：“猫若蹿灵，孩子先莫叫乳名。”其解释并不统一，有人说是怕孩子受惊，有人说只是长辈留下的规矩。</p><p>这一说法在上世纪八九十年代仍有人遵守，但地方志未将其列为正式礼俗。</p>`;else if(i===5)body=`<p>乳名在家庭内部使用频繁，但遇到丧事、走失、惊吓等情况，部分老人会临时改叫大名。其理由多与“压惊”“怕叫魂”有关。</p><p>这种做法没有统一仪式，也不能简单视为宗教禁忌。</p>`;else if(i===4)body=`<div class="scan-thumb">纸本扫描缩略图<br>《南关旧门牌册》<br>第 17 页</div><p>槐树巷在 2000 年旧城改造后并入南关路。1987—1998 年门牌表如下：</p><table class="school-table"><tr><th>旧门牌</th><th>户主 / 使用人</th><th>新编号</th></tr><tr><td>槐树巷 15 号</td><td>钱守义</td><td>南关路 88 号</td></tr><tr><td><b>槐树巷 17 号</b></td><td><b>赵淑琴 / 冯家</b></td><td>拆除</td></tr><tr><td>槐树巷 19 号</td><td>街道仓房</td><td>拆除</td></tr></table><div class="evidence">班主任记录里的“槐树巷17号”，正是赵淑琴家的旧门牌。</div>`;else body=`<p>这是一篇普通地方文化资料，记录鹤宁街巷、节气和社区生活的细节。</p><p>资料来自文化馆历年采集与居民捐赠。</p>`;return `<div class="site culture"><div class="head"><div class="title">鹤宁地方文化馆</div></div><div class="wrap article"><button class="linklike" data-nav="culture">← 返回资料目录</button><h1>${esc(x[1])}</h1><div class="muted">${x[0]} · ${x[2]}</div>${body}</div></div>`}

function libraryHome(){return `<div class="site library"><div class="head"><div class="libname">鹤宁市图书馆 · 地方文献中心</div></div><div class="nav">馆藏目录　数字报刊　地方志　旧地图　社区资料　读者服务</div><div class="wrap"><h2>地方文献联合检索</h2><div class="search-row"><label>题名 / 关键词<input id="libKw" placeholder="门牌、何惠、2009、南关"></label><label>资料类型<select><option>全部类型</option><option>报刊</option><option>地方志</option><option>社区资料</option></select></label><button class="action" id="libSearch">检索</button></div><div style="margin-top:24px"><div class="muted" style="font-size:11px;padding-bottom:7px;border-bottom:2px solid #496b77">地方文献专题库 · 共 8,412 条书目记录</div>${libEntries.map((x,i)=>`<div class="lib-result"><div class="lib-code">${x[0]}</div><button class="linklike" data-lib="${i}">${x[1]}</button><div class="muted">${x[2]} · 馆内阅览 / 数字镜像</div></div>`).join('')}</div></div></div>`}
function librarySearch(q=''){const kw=decodeURIComponent(q||'');let inds=/门牌|槐树巷/.test(kw)?[1,4]:/2009|沈妍|请假/.test(kw)?[2,3]:[0,1,5];return `<div class="site library"><div class="head"><div class="libname">鹤宁市图书馆 · 检索结果</div></div><div class="wrap"><p><button class="linklike" data-nav="library">← 返回</button></p><h2>关键词：${esc(kw)}</h2>${inds.map(i=>{const x=libEntries[i];return `<div class="lib-result"><div class="lib-code">${x[0]}</div><button class="linklike" data-lib="${i}">${x[1]}</button><div class="muted">${x[2]}</div></div>`}).join('')}</div></div>`}
function libraryDoc(i){i=Number(i);let body='';if(i===1){mark('address17');body=`<h2>南关街道旧门牌对照表</h2><table class="school-table"><tr><th>旧址</th><th>登记户主</th><th>备注</th></tr><tr><td>槐树巷 17 号</td><td><b>赵淑琴</b></td><td>冯家长期居住</td></tr><tr><td>东河路 42 号</td><td>何家</td><td>1996 年底迁出</td></tr></table>`}else if(i===2){mark('shenyan_absence');body=`<h2>鹤宁实验小学 2009 年请假资料摘录</h2><div class="scan"><p>学生：沈妍　　一年级二班</p><p>请假：2009-10-02 至 2009-10-03</p><p>事由：<b>发烧，在家休息</b></p><p>家长签字：何惠</p></div><div class="evidence">这两天恰好与本地那张未打印的寻人启事重合。</div>`}else if(i===3){body=`<h2>南关居民口述资料第九辑</h2><p>本辑收录 2008—2010 年社区交通、早市、拆迁回忆。部分内容转录自“南关人家”论坛。</p><p>建议按“早市 / 孩子 / 旧二路终点”检索论坛原帖。</p>`}else if(i===5){mark('calendar');body=`<h2>捐赠资料：何惠旧日历摘录</h2><div class="scan diary-scan"><p class="diary-context">10月2日　学校请假。</p><p><b>10月3日　第一天，不认床。</b></p><p><b>10月4日　第二天，肯吃鸡蛋羹。</b></p><p><b>10月5日　第三天，叫我妈了。</b></p><p class="diary-context">学校那边说好了，只叫大名。猫送走。南关不去。</p><p><b>以后不记了。</b></p></div>`}else body=`<h2>${esc(libEntries[i]?.[1]||'地方文献')}</h2><p>数字化馆藏页面。该条资料与当前主线没有直接关系。</p>`;return `<div class="site library"><div class="head"><div class="libname">鹤宁市图书馆 · 文献阅览</div></div><div class="wrap"><button class="linklike" data-nav="library">← 返回馆藏</button><div class="doc-view" style="margin-top:16px">${body}</div></div></div>`}

function bindRoute(r){
 document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>nav(b.dataset.nav));
 document.querySelectorAll('[data-news]').forEach(b=>b.onclick=()=>nav('newsarticle:'+b.dataset.news));
 document.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>nav('thread:'+b.dataset.thread));
 document.querySelectorAll('[data-culture]').forEach(b=>b.onclick=()=>nav('culturearticle:'+b.dataset.culture));
 document.querySelectorAll('[data-lib]').forEach(b=>b.onclick=()=>nav('libdoc:'+b.dataset.lib));
 document.querySelectorAll('[data-schoolnotice]').forEach(b=>b.onclick=()=>nav('schoolnotice:'+b.dataset.schoolnotice));
 const doNewsSearch=()=>{const kw=document.getElementById('newsKw').value.trim()||'南关 儿童';const f=document.getElementById('newsFrom')?.value.trim()||'';const t=document.getElementById('newsTo')?.value.trim()||'';nav('newssearch:'+encodeURIComponent([kw,f,t].join('|')))}; document.getElementById('newsSearch')?.addEventListener('click',doNewsSearch); ['newsKw','newsFrom','newsTo'].forEach(id=>document.getElementById(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')doNewsSearch()}));
 const doForum=()=>nav('forumsearch:'+encodeURIComponent(document.getElementById('forumKw').value.trim())); document.getElementById('forumSearch')?.addEventListener('click',doForum); document.getElementById('forumKw')?.addEventListener('keydown',e=>{if(e.key==='Enter')doForum()});
 const doCulture=()=>nav('culturesearch:'+encodeURIComponent(document.getElementById('cultureKw').value.trim())); document.getElementById('cultureSearch')?.addEventListener('click',doCulture); document.getElementById('cultureKw')?.addEventListener('keydown',e=>{if(e.key==='Enter')doCulture()});
 const doLib=()=>nav('librarysearch:'+encodeURIComponent(document.getElementById('libKw').value.trim())); document.getElementById('libSearch')?.addEventListener('click',doLib); document.getElementById('libKw')?.addEventListener('keydown',e=>{if(e.key==='Enter')doLib()});
 document.getElementById('absenceOpen')?.addEventListener('click',()=>{document.getElementById('absenceArea').innerHTML=absenceTable();renderAnchor()});
 const doStudent=()=>{const n=document.getElementById('studentName').value.trim();const d=document.getElementById('studentDob').value.trim().replace(/[-/.]/g,'');if(n==='何惠'&&d==='19880309')nav('schoolstudent');else document.getElementById('studentMsg').textContent='未找到匹配记录。请核对姓名与出生日期。'}; document.getElementById('studentSearch')?.addEventListener('click',doStudent); ['studentName','studentDob'].forEach(id=>document.getElementById(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')doStudent()}));
}

function triggerBlackout(){
 if(!C.shouldBlackout(state)){win='folder';render();return}
 state=C.markBlackout(state);save();blackout.classList.add('show');blackout.classList.remove('text-on');blackout.setAttribute('aria-hidden','false');lowTone();
 setTimeout(()=>blackout.classList.add('text-on'),700);
 setTimeout(()=>{blackout.classList.remove('show','text-on');blackout.setAttribute('aria-hidden','true');win='folder';render();setTimeout(()=>{const p=document.getElementById('localPreview');if(p)p.innerHTML='<div class="note-paper"><b>cache_1127.tmp</b><br><br>读取失败。文件头损坏。<br><br><span style="color:#777">没有可恢复的正文。</span></div>'},50)},3000);
}
function renderEnd(){
 app.innerHTML=`<div class="end-screen" style="background:#0d2231 url('assets/wallpaper.jpg') center/cover no-repeat"><div class="end-inner"><div style="font-size:12px;color:#9aa8b0;margin-bottom:22px">Windows 已锁定</div><div class="photo-frame" style="padding:5px;border-color:#8aa0ad;background:#dfe7ea"><img src="assets/mother_child_photo.jpg" alt="母女合影" style="width:152px;max-width:42vw"></div><div style="font-size:21px;margin-top:12px;text-shadow:0 1px 2px #000">沈妍</div><div class="end-note">照片信息：回家第二天。</div><div class="end-small">母亲留下的旧箱子已由家属送到医院。没有新的消息。</div><div style="margin-top:54px;color:#a9b2b7;font-size:11px">结束</div><button id="restartEnd" style="margin-top:17px;background:rgba(20,30,36,.56);border:1px solid #6d7d85;color:#c4cbd0;padding:6px 11px">重新开始</button></div></div>`;
 document.getElementById('restartEnd').onclick=()=>confirm('确定重新开始？')&&reset();
}
// Initial bind / delegated local window bindings after each desktop render.
const originalRender=render;
render=function(){originalRender();if(win&&win!=='browser')bindLocal()};
['pointerdown','keydown','wheel','touchstart'].forEach(ev=>document.addEventListener(ev,noteActivity,{passive:true}));
armIdleHint();
render();
})();
