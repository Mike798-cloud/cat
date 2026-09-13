(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const CHECKPOINTS=[
    {keys:['missing_article'],after:'姐姐已经失联三天。她失联前一阵子常去南关，也翻过九十年代的旧报。',next:'她在旧报里反复找的，到底是哪一段？',hint1:'晚报首页有“数字报刊”，先从她最近常查的南关旧闻找起。',hint2:'1996年11月下旬的南关报道值得连续看几天，不要只看一篇。'},
    {keys:['news_1996'],after:'1996年11月下旬，南关连续出现儿童走失的报道。几篇报道里的数字并不完全一样。',next:'报纸只能看到公开说法。学校当时留下的缺勤和转学记录会不会更具体？',hint1:'旧报里反复出现“鹤宁市第二小学”。',hint2:'进入二小网站后，不要只看现在的通知，找它保留下来的校史/旧版资料。'},
    {keys:['school_attendance'],after:'二小的11月考勤里有六个名字，但有人是病假、有人临时被接走，不能把“缺勤”直接当成同一件事。',next:'哪一个孩子回来以后，没过几天就办了转学？',hint1:'看考勤表中的日期，再去旧版资料里找同一时期的学籍异动。',hint2:'三年级二班的何惠，25日找到、27日返校、29日转出。'},
    {keys:['hehui','teacher_record'],after:'何惠29日转学。班务记录里还留下一处和她户籍不一致的地址：槐树巷17号。',next:'1996年的槐树巷17号，住的是什么人？',hint1:'班务记录下方注明旧门牌资料现由地方文献馆保管。',hint2:'在地方文献馆查“槐树巷”或直接看旧门牌对照资料。'},
    {keys:['address17','folkname'],after:'旧门牌显示17号登记的是冯家，户内还有赵淑琴和冯小兰。南关口述资料里也提过“孩子找回来后先叫大名”的老做法。',next:'赵淑琴和冯小兰，跟当年的“猫脸老太太”传言是什么关系？',hint1:'文献馆的口述资料注明，部分旧讨论曾转载到“南关人家”社区。',hint2:'进论坛后搜“猫脸”“赵淑琴”或“兰兰”。'},
    {keys:['zhao_forum'],after:'论坛老住户的说法能对上：赵淑琴当时是在找外孙女冯小兰，后来传言把她说成了“抓孩子的人”。',next:'论坛里另一条2012年的旧帖，为什么会出现何惠家的孩子？',hint1:'在论坛搜“孩子”“早市”“旧二路终点”。',hint2:'2012年10月4日那条“南关早市附近昨天是不是在找孩子？”继续往下看。'},
    {keys:['shenyan2012'],after:'2012年南关也有一个孩子走散后被找回。老住户后来认出，她是何惠的女儿。',next:'姐姐本人有没有留下她查到这里之后的公开记录？',hint1:'2012旧帖里“sy0718”这个账号值得点进去。',hint2:'这个账号的个人主页就是姐姐留下的“旧闻夹”。'},
    {keys:['note_1996','note_absence','photo_meta'],after:'姐姐把何惠1996年的转学材料、自己2012年的请假单和一张旧照片的日期放在了一起。',next:'2012年10月3日以后，何惠自己记过什么？',hint1:'姐姐的资料页还有一篇后来补录的旧日历。',hint2:'先看照片日期，再看“旧日历里记的那几天”。'},
    {keys:['calendar'],after:'旧日历里，何惠只在那几天多记了几笔：不肯进房间、问“原来住的地方”、过了两天才重新叫她。',next:'姐姐失联前最后一次公开更新停在哪里？',hint1:'日历页最下面留了她下一次见人的安排。',hint2:'回到晚报看家属后续；公开材料到这里已经没有更多能互证的内容。'},
    {keys:['ending'],after:'姐姐仍然失联。她最后要去见谁，公开网页里没有名字。',next:'剩下的只有家属和警方掌握的线索。',hint1:'已经到公开资料的尽头。',hint2:'可以回看之前的标签页；结局没有额外隐藏密码。'}
  ];
  function fresh(){return {seen:{},stage:0,visits:0,hintLevel:0};}
  function normalize(s){const n=fresh();if(s&&typeof s==='object'){n.seen={...(s.seen||{})};n.visits=Number(s.visits)||0;n.hintLevel=Number(s.hintLevel)||0;}n.stage=computeStage(n);return n;}
  function has(s,k){return !!(s.seen&&s.seen[k]);}
  function computeStage(s){let st=0;for(const cp of CHECKPOINTS){if(cp.keys.every(k=>has(s,k)))st++;else break;}return st;}
  function mark(s,k){const n=normalize(s);if(k&&!n.seen[k]){n.seen[k]=true;n.visits++;}const old=n.stage;n.stage=computeStage(n);if(n.stage!==old)n.hintLevel=0;return n;}
  function hint(s){const n=normalize(s);const cp=CHECKPOINTS[Math.min(n.stage,CHECKPOINTS.length-1)];n.hintLevel=Math.min(2,(n.hintLevel||0)+1);return {state:n,text:n.hintLevel===1?cp.hint1:cp.hint2};}
  function status(s){const n=normalize(s);if(n.stage===0)return {stage:0,total:CHECKPOINTS.length,known:'姐姐已经失联三天。家里只知道她最近常往南关跑，也查过不少旧报。',question:'她失联前到底在查什么？',hintLevel:n.hintLevel};const cp=CHECKPOINTS[Math.min(n.stage-1,CHECKPOINTS.length-1)];return {stage:n.stage,total:CHECKPOINTS.length,known:cp.after,question:cp.next,hintLevel:n.hintLevel};}
  return {CHECKPOINTS,fresh,normalize,has,mark,hint,computeStage,status};
});
