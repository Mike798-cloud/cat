(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ORDER=['news5','school6','police4','hehui','teacher','address_owner','zhao','folkname','neighbor','shenyan_absence','shenyan_notice','backup_open','private_notes','calendar','photo_meta','final_date','final_photo'];
  const REQUIRED={
    1:['news5'],
    2:['news5','school6','police4'],
    3:['hehui','teacher'],
    4:['address_owner','zhao'],
    5:['folkname'],
    6:['neighbor','shenyan_absence','shenyan_notice'],
    7:['private_notes','calendar','photo_meta'],
    8:['final_date','final_photo']
  };
  function fresh(){return {seen:{},stage:0,ended:false,visits:0};}
  function has(s,k){return !!(s&&s.seen&&s.seen[k]);}
  function all(s,arr){return arr.every(k=>has(s,k));}
  function computeStage(s){
    let stage=0;
    for(let i=1;i<=8;i++){
      if(all(s,REQUIRED[i])) stage=i;
      else break;
    }
    return stage;
  }
  function normalize(s){
    const n=fresh();
    if(!s||typeof s!=='object') return n;
    n.seen={...(s.seen||{})};
    n.visits=Number(s.visits)||0;
    n.stage=computeStage(n);
    n.ended=!!s.ended&&n.stage===8;
    return n;
  }
  function mark(s,key){const n=normalize(s);n.seen[key]=true;n.visits++;n.stage=computeStage(n);return n;}
  function hintSet(s){
    const n=normalize(s),st=n.stage;
    if(st===0) return ['沈妍失踪前在查什么？','“沈妍的资料”里留着她最近整理的东西。','先看调查起点和1996年的剪报索引。'];
    if(st===1){
      if(!has(n,'school6')) return ['报纸里的“五个孩子”，和学校记录的是一回事吗？','学校旧站保留了1996年的校务附件。','从晚报11月24日那篇报道进入鹤宁二小旧站，打开11月25日考勤汇总。'];
      if(!has(n,'police4')) return ['学校记下的异常缺勤，哪些真的报过警？','11月27日的晚报提到公开的接处警摘要。','回到11月27日报道，打开辖区接处警摘要。'];
    }
    if(st===2) return ['何惠回来以后，学校留下了什么？','旧学籍查询要姓名和出生日期；电脑里应该留过她的基本资料。','开始菜单里用“搜索”查“何惠”，打开户籍摘录，再去学校旧站查学籍。'];
    if(st===3){
      if(!has(n,'address_owner')) return ['“槐树巷17号”到底是谁家？','老师记录里的地址不是何惠户籍地址。地方文献能核旧门牌。','打开鹤宁市图书馆地方文献中心，查“槐树巷17号”。'];
      if(!has(n,'zhao')) return ['赵淑琴和冯小兰是什么关系？','2005年前后有人在本地论坛重新讨论过“猫脸老太太”的传言。','去“南关人家”搜索“猫脸”或“兰兰”。'];
    }
    if(st===4) return ['何惠家为什么突然只叫她大名？','这件事不像学校自己的规定。地方文献里有老住户的口述。','在地方文献中心查“乳名”或“称呼”。'];
    if(st===5){
      if(!has(n,'neighbor')) return ['沈妍六岁那两天，外面的人记得什么？','2012年10月初，南关论坛里有人提到找孩子。','去“南关人家”搜索“2012”“早市”或“孩子”。'];
      if(!has(n,'shenyan_absence')||!has(n,'shenyan_notice')) return ['何惠当年对学校是怎么说的？','资料盘里的旧备份需要账户和“回家那天”。','账户名在维修说明里；“回家那天”能从2012年的论坛帖确定。进入D盘 BACKUP_OLD。'];
    }
    if(st===6){
      if(!has(n,'calendar')) return ['何惠自己留下过那几天的记录吗？','旧备份里还有一张2012年10月的日历扫描。','打开D盘备份里的“旧日历_2012_10.jpg”。'];
      if(!has(n,'photo_meta')) return ['沈妍反复留下的那张照片是什么时候拍的？','照片的原始信息还在。','打开备份里的 IMG_2002.jpg，查看拍摄日期。'];
      if(!has(n,'private_notes')) return ['沈妍查到这里时，自己记了什么？','她在旧备份里留了一份很短的调查备忘。','打开“调查备忘.txt”。'];
    }
    if(st===7){
      if(!has(n,'final_date')) return ['把两代人的日期放到一起，还差哪一天？','调查记录.xls 最后一行只缺母女照片的拍摄日期。','打开调查记录.xls，按照片原始信息填入 2012-10-04。'];
      return ['照片背面还有什么？','工作簿已经出现照片附件。','点开调查记录里的 IMG_2002.jpg 附件。'];
    }
    return ['调查已经到这里。','没有新的入口。剩下的是你已经看过的材料。','关闭调查记录即可结束。'];
  }
  function anchor(s,level=0){const h=hintSet(s);return [h[0],h[Math.max(1,Math.min(2,level+1))]];}
  function completion(s){return Math.round(normalize(s).stage/8*100);}
  return {fresh,normalize,has,mark,computeStage,anchor,hintSet,completion,ORDER};
});
