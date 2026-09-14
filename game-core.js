(function(root,factory){
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
const CHECKPOINTS=[
{keys:['missing_article'],after:'9月10日晚失联；登记栏里留着“1996.11《鹤宁晚报》缩微卷”，家属只知道她近来常去南关。',next:'1996年11月的旧报里，她可能在找哪几条？',hint1:'失联报道里留下了她最近查阅的资料名称。',hint2:'从报道里的“1996年11月”开始查旧报即可。'},
{keys:['news_missing_1996','news_return_1996'],after:'11月24日写“五名儿童未归”；11月27日写“四人陆续回家、一户仍在寻找”。27日另提到二小核过低年级缺勤。',next:'二小当年的表格里，会不会留下更具体的名字？',hint1:'11月27日那篇报道提到了鹤宁市第二小学。',hint2:'报道末尾保留了二小旧站入口；进入后找1996年的校史资料。'},
{keys:['school_attendance'],after:'缺勤核对表里有六个名字。何惠一栏写着“25日上午家长来电：已找到”“27日返校”。',next:'同一时期，何惠在学籍和班务记录里还出现过吗？',hint1:'校史目录里1996年的资料不止一张表。',hint2:'何惠所在班级和学籍变化，需要分别从学籍异动与班主任工作册里找。'},
{keys:['hehui','teacher_record'],after:'学籍登记是东河路42号；三（2）班工作册里，她却写过“槐树巷17号”。同一周还记着蓝铅笔和藏粉笔的小事。',next:'槐树巷17号在旧门牌里是谁家？',hint1:'班务簿页边有一条后来补上的“槐树巷门牌见市地方文献馆”。',hint2:'班务簿页边那条“门牌见市地方文献馆”的注记值得顺着查。'},
{keys:['address17'],after:'门牌底册：槐树巷17号是冯姓；东河路42号是何姓。17号那一格另夹过一张姓名残缺的借住卡。',next:'馆里关于南关的口述资料里，还留下过什么？',hint1:'文献馆目录除了门牌资料，还有一份南关口述访谈。',hint2:'回馆藏目录找口述类资料；那份材料末尾还留着一个旧论坛地址。'},
{keys:['folkname','zhao_forum'],after:'口述里有人只记得“先让孩子吃饭睡觉”；论坛里，赵淑琴那晚到底在哪里也没人说得一致。',next:'这个论坛里，后来还有没有类似的寻人帖？',hint1:'论坛首页的帖子不多，年份跨度却很大。',hint2:'找一条2012年的儿童走失求助后续。'},
{keys:['shenyan2012'],after:'2012旧帖：孩子被找回；有人记得她问过一句怪话，也有人记得她后来一直正常上学。2026年，sy0718重新回帖。',next:'sy0718是谁，她为什么回来问这件事？',hint1:'2012帖里有一条2026年的新回复。',hint2:'sy0718的回复下面留着她自己的公开资料页。'},
{keys:['note_1996','note_absence','photo_meta'],after:'旧闻夹里有何惠1996年的学校记录、沈妍2012年的请假单和一张照片。日期并没有完全对齐。',next:'家里还有没有更私人的那一周记录？',hint1:'照片页末尾提到何惠旧抽屉里的一本台历。',hint2:'三份材料都在旧闻夹里；照片页最后还提到一本2012年的台历。'},
{keys:['calendar'],after:'2012台历里，大多是买菜、交费和上学安排；中间夹着“原来住的地方”，也记着她仍会用以前哄猫的办法。',next:'沈妍9月8日最后记下了什么？',hint1:'台历页最下面还有沈妍自己在2026年补的一行。',hint2:'补记下面留着9月14日的家属后续报道。'},
{keys:['ending'],after:'9月14日晚报仍没有沈妍的去向。家属只确认她小时候也曾在南关短暂走失。',next:'“以前住过槐树巷的人”是谁，网页里没有留下名字。',hint1:'目前能看到的公开资料已经停在9月14日这篇后续。',hint2:'可以回看旧标签互相核对，但这里不再替任何一种解释下结论。'}
];
function fresh(){return {seen:{},stage:0,visits:0,hintLevel:0};}
function normalize(s){
  const n=fresh();
  if(s&&typeof s==='object'){
    n.seen={...(s.seen||{})};
    n.visits=Number(s.visits)||0;
    n.hintLevel=Number(s.hintLevel)||0;
  }
  // Compatibility with saves created before the old-paper checkpoint was split into two documents.
  if(n.seen.news_1996){
    n.seen.news_missing_1996=true;
    n.seen.news_return_1996=true;
  }
  n.stage=computeStage(n);
  return n;
}
function has(s,k){return !!(s.seen&&s.seen[k]);}
function computeStage(s){let st=0;for(const cp of CHECKPOINTS){if(cp.keys.every(k=>has(s,k)))st++;else break;}return st;}
function mark(s,k){const n=normalize(s);if(k&&!n.seen[k]){n.seen[k]=true;n.visits++;}const old=n.stage;n.stage=computeStage(n);if(n.stage!==old)n.hintLevel=0;return n;}
function hint(s){const n=normalize(s);const cp=CHECKPOINTS[Math.min(n.stage,CHECKPOINTS.length-1)];n.hintLevel=Math.min(2,(n.hintLevel||0)+1);return {state:n,text:n.hintLevel===1?cp.hint1:cp.hint2};}
function status(s){const n=normalize(s);if(n.stage===0)return {stage:0,total:CHECKPOINTS.length,known:'9月13日：沈妍已经失联三天。',question:'先从她失联前反复做的事查起。',hintLevel:n.hintLevel};const cp=CHECKPOINTS[Math.min(n.stage-1,CHECKPOINTS.length-1)];return {stage:n.stage,total:CHECKPOINTS.length,known:cp.after,question:cp.next,hintLevel:n.hintLevel};}
return {CHECKPOINTS,fresh,normalize,has,mark,hint,computeStage,status};
});
