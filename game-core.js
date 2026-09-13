(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const CHECKPOINTS=[
    {keys:['missing_article'],after:'姐姐失联前一直在查1996年的南关旧闻。',next:'她具体在查哪一件事？'},
    {keys:['news_1996'],after:'1996年11月，南关几名孩子先后失联，晚报最早写的是“五名”。',next:'学校当时留下的记录和报纸一样吗？'},
    {keys:['school_attendance'],after:'学校的异常缺勤里混着病假、临时接走和真正未归，和报纸不是一个口径。',next:'这些名字里，谁回来以后很快转学？'},
    {keys:['hehui','teacher_record'],after:'何惠回来后很快转学；返校那天，她说自己住在槐树巷17号。',next:'槐树巷17号是谁家？家里为什么又要求学校只叫她大名？'},
    {keys:['address17','folkname'],after:'17号属于赵淑琴和冯家；南关一些家庭确有孩子找回后暂时改叫大名的做法。',next:'赵淑琴当年到底说过什么？“猫脸老太太”的传言从哪儿拐了弯？'},
    {keys:['zhao_forum'],after:'旧帖里的居民都说赵淑琴是在找兰兰，并没人见她追孩子。',next:'帖子里有人提到2012年南关又丢过一个小姑娘。是谁？'},
    {keys:['shenyan2012'],after:'2012年南关走失后被找回的孩子就是沈妍。',next:'姐姐为什么在2026年又把这件事翻出来？'},
    {keys:['note_1996','note_absence','photo_meta'],after:'姐姐已经把母亲1996年的记录和自己2012年的材料对到了一起。',next:'何惠2012年那几天到底记了什么？'},
    {keys:['calendar'],after:'两次走失后的几天里，都出现了认错住处、改叫大名和重新“认家”的记录。',next:'姐姐失联前最后要去见谁，公开资料有没有留下名字？'},
    {keys:['ending'],after:'公开资料到这里结束。',next:'剩下的部分没有公开答案。'}
  ];
  function fresh(){return {seen:{},stage:0,visits:0};}
  function normalize(s){const n=fresh();if(s&&typeof s==='object'){n.seen={...(s.seen||{})};n.visits=Number(s.visits)||0;}n.stage=computeStage(n);return n;}
  function has(s,k){return !!(s.seen&&s.seen[k]);}
  function computeStage(s){let st=0;for(const cp of CHECKPOINTS){if(cp.keys.every(k=>has(s,k)))st++;else break;}return st;}
  function mark(s,k){const n=normalize(s);if(k){n.seen[k]=true;n.visits++;}n.stage=computeStage(n);return n;}
  function status(s){const n=normalize(s);if(n.stage===0)return {stage:0,total:CHECKPOINTS.length,known:'姐姐已经失联三天。家里只知道她最近一直在查南关旧闻。',question:'她失联前到底在查什么？'};const cp=CHECKPOINTS[Math.min(n.stage-1,CHECKPOINTS.length-1)];return {stage:n.stage,total:CHECKPOINTS.length,known:cp.after,question:cp.next};}
  return {CHECKPOINTS,fresh,normalize,has,mark,computeStage,status};
});
