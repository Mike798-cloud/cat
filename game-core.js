(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ORDER=['news5','school6','police4','hehui','zhao','address17','folkname','blackout','shenyan_absence','shenyan_notice','neighbor','private_notes','photo_meta','calendar','final_date','final_photo'];
  const REQUIRED={
    1:['news5'],
    2:['news5','school6','police4'],
    3:['hehui'],
    4:['zhao'],
    5:['address17','folkname','blackout'],
    6:['shenyan_absence','shenyan_notice','neighbor'],
    7:['private_notes','photo_meta','calendar'],
    8:['final_date','final_photo']
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
    if(st===0) return ['她为什么反复保存1996年的南关旧报？','先从她自己整理过的材料看起，别急着猜传言是真是假。'];
    if(st===1){
      if(!has(n,'school6')) return ['晚报说的“五个”，和学校记下的是同一批孩子吗？','同一天，不同单位记录的东西可能根本不是同一个口径。'];
      if(!has(n,'police4')) return ['六个异常缺勤里，到底有几个真的进入了失踪记录？','“没来上学”和“正式报案”不是一回事。'];
    }
    if(st===2) return ['这些名字里，谁被家里接回以后很快离开了学校？','总数已经解释得通了，接下来该看具体的人。'];
    if(st===3) return ['老太太一直问的“兰兰”是谁，她为什么说“回去了没有”？','如果她不是在追孩子，最早的传言可能从一开始就讲反了。'];
    if(st===4){
      if(!has(n,'address17')) return ['何惠回来以后说出的地址，为什么不是自己家？','她返校后的几天，比失踪本身留下了更多异常。'];
      if(!has(n,'folkname')) return ['为什么家长突然不让别人叫她的小名？','这不像学校临时想出来的规矩。'];
      if(!has(n,'blackout')) return ['同一周的资料到这里为什么突然断掉？','公开记录能解释人数，却解释不了何惠回来后的那些细节。'];
    }
    if(st===5) return ['沈妍六岁那两天到底发生过什么？','“发烧请假”只是一个说法，留下来的材料并不只这一份。'];
    if(st===6) return ['何惠后来到底在害怕什么？','她成年后做的很多事，看起来都像在重复自己小时候家里做过的事。'];
    if(st===7){
      if(!has(n,'final_date')) return ['那张母女合影究竟拍在什么时候？','把沈妍失踪、回家和照片原始日期放到同一条时间线上。'];
      return ['日期已经对上了，照片本身还留下了什么？','答案不在新出现的东西里，而在你从一开始就见过的那张照片上。'];
    }
    return ['没有新的问题了。','剩下的，只是你已经看见的那些材料。'];
  }
  function completion(s){return Math.round(normalize(s).stage/8*100);}
  return {fresh,normalize,has,mark,computeStage,shouldBlackout,markBlackout,anchor,completion,ORDER};
});
