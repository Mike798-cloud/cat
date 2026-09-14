(function(root,factory){
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
const CHECKPOINTS=[
{keys:['missing_article'],after:'姐姐失联前一阵子反复去南关，也查过九十年代旧报。家里不知道她具体在核哪一年。',next:'她最近翻过的旧报里，哪几天值得先对起来？',hint1:'晚报首页的“数字报刊”能查到历史版面。先从南关、儿童、学校这几个词附近找。',hint2:'1996年11月24日至27日的几篇南关报道可以连着看，不要只看一篇。'},
{keys:['news_1996'],after:'11月24日报道五名儿童一度未归；后续又说登记口径并不一致，报纸没有公开姓名。',next:'如果报纸只给了公开口径，当时学校自己的考勤会留下什么？',hint1:'几篇旧报里反复出现“鹤宁市第二小学”。',hint2:'11月27日报道下方有“文中机构”，二小网站保留少量校史资料。'},
{keys:['school_attendance'],after:'二小的核对表里出现六个名字，但缺勤原因并不相同。何惠25日被家里报为“已找到”，27日返校。',next:'她返校以后为什么很快又办了转学？',hint1:'旧版资料里，同批归档还有学籍异动材料。',hint2:'看何惠的转学登记，再顺着“原班级材料”继续核。'},
{keys:['hehui','teacher_record'],after:'转学表写的是东河路42号；班务簿却记着何惠自己填过“槐树巷17号”，母亲当场把它改掉。',next:'1996年的槐树巷17号，登记的是谁？',hint1:'班务簿页边注了“槐树巷门牌见市地方文献馆”。',hint2:'打开地方文献馆的旧门牌对照，查17号。'},
{keys:['address17','folkname'],after:'17号旧门牌登记的是冯家，同户有赵淑琴、冯小兰。口述资料里还保留了一种“孩子受惊或走丢回来先叫大名”的旧说法。',next:'赵淑琴、冯小兰和后来流传的“猫脸老太太”，在居民记忆里究竟是怎么连起来的？',hint1:'口述资料末尾提到“南关人家”旧帖区。',hint2:'到论坛搜“猫脸”“赵淑琴”“兰兰”，注意不同人的记忆并不完全一样。'},
{keys:['zhao_forum'],after:'论坛里有人记得赵淑琴是在找外孙女，也有人把年份、地点甚至见到她的时间说得对不上。',next:'论坛还有一条2012年的寻人帖，为什么会和何惠一家重新碰上？',hint1:'论坛首页搜“孩子”“早市”或直接看2012年10月4日的帖子。',hint2:'那条帖子后面有一个2026年重新出现的账号，用户名是 sy0718。'},
{keys:['shenyan2012'],after:'2012年南关也有一个孩子走散后被找回。旧帖后来的回复把这件事指向何惠一家。',next:'sy0718自己留下了哪些能和这条旧帖互相核对的材料？',hint1:'点开 sy0718 的用户名，会进入她自己的旧闻夹。',hint2:'先看何惠、2012请假单和照片日期；三项放在一起再判断。'},
{keys:['note_1996','note_absence','photo_meta'],after:'旧闻夹把1996年的何惠、2012年的请假单和10月4日的家庭照片日期摆在了一起，但没有替这些材料下结论。',next:'2012年10月3日以后，何惠自己有没有留下更贴近日常的记录？',hint1:'“相册里那张照片”末尾有一条去旧日历的链接。',hint2:'看2012年10月2日至8日的日历原样抄录。'},
{keys:['calendar'],after:'何惠的日历只在那几天写得异常详细：孩子不肯进房间、问“原来住的地方”，几天后才重新叫她“妈”。',next:'姐姐失联前最后一次公开更新停在哪里？',hint1:'日历页底部写着她第二天要去南关见一个旧住户。',hint2:'日历页最后有一条“鹤宁晚报今天的家属后续”。'},
{keys:['ending'],after:'姐姐仍然失联。公开网页只知道她失联前准备去见一名住过槐树巷的老人，姓名和见面地点都没有公开。',next:'公开资料到这里为止。剩下的信息没有出现在网页上。',hint1:'这已经是当前公开资料的尽头。',hint2:'可以回看之前保留的标签页；结局没有额外密码或隐藏按钮。'}
];
function fresh(){return {seen:{},stage:0,visits:0,hintLevel:0};}
function normalize(s){const n=fresh();if(s&&typeof s==='object'){n.seen={...(s.seen||{})};n.visits=Number(s.visits)||0;n.hintLevel=Number(s.hintLevel)||0;}n.stage=computeStage(n);return n;}
function has(s,k){return !!(s.seen&&s.seen[k]);}
function computeStage(s){let st=0;for(const cp of CHECKPOINTS){if(cp.keys.every(k=>has(s,k)))st++;else break;}return st;}
function mark(s,k){const n=normalize(s);if(k&&!n.seen[k]){n.seen[k]=true;n.visits++;}const old=n.stage;n.stage=computeStage(n);if(n.stage!==old)n.hintLevel=0;return n;}
function hint(s){const n=normalize(s);const cp=CHECKPOINTS[Math.min(n.stage,CHECKPOINTS.length-1)];n.hintLevel=Math.min(2,(n.hintLevel||0)+1);return {state:n,text:n.hintLevel===1?cp.hint1:cp.hint2};}
function status(s){const n=normalize(s);if(n.stage===0)return {stage:0,total:CHECKPOINTS.length,known:'姐姐已经失联三天。家里只知道她最近常往南关跑，也查过不少旧报。',question:'她失联前到底在核什么？',hintLevel:n.hintLevel};const cp=CHECKPOINTS[Math.min(n.stage-1,CHECKPOINTS.length-1)];return {stage:n.stage,total:CHECKPOINTS.length,known:cp.after,question:cp.next,hintLevel:n.hintLevel};}
return {CHECKPOINTS,fresh,normalize,has,mark,hint,computeStage,status};
});
