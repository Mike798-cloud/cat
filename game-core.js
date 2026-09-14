(function(root,factory){
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
const CHECKPOINTS=[
{keys:['missing_article'],after:'9月10日晚失联；图书馆登记栏写着“1996.11《鹤宁晚报》缩微卷”；她最近反复去南关。',next:'那一卷旧报里，哪些事情和南关有关？',hint1:'晚报首页的头条就是沈妍失联报道。',hint2:'先打开头条，记下她失联前反复查什么、去过哪里。'},
{keys:['news_missing_1996','news_return_1996'],after:'11月24日报道“五名儿童未归”；11月27日报道“四人陆续回家、一户仍在寻找”。27日那篇还提到二小重新核过低年级缺勤。',next:'报纸里的数字，和学校自己的缺勤记录是不是同一回事？',hint1:'失踪报道的相关新闻里有历史版面检索入口。',hint2:'登记栏给的是1996年11月；至少对照最初的未归报道和后续的回家报道，不必把整月都点完。'},
{keys:['school_attendance'],after:'二小核对表列了六个名字，但备注原因不同；何惠一栏跨了25日和27日。',next:'何惠返校以后，在别的表册里还留下过什么？',hint1:'11月27日报道里提到了鹤宁市第二小学，并保留了学校旧站入口。',hint2:'进校史资料后找1996年低年级缺勤核对表；先看原表，不要把“缺勤”直接等同于“走失”。'},
{keys:['hehui','teacher_record'],after:'学籍登记写东河路42号；三（2）班班务簿另一处出现“槐树巷17号”。同一页也记着她能说出同学间很细的小事。',next:'“槐树巷17号”在当年的门牌底册里登记的是谁家？',hint1:'缺勤表只是一种记录。同一年的学籍异动和班主任工作册被分开归档。',hint2:'何惠是三（2）班：第四季度学籍记录与三年级班主任工作册都值得对照，不要只看其中一份。'},
{keys:['address17'],after:'门牌底册把槐树巷17号记在冯家名下；何家的正式登记仍是东河路42号。17号另夹过一张姓名残缺的借住卡。',next:'纸面只能说明登记关系。南关人的口述和回忆怎么说？',hint1:'班务簿页边只写了“门牌见市地方文献馆”，没有替两个地址作解释。',hint2:'去地方文献馆网上目录找“地名 / 门牌”类资料；先看登记底册，再判断它究竟能证明什么。'},
{keys:['folkname','zhao_forum'],after:'口述材料没有统一“旧俗”；论坛里关于赵淑琴出现的时间、地点也没有统一说法。',next:'论坛里还有没有别的年份，也出现过“孩子走丢又回来”？',hint1:'文献馆目录里还有南关口述材料；它和门牌底册不是同一种证据。',hint2:'读完口述材料，再顺着其中留下的旧论坛入口看关于赵淑琴、兰兰和“猫脸老太太”的居民回忆。'},
{keys:['shenyan2012'],after:'2012帖子里，孩子被找回；有人记得一句怪话，也有人强调她后来上学、生活都正常。2026年，sy0718又回来追问。',next:'sy0718为什么会重新查这件事？',hint1:'论坛首页还有一条2012年的儿童走失求助后续。',hint2:'那条旧帖在2026年又出现新回复；留意回复者 sy0718 为什么重新追问。'},
{keys:['note_1996','note_absence','photo_meta'],after:'旧闻夹里同时有何惠的学校记录、沈妍2012年的请假单和一张照片。几份材料既互相支持，也有日期和记忆对不上的地方。',next:'家里当年有没有留下不属于学校、论坛或报纸的记录？',hint1:'sy0718在回复里留了一个公开资料页。',hint2:'资料页把1996记录、2012请假单和一张照片并排放着；三份都看过以后再比较日期与来源。'},
{keys:['calendar'],after:'2012台历的普通生活记录里夹着几句难解释的话；同一周又留下孩子仍熟悉旧习惯的细节。',next:'沈妍失联前最后还在核哪一条旧线索？',hint1:'照片页提到何惠旧抽屉里还有一本2012年的台历。',hint2:'台历大部分是家务记录；往下读完整周，不要只挑看起来异常的句子。'},
{keys:['ending'],after:'9月14日晚报仍没有沈妍的去向。何惠确认，2012年那次走失后被找回的孩子就是沈妍。',next:'沈妍失联前约见的“以前住槐树巷的人”，究竟是谁？',hint1:'台历抄录页下面有沈妍9月8日的一条补记。',hint2:'她只写了一个“以前住槐树巷的人”和第二天下午的约见；顺着这条补记看家属后续。'}
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
