(function(root,factory){
const api=factory();
if(typeof module==='object'&&module.exports) module.exports=api;
root.RenShengCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
const CHECKPOINTS=[
{keys:['missing_article'],after:'沈妍失联前反复去南关，也在图书馆查过九十年代旧报；家里不知道她具体在核哪件事。',next:'她最近翻过的旧报里，哪些南关报道值得先互相对照？',hint1:'晚报首页的“数字报刊”能查历史版面。先试南关、儿童、学校等词。',hint2:'1996年11月下旬有几篇报道互相引用，先看它们各自说了什么，不急着下结论。'},
{keys:['news_1996'],after:'11月24日报道暂有五名儿童未归；后续报道又承认报失、询问和学校缺勤的统计口径并不相同。',next:'报道提到二小重新核过低年级缺勤。学校自己的旧表格还在吗？',hint1:'11月27日报道里提到了鹤宁市第二小学。',hint2:'二小旧站的“校史资料”保留了少量文字转录。'},
{keys:['school_attendance'],after:'二小核对表里有六个名字，但每个人的缺勤原因不同；何惠一栏写着“25日已找到、27日返校”。',next:'同批归档里，何惠返校以后又留下了什么记录？',hint1:'校史目录里还有1996年第四季度学籍异动材料。',hint2:'先看转学登记，再看与它一起扫描的原班级班务簿。'},
{keys:['hehui','teacher_record'],after:'转学表登记东河路42号；班务簿却记下何惠自己写过“槐树巷17号”，随后被母亲划掉。',next:'1996年的“槐树巷17号”在地方资料里登记的是哪一户？',hint1:'班务簿页边注提到了市地方文献馆的旧门牌资料。',hint2:'到地方文献馆查旧城门牌簿，不要只看口述材料。'},
{keys:['address17','folkname'],after:'旧门牌把17号记在冯家名下；另一份口述资料提到，有些老人会在孩子受惊或走丢回来后先叫全名，但受访者说法并不一致。',next:'这些名字和旧习惯，在南关居民自己的记忆里又是什么样？',hint1:'口述资料末尾留了“南关人家”旧论坛的入口。',hint2:'论坛里可搜“猫脸”“赵淑琴”“兰兰”，留意帖子之间不一致的部分。'},
{keys:['zhao_forum'],after:'论坛里有人记得赵淑琴是在找外孙女，也有人对她出现的日期、地点说法不同；没人能把所有细节说圆。',next:'论坛中另一次“孩子走丢又找到”的旧帖，和何惠一家有没有关系？',hint1:'论坛首页里有一条2012年10月的求助后续。',hint2:'那条旧帖后来被账号 sy0718 重新顶起。'},
{keys:['shenyan2012'],after:'2012年的旧帖提到一个被找回的小女孩；2026年，sy0718追问孩子的母亲是否叫何惠、小时候是否叫“妍妍”。',next:'sy0718是谁？她自己的公开资料能不能把2012年的身份对上？',hint1:'点开 sy0718 的公开资料页。',hint2:'先看1996的何惠、2012请假单和照片日期；把几项放在一起，别只挑异常的一条。'},
{keys:['note_1996','note_absence','photo_meta'],after:'旧闻夹显示：何惠是沈妍的母亲；2012年沈妍的请假单、未张贴的寻人启事和相册日期彼此并不完全一致。',next:'何惠本人有没有留下2012年那几天的日常记录？',hint1:'“相册里那张照片”提到一本旧台历。',hint2:'看10月2日至8日原样抄录的几页，也别跳过那些看起来很普通的小事。'},
{keys:['calendar'],after:'何惠的台历既记着孩子不认房间、迟迟不叫“妈”，也记着她仍记得只有家里人才知道的习惯。何惠后来不再继续写。',next:'沈妍失联前最后公开留下的调查方向是什么？',hint1:'台历页底部有沈妍自己的最后一条补记。',hint2:'她准备去见一名以前住过槐树巷的人；随后晚报刊出了家属后续。'},
{keys:['ending'],after:'沈妍仍然失联。家属公开确认，她2012年走失后家里逐渐不再叫她“妍妍”，但母亲拒绝把那几天解释成任何超自然事件。',next:'公开资料没有给出唯一答案。前面的日期、称呼和几份互相矛盾的记录，只能由你自己判断。',hint1:'可以回看旧帖、班务簿和台历，看哪些细节彼此支持，哪些彼此冲突。',hint2:'不必只挑异常的一半材料。何惠后来仍把她当作女儿，这件事本身也是记录的一部分。'}
];
function fresh(){return {seen:{},stage:0,visits:0,hintLevel:0};}
function normalize(s){const n=fresh();if(s&&typeof s==='object'){n.seen={...(s.seen||{})};n.visits=Number(s.visits)||0;n.hintLevel=Number(s.hintLevel)||0;}n.stage=computeStage(n);return n;}
function has(s,k){return !!(s.seen&&s.seen[k]);}
function computeStage(s){let st=0;for(const cp of CHECKPOINTS){if(cp.keys.every(k=>has(s,k)))st++;else break;}return st;}
function mark(s,k){const n=normalize(s);if(k&&!n.seen[k]){n.seen[k]=true;n.visits++;}const old=n.stage;n.stage=computeStage(n);if(n.stage!==old)n.hintLevel=0;return n;}
function hint(s){const n=normalize(s);const cp=CHECKPOINTS[Math.min(n.stage,CHECKPOINTS.length-1)];n.hintLevel=Math.min(2,(n.hintLevel||0)+1);return {state:n,text:n.hintLevel===1?cp.hint1:cp.hint2};}
function status(s){const n=normalize(s);if(n.stage===0)return {stage:0,total:CHECKPOINTS.length,known:'姐姐已经失联三天。公开报道只知道她最近常去南关，也查过不少旧报。',question:'她失联前到底在核什么？',hintLevel:n.hintLevel};const cp=CHECKPOINTS[Math.min(n.stage-1,CHECKPOINTS.length-1)];return {stage:n.stage,total:CHECKPOINTS.length,known:cp.after,question:cp.next,hintLevel:n.hintLevel};}
return {CHECKPOINTS,fresh,normalize,has,mark,hint,computeStage,status};
});
