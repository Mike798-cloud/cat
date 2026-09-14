(function(root,factory){
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
const CHECKPOINTS=[
{keys:['missing_article'],after:'9/10：沈妍失联。近期多次去南关；10日下午在图书馆查过九十年代《鹤宁晚报》缩微资料。',next:'先把她最近反复查的南关旧闻找出来。',hint1:'晚报“数字报刊”可以按地名、日期、标题检索。',hint2:'先试“南关”“儿童”“学校”这类她可能会用的词，不必一次把所有旧报都读完。'},
{keys:['news_1996'],after:'11/24：报纸写“五名儿童未归”。11/27：写“四人陆续回家、一户仍在寻找”，并说明报失、询问、学校缺勤不是同一套数字。',next:'报纸提到二小重新核过低年级缺勤；学校自己的旧资料里会怎么记？',hint1:'11月27日那篇报道提到鹤宁市第二小学。',hint2:'二小旧站保留“校史资料”，按年份或“缺勤”检索比逐页翻更快。'},
{keys:['school_attendance'],after:'二小核对表列了六个名字；备注并不相同。何惠一栏：25日“家长来电称已找到”，27日返校。',next:'同一时期还有没有何惠返校后的原始记录？',hint1:'校史目录里不只有缺勤表，还有学籍、班务一类资料。',hint2:'把第四季度学籍异动和原班级班务簿放在一起看。'},
{keys:['hehui','teacher_record'],after:'学籍登记：东河路42号。班务簿：何惠自己写过“槐树巷17号”，母亲随后划掉；27—29日还留有点名、座位和转学记录。',next:'“槐树巷17号”当年登记的是谁家？',hint1:'班务簿页边有人后来补过“见市地方文献馆”。',hint2:'去查地方文献馆的旧门牌簿；口述材料先当旁证。'},
{keys:['address17','folkname'],after:'旧门牌：17号登记在冯家名下。另一份口述材料记着“孩子受惊或走丢回来后先叫全名”的旧习惯，但几位受访者说法不一致。',next:'再看看南关居民自己怎样记赵淑琴、冯小兰和那几天。',hint1:'文献馆口述资料末尾留有“南关人家”旧论坛入口。',hint2:'搜“猫脸”“赵淑琴”“兰兰”，重点看楼层之间互相打架的地方。'},
{keys:['zhao_forum'],after:'论坛：有人说赵淑琴只是在找外孙女；也有人记得她在不该出现的时间又出现过。帖子里的日期、地点并不能完全对齐。',next:'论坛里还有一次“孩子走丢后被找回”的旧帖；它和何惠一家是什么关系？',hint1:'论坛首页有一条2012年10月的“求助后续”。',hint2:'那条帖子在2026年被账号 sy0718 重新顶起。'},
{keys:['shenyan2012'],after:'2012旧帖：孩子被找回；有人记得她说过“还是回你家吗”，也有人说她后来正常上学。2026年，sy0718追问孩子母亲是否叫何惠、小时候是否叫“妍妍”。',next:'sy0718是谁？先核她自己的公开资料。',hint1:'帖子里的 sy0718 有公开资料页。',hint2:'先看1996何惠、2012请假单、照片日期三项；异常和正常的细节都保留。'},
{keys:['note_1996','note_absence','photo_meta'],after:'旧闻夹：何惠是沈妍的母亲；2012请假单、未使用的寻人纸、论坛发帖日期和照片冲印日期彼此差一天到两天。沈妍没有替原件改日期。',next:'何惠自己有没有记过2012年那几天？',hint1:'照片页提到她在母亲旧抽屉里找到一本2012台历。',hint2:'10月2日至8日的记录很密；看完异常句子，也看后面那些能对得上的生活习惯。'},
{keys:['calendar'],after:'台历：孩子一度不认房间、迟迟不叫“妈”；随后又记得只有家里人才知道的叫猫方法。10月12日只剩一句“别记了”。',next:'沈妍失联前最后准备去核什么？',hint1:'台历抄录页下面还有沈妍9月8日的一条补记。',hint2:'她拿到一个“以前住槐树巷的人”的电话；之后晚报刊出了家属后续。'},
{keys:['ending'],after:'9/14：沈妍仍未找到。何惠确认2012年走失后被找回的女孩就是沈妍，也拒绝把那段经历解释成超自然事件。',next:'公开报道没有再给出沈妍的去向。前面的记录仍有互相支持、也有互相冲突的部分。',hint1:'想复盘的话，可回看班务簿、2012旧帖和台历。',hint2:'别只留下最怪的一半：何惠最后仍坚持“她就是我女儿”。'}
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
