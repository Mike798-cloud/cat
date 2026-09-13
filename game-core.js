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
  function normalize(s){const n=fresh(); if(!s||typeof s!=='object') return n; n.seen={...(s.seen||{})}; n.blackoutShown=!!s.blackoutShown; n.ended=!!s.ended&&!!n.seen.final_photo; n.visits=Number(s.visits)||0; n.stage=computeStage(n); return n;}
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
    if(st===0) return ['1996那批剪报还没看完。','先从11月24日那篇开始。'];
    if(st===1) return ['晚报说五个，学校和派出所会怎么记？','把考勤和辖区记录分别看一遍。'];
    if(st===2) return ['何惠应该就在那几份名单里。','她后来为什么突然转学，我也想知道。'];
    if(st===3) return ['老太太一直找的“兰兰”到底是谁？','旧论坛里有人记得当年的说法。'];
    if(st===4){
      if(!has(n,'address17')) return ['何惠返校以后还发生了什么？','班主任那份工作记录没看完。'];
      if(!has(n,'folkname')) return ['为什么家里后来不再叫她小名？','地方资料里也许有人提过这种规矩。'];
      if(!has(n,'blackout')) return ['桌面刚多出一个损坏缓存。','cache_1127.tmp 的时间和班主任记录是同一天。'];
    }
    if(st===5) return ['我六岁那两天真的只是在家发烧吗？','请假单、寻人稿和南关旧帖应该能对上。'];
    if(st===6) return ['妈到底在怕什么？','备忘、照片原图和她留下的旧日历还没对完。'];
    if(st===7) return ['那张照片究竟是第几天拍的？','时间表最后一格还空着。'];
    return ['调查结束',''];
  }
  function completion(s){return Math.round(normalize(s).stage/8*100);}
  return {fresh,normalize,has,mark,computeStage,shouldBlackout,markBlackout,anchor,completion,ORDER};
});
