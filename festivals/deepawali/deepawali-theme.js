/*! Happy Deepawali festival theme script · prashant.dhingra.website · v20261008
 * Shared by the festival pages: header, hero, sections, cards, swipe rails, timeline,
 * muhurat finder, puja steps, checklist, wishes, FAQ, comments, footer and phone dock. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
document.documentElement.classList.remove('no-js');

/* nav */
var tog=$('.nav-toggle'),nav=$('#site-nav');
if(tog&&nav){tog.addEventListener('click',function(){var o=nav.classList.toggle('open');tog.setAttribute('aria-expanded',o?'true':'false')});
 $$('#site-nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');tog.setAttribute('aria-expanded','false')})});}

/* toast */
var toastEl=$('#toast'),tt;
function toast(m){if(!toastEl)return;toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('show')},2200)}

/* season timeline + countdown */
var items=$$('.tl[data-start]'),now=Date.now(),next=null;
items.forEach(function(li){
 var s=Date.parse(li.getAttribute('data-start')),e=Date.parse(li.getAttribute('data-end')||li.getAttribute('data-start'))+36e5*20,st=$('.tl__state',li);
 if(now>e){li.classList.add('is-past');if(st)st.textContent='Done'}
 else if(now>=s){li.classList.add('is-today');if(st)st.textContent='On now'}
 else{if(!next){next=li;li.classList.add('is-next');if(st)st.textContent='Next'}else if(st){st.textContent='Coming'}}
});
var cd=$('[data-countdown]');
if(cd){
 var target=Date.parse(cd.getAttribute('data-target')),label=$('.countdown__label strong',cd.parentNode);
 if(next&&next.getAttribute('data-count')!=='skip'&&Date.parse(next.getAttribute('data-start'))<target){target=Date.parse(next.getAttribute('data-start'));if(label)label.textContent=next.getAttribute('data-label')}
 var f=function(){var d=Math.max(0,target-Date.now()),u=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
  $$('b',cd).forEach(function(b,i){b.textContent=(i?String(u[i]).padStart(2,'0'):u[i])});if(d<=0)clearInterval(iv)};
 f();var iv=setInterval(f,1000);
}

/* Lakshmi Puja muhurat finder */
var dataEl=$('#muhurat-data');
if(dataEl){
 var L=JSON.parse(dataEl.textContent),sel=$('#citySelect'),fmt=store.get('dw-fmt')||'12',cur=null;
 var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
 var keys=Object.keys(L);cur=keys.filter(function(k){return L[k].tzid===tz})[0]||store.get('dw-city')||'delhi';if(!L[cur])cur='delhi';
 function render(){var c=L[cur];
  $('#rCity').textContent=c.flag+' '+c.city+', '+c.country;$('#rTz').textContent='Local time · '+c.timezone;
  $('#rMain').textContent=c['main'+fmt];$('#rDur').textContent=c.duration+' · Sunday 8 November 2026, local time';
  $('#rPradosh').textContent=c['pradosh'+fmt];$('#rVrish').textContent=c['vrishabha'+fmt];
  $('#rAma').textContent=c['amavasya'+fmt]+' · '+c['amavasyaEnd'+fmt];$('#rSrc').href=c.source;
  sel.value=cur;$$('.chip[data-city]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-city')===cur?'true':'false')});
  $$('[data-fmt]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-fmt')===fmt?'true':'false')});}
 sel.addEventListener('change',function(){cur=sel.value;store.set('dw-city',cur);render()});
 $$('.chip[data-city]').forEach(function(b){b.addEventListener('click',function(){cur=b.getAttribute('data-city');store.set('dw-city',cur);render()})});
 $$('[data-fmt]').forEach(function(b){b.addEventListener('click',function(){fmt=b.getAttribute('data-fmt');store.set('dw-fmt',fmt);render()})});
 var share=$('#rShare');if(share)share.addEventListener('click',function(){var c=L[cur],t='Diwali 2026 Lakshmi Puja muhurat in '+c.city+': '+c.main12+' (8 Nov, local time)';
  if(navigator.share){navigator.share({title:'Lakshmi Puja muhurat',text:t,url:location.href.split('#')[0]+'#muhurat'}).catch(function(){})}
  else{copy(t+' '+location.href.split('#')[0]+'#muhurat')}});
 render();
}

/* samagri checklist */
var list=$('[data-checklist]');
if(list){var key='dw-samagri-2026',saved={};try{saved=JSON.parse(store.get(key)||'{}')||{}}catch(e){}
 var boxes=$$('input[type=checkbox]',list),bar=$('.progress__bar i'),cnt=$('[data-count-done]');
 function upd(){var n=boxes.filter(function(b){return b.checked}).length;if(bar)bar.style.width=(100*n/boxes.length)+'%';if(cnt)cnt.textContent=n+' of '+boxes.length+' ready'}
 boxes.forEach(function(b){b.checked=!!saved[b.value];b.addEventListener('change',function(){saved[b.value]=b.checked;store.set(key,JSON.stringify(saved));upd()})});
 var rs=$('[data-reset]');if(rs)rs.addEventListener('click',function(){boxes.forEach(function(b){b.checked=false});saved={};store.set(key,'{}');upd()});
 upd();}

/* wishes tabs */
function copy(t){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(function(){toast('Copied — paste it anywhere')},function(){fallback(t)})}else fallback(t)}
function fallback(t){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('Copied — paste it anywhere')}catch(e){toast('Select the text to copy')}document.body.removeChild(a)}
var tabs=$$('[role=tab]');
function show(id){tabs.forEach(function(t){var on=t.getAttribute('aria-controls')===id;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1});
 $$('[role=tabpanel]').forEach(function(p){p.hidden=p.id!==id})}
tabs.forEach(function(t,i){t.addEventListener('click',function(){show(t.getAttribute('aria-controls'))});
 t.addEventListener('keydown',function(e){var k=e.key,j=k==='ArrowRight'?i+1:k==='ArrowLeft'?i-1:null;if(j===null)return;j=(j+tabs.length)%tabs.length;tabs[j].focus();show(tabs[j].getAttribute('aria-controls'))})});
if(tabs.length){var langs=(navigator.languages||[navigator.language||'en']).map(function(l){return String(l).toLowerCase().split('-')[0]}),pick=null;
 for(var i=0;i<langs.length&&!pick;i++){if(langs[i]==='en')break;pick=tabs.filter(function(t){return t.getAttribute('data-lang')===langs[i]})[0]}
 show((pick||tabs[0]).getAttribute('aria-controls'))}
$$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var w=b.closest('.wish');copy($('.wish__text',w).textContent.trim()+'\n— Happy Deepawali 2026')})});

/* comments */
var cl=$('[data-comments-list]');
if(cl){var empty=$('[data-comments-empty]');
 function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
 function pk(o,k){for(var i=0;i<k.length;i++)if(o[k[i]]!=null&&o[k[i]]!=='')return o[k[i]];return ''}
 function fd(d){var t=new Date(typeof d==='number'&&d<1e12?d*1e3:d);if(isNaN(t))return String(d||'');try{return t.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}catch(e){return t.toDateString()}}
 function li(c,depth){var text=pk(c,['text','comment','body','message','content']),st=String(c.status||'').toLowerCase();
  if(!text||st==='hidden'||st==='spam'||st==='deleted'||c.approved===false)return '';
  var name=pk(c,['name','author','author_name','user','username','display_name'])||'Reader',loc=pk(c,['location','city','place']),d=pk(c,['date','created_at','createdAt','timestamp','time','published']);
  var reps=(c.replies||c.children||[]),r=depth<3&&reps.length?'<ol>'+reps.map(function(x){return li(x,depth+1)}).join('')+'</ol>':'';
  return '<li><div class="comment__head"><strong>'+esc(name)+'</strong>'+(c.author_reply?'<span class="badge">Author</span>':'')+(loc?' · '+esc(loc):'')+(d?' · '+esc(fd(d)):'')+'</div><p>'+esc(text).replace(/\n/g,'<br>')+'</p>'+r+'</li>'}
 var src=cl.getAttribute('data-comments-src'),path=cl.getAttribute('data-comments-path'),tries=[src,path].filter(Boolean);
 (function go(i){if(i>=tries.length||!window.fetch)return;fetch(tries[i],{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
   var a=Array.isArray(j)?j:(j.comments||j.data||j.items||[]),h=a.map(function(c){return li(c,0)}).join('');
   if(h){cl.innerHTML=h;if(empty)empty.hidden=true}}).catch(function(){go(i+1)})})(0);
}
})();
(function(){
'use strict';
var phone=window.matchMedia&&window.matchMedia('(max-width: 720px)').matches;
/* fold long blocks on phones (they stay open on desktop and without JS) */
if(phone){Array.prototype.forEach.call(document.querySelectorAll('[data-mobile-collapse]:not([data-keep-open])'),function(d){d.open=false})}
/* rail position dots */
Array.prototype.forEach.call(document.querySelectorAll('.rail'),function(r){
 var n=r.children.length;if(n<2)return;
 var hint=document.createElement('div');hint.className='rail-hint';hint.setAttribute('aria-hidden','true');
 hint.innerHTML='<span>Swipe for more · <b>1</b> of '+n+'</span><span class="rail-hint__dots">'+new Array(n+1).join('<i></i>')+'</span>';
 r.parentNode.insertBefore(hint,r);
 var dots=hint.querySelectorAll('i'),num=hint.querySelector('b');
 function upd(){var w=r.children[0].getBoundingClientRect().width+12,i=Math.min(n-1,Math.round(r.scrollLeft/w));num.textContent=i+1;
  Array.prototype.forEach.call(dots,function(d,j){d.className=j===i?'on':''})}
 r.addEventListener('scroll',function(){window.requestAnimationFrame(upd)},{passive:true});upd();
});
/* highlight the dock item for the section in view */
var dock=document.querySelector('.dock');
if(dock&&'IntersectionObserver' in window){
 var links=dock.querySelectorAll('a[href^="#"]'),map={};
 Array.prototype.forEach.call(links,function(a){map[a.getAttribute('href').slice(1)]=a});
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;Array.prototype.forEach.call(links,function(a){a.classList.remove('on')});if(map[e.target.id])map[e.target.id].classList.add('on')})},{rootMargin:'-45% 0px -50% 0px'});
 Array.prototype.forEach.call(document.querySelectorAll('main > section'),function(el){io.observe(el)});
}
})();
