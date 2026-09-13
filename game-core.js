(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ORDER=['news5','school6','police4','hehui','zhao','address17','folkname','blackout','shenyan_absence','shenyan_notice','neighbor','private_notes','photo_meta','calendar','final_date'];
  const REQUIRED={
    1:['news5'],
    2:['news5','school6','police4'],
    3:['hehui'],
    4:['zhao'],
    5:['address17','folkname','blackout'],
    6:['shenyan_absence','shenyan_notice','neighbor'],
    7:['private_notes','photo_meta','calendar'],
    8:['final_date']
  };
  function fresh(){return {seen:{},stage:0,blackoutShown:false,ended:false,visits:0};}
  function normalize(s){const n=fresh(); if(!s||typeof s!=='object') return n; n.seen={...(s.seen||{})}; n.blackoutShown=!!s.blackoutShown; n.ended=!!s.ended; n.visits=Number(s.visits)||0; n.stage=computeStage(n); return n;}
  function has(s,k){return !!(s.seen&&s.seen[k]);}
  function all(s,arr){return arr.every(k=>has(s,k));}
  function computeStage(s){
    let stage=0;
    if(all(s,REQUIRED[1])) stage=1;
    if(stage===1 && all(s,REQUIRED[2])) stage=2;
    if(stage===2 && all(s,REQUIRED[3])) stage=3;
    if(stage===3 && all(s,REQUIRED[4])) stage=4;
    if(stage===4 && all(s,REQUIRED[5])) stage=5;
    if(stage===5 && all(s,REQUIRED[6])) stage=6;
    if(stage===6 && all(s,REQUIRED[7])) stage=7;
    if(stage===7 && all(s,REQUIRED[8])) stage=8;
    return stage;
  }
  function mark(s,key){const n=normalize(s); n.seen[key]=true; n.visits++; n.stage=computeStage(n); return n;}
  function shouldBlackout(s){return has(s,'hehui')&&!s.blackoutShown;}
  function markBlackout(s){const n=normalize(s); n.blackoutShown=true; n.seen.blackout=true; n.stage=computeStage(n); return n;}
  function anchor(s){
    const n=normalize(s), st=n.stage;
    if(st===0) return ['她最后在查什么？','最后打开：1996资料 / 剪报索引。'];
    if(st===1) return ['当年到底发生了几起儿童失联？','待核：学校考勤 / 辖区案号。'];
    if(st===2) return ['哪几个孩子真的失联？谁回来了？','待核：何惠 / 转学日期。'];
    if(st===3) return ['最早的“老太太找孩子”是谁？','待核：兰兰 / 赵淑琴 / 南关旧帖。'];
    if(st===4){
      if(!has(n,'address17')) return ['何惠回来后为什么立刻转学？','待核：班主任工作记录。'];
      if(!has(n,'folkname')) return ['为什么家里后来只叫大名？','待核：乳名 / 守灵 / 猫。'];
      if(!has(n,'blackout')) return ['桌面刚恢复出一个损坏缓存。','cache_1127.tmp 没有正常的文件头。'];
    }
    if(st===5) return ['沈妍六岁为什么有一段“发烧请假”？','待核：请假单 / 寻人稿 / 2009 年南关旧帖。'];
    if(st===6) return ['母亲到底在怕什么？','待核：私人备忘 / 照片原图 / 旧日历。'];
    if(st===7) return ['沈妍真正误解了什么？','旧事时间表还有一格没填。'];
    if(st===8&&!has(n,'final_photo')) return ['时间线已经排好了。','表格里的照片缩略图还能点开。'];
    if(st===8) return ['这份表已经核完了。','关掉文件就好。'];
    return ['调查结束',''];
  }
  function completion(s){return Math.round(normalize(s).stage/8*100);}
  return {fresh,normalize,has,mark,computeStage,shouldBlackout,markBlackout,anchor,completion,ORDER};
});
