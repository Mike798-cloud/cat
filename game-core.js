(function(root,factory){
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
const CHECKPOINTS=[
{keys:['missing_article'],after:'她留下的登记里写着“1996.11《鹤宁晚报》缩微卷”，近来又常去南关。',next:'1996年11月的旧报里，有没有几条报道彼此对不上？',hint1:'她失联前反复查的是同一个月份的旧报。',hint2:'从历史报刊里先看1996年11月与南关有关的报道。'},
{keys:['news_missing_1996','news_return_1996'],after:'24日：五名儿童未归。27日：四人陆续回家，一户仍在寻找。',next:'学校留下的名单，会不会和报纸里的数字不完全一样？',hint1:'27日报道提到了鹤宁市第二小学。',hint2:'报道末尾保留了二小旧站入口；校史资料里有1996年的纸表。'},
{keys:['school_attendance'],after:'二小缺勤表里有六个名字。何惠那一栏旁边有25日、27日两笔手写。',next:'同一周，何惠在别的校内记录里还留下了什么？',hint1:'同一个1996档案盒里还有其他类型的学校记录。',hint2:'分别看看第四季度学籍异动和三（2）班工作册。'},
{keys:['hehui','teacher_record'],after:'何惠的学籍页写东河路42号；班务簿页边另有“槐树巷17号”。',next:'槐树巷17号在旧门牌资料里登记给谁？',hint1:'班务簿页边有一条后来补上的门牌资料来源。',hint2:'顺着页边注记，去市地方文献馆核旧门牌。'},
{keys:['address17'],after:'门牌底册：槐树巷17号，冯姓。那一格夹过一张姓名残缺的借住卡。',next:'南关的其他旧资料里，还能看到同一时期的生活说法吗？',hint1:'文献馆目录里还有口述类资料。',hint2:'馆藏目录中的“南关旧俗口述访谈摘录”可以打开。'},
{keys:['folkname','zhao_forum'],after:'口述和论坛都提到那几天，但赵淑琴那晚的时间说法对不上。',next:'旧论坛后来还有没有另一件孩子走失的事？',hint1:'论坛首页的主题年份跨度很大。',hint2:'找2012年的儿童走失求助后续。'},
{keys:['shenyan2012'],after:'2012旧帖：孩子找回。2026年，有人又把这张旧帖顶了起来。',next:'2026年重新追问的人是谁？',hint1:'旧帖里有一条2026年的新回复。',hint2:'那条回复下面留着发帖人的公开资料页。'},
{keys:['note_1996','note_absence','photo_meta'],after:'旧闻夹里有三份挨得很近的材料，日期没有完全对齐。',next:'家里有没有比公开资料更私人、也更零碎的记录？',hint1:'照片记录末尾提到何惠旧抽屉里的一本台历。',hint2:'把旧闻夹里的三份材料看完，再打开2012年的台历。'},
{keys:['calendar'],after:'那一周的台历比平时写得多；其中一句提到“原来住的地方”，另一天又记着一个旧习惯。',next:'沈妍失联前最后留下的安排是什么？',hint1:'台历页最下面还有沈妍在2026年补的一行。',hint2:'补记下面留着9月14日的家属后续报道。'},
{keys:['ending'],after:'9月14日晚报仍没有沈妍的去向。',next:'她原本要见的那个人是谁，现有网页没有写出来。',hint1:'到这里，公开页面没有再给出新的姓名。',hint2:'可以回看旧标签互相核对；现有资料并不能替任何一种解释下结论。'}
]
function fresh(){return {seen:{},stage:0,visits:0,hintLevel:0};}
function normalize(s){
  const n=fresh();
  if(s&&typeof s==='object'){
    n.seen={...(s.seen||{})};
    n.visits=Number(s.visits)||0;
    n.hintLevel=Number(s.hintLevel)||0;
  }
  // Compatibility with older saves: the two old markers referred to the two separate reports.
  // Do not let a save that only saw the first report silently complete the second report as well.
  if(n.seen.news_1996)n.seen.news_missing_1996=true;
  if(n.seen.news_followup)n.seen.news_return_1996=true;
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
