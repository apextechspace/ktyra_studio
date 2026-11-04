'use strict';
/* Read only the fictional garment summary. No customer-identifying info exists. */
const shop=window.KTYRA_SHOP;
let summary=null;
try{summary=JSON.parse(sessionStorage.getItem(shop.SUCCESS_KEY)||'null');}catch{}
const list=document.getElementById('successSummaryItems');
const note=document.getElementById('successSummaryMeta');
const total=document.getElementById('successSubtotal');
if(summary&&summary.demo===true&&Array.isArray(summary.items)){
 let itemCount=0;
 let amount=0;
 for(const item of summary.items){
  if(!shop.isValidItem(item))continue;
  const p=shop.PRODUCTS[item.category];
  const shade=p.shades.find(s=>s[0]===item.shade);
  itemCount+=item.quantity;amount+=p.demoPriceNGN*item.quantity;
  const line=document.createElement('span');
  line.textContent=p.title+' · '+shade[1]+' · '+item.size+' · Qty '+item.quantity;
  list.appendChild(line);
 }
 note.textContent='Design preview completed · '+itemCount+' '+(itemCount===1?'piece':'pieces')+'. No real transaction occurred.';
 const c=Object.hasOwn(shop.DEMO_RATES,summary.currency)?summary.currency:'NGN';
 total.textContent='Illustrative subtotal: '+shop.formatDemoPrice(amount,c)+(c==='NGN'?'':' (fictional FX conversion)');
}else{
 note.textContent='This is the KTYRA STUDIO demo completion page. There is no real order to track.';
 total.textContent='No purchase or payment was made.';
}
