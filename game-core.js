(function(root,factory){
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
const CHECKPOINTS=[
{keys:['missing_article'],after:'9月10日晚失联；图书馆登记里有九十年代《鹤宁晚报》缩微资料；她最近反复去南关。',next:'她反复查的旧报里，哪些事情和南关有关？',hint1:'晚报的“数字报刊”能按日期、地名或标题词检索。',hint2:'先用她已经留下的范围去缩小：南关、九十年代、学校。'},
{keys:['news_1996'],after:'11月24日标题写“五名儿童未归”；11月27日写“四人陆续回家、一户仍在寻找”。报道同时提到二小重新核过低年级缺勤。',next:'报纸里的数字，和学校自己的记录是不是同一回事？',hint1:'要核人数，可以去看报道里提到的二小旧站。',hint2:'校史资料按原档案题名保存；年份和“缺勤”都能用来检索。'},
{keys:['school_attendance'],after:'二小核对表里列了六个名字，备注原因并不相同；何惠一栏跨了25日和27日。',next:'何惠返校以后，在别的表册里还留下过什么？',hint1:'同一年的学籍异动和班务记录原本不是一张表。',hint2:'先查第四季度学籍，再留意有没有何惠的单条摘录。'},
{keys:['hehui','teacher_record'],after:'学籍登记里的住址是东河路42号；班务簿另一处出现“槐树巷17号”。这两处都来自原始表册。',next:'“槐树巷17号”当时登记的是谁家？',hint1:'班务簿页边留了一条后来整理人员写的馆藏去向。',hint2:'地方文献馆的旧门牌簿能按街巷查；口述材料只能当旁证。'},
{keys:['address17','folkname'],after:'旧门牌簿把17号记在冯家名下；另一份口述材料谈到过旧称呼习惯，但几位受访者的说法并不一致。',next:'南关居民自己的回忆，和这些纸面记录能对上多少？',hint1:'文献馆口述资料末尾留有“南关人家”旧论坛入口。',hint2:'论坛搜索“赵淑琴”“兰兰”或“猫脸”，先看互相矛盾的楼层。'},
{keys:['zhao_forum'],after:'论坛里关于赵淑琴出现的时间、地点没有统一说法；有人把它当旧传言，也有人明确说自己可能记错。',next:'论坛里还有没有别的年份，出现过“孩子走丢又回来”？',hint1:'论坛首页有一条2012年的求助后续。',hint2:'那条旧帖多年后被账号 sy0718 重新翻了出来。'},
{keys:['shenyan2012'],after:'2012帖子里，孩子被找回；有人记得一句奇怪的话，也有人强调她后来上学、生活都很正常。2026年，sy0718开始追问当年的细节。',next:'sy0718为什么会回头查这件事？',hint1:'sy0718留了一个公开资料页。',hint2:'先看她放在一起的1996材料、2012请假单和照片日期，不必先替日期找统一解释。'},
{keys:['note_1996','note_absence','photo_meta'],after:'旧闻夹把何惠、2012请假单和一张照片放在同一条时间线上；几份原件的日期没有被强行改成同一天。',next:'家里当年有没有留下不属于学校、论坛或报纸的记录？',hint1:'照片页提到何惠旧抽屉里还有一本2012年的台历。',hint2:'台历里既有异常句子，也有非常普通的家务和生活记录。'},
{keys:['calendar'],after:'2012台历里，几天普通生活记录中夹着几句难解释的话；同一页也留着孩子熟悉家里旧习惯的细节。',next:'沈妍失联前最后还在核哪一条旧线索？',hint1:'台历抄录页下面有沈妍9月8日的一条补记。',hint2:'那条补记只留下一个“以前住槐树巷的人”和第二天下午的约见。'},
{keys:['ending'],after:'9月14日晚报仍没有沈妍的去向。何惠确认，2012年那次走失后被找回的孩子就是沈妍。',next:'几份记录能互相支持，也有互相冲突的地方；没有哪一页能单独解释全部事情。',hint1:'想复核的话，班务簿、2012旧帖和台历分别来自不同的人。',hint2:'也别只留下最怪的部分：这些材料里一直有能对得上的生活细节。'}
];
function fresh(){return {seen:{},stage:0,visits:0,hintLevel:0};}
function normalize(s){const n=fresh();if(s&&typeof s==='object'){n.seen={...(s.seen||{})};n.visits=Number(s.visits)||0;n.hintLevel=Number(s.hintLevel)||0;}n.stage=computeStage(n);return n;}
function has(s,k){return !!(s.seen&&s.seen[k]);}
function computeStage(s){let st=0;for(const cp of CHECKPOINTS){if(cp.keys.every(k=>has(s,k)))st++;else break;}return st;}
function mark(s,k){const n=normalize(s);if(k&&!n.seen[k]){n.seen[k]=true;n.visits++;}const old=n.stage;n.stage=computeStage(n);if(n.stage!==old)n.hintLevel=0;return n;}
function hint(s){const n=normalize(s);const cp=CHECKPOINTS[Math.min(n.stage,CHECKPOINTS.length-1)];n.hintLevel=Math.min(2,(n.hintLevel||0)+1);return {state:n,text:n.hintLevel===1?cp.hint1:cp.hint2};}
function status(s){const n=normalize(s);if(n.stage===0)return {stage:0,total:CHECKPOINTS.length,known:'9月13日：姐姐沈妍已经失联三天。',question:'先从她失联前反复做的事查起。',hintLevel:n.hintLevel};const cp=CHECKPOINTS[Math.min(n.stage-1,CHECKPOINTS.length-1)];return {stage:n.stage,total:CHECKPOINTS.length,known:cp.after,question:cp.next,hintLevel:n.hintLevel};}
return {CHECKPOINTS,fresh,normalize,has,mark,hint,computeStage,status};
});
