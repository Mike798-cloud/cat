(()=>{
'use strict';
const C=window.RenShengCore;
const KEY='rensheng_web_v2';
function load(){try{return C.normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){return C.fresh();}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
let state=load();
const mark=document.body.dataset.mark;
if(mark){state=C.mark(state,mark);save(state);}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function buildInvestigator(){
  const host=document.getElementById('investigator-ui'); if(!host)return;
  const st=C.status(state); const pct=Math.round(Math.min(st.stage,st.total)/st.total*100);
  host.innerHTML=`<button class="investigator-toggle" aria-expanded="false">调查记录</button><section class="investigator-panel" aria-hidden="true"><button class="investigator-close" aria-label="关闭">×</button><div class="investigator-progress"><span>调查进度 ${Math.min(st.stage,st.total)} / ${st.total}</span><i><b style="width:${pct}%"></b></i></div><dl><dt>已经确认</dt><dd>${esc(st.known)}</dd><dt>还没弄清</dt><dd>${esc(st.question)}</dd></dl><button class="investigator-reset" type="button">重置进度</button></section>`;
  const t=host.querySelector('.investigator-toggle'),p=host.querySelector('.investigator-panel');
  const setOpen=v=>{p.classList.toggle('open',v);p.setAttribute('aria-hidden',v?'false':'true');t.setAttribute('aria-expanded',v?'true':'false');};
  t.addEventListener('click',()=>setOpen(!p.classList.contains('open')));
  host.querySelector('.investigator-close').addEventListener('click',()=>setOpen(false));
  host.querySelector('.investigator-reset').addEventListener('click',()=>{if(confirm('清除本机调查进度并回到开头？')){localStorage.removeItem(KEY);location.href=document.body.dataset.depth==='0'?'index.html':'../'.repeat(Number(document.body.dataset.depth||0))+'index.html';}});if(mark==='ending')setTimeout(()=>setOpen(true),120);
}
function setupFilters(){
  document.querySelectorAll('[data-filter-input]').forEach(inp=>{
    const target=document.querySelector(inp.dataset.filterTarget); if(!target)return;
    const items=[...target.querySelectorAll('.filter-item')];
    const run=()=>{const q=inp.value.trim().toLowerCase();let shown=0;items.forEach(it=>{const ok=!q||(it.dataset.search||it.textContent).toLowerCase().includes(q);it.hidden=!ok;if(ok)shown++;});let empty=target.querySelector('.filter-empty');if(!shown){if(!empty){empty=document.createElement('div');empty.className='filter-empty';empty.textContent='没有找到符合条件的条目。';target.appendChild(empty)}}else empty?.remove();};
    inp.addEventListener('input',run);inp.addEventListener('keydown',e=>{if(e.key==='Escape'){inp.value='';run();}});
  });
}
function setupExternal(){document.querySelectorAll('[data-external]').forEach(a=>a.addEventListener('click',()=>{state=C.mark(state,'visit_'+a.dataset.external);save(state);}));}
function setupEndingReset(){document.getElementById('reset-progress')?.addEventListener('click',()=>{localStorage.removeItem(KEY);location.href='index.html';});}
function setupKeyboard(){document.addEventListener('keydown',e=>{if(e.key==='?'&&!/input|textarea/i.test(document.activeElement?.tagName||'')){e.preventDefault();document.querySelector('.investigator-toggle')?.click();}});}
buildInvestigator();setupFilters();setupExternal();setupEndingReset();setupKeyboard();
})();
