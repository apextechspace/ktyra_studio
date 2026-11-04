'use strict';
/* KTYRA STUDIO EDITORIAL PAGES — static, no backend or tracking. */
document.querySelectorAll('.mobile-menu-links a').forEach(a=>a.addEventListener('click',()=>{
 const menu=document.querySelector('.mobile-menu');
 if(menu)menu.open=false;
}));
const filters=document.querySelectorAll('[data-look-filter]');
const looks=document.querySelectorAll('[data-look-kind]');
const count=document.getElementById('lookCount');
if(filters.length&&count){
 filters.forEach(button=>button.addEventListener('click',()=>{
  const selected=button.dataset.lookFilter;
  let visible=0;
  looks.forEach(card=>{
   const match=selected==='all'||card.dataset.lookKind===selected;
   card.hidden=!match;
   if(match)visible++;
  });
  filters.forEach(b=>{
   const active=b===button;
   b.classList.toggle('active',active);
   b.setAttribute('aria-pressed',String(active));
  });
  count.textContent='Showing '+visible+' editorial '+(visible===1?'look':'looks');
 }));
}
const contactForm=document.getElementById('contactDemoForm');
if(contactForm){
 const card=document.getElementById('contactCard');
 const done=document.getElementById('contactDone');
 contactForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!contactForm.checkValidity()){contactForm.reportValidity();return;}
  // No network requests, analytics, storage, or email actions. This is UI-only.
  // Discard all form entries immediately; only a visual confirmation remains.
  contactForm.reset();
  card.hidden=true;
  done.hidden=false;
  done.focus();
 });
 document.getElementById('resetContactDemo').addEventListener('click',()=>{
  done.hidden=true;
  card.hidden=false;
  document.getElementById('contactName').focus();
 });
}
