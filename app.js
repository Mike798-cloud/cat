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
let minimizedWin=null;
let winMax=false;
let browserTabs=['news'];
let idleTimer=null;
const app=document.getElementById('app');
const blackout=document.getElementById('blackout');

function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function reset(){localStorage.removeItem(KEY);state=C.fresh();win=null;minimizedWin=null;winMax=false;browserRoute='news';browserTabs=['news'];historyStack=[];historyIndex=-1;render();}
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
 ['2012-10-04','南关早市附近昨天是不是在找孩子？','槐树下喝茶',18],['2012-09-28','二路车终点到底搬哪儿了','老何修车',9],['2008-04-12','求租南关一室一厅','小北风',12],['2005-11-21','说说九几年那个猫脸老太太到底怎么传起来的','锅炉房老李',47],['2003-06-07','鹤宁二小以前是不是有个后门？','南关照相馆',21],['2001-02-03','槐树巷拆迁前老门牌谁还记得','旧邮局',33],['1999-08-16','南关最好吃的糖糕是哪家','三轮车王师傅',26],['1998-12-11','寻找老同学：二小89级三班','梅子',14],['2009-12-02','南关哪家修收音机还行','东河口',7],['2007-06-18','早市搬了以后买菜真麻烦','小叶子',22],['2006-03-11','谁有旧二路车时刻表','二厂宿舍',5],['2004-09-19','求推荐给孩子补习作文的老师','秋雨',16],['2002-12-27','南关澡堂什么时候关门','老邢',11],['2000-05-14','街坊们有谁会修凤凰车','一把扳手',8]
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
 const task=minimizedWin?taskLabel(minimizedWin):'';
 return `<div class="os"><div class="desktop">
   <div class="desk-icons">
    ${deskIcon('computer','computer','我的电脑')}
    ${deskIcon('trash','recycle','回收站')}
    ${deskIcon('folder','syfolder','沈妍的资料')}
    ${deskIcon('folder','unsorted','未整理')}
    ${deskIcon('folder','folder','1996资料')}
    ${deskIcon('browser','browser','Internet Explorer')}
    ${deskIcon('folder','photos','照片')}
    ${deskIcon('lock','private','备份_旧')}
    ${deskIcon('doc','thesis','毕业论文.doc')}
    ${deskIcon('doc','doc','备忘.txt')}
    ${deskIcon('sheet','timeline','调查记录.xls')}
    ${deskIcon('photo','photo','IMG_2002.jpg')}
    ${deskIcon('media','media','Windows Media Player')}
    ${deskIcon('qq','qq','腾讯QQ')}
    ${deskIcon('zip','zip','旧照片.zip')}
    ${cacheReady?deskIcon('tmp','cache','cache_1127.tmp'):''}
   </div>
   <div id="startMenu" class="start-menu" aria-hidden="true">
    <div class="start-user"><div class="start-avatar">沈</div><b>沈妍</b></div>
    <div class="start-columns"><div class="start-left">
      <button data-open="browser"><img src="assets/icons/browser.png" alt="">Internet Explorer</button>
      <button data-open="doc"><img src="assets/icons/doc.png" alt="">记事本</button>
      <button data-open="timeline"><img src="assets/icons/sheet.png" alt="">Microsoft Excel</button>
      <button data-open="media"><img src="assets/icons/media.png" alt="">Windows Media Player</button>
      <hr><button data-open="photos"><img src="assets/icons/photo.png" alt="">图片收藏</button>
    </div><div class="start-right">
      <button data-open="syfolder">我的文档</button><button data-open="photos">我的图片</button><button data-open="computer">我的电脑</button><hr><button data-open="control">控制面板</button><button data-open="help">帮助和支持</button><button data-open="search">搜索</button><button data-open="run">运行...</button>
    </div></div>
    <div class="start-footer"><span>注销</span><span>关闭计算机</span></div>
   </div>
 </div>
 <div class="taskbar"><button class="start-button" id="startButton" aria-label="开始"><span class="start-flag"></span><b>开始</b></button><button class="task-app" data-open="computer"><img src="assets/icons/computer.png" alt="">沈妍的电脑</button><button class="task-app" data-open="browser"><img src="assets/icons/browser.png" alt="">Internet Explorer</button>${task?`<button class="task-app minimized-task" data-restore="${minimizedWin}">${esc(task)}</button>`:''}<div class="tray"><span class="tray-net"></span><span class="tray-speaker"></span><div class="clock">${clock()}<br>2026/09/12</div></div></div>
 <button class="anchor-toggle" id="anchorToggle" title="沈妍的便笺">便笺</button><div id="anchorPanel" class="anchor-panel"><b>${esc(a[0])}</b><div class="sub">${esc(a[1])}</div></div>
 </div>`;
}
function taskLabel(id){return ({computer:'我的电脑',recycle:'回收站',syfolder:'沈妍的资料',unsorted:'未整理',photos:'照片',folder:'1996资料',thesis:'毕业论文.doc',photo:'IMG_2002.jpg',timeline:'调查记录.xls',private:'调查备忘.lock',doc:'备忘.txt',control:'控制面板',help:'帮助和支持',search:'搜索',run:'运行',qq:'腾讯QQ',media:'Windows Media Player',zip:'旧照片.zip',work:'工作',travel:'旅行',downloads:'下载'}[id]||'窗口')}
function deskIcon(cls,id,label){return `<button class="desk-icon" data-open="${id}" title="双击打开 ${esc(label)}"><img class="desk-ico-img" src="assets/icons/${cls}.png" alt=""><span>${esc(label)}</span></button>`}
function deskDecor(cls,label){return deskIcon(cls,'doc',label)}
function bindDesktop(){
 const coarse=matchMedia('(pointer:coarse)').matches;
 document.querySelectorAll('[data-open]:not(.desk-icon)').forEach(b=>b.onclick=e=>{e.stopPropagation();openWin(b.dataset.open)});
 document.querySelectorAll('.desk-icon').forEach(b=>{
   b.onclick=e=>{e.stopPropagation();document.querySelectorAll('.desk-icon.selected').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');if(coarse)openWin(b.dataset.open)};
   b.ondblclick=e=>{e.preventDefault();e.stopPropagation();openWin(b.dataset.open)};
 });
 document.querySelectorAll('[data-restore]').forEach(b=>b.onclick=()=>{win=b.dataset.restore;minimizedWin=null;render()});
 const sb=document.getElementById('startButton'), sm=document.getElementById('startMenu');
 if(sb&&sm) sb.onclick=e=>{e.stopPropagation();sm.classList.toggle('show');sm.setAttribute('aria-hidden',sm.classList.contains('show')?'false':'true')};
 document.getElementById('anchorToggle').onclick=()=>{anchorOpen=!anchorOpen;renderAnchor()};
 document.querySelector('.desktop')?.addEventListener('click',e=>{if(!e.target.closest('.start-menu')&&!e.target.closest('#startButton'))document.getElementById('startMenu')?.classList.remove('show')});
}
function renderAnchor(){const p=document.getElementById('anchorPanel');if(!p)return;const a=anchor();p.innerHTML=`<div class="sticky-title">沈妍的便笺</div><b>${esc(a[0])}</b><div class="sub">${esc(a[1])}</div>`;p.classList.toggle('show',anchorOpen)}
function openWin(id){
 if(id==='browser'){openBrowser(browserRoute);return}
 if(id==='cache'){triggerBlackout();return}
 minimizedWin=null;winMax=false;win=id;render();
}
function closeWin(){if(win==='timeline'&&has('final_date')&&has('final_photo')){state.ended=true;save();win=null;render();return}win=null;minimizedWin=null;winMax=false;render()}
function windowHTML(id){
 let title='',body='',small=false,type='explorer',toolbar='',menubar='',status='就绪';
 const xpMenu='<div class="classic-menu">文件(F)　编辑(E)　查看(V)　收藏(A)　工具(T)　帮助(H)</div>';
 const explorerToolbar=(path)=>`<div class="win-toolbar xp-toolbar"><button class="xp-tool nav-arrow">←</button><button class="xp-tool nav-arrow muted-tool">→</button><button class="xp-tool nav-arrow">↑</button><span class="xp-sep"></span><button class="xp-tool wide"><span class="mini-search"></span>搜索</button><button class="xp-tool wide"><img src="assets/icons/folder.png" alt="">文件夹</button><span class="xp-sep"></span><div class="crumbbox"><b>地址</b>　${path}</div><button class="xp-go">转到</button></div>`;
 if(id==='doc'){title='备忘.txt - 记事本';small=true;type='notepad';menubar='<div class="classic-menu">文件(F)　编辑(E)　格式(O)　查看(V)　帮助(H)</div>';body=`<div class="note-paper notepad-paper">沈妍出事时随身带着的这台旧电脑屏幕已经裂了。她平时只拿它跑旧软件、查离线资料，日常电脑不在这里。家属只说把重要资料先备份出来，别删原文件。<br><br>她最近查得最多的是 1996 年南关那件事。<br><br>浏览器历史被保留下来；部分本地缓存损坏。<br><br>Internet 同步用户：sy0718（仅恢复书签与历史）。<br><br>— 维修点临时说明</div><div class="notepad-footer"><button id="resetBtn" class="classic-button">清除本地进度重新开始</button></div>`}
 if(id==='computer'){title='我的电脑';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('我的电脑');body=myComputerHTML();status='4 个对象'}
 if(id==='recycle'){title='回收站';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('回收站');body=recycleHTML();status='回收站中有 6 个对象'}
 if(id==='syfolder'){title='沈妍的资料';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('C:\\Documents and Settings\\沈妍\\我的文档\\沈妍的资料');body=syFolderHTML();status='11 个对象'}
 if(id==='unsorted'){title='未整理';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('C:\\Documents and Settings\\沈妍\\桌面\\未整理');body=unsortedHTML();status='8 个对象'}
 if(id==='photos'){title='照片';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('C:\\Documents and Settings\\沈妍\\我的文档\\我的图片');body=photosFolderHTML();status='17 个对象'}
 if(id==='folder'){title='1996资料';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('C:\\Documents and Settings\\沈妍\\桌面\\1996资料');body=folderHTML();status='10 个对象'}
 if(id==='thesis'){title='毕业论文.doc - Microsoft Word';type='word-viewer';menubar='<div class="classic-menu">文件(F)　编辑(E)　视图(V)　插入(I)　格式(O)　工具(T)　表格(A)　窗口(W)　帮助(H)</div>';toolbar='<div class="word-toolbar"><button>新建</button><button>打开</button><button>保存</button><button>打印</button><span class="xp-sep"></span><span>样式：正文　字体：宋体　字号：小四　<b>B</b>　<i>I</i>　<u>U</u></span></div>';body=thesisHTML();status='第 1 页，共 42 页　　1 节'}
 if(id==='photo'){title='IMG_2002.jpg - Windows 图片和传真查看器';type='photo-viewer';menubar='';toolbar='<div class="photo-tools"><button>上一张</button><button>下一张</button><button>左转</button><button>右转</button><button>放大</button><button>缩小</button><button>打印</button><button>保存</button></div>';body=photoHTML();status='IMG_2002.jpg'}
 if(id==='timeline'){title='调查记录.xls - Microsoft Excel';type='sheet-viewer';menubar='<div class="classic-menu">文件(F)　编辑(E)　视图(V)　插入(I)　格式(O)　工具(T)　数据(D)　窗口(W)　帮助(H)</div>';toolbar='<div class="excel-ribbon classic-toolbar"><button>新建</button><button>打开</button><button>保存</button><button>打印</button><span class="xp-sep"></span><span>字体：宋体　字号：10　<b>B</b>　<i>I</i>　<u>U</u>　Σ</span></div><div class="formula-bar"><span class="namebox-mini">A1</span><span>fx</span><div>日期核对</div></div>';body=timelineHTML();status='就绪'}
 if(id==='private'){title='调查备忘.lock';type='private-window';menubar='<div class="classic-menu">文件(F)　安全(S)　帮助(H)</div>';body=privateLoginHTML();status='本地加密文件'}
 if(id==='work'){title='工作';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('C:\\Documents and Settings\\沈妍\\我的文档\\工作');body=workHTML();status='7 个对象'}
 if(id==='travel'){title='旅行';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('C:\\Documents and Settings\\沈妍\\我的文档\\旅行');body=travelHTML();status='13 个对象'}
 if(id==='downloads'){title='下载';type='explorer';menubar=xpMenu;toolbar=explorerToolbar('C:\\Documents and Settings\\沈妍\\我的文档\\下载');body=downloadsHTML();status='9 个对象'}
 if(id==='control'){title='控制面板';type='control-window';body=controlHTML();status='经典视图'}
 if(id==='systeminfo'){title='系统属性';small=true;type='systeminfo-window';body=systemInfoHTML();status=''}
 if(id==='help'){title='帮助和支持中心';type='help-window';body=helpHTML();status='Windows 帮助和支持'}
 if(id==='search'){title='搜索结果';type='search-window';body=searchHTML();status='准备搜索'}
 if(id==='run'){title='运行';small=true;type='run-window';body=runHTML();status=''}
 if(id==='qq'){title='腾讯QQ';small=true;type='qq-window';body=qqHTML();status='离线'}
 if(id==='media'){title='Windows Media Player';type='media-window';body=mediaHTML();status='停止'}
 if(id==='zip'){title='旧照片.zip - WinRAR';type='zip-window';menubar='<div class="classic-menu">文件(F)　命令(C)　工具(T)　收藏夹(F)　选项(O)　帮助(H)</div>';body=zipHTML();status='压缩文件，共 8 个对象'}
 return `<section class="window center ${winMax?'maximized ':''}${small?'small ':''}${type}"><div class="titlebar"><span class="window-app-icon ${type}"></span><strong>${esc(title)}</strong><button class="win-min" id="winMin" aria-label="最小化">_</button><button class="win-max" id="winMax" aria-label="最大化">□</button><button class="win-close" id="winClose" aria-label="关闭">×</button></div>${menubar}${toolbar}<div class="window-body">${body}</div><div class="window-status">${status}</div></section>`;
}
function bindWindow(){
 document.getElementById('winClose')?.addEventListener('click',closeWin);
 document.getElementById('winMin')?.addEventListener('click',()=>{minimizedWin=win;win=null;render()});
 document.getElementById('winMax')?.addEventListener('click',()=>{winMax=!winMax;render()});
 document.getElementById('resetBtn')?.addEventListener('click',()=>confirm('确定清除当前进度？')&&reset());
 document.querySelectorAll('.window [data-open]').forEach(b=>b.onclick=()=>openWin(b.dataset.open));
}
function xpExplorerLayout(sideTitle,sideItems,main){return `<div class="explorer-layout"><aside class="explorer-tree xp-tasks"><div class="xp-taskbox"><h4>${sideTitle}</h4>${sideItems}</div><div class="xp-taskbox pale"><h4>其他位置</h4><button data-open="syfolder">我的文档</button><button data-open="computer">我的电脑</button><button data-open="recycle">回收站</button></div></aside><section class="explorer-main">${main}<div id="localPreview" class="local-preview"></div></section></div>`}
function myComputerHTML(){return xpExplorerLayout('系统任务','<button data-open="systeminfo">查看系统信息</button><button data-open="control">添加或删除程序</button><button data-open="control">更改一个设置</button>',`<h3 class="explorer-section-title">存储在此计算机上的文件</h3><div class="xp-drive-list"><button class="xp-drive" data-open="syfolder"><img src="assets/icons/folder.png"><span><b>沈妍的文档</b><small>文件夹</small></span></button><button class="xp-drive" data-open="photos"><img src="assets/icons/photo.png"><span><b>共享文档</b><small>图片与扫描件</small></span></button></div><h3 class="explorer-section-title">硬盘驱动器</h3><div class="xp-drive-list"><button class="xp-drive" data-local="driveC"><img src="assets/icons/drive_c.png"><span><b>本地磁盘 (C:)</b><small>38.2 GB 可用，共 74.5 GB</small><i><em style="width:48%"></em></i></span></button><button class="xp-drive" data-local="driveD"><img src="assets/icons/drive_d.png"><span><b>资料盘 (D:)</b><small>9.1 GB 可用，共 19.5 GB</small><i><em style="width:54%"></em></i></span></button></div><h3 class="explorer-section-title">有可移动存储的设备</h3><div class="xp-drive-list"><button class="xp-drive" data-local="dvd"><img src="assets/icons/cd.png"><span><b>DVD 驱动器 (E:)</b><small>没有光盘</small></span></button></div>`)}
function recycleHTML(){return xpExplorerLayout('回收站任务','<button class="static-task">清空回收站</button><button class="static-task">还原所有项目</button>',`<div class="details-list"><div class="details-head"><span>名称</span><span>原位置</span><span>删除日期</span><span>大小</span></div>${[['IMG_0891副本.jpg','C:\\Documents and Settings\\沈妍\\桌面','2026-08-18','1.8 MB'],['淘宝订单截图.bmp','D:\\杂项','2026-08-04','824 KB'],['论坛摘录_旧.txt','D:\\未整理','2026-07-22','4 KB'],['meeting_final2.doc','我的文档','2026-07-11','96 KB'],['公交站牌.jpg','我的图片','2026-08-02','742 KB'],['新建文本文档.txt','桌面','2026-06-19','0 KB']].map(x=>`<div class="details-row"><span><img src="assets/icons/doc.png">${x[0]}</span><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span></div>`).join('')}</div>`)}
function syFolderHTML(){return xpExplorerLayout('文件和文件夹任务','<button class="static-task">新建文件夹</button><button class="static-task">将此文件夹发布到 Web</button><button class="static-task">共享此文件夹</button>',`<div class="explorer-icon-grid rich"><button class="explorer-file" data-open="folder"><img src="assets/icons/folder.png"><span>1996资料</span></button><button class="explorer-file" data-open="photos"><img src="assets/icons/folder.png"><span>照片</span></button><button class="explorer-file" data-open="timeline"><img src="assets/icons/sheet.png"><span>调查记录.xls</span></button><button class="explorer-file" data-open="thesis"><img src="assets/icons/doc.png"><span>毕业论文.doc</span></button><button class="explorer-file" data-open="private"><img src="assets/icons/lock.png"><span>备份_旧</span></button><button class="explorer-file" data-open="doc"><img src="assets/icons/doc.png"><span>备忘.txt</span></button><button class="explorer-file" data-open="work"><img src="assets/icons/folder.png"><span>工作</span></button><button class="explorer-file" data-open="travel"><img src="assets/icons/folder.png"><span>旅行</span></button><button class="explorer-file" data-open="downloads"><img src="assets/icons/folder.png"><span>下载</span></button></div>`)}
function unsortedHTML(){return xpExplorerLayout('文件和文件夹任务','<button class="static-task">新建文件夹</button><button class="static-task">按日期排列</button>',`<div class="explorer-icon-grid rich"><button class="explorer-file" data-local="unsorted1"><img src="assets/icons/doc.png"><span>todo_1014.txt</span></button><button class="explorer-file" data-local="unsorted2"><img src="assets/icons/doc.png"><span>论坛用户名.txt</span></button><button class="explorer-file" data-local="busstop"><img src="assets/icons/imagefile.png"><span>站牌_旧.jpg</span></button><button class="explorer-file" data-local="mapprint"><img src="assets/icons/doc.png"><span>地图打印.pdf</span></button><button class="explorer-file" data-local="tempInterview"><img src="assets/icons/tmp.png"><span>~$访谈记录.doc</span></button><button class="explorer-file" data-local="webcache"><img src="assets/icons/folder.png"><span>网页缓存</span></button><button class="explorer-file" data-local="numberFile"><img src="assets/icons/doc.png"><span>号码.txt</span></button><button class="explorer-file" data-local="oldGate"><img src="assets/icons/imagefile.png"><span>旧校门.jpg</span></button></div>`)}
function photosFolderHTML(){
 const extra=[['IMG_1988.jpg','2012-08-16','742 KB'],['IMG_1991.jpg','2012-09-03','688 KB'],['DSC_0031.jpg','2010-02-18','1.1 MB'],['DSC_0038.jpg','2010-02-18','986 KB'],['DSC_0042.jpg','2010-02-19','1.2 MB'],['DSC_0110.jpg','2011-05-02','1.4 MB'],['扫描001.jpg','2018-07-04','611 KB'],['扫描002.jpg','2018-07-04','704 KB'],['手机备份_01.jpg','2020-11-22','2.3 MB'],['手机备份_02.jpg','2020-11-22','2.0 MB'],['证件照_旧.jpg','2017-03-12','304 KB'],['合照_2018.jpg','2018-06-09','1.8 MB'],['IMG_2001.jpg','2012-10-04','694 KB']];
 return xpExplorerLayout('图片任务','<button class="static-task">以幻灯片方式查看</button><button class="static-task">从相机或扫描仪获取图片</button><button class="static-task">打印图片</button>',`<div class="photo-folder-grid"><button class="photo-thumb" data-open="photo"><img src="assets/mother_child_photo.jpg"><span>IMG_2002.jpg</span></button><button class="photo-thumb" data-local="photoSchool"><img src="assets/school_old.jpg"><span>二小旧楼.jpg</span></button><button class="photo-thumb" data-local="photoStreet"><img src="assets/old_street.jpg"><span>南关旧街.jpg</span></button><button class="photo-thumb" data-local="photoFestival"><img src="assets/festival.jpg"><span>庙会_2006.jpg</span></button></div><div class="photo-file-list"><div class="photo-file-list-head">其他图片（${extra.length}）</div>${extra.map((x,i)=>`<button class="photo-list-item" data-local="ordinaryPhoto${i}"><img src="assets/icons/imagefile.png"><span>${x[0]}</span><small>${x[1]}　${x[2]}</small></button>`).join('')}</div>`)}
function thesisHTML(){return `<div class="word-workarea"><div class="word-ruler"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span></div><article class="word-page"><h1>地方都市传说传播机制中的<br>记忆重构与媒介再生产</h1><p class="word-meta">本科毕业论文　　沈妍<br>指导教师：周老师　　2026 年 4 月（初稿）</p><h2>摘　要</h2><p>本文以地方性都市传说为研究对象，讨论报刊、口述记忆与网络论坛在叙事扩散过程中如何互相改写。研究发现，同一事件在不同记录体系中常出现人数、地点与称谓的偏差，这类偏差既可能来自统计口径，也可能被后来的讲述重新组织。</p><p>论文案例均来自公开材料，涉及真实人物的部分已作匿名处理。</p><p class="word-keywords"><b>关键词：</b>都市传说；地方记忆；网络论坛；媒介叙事</p><div class="page-break-line">— 1 —</div></article></div>`}
function folderHTML(){
 return xpExplorerLayout('文件和文件夹任务','<button class="static-task">新建文件夹</button><button class="static-task">将此文件夹发布到 Web</button><button class="static-task">共享此文件夹</button>',`<div class="explorer-icon-grid rich">
      <button class="explorer-file" data-local="clip"><img src="assets/icons/doc.png" alt=""><span>剪报索引_1996.txt</span></button>
      <button class="explorer-file" data-local="hehui"><img src="assets/icons/doc.png" alt=""><span>户籍摘录_何惠.txt</span></button>
      <button class="explorer-file" data-local="notes"><img src="assets/icons/doc.png" alt=""><span>核对项_未整理.txt</span></button>
      <button class="explorer-file" data-local="notice"><img src="assets/icons/doc.png" alt=""><span>寻人启事_排版稿.doc</span></button>
      <button class="explorer-file" data-local="bus"><img src="assets/icons/doc.png" alt=""><span>公交线路_旧二路.pdf</span></button>
      <button class="explorer-file" data-local="map"><img src="assets/icons/imagefile.png" alt=""><span>南关地图_1994.jpg</span></button>
      <button class="explorer-file" data-local="papers"><img src="assets/icons/folder.png" alt=""><span>报纸扫描</span></button>
      <button class="explorer-file" data-local="schoolfiles"><img src="assets/icons/folder.png" alt=""><span>学校档案</span></button>
      <button class="explorer-file" data-local="policefiles"><img src="assets/icons/folder.png" alt=""><span>派出所材料</span></button>
      <button class="explorer-file" data-local="privatefiles"><img src="assets/icons/folder.png" alt=""><span>私人记录</span></button>
    </div>`);
}
function localPreview(type){
 const el=document.getElementById('localPreview'); if(!el)return;
 if(type==='clip') el.innerHTML=`<div class="note-paper file-preview"><b>1996 剪报索引</b><br><br>11/24 南关 / 儿童 / 一度失联<br>11/25 南关 / 怪老人 / 辟谣<br>11/27 已与家属取得联系<br><br>晚报数字馆：<button class="file-link" data-web="news">archive.heningdaily.local</button></div>`;
 if(type==='hehui') el.innerHTML=`<div class="scan file-preview"><b>户籍资料摘录（沈妍手抄）</b><br><br>姓名：何惠<br>出生：1988-03-09<br>原住址：南关区东河路 42 号<br>1996 年底迁出。<br><br><span style="color:#766">妈从来没跟我说过她具体是哪天转学的。</span></div>`;
 if(type==='notes') el.innerHTML=`<div class="note-paper file-preview">妈说她小时候“走丢过半天”。晚报写的是 5 个孩子，可论坛里有人说那几天学校至少少了一个班那么多人。<br><br>先别信论坛。把学校、报纸、警方的口径拆开看。<br><br>还有：那个老太太到底是在抓孩子，还是在找谁？</div>`;
 if(type==='notice'){mark('shenyan_notice');el.innerHTML=`<div class="scan file-preview"><div style="text-align:center;font-size:23px;font-weight:700">寻 人 启 事</div><br>沈妍，女，6岁，身高约118cm。2012年10月2日下午在南关早市附近与家人走散。走失时穿浅灰外套、红色布鞋。<br><br>联系人：何女士　联系电话：——<br><br><div class="muted">文件属性：创建于 2012-10-02 19:42；未发现打印记录。</div></div>`}
 if(type==='bus') el.innerHTML=`<div class="scan file-preview"><b>鹤宁市公共汽车旧线路表（节选）</b><hr>2 路：火车站 — 百货大楼 — 南关早市 — 东河路 — <b>旧二路终点</b><br>末班：19:10<br><br><span class="muted">1998 年调整后终点迁至东河桥。沈妍打印件边上写着：“2012 还这么叫的人，多半是老住户。”</span></div>`;
 if(type==='map') el.innerHTML=`<div class="image-preview-real map-scan"><img src="assets/map_1994.jpg"><p>南关地图_1994.jpg　纸本地图扫描；边缘有铅笔圈注。</p></div>`;
 if(type==='papers') el.innerHTML=`<div class="folder-preview-list"><b>报纸扫描</b><span>1996-11-24_03版.tif</span><span>1996-11-25_02版.tif</span><span>1996-11-27_03版.tif</span><span>1996-12-03_索引.jpg</span><button class="file-link" data-web="news">打开数字报刊镜像</button></div>`;
 if(type==='schoolfiles') el.innerHTML=`<div class="folder-preview-list"><b>学校档案</b><span>1996_点名册.xls</span><span>班主任工作记录_三班.doc</span><span>转学登记摘录.txt</span><button class="file-link" data-web="school">打开鹤宁二小旧站</button></div>`;
 if(type==='policefiles') el.innerHTML=`<div class="folder-preview-list"><b>派出所材料</b><span>公开情况说明_扫描.pdf</span><span>报案编号对照_手抄.txt</span><span class="muted">沈妍备注：警方登记的是“立案”，不是学校的“缺课”。</span></div>`;
 if(type==='privatefiles') el.innerHTML=`<div class="folder-preview-list"><b>私人记录</b><span>何惠旧日历_目录.txt</span><span>照片背面抄录.txt</span><span>调查备忘.lock</span><button class="file-link" data-open="private">打开加密备忘</button></div>`;
 if(type==='unsorted1') el.innerHTML=`<div class="note-paper file-preview">10/14<br>先查“5、6、4”到底各自统计的是什么。别把不一样的表格硬当成矛盾。<br><br>学校的“缺课”范围最大；报纸写的是家长一度联系不上；警方只算正式报案。</div>`;
 if(type==='unsorted2') el.innerHTML=`<div class="note-paper file-preview">旧论坛账号可能是：槐树下喝茶 / 南关照相馆 / 小叶子。<br><br>妈以前提过“兰兰”这个名字吗？完全没印象。</div>`;
 if(type==='photoSchool') el.innerHTML=`<div class="image-preview-real"><img src="assets/school_old.jpg"><p>二小旧楼.jpg　【资料图】鹤宁第二小学旧校舍；旧站缓存恢复，拍摄年代约2000年代初。</p></div>`;
 if(type==='photoStreet') el.innerHTML=`<div class="image-preview-real"><img src="assets/old_street.jpg"><p>南关旧街.jpg　【资料图】南关旧街街景；扫描自地方报刊旧版，原始拍摄日期不详。</p></div>`;
 if(type==='photoFestival') el.innerHTML=`<div class="image-preview-real"><img src="assets/festival.jpg"><p>庙会_2006.jpg　【馆藏图】南关庙会现场，2006；鹤宁地方文化馆数字资料夹导出。</p></div>`;
 if(type==='driveC') el.innerHTML=`<div class="folder-preview-list"><b>本地磁盘 (C:)</b><span>Documents and Settings</span><span>Program Files</span><span>WINDOWS</span><span>Temp</span><button class="file-link" data-open="syfolder">打开“沈妍的资料”</button></div>`;
 if(type==='driveD') el.innerHTML=`<div class="folder-preview-list"><b>资料盘 (D:)</b><span>旧电脑备份</span><span>照片归档</span><span>课程资料</span><span>杂项</span><span class="muted">卷标：DATA　文件系统：NTFS</span></div>`;
 if(type==='dvd') el.innerHTML=`<div class="file-preview" style="font:12px Tahoma;padding:18px"><b>DVD 驱动器 (E:)</b><p>请将光盘插入驱动器 E:。</p></div>`;
 if(type==='busstop') el.innerHTML=`<div class="image-preview-real"><img src="assets/old_street.jpg"><p>站牌_旧.jpg　【调查照片】2012-10-04 16:22；南关旧二路终点附近。照片边缘可辨“二路终点”四字。</p></div>`;
 if(type==='mapprint') el.innerHTML=`<div class="image-preview-real map-scan"><img src="assets/map_1994.jpg"><p>地图打印.pdf　2 页　打印：2012-10-05。沈妍在“槐树巷”旁做过铅笔圈注。</p></div>`;
 if(type==='tempInterview') el.innerHTML=`<div class="note-paper file-preview"><b>Word 自动恢复文件</b><br><br>无法读取完整正文。可恢复的片段：<br><br>“……她问的不是孩子名字。她一直问，有没有见过兰兰……”<br><br><span class="muted">临时文件由 Microsoft Word 自动创建。</span></div>`;
 if(type==='webcache') el.innerHTML=`<div class="folder-preview-list browser-cache"><b>Internet Explorer · 历史记录 / 收藏夹缓存</b><span>2026-09-11　<button class="file-link" data-web="news">鹤宁晚报数字报刊</button></span><span>2026-09-10　<button class="file-link" data-web="school">鹤宁第二小学旧站</button></span><span>2026-09-09　<button class="file-link" data-web="forum">南关人家 BBS</button></span><span>2026-09-08　<button class="file-link" data-web="culture">鹤宁地方文化馆资料站</button></span><span>2026-09-07　<button class="file-link" data-web="library">鹤宁市图书馆地方文献</button></span><span class="muted">部分历史记录来自旧硬盘同步，访问日期可能晚于网页原始发布时间。</span></div>`;
 if(type==='numberFile') el.innerHTML=`<div class="note-paper file-preview">图书馆地方文献：6073-2219<br>二小校史办公室：6071-0326<br>南关街道：6075-1184<br><br><span class="muted">最后修改：2026-09-06 23:14</span></div>`;
 if(type==='oldGate') el.innerHTML=`<div class="image-preview-real"><img src="assets/school_old.jpg"><p>旧校门.jpg　【资料图】鹤宁第二小学旧校门；来自学校旧站缓存。</p></div>`;
 if(type.startsWith('ordinaryPhoto')){
   const list=[['IMG_1988.jpg','2012-08-16','家庭相机'],['IMG_1991.jpg','2012-09-03','家庭相机'],['DSC_0031.jpg','2010-02-18','相机导入'],['DSC_0038.jpg','2010-02-18','相机导入'],['DSC_0042.jpg','2010-02-19','相机导入'],['DSC_0110.jpg','2011-05-02','相机导入'],['扫描001.jpg','2018-07-04','扫描仪'],['扫描002.jpg','2018-07-04','扫描仪'],['手机备份_01.jpg','2020-11-22','手机备份'],['手机备份_02.jpg','2020-11-22','手机备份'],['证件照_旧.jpg','2017-03-12','照片馆扫描'],['合照_2018.jpg','2018-06-09','家庭相册'],['IMG_2001.jpg','2012-10-04','家庭相机']];
   const i=Math.max(0,Math.min(list.length-1,Number(type.replace('ordinaryPhoto',''))||0)),x=list[i];
   const imgs=['assets/mother_child.jpg','assets/school_old.jpg','assets/old_street.jpg','assets/festival.jpg'];
   el.innerHTML=`<div class="image-preview-real ordinary-photo"><img src="${imgs[i%imgs.length]}"><p>${x[0]}　${x[1]}　来源：${x[2]}</p><p class="muted">缩略图缓存可用；原始照片未加入当前相册索引。</p></div>`;
 }
 el.querySelectorAll('[data-web]').forEach(b=>b.onclick=()=>openBrowser(b.dataset.web));
 el.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openWin(b.dataset.open));
}
function photoHTML(){
 mark('photo_meta');
 return `<div class="photo-view-layout"><div class="photo-canvas"><div class="photo-frame"><img src="assets/mother_child_photo.jpg" alt="一张低清母女合影"></div></div><aside class="photo-note-panel"><div class="photo-note-title">照片信息</div><dl><dt>文件名</dt><dd>IMG_2002.jpg</dd><dt>拍摄日期</dt><dd>2012-10-04 10:18</dd><dt>备注</dt><dd class="hand-note">第二天，<br>肯吃饭了。</dd></dl></aside></div><div class="photo-status-note">【家庭照片】人物眼部已做隐私遮挡。文件名曾在整理照片时改过；相机日期和背面手写备注一直保留。</div>`;
}
function timelineHTML(){
 const canFinal=state.stage>=7;
 return `<div class="timeline-wrap"><div class="sheet-tabs-top"><span class="namebox">A1</span><span class="formula-input">事件时间线</span></div><table class="excel-grid"><thead><tr><th class="rowhead"></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr><tr><th class="rowhead">1</th><th>时间</th><th>事件</th><th>人物</th><th>证据来源</th><th>备注</th></tr></thead><tbody>
 <tr><th class="rowhead">2</th><td>1996.11.24</td><td>南关儿童一度失联</td><td>何惠</td><td>晚报 / 学校</td><td>口径不一致</td></tr>
 <tr><th class="rowhead">3</th><td>1996.11.27</td><td>何惠返校</td><td>何惠</td><td>班主任记录</td><td>称呼异常</td></tr>
 <tr><th class="rowhead">4</th><td>1996.11.29</td><td>办理转学</td><td>何惠</td><td>学校档案</td><td>迅速切断旧关系</td></tr>
 <tr><th class="rowhead">5</th><td>2012.10.02</td><td>南关早市走散</td><td>沈妍</td><td>寻人稿</td><td>未打印</td></tr>
 <tr><th class="rowhead">6</th><td>2012.10.03</td><td>旧二路终点附近被找到</td><td>沈妍</td><td>邻居旧帖</td><td>约30余小时</td></tr>
 <tr><th class="rowhead">7</th><td>${has('final_date')?'2012.10.04':canFinal?'<input id="finalDate" inputmode="numeric" placeholder="YYYY-MM-DD">':'（待核）'}</td><td>母女合影</td><td>沈妍 / 何惠</td><td>照片 EXIF / 背面</td><td>${has('final_date')?'<b>第二天</b>':'—'}</td></tr>
 </tbody></table><div class="sheet-bottom-tabs"><span class="active">事件时间线</span><span>资料来源</span><span>其他线索</span></div>
 ${canFinal&&!has('final_date')?'<div class="excel-actionbar"><button id="finalSubmit">写入日期</button><span id="finalMsg">按照片原始信息填写，格式 YYYY-MM-DD。</span></div>':''}
 ${has('final_date')?`<div class="final-file-row"><span class="final-file-label">附件</span><button id="finalPhoto" class="final-photo-link"><img src="assets/mother_child_photo.jpg" alt="照片缩略图"><span>IMG_2002.jpg</span></button></div>`:''}
 ${has('final_photo')?'<div class="photo-back"><div class="photo-back-label">照片背面</div><div class="photo-back-hand">第二天，肯吃饭了。</div></div><div class="caption">没有新的文件。保存后可以关闭工作簿。</div>':''}</div>`;
}
function privateLoginHTML(){
 if(has('private_notes')) return `<div class="memo"><h2>调查备忘 / 未整理</h2><p>我一直以为妈只是迷信。她不让我养猫，不许亲戚叫我小名，连南关都不愿回。小时候那几张照片也一直被她收在柜子最里面。</p><p>可她八岁那次回来以后，家里做过几乎一样的事。</p><p>我六岁那两天，她对学校说我发烧。请假单是两天。寻人启事却已经排好版。</p><p><b>我已经不知道自己是不是还想查下去了。</b></p><p>还有那张照片。她为什么一直记“肯吃饭了”？</p><hr><p class="muted">待核：2012 年请假记录 / 邻居旧帖 / 照片原图 / 妈的旧日历。</p></div>`;
 return `<div class="private-screen" style="margin:-18px;min-height:430px"><div class="login"><div style="font-size:20px;margin-bottom:18px">本地加密备忘</div><label>账号 <span>输入沈妍常用账号</span><input id="loginUser" autocomplete="off" placeholder="例如：sy0718"></label><label>校验 <span>请输入何惠生日（8 位）</span><input id="loginPass" inputmode="numeric" autocomplete="off" placeholder="YYYYMMDD"></label><button id="loginSubmit">读取本地备忘</button><div id="loginMsg" style="margin-top:12px;color:#aab1b6"></div></div></div>`;
}


function workHTML(){return xpExplorerLayout('文件和文件夹任务','<button class="static-task">新建文件夹</button><button class="static-task">按名称排列</button>',`<div class="details-list"><div class="details-head"><span>名称</span><span>类型</span><span>修改日期</span><span>大小</span></div>${[['会议纪要_0407.doc','Microsoft Word 文档','2026-09-07','84 KB'],['报销单_三月.xls','Microsoft Excel 工作表','2026-09-03','31 KB'],['周报_14.doc','Microsoft Word 文档','2026-09-01','56 KB'],['客户资料','文件夹','2026-08-29',''],['素材待确认','文件夹','2026-08-25',''],['logo_old.ai','Adobe Illustrator 文件','2026-08-18','2.1 MB'],['readme.txt','文本文档','2026-07-11','2 KB']].map(x=>`<div class="details-row"><span><img src="assets/icons/${x[1]==='文件夹'?'folder':'doc'}.png">${x[0]}</span><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span></div>`).join('')}</div>`)}
function travelHTML(){return xpExplorerLayout('图片任务','<button class="static-task">以幻灯片方式查看</button><button class="static-task">打印图片</button>',`<div class="details-list"><div class="details-head"><span>名称</span><span>拍摄日期</span><span>大小</span><span>备注</span></div>${[['IMG_1732.jpg','2025-10-03','1.8 MB','火车站'],['IMG_1741.jpg','2025-10-03','2.0 MB','江边'],['IMG_1818.jpg','2025-10-04','1.6 MB','早餐店'],['IMG_1902.jpg','2025-10-05','2.3 MB','山路'],['IMG_1930.jpg','2025-10-05','1.9 MB','返程'],['路线.txt','2025-09-29','1 KB',''],['车票截图.png','2025-09-28','436 KB','']].map(x=>`<div class="details-row"><span><img src="assets/icons/${x[0].endsWith('.txt')?'doc':'imagefile'}.png">${x[0]}</span><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span></div>`).join('')}</div>`)}
function downloadsHTML(){return xpExplorerLayout('文件和文件夹任务','<button class="static-task">删除所选项目</button><button class="static-task">按类型排列</button>',`<div class="details-list"><div class="details-head"><span>名称</span><span>类型</span><span>修改日期</span><span>大小</span></div>${[['FlashPlayer10.exe','应用程序','2025-08-11','2.7 MB'],['公交线路图.pdf','PDF 文档','2026-08-30','1.1 MB'],['hn2ps_old.zip','WinRAR 压缩文件','2026-08-18','6.4 MB'],['QQ截图20230402.bmp','位图图像','2023-04-02','912 KB'],['字体包.zip','WinRAR 压缩文件','2025-12-10','8.7 MB'],['readme(1).txt','文本文档','2025-09-17','3 KB']].map(x=>`<div class="details-row"><span><img src="assets/icons/${x[0].endsWith('.zip')?'zip':x[0].endsWith('.txt')?'doc':'misc'}.png">${x[0]}</span><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span></div>`).join('')}</div>`)}
function controlHTML(){
 const items=[['computer','显示','桌面、屏幕保护程序和外观'],['browser','网络连接','宽带和本地连接'],['cd','添加或删除程序','安装或卸载软件'],['photo','用户账户','沈妍'],['tmp','日期和时间','2026年9月12日'],['media','声音和音频设备','扬声器 / 系统声音'],['folder','文件夹选项','常规、查看、文件类型'],['doc','打印机和传真','无已安装打印机']];
 return `<div class="control-grid">${items.map((x,i)=>`<button class="control-item" data-control="${i}"><img class="control-img" src="assets/icons/${x[0]}.png" alt=""><b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div><div id="controlPreview" class="control-preview">选择一个控制面板项目查看设置。</div>`
}
function systemInfoHTML(){return `<div class="sysprop"><div class="sys-logo">Windows XP</div><p><b>Microsoft Windows XP Professional</b><br>版本 2002　Service Pack 3</p><hr><p>注册到：沈妍<br>计算机：Intel Pentium Dual-Core<br>1.96 GB 内存</p><p class="muted">部分硬件信息暂不可用。要查看设备状态，请打开“设备管理器”。</p></div>`}
function helpHTML(){return `<div class="help-layout"><aside><b>帮助主题</b><button>Windows 基础</button><button>文件和文件夹</button><button>网络和 Internet</button><button>照片和图片</button></aside><main><h2>帮助和支持中心</h2><p>选择左侧主题，或在开始菜单中使用“搜索”查找文件。</p><div class="help-tip"><b>提示</b><br>要打开桌面项目，请双击图标；要选择项目，请单击一次。</div></main></div>`}
function searchHTML(){return `<div class="search-dog"><div class="search-pane"><h3>您要查找什么？</h3><label>全部或部分文件名：<input id="localSearchKw" placeholder="例如：1996 / 何惠 / 照片"></label><button id="localSearchBtn" class="classic-button">搜索</button></div><div id="searchResults" class="search-results"><p>在本地磁盘和“我的文档”中搜索。</p></div></div>`}
function runHTML(){return `<div class="run-box"><p>请输入程序、文件夹、文档或 Internet 资源的名称，Windows 将为您打开它。</p><label>打开(O)：<input id="runInput" value=""></label><div><button id="runOk" class="classic-button">确定</button><button id="runCancel" class="classic-button">取消</button></div><div id="runMsg" class="muted"></div></div>`}
function qqHTML(){return `<div class="qq-login"><img src="assets/icons/qq.png" alt=""><h3>腾讯QQ 2009</h3><label>号码 <input value="42790618" readonly></label><label>状态 <select><option>离线</option></select></label><button id="qqLogin" class="classic-button">登录</button><p id="qqMsg" class="muted">上次登录：2026-09-11 22:18</p></div>`}
function mediaHTML(){return `<div class="wmp"><div class="wmp-screen"><div class="wmp-logo">Windows Media Player</div><div id="wmpTrack" class="wmp-track">未播放</div></div><div class="wmp-controls"><button data-media="prev">◀◀</button><button data-media="play">▶</button><button data-media="stop">■</button><button data-media="next">▶▶</button><span id="wmpTime">00:00 / 00:00</span></div><div class="playlist"><b>播放列表</b><button class="playlist-row" data-track="周末电台剪辑.wma">01　周末电台剪辑.wma</button><button class="playlist-row" data-track="录音_空白.wav">02　录音_空白.wav</button><button class="playlist-row" data-track="系统提示音.wav">03　系统提示音.wav</button></div></div>`}
function zipHTML(){return `<div class="zip-toolbar"><button>添加</button><button>解压到</button><button>测试</button><button>查看</button><button>删除</button></div><div class="details-list"><div class="details-head"><span>名称</span><span>大小</span><span>修改日期</span><span>CRC32</span></div>${[['IMG_1997.jpg','732 KB','2018-07-04','A1E83B2C'],['IMG_1998.jpg','818 KB','2018-07-04','920AB8D1'],['IMG_2001.jpg','694 KB','2018-07-04','33C9FA08'],['IMG_2002.jpg','847 KB','2018-07-04','81D3A9C2'],['IMG_2003.jpg','761 KB','2018-07-04','D10684B2'],['IMG_2004.jpg','802 KB','2018-07-04','BC77E21A'],['说明.txt','1 KB','2018-07-04','02D2140F']].map(x=>`<div class="details-row"><span>${x[0]}</span><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span></div>`).join('')}</div>`}
function bindLocal(){
 bindWindow();
 document.querySelectorAll('[data-local]').forEach(b=>b.onclick=()=>localPreview(b.dataset.local));
 document.querySelectorAll('.static-task,.xp-tool,.xp-go,.word-toolbar button,.photo-tools button,.excel-ribbon button,.wmp-controls button,.zip-toolbar button').forEach(b=>b.onclick=()=>{b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),120)});
 document.querySelectorAll('[data-control]').forEach(b=>b.onclick=()=>{const p=document.getElementById('controlPreview');if(p)p.innerHTML='<b>'+b.querySelector('b').textContent+'</b><p>'+b.querySelector('small').textContent+'</p><p class="muted">当前账户权限有限；部分设置需要管理员权限才能保存。</p>'});
 const lsb=document.getElementById('localSearchBtn');if(lsb)lsb.onclick=()=>{const q=(document.getElementById('localSearchKw').value||'').trim();const r=document.getElementById('searchResults');const pool=['1996资料\\剪报索引_1996.txt','1996资料\\户籍摘录_何惠.txt','照片\\IMG_2002.jpg','未整理\\论坛用户名.txt','沈妍的资料\\调查记录.xls','沈妍的资料\\毕业论文.doc'];const hit=pool.filter(x=>!q||x.includes(q));r.innerHTML=hit.length?hit.map(x=>'<div class="search-hit">'+esc(x)+'</div>').join(''):'<p>搜索完成。没有找到文件。</p>';};
 const rok=document.getElementById('runOk');if(rok)rok.onclick=()=>{const v=(document.getElementById('runInput').value||'').trim().toLowerCase();if(v==='notepad'||v==='notepad.exe')openWin('doc');else if(v==='iexplore'||v==='iexplore.exe')openWin('browser');else if(v==='calc'||v==='calc.exe')document.getElementById('runMsg').textContent='Windows 找不到 calc.exe。文件可能已被移动或删除。';else document.getElementById('runMsg').textContent='Windows 找不到“'+v+'”。请检查名称后重试。';}; document.getElementById('runCancel')?.addEventListener('click',closeWin);
 const ql=document.getElementById('qqLogin');if(ql)ql.onclick=()=>{document.getElementById('qqMsg').textContent='连接服务器超时。请检查网络连接后重试。';};
 document.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>{const t=document.getElementById('wmpTrack');const tm=document.getElementById('wmpTime');if(t)t.textContent=b.dataset.track+'　（无法找到媒体文件）';if(tm)tm.textContent='00:00 / 00:00';});
 document.querySelectorAll('[data-media]').forEach(b=>b.onclick=()=>{const t=document.getElementById('wmpTrack');if(!t)return;if(b.dataset.media==='stop')t.textContent='已停止';else if(b.dataset.media==='play')t.textContent='无法播放：媒体文件路径已失效';});
 const fs=document.getElementById('finalSubmit'); if(fs)fs.onclick=()=>{const v=document.getElementById('finalDate').value.trim().replace(/[/.]/g,'-');if(v==='2012-10-04'||v==='20121004'){mark('final_date');win='timeline';render()}else document.getElementById('finalMsg').textContent='日期与原图信息对不上。'}; const fp=document.getElementById('finalPhoto'); if(fp)fp.onclick=()=>{mark('final_photo');win='timeline';render()};
 const ls=document.getElementById('loginSubmit'); if(ls)ls.onclick=()=>{const u=document.getElementById('loginUser').value.trim().toLowerCase();const p=document.getElementById('loginPass').value.trim();if((u==='sy0718'||u==='sheny0718'||u==='shenyan0718')&&p==='19880309'){mark('private_notes');win='private';render()}else document.getElementById('loginMsg').textContent='账号或校验信息不匹配。账号可在浏览器自动填充记录中找到。'};
}

function siteBase(r){const b=(r||'news').split(':')[0];if(b==='police'||b.startsWith('news'))return'news';if(b==='teacher'||b.startsWith('school'))return'school';if(b==='thread'||b.startsWith('forum'))return'forum';if(b.startsWith('culture'))return'culture';if(b==='libdoc'||b.startsWith('library'))return'library';return b}
function siteLabel(b){return ({news:'鹤宁晚报',school:'鹤宁二小',forum:'南关人家',culture:'地方文化馆',library:'市图书馆'}[b]||b)}
function openBrowser(route,push=true){browserRoute=route||'news';win='browser';minimizedWin=null;const base=siteBase(browserRoute);if(['news','school','forum','culture','library'].includes(base)&&!browserTabs.includes(base))browserTabs.push(base);if(push){historyStack=historyStack.slice(0,historyIndex+1);historyStack.push(browserRoute);historyIndex=historyStack.length-1}renderBrowserShell()}
function nav(route){openBrowser(route,true)}
function renderBrowserShell(){
 const bb=browserRoute.split(':')[0]; const title=bb.startsWith('news')||bb==='police'?'鹤宁晚报数字报刊':bb.startsWith('school')||bb==='teacher'?'鹤宁市第二小学':bb.startsWith('forum')||bb==='thread'?'南关人家 - 论坛':bb.startsWith('culture')?'鹤宁地方文化馆':bb.startsWith('library')||bb==='libdoc'?'鹤宁市图书馆':'网页';
 app.innerHTML=desktopHTML()+`<section class="browser-window ${winMax?'maximized':''}">
 <div class="browser-titlebar"><img src="assets/icons/browser.png" alt=""><strong>${esc(title)} - Microsoft Internet Explorer</strong><div class="browser-window-controls"><button id="browserMin">_</button><button id="browserMax">□</button><button id="browserClose">×</button></div></div><div class="ie-tabs">${browserTabs.map(t=>`<button class="ie-tab ${siteBase(browserRoute)===t?'active':''}" data-tab="${t}">${siteLabel(t)}</button>`).join('')}</div>
 <div class="browser-menubar">文件(F)　编辑(E)　查看(V)　收藏(A)　工具(T)　帮助(H)</div>
 <div class="ie-toolbar"><button class="ie-tool" id="backBtn" ${historyIndex<=0?'disabled':''}>◀<small>后退</small></button><button class="ie-tool" id="fwdBtn" ${historyIndex>=historyStack.length-1?'disabled':''}>▶<small>前进</small></button><span class="ie-sep"></span><span class="ie-tool static">■<small>停止</small></span><span class="ie-tool static">↻<small>刷新</small></span><span class="ie-tool static">⌂<small>主页</small></span><span class="ie-sep"></span><span class="ie-tool static">⌕<small>搜索</small></span><span class="ie-tool static">★<small>收藏夹</small></span></div>
 <div class="browser-top"><span class="address-label">地址(D)</span><input id="address" class="address" value="http://${esc(routeUrl(browserRoute))}"><button id="goBtn" class="go">转到</button></div>
 <div class="bookmarkbar"><span class="fav-label">收藏夹</span>${browserTabs.map(t=>`<button data-nav="${t}">${siteLabel(t)}</button>`).join('')}</div>
 <div id="browserContent" class="browser-content">${renderRoute(browserRoute)}</div><div class="browser-status"><span>完成</span><span>本地缓存：可用　脱机工作</span><span>Internet</span></div></section><button class="anchor-toggle" id="anchorToggle" title="沈妍的便笺">便笺</button><div id="anchorPanel" class="anchor-panel"></div>`;
 bindBrowser();renderAnchor();
}
function routeUrl(r){const base=r.split(':')[0];if(base==='police')return'archive.heningdaily.local/attachment/ng-police-1996';if(base.startsWith('news'))return'archive.heningdaily.local/'+(base==='news'?'':'view/'+encodeURIComponent(r.split(':')[1]||'search'));if(base.startsWith('school')||base==='teacher')return'old.hn2ps.edu.local/'+(base==='school'?'':'archive/'+base);if(base.startsWith('forum')||base==='thread')return'bbs.nanguan.local/'+(base==='forum'?'':'thread/'+(r.split(':')[1]||'search'));if(base.startsWith('culture'))return'culture.hening.local/'+(base==='culture'?'':'data/'+(r.split(':')[1]||'search'));if(base.startsWith('library')||base==='libdoc')return'lib.hening.local/'+(base==='library'?'':'local/'+(r.split(':')[1]||'search'));return'local/'+r}
function fromAddress(v){v=v.toLowerCase().trim();if(v.includes('heningdaily')||v.includes('鹤宁晚报')||v.includes('晚报'))return'news';if(v.includes('hn2ps')||v.includes('鹤宁第二小学')||v.includes('鹤宁二小')||v==='二小')return'school';if(v.includes('bbs')||v.includes('nanguan')||v.includes('南关人家')||v.includes('南关论坛'))return'forum';if(v.includes('culture')||v.includes('文化馆')||v.includes('民俗'))return'culture';if(v.includes('lib.hening')||v.includes('图书馆')||v.includes('地方文献'))return'library';return browserRoute}
function bindBrowser(){
 document.getElementById('browserClose').onclick=()=>{win=null;winMax=false;render()};
 document.getElementById('browserMin').onclick=()=>{minimizedWin='browser';win=null;render()};
 document.getElementById('browserMax').onclick=()=>{winMax=!winMax;renderBrowserShell()};
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>nav(b.dataset.tab));
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
function newsHome(){return `<div class="site news"><div class="mast"><div class="brand">鹤宁晚报</div><div class="mast-meta">HENING EVENING NEWS</div><div class="issue-date">1996年12月3日　星期二<br><span>农历丙子年十月廿三</span></div><div class="news-quick-search"><input id="newsKw" placeholder="站内搜索"><button id="newsSearch" class="action">搜索</button></div></div><div class="subnav"><span>首页</span><span>本地新闻</span><span>社会</span><span>民生</span><span>文体</span><span>副刊</span><span>数字报刊</span><span>旧版检索</span></div><div class="wrap"><div class="newspaper-front"><section><h2>历史报刊检索</h2><div class="news-searchbox"><div class="search-row"><label>起始日期<input id="newsFrom" value="1996-11-20" placeholder="YYYY-MM-DD"></label><label>结束日期<input id="newsTo" value="1996-11-30" placeholder="YYYY-MM-DD"></label><button class="action" id="newsSearch2">检索</button></div><div class="archive-stat">馆藏 21,842 期 · 1990—2002 年版面已完成 OCR · 原版扫描可能存在污损和错字</div></div><h3 class="paper-section-title">1996 年 11 月整理批次</h3>${normalNews.slice(0,10).map(n=>`<div class="news-row"><div class="date">${n[0]}</div><div><button class="linklike" data-news="${n[0]}">${n[1]}</button><div class="muted">${n[2]} · 历史版面</div></div></div>`).join('')}</section><aside class="news-front-side"><img src="assets/old_street.jpg" alt="南关旧街"><div class="news-caption">图：南关街旧照（资料图）</div><h4>本期其他新闻</h4><p>我市开展冬季校园安全检查工作</p><p>南关片区加强夜间巡逻</p><p>供暖公司回应市民关闭问题</p></aside></div></div></div>`}
function newsSearch(q=''){const raw=decodeURIComponent(q||'南关');const [kw0,from='',to='']=raw.split('|');const kw=kw0||'南关';const relevant=/南关|儿童|老人|猫脸|兰兰/.test(kw);let rows=relevant?normalNews.filter(n=>['1996-11-24','1996-11-25','1996-11-26','1996-11-27'].includes(n[0])):normalNews.slice(0,10);if(from)rows=rows.filter(n=>n[0]>=from);if(to)rows=rows.filter(n=>n[0]<=to);return `<div class="site news"><div class="mast"><div class="brand">鹤宁晚报</div><div>数字报刊资料库</div></div><div class="subnav"><span>旧报检索</span><span>版面浏览</span><span>馆藏说明</span></div><div class="wrap"><p><button class="linklike" data-nav="news">← 修改检索条件</button></p><h2>检索结果：${esc(kw)}</h2><div class="muted" style="margin:-10px 0 18px">${from||'不限'} 至 ${to||'不限'} · ${rows.length} 条结果</div><div class="news-list">${rows.map(n=>`<div class="news-row"><div class="date">${n[0]}</div><div><button class="linklike" data-news="${n[0]}">${n[1]}</button><div class="muted">${n[2]} · 第 3 版 · 版面扫描</div></div></div>`).join('')||'<p class="muted">没有匹配结果。</p>'}</div></div></div>`}
function newsArticle(date){
 const common=`<div class="site news"><div class="mast"><div class="brand">鹤宁晚报</div><div>数字报刊资料库</div></div><div class="wrap article"><button class="linklike" data-nav="news">← 返回数字报刊</button>`;
 if(date==='1996-11-24'){mark('news5');return common+`<h1 class="headline">南关五名儿童一度与家长失去联系</h1><div class="muted">1996-11-24 · 社会版</div><p>本报讯　昨日傍晚，南关一带有五名低龄儿童在放学及外出途中一度与家长失去联系。经家属、学校及辖区民警寻找，截至今晨已有两名儿童由家属接回，其余情况仍在核实。</p><p>鹤宁第二小学表示，当日学校正常上课，个别学生因病或家庭原因缺勤。校方已临时要求低年级学生放学后由家长接送。</p><p>近日民间关于“怪老人夜间找孩子”的说法较多，警方提醒市民不要传播未经证实的信息。</p><div class="evidence"><b>这里写的是“五名一度失联”。</b>报道没有说“五人全部立案”，也没有说学校只有五人缺课。</div><p>相关：<button class="linklike" data-news="1996-11-25">关于南关“怪老人”传言的情况说明</button></p></div></div>`}
 if(date==='1996-11-25')return common+`<h1 class="headline">关于南关“怪老人”传言的情况说明</h1><div class="muted">1996-11-25 · 社会版</div><p>南关街道办昨日表示，近期所谓“猫脸老人抓孩子”等说法与已掌握事实不符。居民确曾反映一名面部有旧疾的老妇人在夜间沿街寻找儿童，询问内容多为“有没有见过兰兰”。</p><p>记者核实，该老妇赵淑琴的外孙女冯小兰于 11 月 23 日傍晚走失。赵某于次日清晨突发疾病去世。</p><p>街道工作人员呼吁不要将老人外貌与儿童失联事件混为一谈。</p><div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap"><img src="assets/zhao_newsprint_photo.jpg" alt="旧报纸中的赵淑琴照片" style="width:145px;border:1px solid #777;background:#ddd;padding:3px"><div class="muted" style="max-width:420px">【报刊资料图】赵淑琴旧照。人物眼部已做隐私遮挡；原报扫描网点严重，右半脸有重影和折痕。</div></div></div></div>`;
 if(date==='1996-11-27')return common+`<h1 class="headline">南关多名儿童已与家属取得联系</h1><div class="muted">1996-11-27 · 社会版</div><p>截至昨晚，此前一度与家长失去联系的儿童已有四人与家属团聚，另有一名仍在寻找。辖区民警表示，部分家属在正式报案前已自行找到孩子，因此公开案号数量与早期媒体统计并不完全一致。</p><p>警方后续公开材料可见：<button class="linklike" data-nav="police">南关辖区 1996 年 11 月接处警摘要</button>。</p></div></div>`;
 {const n=normalNews.find(n=>n[0]===date);const ordinary={
 '1996-11-29':'本报讯　市公交公司自本周起增开冬季早班车，首班时间提前二十分钟。线路调整表已张贴于主要站点。',
 '1996-11-28':'本报讯　鹤宁纺织厂锅炉改造工程昨日完成试运行。厂方表示，冬季供热期间将继续安排夜间值守。',
 '1996-11-23':'本报讯　冬储白菜昨日进入集中上市期，南关、东河两处临时售卖点延长营业至晚七时。',
 '1996-11-22':'本报讯　青年宫乒乓球馆本周末恢复开放，上午面向学生，下午为职工活动时段。',
 '1996-11-21':'气象台预计本周末迎来今冬首场降雪，夜间最低气温可能降至零下六度。',
 '1996-11-20':'市环卫处将冬季清扫时间提前至清晨五时三十分，重点路段增加人工除冰班次。'};return common+`<h1 class="headline">${esc(n?.[1]||'历史报道')}</h1><div class="muted">${esc(date)} · ${esc(n?.[2]||'本地')}</div><p>${ordinary[date]||'本报讯　该版面为地方新闻存档，原件由市图书馆报刊库提供数字镜像。'}</p><p class="muted">版面号：${date.replace(/-/g,'')}-03　OCR 校对状态：已完成</p></div></div>`}
}
function policeDoc(){mark('police4');return `<div class="site library"><div class="head"><div class="libname">鹤宁市公开资料镜像</div></div><div class="wrap"><div class="doc-view"><div style="text-align:center"><h2>南关辖区 1996 年 11 月接处警摘要</h2><div class="muted">公开摘录 / 后期数字化</div></div><table class="school-table" style="margin-top:24px"><tr><th>日期</th><th>编号</th><th>事项</th><th>结果</th></tr><tr><td>11/23</td><td>NG961123-07</td><td>儿童走失</td><td>转失踪登记</td></tr><tr><td>11/23</td><td>NG961123-11</td><td>儿童走失</td><td>次日家属带回</td></tr><tr><td>11/24</td><td>NG961124-02</td><td>儿童走失</td><td>转失踪登记</td></tr><tr><td>11/24</td><td>NG961124-04</td><td>儿童走失</td><td>继续查找</td></tr><tr><td>11/24</td><td>口头求助</td><td>何姓家属称女童未归</td><td><b>家属后电话称已找到，未生成正式案号</b></td></tr></table><div class="evidence">正式案号是 4 个；另有 1 起口头求助在立案前撤回。</div></div></div></div>`}

function schoolHome(){return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-seal">鹤<br>二</div><div class="school-name-wrap"><div class="school-name">鹤宁市第二小学</div><div class="school-en">HENING NO.2 PRIMARY SCHOOL</div></div><div class="school-slogan"><b>团结　勤学　健康　快乐</b></div></div></div><div class="school-topnav"><span>学校首页</span><span>学校概况</span><span>校园新闻</span><span>通知公告</span><span>教学教研</span><span>德育天地</span><span>教师园地</span><span>学生天地</span><span>旧版资料</span></div><div class="wrap"><div class="school-grid"><aside class="leftmenu"><div>学校首页</div><div>学校概况</div><div>校园新闻</div><div>教务管理</div><div>德育天地</div><div>教师园地</div><div>学生作品</div><div><button class="linklike" data-nav="schoolarchive">旧版资料</button></div><div>联系我们</div></aside><section class="school-content"><div class="school-welcome"><div><h2>通知公告</h2><div class="ordinary-list">${schoolNotices.slice(0,8).map((x,i)=>`<div><span class="date">${x[0]}</span><button class="linklike" data-schoolnotice="${i}">· ${x[1]}</button></div>`).join('')}</div></div><aside><img src="assets/school_old.jpg" alt="学校旧照"><p>校舍旧照（网站资料图）<br>拍摄年代约2000年代初</p></aside></div><div class="school-bottom-strip"><span>校务公开</span><span>家校交流</span><span>卫生保健</span><span>少先队</span><span>资料下载</span></div></section></div><div class="old-counter">您是本站第 <b>0</b><b>3</b><b>2</b><b>6</b><b>1</b><b>7</b> 位访问者　　建议使用 IE6 / 1024×768 浏览</div></div></div>`}
function schoolArchive(){return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学</div></div></div><div class="nav"><div class="wrap"><span>学校首页</span><span>校史资料</span><span>旧附件镜像</span></div></div><div class="wrap"><div class="crumb">首页 &gt; 校史资料 &gt; 旧附件镜像</div><h2 style="font-size:18px;color:#174d75">1996 年校务附件</h2><p>以下文件为 2009 年校史资料整理时建立的扫描索引。个别学籍字段由纸卡人工录入，缺项保留为空。</p><div class="main-grid"><div><h3 style="font-size:15px">附件目录</h3><div class="table-scroll"><table class="school-table"><tr><th>文件</th><th>日期</th><th>类型</th></tr><tr><td><button class="linklike attach" id="absenceOpen">1996-11-25_三年级考勤汇总.xls</button></td><td>1996-11-25</td><td>XLS</td></tr><tr><td><span class="attach">1996-11_低年级放学管理通知.doc</span></td><td>1996-11-26</td><td>DOC</td></tr><tr><td><span class="attach">1996-12_转学办理汇总.xls</span></td><td>1996-12-06</td><td>XLS</td></tr><tr><td><span class="attach">1996秋_值周记录_三年级.doc</span></td><td>1996-12-18</td><td>DOC</td></tr><tr><td><span class="attach">1996_校医室登记薄_目录.pdf</span></td><td>1997-01-04</td><td>PDF</td></tr></table></div><h3 style="margin-top:24px;font-size:15px">旧学籍查询</h3><div class="search-row"><label>学生姓名<input id="studentName" placeholder="请输入学生姓名"></label><label>出生日期<input id="studentDob" inputmode="numeric" placeholder="请输入何惠出生日期（YYYYMMDD）"></label><button class="action" id="studentSearch">查询</button></div><div id="studentMsg" class="caption"></div></div><aside class="side"><b>资料说明</b><p>旧系统只支持姓名与出生日期联合校验，不提供模糊查询。</p><p class="muted">数据整理：校史办公室<br>最后导入：2012-06-18</p></aside></div><div id="absenceArea" style="margin-top:22px"></div></div></div>`}
function absenceTable(){mark('school6');return `<div class="scan registry-scan"><b>三年级 11 月 25 日考勤异常汇总</b><table class="school-table" style="margin-top:14px"><tr><th>姓名</th><th>班级</th><th>连续缺勤</th><th>备注</th></tr><tr><td>何惠</td><td>三(2)</td><td>2 天</td><td>家属寻找</td></tr><tr><td>冯小兰</td><td>三(1)</td><td>3 天+</td><td>未归</td></tr><tr><td>周斌</td><td>三(4)</td><td>1 天</td><td>家属已接回</td></tr><tr><td>陈晓梅</td><td>三(3)</td><td>1 天</td><td>家属已接回</td></tr><tr><td>王涛</td><td>三(1)</td><td>2 天</td><td>家属寻找</td></tr><tr><td>李文杰</td><td>三(2)</td><td>3 天</td><td><b>市二院肺炎住院</b></td></tr></table><div class="evidence">学校记的是“6 人连续缺课”，其中李文杰从未失踪。</div></div>`}
function schoolStudent(){mark('hehui');return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学</div></div></div><div class="wrap"><p><button class="linklike" data-nav="schoolarchive">← 返回旧附件</button></p><h2>学生历史记录：何惠</h2><table class="school-table"><tr><th>姓名</th><td>何惠</td><th>出生</th><td>1988-03-09</td></tr><tr><th>原班级</th><td>三年级二班</td><th>状态</th><td>1996-11-29 转出</td></tr><tr><th>异常缺勤</th><td>11/23 傍晚起，约 41 小时</td><th>家属备注</th><td>11/25 上午已找到</td></tr></table><h3 style="margin-top:22px">关联附件</h3><p><button class="linklike" data-nav="teacher">班主任工作记录_1996-11-27.pdf</button></p><p>转学申请摘要：家属称学生受惊，近期不宜继续参加集体活动；申请尽快转学。</p><div class="evidence">何惠就是警方摘要里那起“家属先找到、未生成正式案号”的女童。</div></div></div>`}
function teacherRecord(){mark('address17');return `<div class="site school"><div class="header"><div class="head-inner"><div class="school-name">鹤宁第二小学 · 扫描附件</div></div></div><div class="wrap"><div class="scan stamp"><p>11月27日。何惠返校。</p><p>上午点名时叫“惠惠”无回应，叫全名后抬头。第一节前进教室，站到第三排靠窗座位旁，后由同学提醒回原位。</p><p>午后谈话，问“家住哪里”，先答：<b>槐树巷17号</b>。后其母进办公室，称孩子这两天受惊，不要再追问。</p><p>家长要求今后在校只叫大名。</p><p>11月29日办理转学。</p></div><div class="evidence">“槐树巷 17 号”不是何惠家的地址。它值得单独核对。</div></div></div>`}

function forumHome(){return `<div class="site forum"><div class="topline">南关人家　&gt;　论坛首页　　欢迎，游客　 <span>注册 | 登录 | 社区服务 | 帮助</span></div><div class="wrap"><div class="logo"><b>南关人家</b><span>一起说说我们身边的事</span></div><div class="forum-nav"><span>论坛首页</span><span>生活休闲</span><span>本地新闻</span><span>房屋租售</span><span>求职招聘</span><span>亲子教育</span></div><div class="bbs-tools"><input id="forumKw" placeholder="帖子 / 用户 / 街道"><button id="forumSearch" class="action">搜索老帖</button>　今日 42　昨日 108　主题 18,642</div><div class="thread-list">${forumThreads.map((t,i)=>`<div class="thread-row"><div><button class="linklike" data-thread="${i}">${t[1]}</button><div class="muted">${t[0]}</div></div><div>${t[2]}</div><div>${t[3]} 回复</div></div>`).join('')}</div><div class="pager">首页　1　2　3　4　…　下一页　　版主：南关照相馆 / 老何修车</div></div></div>`}
function forumSearch(q=''){const kw=decodeURIComponent(q||'');let inds=[];if(/兰兰|猫脸|老太太|老人/.test(kw))inds=[3];else if(/南关|孩子|早市|沈妍/.test(kw))inds=[0,3];else if(/槐树巷|门牌/.test(kw))inds=[5];else inds=[1,2,6];return `<div class="site forum"><div class="topline">南关人家 BBS · 搜索</div><div class="wrap"><p><button class="linklike" data-nav="forum">← 返回论坛</button></p><h3>搜索：${esc(kw)}</h3><div class="thread-list">${inds.map(i=>{const t=forumThreads[i];return `<div class="thread-row"><div><button class="linklike" data-thread="${i}">${t[1]}</button><div class="muted">${t[0]}</div></div><div>${t[2]}</div><div>${t[3]} 回复</div></div>`}).join('')}</div></div></div>`}
function forumThread(i){i=Number(i);if(i===3)mark('zhao');if(i===0)mark('neighbor');const t=forumThreads[i]||forumThreads[1];let posts='';if(i===3)posts=`${post('锅炉房老李','2005-11-21 21:08','九几年那阵都说是猫脸老太太抓小孩。我那时就在南关锅炉房值夜班，印象里根本不是这么回事。')} ${post('旧邮局','2005-11-21 21:44','我记得那个老太太脸确实有毛病，一边眼睛和嘴角往下。她前一天晚上一直在问人：“见没见兰兰？”不是追孩子。')} ${post('槐树下喝茶','2005-11-22 08:16','兰兰就是她外孙女冯小兰。孩子那晚没回来。老太太第二天清早就没了，后来守灵院里跑过一只黑猫，几件事才越传越邪。')} ${post('锅炉房老李','2005-11-22 09:03','学校也没停课，停的是晚自习。后来网上说成全城停课了。')}`;
else if(i===0)posts=`${post('槐树下喝茶','2012-10-04 07:21','昨天下午去西郊旧二路车终点买零件，看见一个女的抱着小姑娘哭。听旁边人说孩子前天下午在南关早市走散，昨天三点多才找到，算下来三十来个小时。')} ${post('南关照相馆','2012-10-04 09:18','是不是东河路何家的？早市那边前晚确实有人问。奇怪的是他们没贴寻人启事。')} ${post('槐树下喝茶','2012-10-04 10:40','应该是。小姑娘看着没受伤，就是一直不肯上她妈那辆车，后来还是抱走的。')}`;
else {const ordinary={1:['二路车现在改到东河桥那边折返了，老终点牌子还在，司机一般不叫那个名字了。','老何修车','我昨天坐的末班，过南关早市大概六点四十。'],2:['房子已经租出去了，多谢大家。','小北风','南关这边一室一厅最近涨得挺快，东河路稍便宜。'],4:['后门在操场北边，九十年代末砌墙封了。','南关照相馆','小时候放学总从那边抄近路，后来值班室搬过去就不让走了。'],5:['槐树巷拆之前门牌很乱，单双号还不完全挨着。','旧邮局','17号靠里，不在大路边，送信得从井台旁边拐进去。'],6:['老赵家那家糖糕早没了，现在早市口那摊不是一家的。','三轮车王师傅','以前两毛一个，冬天刚出锅最好吃。'],7:['89级三班我认识两个，姓孙和姓胡的，私信你电话。','梅子','毕业照我家里可能还有，周末找找。'],8:['东河口那边的老周还修，就是零件不一定有。','东河口','要是熊猫牌收音机先说型号。'],9:['搬到桥底以后摊位少了一半，买菜确实没以前方便。','小叶子','周六人还是多，早点去。'],10:['我手里有一张2001年的，2路终点已经改过一次。','二厂宿舍','要老版得去公交公司档案室问。'],11:['实验小学门口有个退休语文老师，姓陈。','秋雨','不接太小的孩子，三年级往上。'],12:['澡堂是03年春节后彻底关的，后来改成仓库。','老邢','门脸还在，招牌被拆了。'],13:['凤凰28能修，先看看飞轮和链条是不是一起坏。','一把扳手','我周末在二厂宿舍门口。']}[i]||['这两天没听说有变化。',t[2],'有消息再补。'];posts=`${post(t[2],t[0]+' 18:20',ordinary[0])} ${post(ordinary[1],t[0]+' 19:03',ordinary[2])}`;}
return `<div class="site forum"><div class="topline">南关人家 BBS</div><div class="wrap"><p><button class="linklike" data-nav="forum">← 论坛首页</button></p><h2 style="font-size:18px">${esc(t[1])}</h2>${posts}</div></div>`}
function post(user,time,body){return `<div class="post"><div class="post-user"><b>${esc(user)}</b><br><span class="muted">注册居民</span></div><div class="post-body"><span class="floor">${esc(time)}</span>${body}<div class="sig">来自：鹤宁 · 南关</div></div></div>`}

function cultureHome(){return `<div class="site culture"><div class="head"><div class="culture-seal">文</div><div><div class="title">鹤宁地方文化馆</div><div class="culture-en">HENING LOCAL CULTURE MUSEUM</div></div><div class="culture-tagline">传承地方文化　记录城市记忆</div></div><div class="bar"><span>首页</span><span>本馆介绍</span><span>馆藏资源</span><span>非遗民俗</span><span>地方志</span><span>展览活动</span><span>资料下载</span></div><div class="wrap"><div class="culture-layout"><aside class="culture-left"><div>首页</div><div>本馆概况</div><div class="active">民间习俗</div><div>非遗文化</div><div>民俗风情</div><div>地方志</div><div>馆藏资料</div><div>活动展览</div></aside><main><div class="crumb">当前位置： 首页 &gt; 民俗资料 &gt; 资料目录</div><div class="culture-notice"><b>资料站公告：</b> 部分口述资料保留方言原句，引用请注明采集年份。</div><h2>地方资料目录</h2>${cultureEntries.map((x,i)=>`<div class="entry"><button class="linklike" data-culture="${i}">${x[1]}</button><div class="muted">[${x[0]}]　${x[2]}</div></div>`).join('')}</main><aside class="culture-side"><img src="assets/festival.jpg" alt="地方活动旧照"><div class="site-photo-caption">图：南关庙会旧照（2006，馆藏资料）</div><h3>站内资料检索</h3><input id="cultureKw" placeholder="乳名 / 守灵 / 街巷"><button id="cultureSearch" class="action">检索</button><p>开放时间<br>周二至周日 09:00—16:30</p></aside></div></div></div>`}
function cultureSearch(q=''){const kw=decodeURIComponent(q||'');let inds=/乳名|守灵|猫/.test(kw)?[0,5]:/槐树巷|门牌/.test(kw)?[4,1]:[1,2,3];return `<div class="site culture"><div class="head"><div class="title">鹤宁地方文化馆</div></div><div class="wrap"><p><button class="linklike" data-nav="culture">← 返回目录</button></p><h2>检索：${esc(kw)}</h2>${inds.map(i=>{const x=cultureEntries[i];return `<div class="entry"><button class="linklike" data-culture="${i}">${x[1]}</button><div class="muted">${x[0]}　${x[2]}</div></div>`}).join('')}</div></div>`}
function cultureArticle(i){i=Number(i);const x=cultureEntries[i]||cultureEntries[2];if(i===0||i===5)mark('folkname');if(i===4)mark('address17');let body='';if(i===0)body=`<p>鹤宁旧式丧俗中，守灵期间忌家畜近棺，并不只针对猫。南关一带老人尤其忌讳“猫蹿灵”后立即反复呼喊幼童乳名。</p><p>口述资料中常见一句：“猫若蹿灵，孩子先莫叫乳名。”其解释并不统一，有人说是怕孩子受惊，有人说只是长辈留下的规矩。</p><p>这一说法在上世纪八九十年代仍有人遵守，但地方志未将其列为正式礼俗。</p>`;else if(i===5)body=`<p>乳名在家庭内部使用频繁，但遇到丧事、走失、惊吓等情况，部分老人会临时改叫大名。其理由多与“压惊”“怕叫魂”有关。</p><p>这种做法没有统一仪式，也不能简单视为宗教禁忌。</p>`;else if(i===4)body=`<div class="scan-thumb">纸本扫描缩略图<br>《南关旧门牌册》<br>第 17 页</div><p>槐树巷在 2000 年旧城改造后并入南关路。1987—1998 年门牌表如下：</p><table class="school-table"><tr><th>旧门牌</th><th>户主 / 使用人</th><th>新编号</th></tr><tr><td>槐树巷 15 号</td><td>钱守义</td><td>南关路 88 号</td></tr><tr><td><b>槐树巷 17 号</b></td><td><b>赵淑琴 / 冯家</b></td><td>拆除</td></tr><tr><td>槐树巷 19 号</td><td>街道仓房</td><td>拆除</td></tr></table><div class="evidence">班主任记录里的“槐树巷17号”，正是赵淑琴家的旧门牌。</div>`;else {const misc={1:'<p>老城区街巷在口语中常用旧称。东河路北段曾被居民叫作“机修街”，井台胡同在不同年份的地图上也有两种写法。</p><p>本条录音整理于2008年春，受访者均为南关长期居民。</p>',2:'<p>2006年城隍庙会恢复后，馆员对居民捐赠照片重新编号。照片多为普通家庭相机拍摄，画面中可见临时戏台、糖画摊和旧公交站牌。</p><p>原照色偏严重，数字化时未作修色。</p>',3:'<p>冬至前后，南关旧住户多做酸菜、炖豆腐和面食。八十年代煤票紧张时，几户人家常合用一口大锅。</p><p>本条为饮食习惯记录，无仪式性内容。</p>',6:'<p>旧街改造前，早市、澡堂、二路车终点和二小后门构成了附近居民最常用的生活路线。</p><p>受访者对年份记忆并不完全一致，馆方按可核实资料加注。</p>',7:'<p>馆藏剪纸以窗花、喜字、花鸟和生肖为主。2007年冬完成第一轮数字化，部分底纸已有折痕和虫蛀。</p>',8:'<p>2009年度共接受居民捐赠资料136件，其中旧照片61张、票证28件、手写日记和账册17册。</p>',9:'<p>老城区对孩子的称呼常随家庭而异，“小名”“乳名”“家名”在口述中混用，并非严格分类。</p>',10:'<p>东河路原为城南土路，九十年代拓宽后并入公交线路。沿线的机修铺、粮店和旧澡堂大多在2000年前后搬迁。</p>'};body=misc[i]||'<p>本页为馆藏普通资料条目，整理自居民捐赠与历年走访记录。</p>';}return `<div class="site culture"><div class="head"><div class="title">鹤宁地方文化馆</div></div><div class="wrap article"><button class="linklike" data-nav="culture">← 返回资料目录</button><h1>${esc(x[1])}</h1><div class="muted">${x[0]} · ${x[2]}</div>${body}</div></div>`}

function libraryHome(){return `<div class="site library"><div class="head"><div class="libname">鹤宁市图书馆 · 地方文献中心</div></div><div class="nav">馆藏目录　数字报刊　地方志　旧地图　社区资料　读者服务</div><div class="wrap"><h2>地方文献联合检索</h2><div class="search-row"><label>题名 / 关键词<input id="libKw" placeholder="门牌、何惠、2012、南关"></label><label>资料类型<select><option>全部类型</option><option>报刊</option><option>地方志</option><option>社区资料</option></select></label><button class="action" id="libSearch">检索</button></div><div style="margin-top:24px"><div class="muted" style="font-size:11px;padding-bottom:7px;border-bottom:2px solid #496b77">地方文献专题库 · 共 8,412 条书目记录</div>${libEntries.map((x,i)=>`<div class="lib-result"><div class="lib-code">${x[0]}</div><button class="linklike" data-lib="${i}">${x[1]}</button><div class="muted">${x[2]} · 馆内阅览 / 数字镜像</div></div>`).join('')}</div></div></div>`}
function librarySearch(q=''){const kw=decodeURIComponent(q||'');let inds=/门牌|槐树巷/.test(kw)?[1,4]:/2012|沈妍|请假/.test(kw)?[2,3]:[0,1,5];return `<div class="site library"><div class="head"><div class="libname">鹤宁市图书馆 · 检索结果</div></div><div class="wrap"><p><button class="linklike" data-nav="library">← 返回</button></p><h2>关键词：${esc(kw)}</h2>${inds.map(i=>{const x=libEntries[i];return `<div class="lib-result"><div class="lib-code">${x[0]}</div><button class="linklike" data-lib="${i}">${x[1]}</button><div class="muted">${x[2]}</div></div>`}).join('')}</div></div>`}
function libraryDoc(i){i=Number(i);let body='';if(i===1){mark('address17');body=`<h2>南关街道旧门牌对照表</h2><table class="school-table"><tr><th>旧址</th><th>登记户主</th><th>备注</th></tr><tr><td>槐树巷 17 号</td><td><b>赵淑琴</b></td><td>冯家长期居住</td></tr><tr><td>东河路 42 号</td><td>何家</td><td>1996 年底迁出</td></tr></table>`}else if(i===2){mark('shenyan_absence');body=`<h2>鹤宁实验小学 2012 年请假资料摘录</h2><div class="scan"><p>学生：沈妍　　一年级二班</p><p>请假：2012-10-02 至 2012-10-03</p><p>事由：<b>发烧，在家休息</b></p><p>家长签字：何惠</p></div><div class="evidence">这两天恰好与本地那张未打印的寻人启事重合。</div>`}else if(i===3){body=`<h2>南关居民口述资料第九辑</h2><p>本辑收录 2008—2010 年社区交通、早市、拆迁回忆。部分内容转录自“南关人家”论坛。</p><p>建议按“早市 / 孩子 / 旧二路终点”检索论坛原帖。</p>`}else if(i===5){mark('calendar');body=`<h2>捐赠资料：何惠旧日历摘录</h2><div class="scan diary-scan"><p class="diary-context">10月2日　学校请假。</p><p><b>10月3日　第一天，不认床。</b></p><p><b>10月4日　第二天，肯吃鸡蛋羹。</b></p><p><b>10月5日　第三天，叫我妈了。</b></p><p class="diary-context">学校那边说好了，只叫大名。猫送走。南关不去。</p><p><b>以后不记了。</b></p></div>`}else {const d=libEntries[i];body=`<h2>${esc(d?.[1]||'地方文献')}</h2><p>馆藏号：${esc(d?.[0]||'—')}　资料类型：${esc(d?.[2]||'地方资料')}</p><p>数字镜像仅供阅览。原件保存于地方文献库，纸本有装订磨损、页边批注或年代性污渍，引用时请以馆藏号登记。</p><p class="muted">最近一次数字化校对：2019-06</p>`;}return `<div class="site library"><div class="head"><div class="libname">鹤宁市图书馆 · 文献阅览</div></div><div class="wrap"><button class="linklike" data-nav="library">← 返回馆藏</button><div class="doc-view" style="margin-top:16px">${body}</div></div></div>`}

function bindRoute(r){
 document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>nav(b.dataset.nav));
 document.querySelectorAll('[data-news]').forEach(b=>b.onclick=()=>nav('newsarticle:'+b.dataset.news));
 document.querySelectorAll('[data-thread]').forEach(b=>b.onclick=()=>nav('thread:'+b.dataset.thread));
 document.querySelectorAll('[data-culture]').forEach(b=>b.onclick=()=>nav('culturearticle:'+b.dataset.culture));
 document.querySelectorAll('[data-lib]').forEach(b=>b.onclick=()=>nav('libdoc:'+b.dataset.lib));
 document.querySelectorAll('[data-schoolnotice]').forEach(b=>b.onclick=()=>nav('schoolnotice:'+b.dataset.schoolnotice));
 const doNewsSearch=()=>{const kw=document.getElementById('newsKw').value.trim()||'南关 儿童';const f=document.getElementById('newsFrom')?.value.trim()||'';const t=document.getElementById('newsTo')?.value.trim()||'';nav('newssearch:'+encodeURIComponent([kw,f,t].join('|')))}; document.getElementById('newsSearch')?.addEventListener('click',doNewsSearch); document.getElementById('newsSearch2')?.addEventListener('click',doNewsSearch); ['newsKw','newsFrom','newsTo'].forEach(id=>document.getElementById(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')doNewsSearch()}));
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
