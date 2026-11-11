'use strict';
const {source:S,analysis:A}=window.PN;
const nodes=new Map(S.nodes.map(n=>[n.id,n]));
const entries=new Map(A.entries.map(e=>[e.id,e]));
const labels={up:'▲ 加強',down:'▼ 削弱',mixed:'▲▼ 取捨',rework:'◆ 重製',new:'＋ 新增',fix:'修正',neutral:'調整'};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={q:'',section:'all',verdict:'all',legacy:false};
$('#title').textContent=`${A.version} · ${A.title}`;document.title=`PoE ${A.version} · ${A.title} 改版精讀`;$('#official').href=S.url;
$('#coverage').textContent=`${S.nodes.length} 段主文 · ${A.entries.length} 組改動`;
$('#section').innerHTML='<option value="all">全部章節</option>'+S.sections.map(s=>`<option value="${s.id}">${esc(A.sections[s.id])}</option>`).join('');
const evidence=(ids)=>ids.map(id=>`<a href="#${esc(id)}">${esc(entries.get(id).name)}</a>`).join('');
$('#directions').innerHTML=A.directions.map(d=>`<li><details><summary><h3>${esc(d.title)}</h3></summary><p class="evidence-label">${d.status==='explicit'?'官方明示':'綜合改動歸納'}</p><div class="evidence">${evidence(d.supports)}</div>${d.exceptions.length?`<p class="evidence-label">限制與例外</p><div class="evidence">${evidence(d.exceptions)}</div>`:''}</details><p>${esc(d.summary)}</p></li>`).join('');
function metric(m){
 const value=k=>m[k]===null?esc(m[k+'_text']):esc(m[k])+esc(m.unit||'');
 let delta='';
 if(typeof m.old==='number'&&typeof m.new==='number'&&m.old>0){const n=(m.new/m.old-1)*100;delta=n===0?'持平':`${n>0?'+':''}${Number(n.toFixed(2))}%`;if(m.unit==='%')delta+=`；${m.new-m.old>0?'+':''}${Number((m.new-m.old).toFixed(3))} 百分點`;}
 return `<div class="metric">${esc(m.label)}：${value('old')} → ${value('new')}${delta?'（'+esc(delta)+'）':''}</div>`;
}
function render(){
 const q=state.q.trim().toLocaleLowerCase();
 const found=A.entries.filter(e=>(state.section==='all'||e.section===state.section)&&(state.verdict==='all'||state.verdict===e.verdict)&&(!state.legacy||e.legacy)&&(!q||[e.name,e.conclusion,e.reason,e.legacy,...e.changes.map(c=>c.text),...e.changes.flatMap(c=>c.source_ids).map(id=>nodes.get(id).text)].join(' ').toLocaleLowerCase().includes(q)));
 $('#count').textContent=`${found.length} / ${A.entries.length} 組`;
 $('#empty').hidden=found.length>0;
 $('#results').innerHTML=S.sections.map(section=>{
  const rows=found.filter(e=>e.section===section.id);if(!rows.length)return '';
  return `<section class="chapter" id="chapter-${section.id}"><h2>${esc(A.sections[section.id])}<span>${rows.length} 組</span></h2>${rows.map(e=>{
   const ids=[...new Set(e.changes.flatMap(c=>c.source_ids))];
   return `<article class="entry" id="${e.id}"><div class="name"><span class="direction ${e.verdict}">${labels[e.verdict]}</span><h3>${esc(e.name)}</h3></div><div class="content"><ul class="changes">${e.changes.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ul>${e.conclusion?`<p class="conclusion">${esc(e.conclusion)}</p>`:''}${e.legacy?`<p class="legacy"><span>舊裝</span>${esc(e.legacy)}</p>`:''}</div><details><summary>推導與原文</summary><div class="detail">${e.reason?`<p>${esc(e.reason)}</p>`:''}${e.changes.flatMap(c=>c.metrics||[]).map(metric).join('')}${e.related?.length?`<p class="evidence-label">一起看</p><div class="evidence">${evidence(e.related)}</div>`:''}${ids.map(id=>`<p class="raw" lang="en">${esc(nodes.get(id).text)}</p>`).join('')}<a href="${esc(S.url)}#${esc(section.anchor)}" target="_blank" rel="noopener">官方章節 ↗</a><a href="${esc(e.poedb_url||'https://poedb.tw/tw/search?q='+encodeURIComponent(e.name))}" target="_blank" rel="noopener">${e.poedb_url?'流亡編年史':'編年史搜尋'} ↗</a><a href="#${e.id}">本條連結</a></div></details></article>`;
  }).join('')}</section>`;
 }).join('');
 $('#overview').hidden=state.section!=='all'||state.verdict!=='all'||state.legacy||Boolean(q);
}
function reset(){Object.assign(state,{q:'',section:'all',verdict:'all',legacy:false});$('#search').value='';$('#section').value='all';$('#verdict').value='all';$('#legacy').checked=false;render();}
$('#search').addEventListener('input',e=>{state.q=e.target.value;render();});
$('#section').addEventListener('change',e=>{state.section=e.target.value;render();});
$('#verdict').addEventListener('change',e=>{state.verdict=e.target.value;render();});
$('#legacy').addEventListener('change',e=>{state.legacy=e.target.checked;render();});
$('#reset').addEventListener('click',reset);
function follow(){const id=location.hash.slice(1);if(!entries.has(id))return;reset();const el=document.getElementById(id);el.querySelector('details').open=true;el.scrollIntoView({block:'center'});}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href');if(href==='#'){e.preventDefault();reset();history.replaceState(null,'',location.pathname);scrollTo(0,0);}else if(href?.startsWith('#')&&entries.has(href.slice(1))){e.preventDefault();history.pushState(null,'',href);follow();}});
window.addEventListener('hashchange',follow);render();follow();
