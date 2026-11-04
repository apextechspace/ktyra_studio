'use strict';
/* DESIGN DEMO ONLY. This form never sends requests or stores user-entered
   name, email, address, or payment data. */
const shop=window.KTYRA_SHOP;
const cart=shop.readCart();
const $=id=>document.getElementById(id);
let currency='NGN';
try{
 const saved=localStorage.getItem(shop.CURRENCY_KEY);
 if(Object.hasOwn(shop.DEMO_RATES,saved))currency=saved;
}catch{}
$('summaryCurrency').value=currency;
function toDisplay(ngn){return shop.formatDemoPrice(ngn,currency);}
function renderSummary(){
 const container=$('summaryItems');
 container.replaceChildren();
 let total=0,itemCount=0;
 for(const item of cart){
  const p=shop.PRODUCTS[item.category];
  const shade=p.shades.find(s=>s[0]===item.shade);
  const lineTotal=p.demoPriceNGN*item.quantity;
  total+=lineTotal;itemCount+=item.quantity;
  const row=document.createElement('div');row.className='checkout-item';
  const image=document.createElement('img');image.src=shop.imagePath(item.category,item.shade);
  image.alt=shade[1]+' '+p.title;image.loading='lazy';
  const info=document.createElement('div');
  const title=document.createElement('div');title.className='checkout-item__name';title.textContent=p.title;
  const meta=document.createElement('div');meta.className='checkout-item__meta';
  meta.textContent=shade[1]+' · '+item.size+' · Qty '+item.quantity;
  info.append(title,meta);
  const amount=document.createElement('div');amount.className='checkout-item__price';amount.textContent=toDisplay(lineTotal);
  row.append(image,info,amount);container.append(row);
 }
 $('summaryCount').textContent=itemCount+' '+(itemCount===1?'PIECE':'PIECES');
 $('summarySubtotal').textContent=toDisplay(total);
 $('summaryTotal').textContent=toDisplay(total);
 $('currencyDisclosure').textContent=currency==='NGN'
  ?'NGN is the base demo currency. Prices are fictional and not real offers.'
  :'Currency layout preview: '+currency+' conversion uses a fixed, fictional demonstration rate. Not live FX or a real charge.';
 $('checkoutEmpty').hidden=cart.length!==0;
 $('checkoutForm').hidden=cart.length===0;
}
$('summaryCurrency').addEventListener('change',()=>{
 currency=$('summaryCurrency').value;
 if(!Object.hasOwn(shop.DEMO_RATES,currency))currency='NGN';
 try{localStorage.setItem(shop.CURRENCY_KEY,currency);}catch{}
 renderSummary();
});
$('checkoutForm').addEventListener('submit',event=>{
 event.preventDefault();
 const form=$('checkoutForm');
 if(!form.checkValidity()){form.reportValidity();return;}
 if(cart.length===0){renderSummary();return;}
 // Persist ONLY fictional product selections for the confirmation design.
 // Never store/transmit checkout name, email, address or mock payment selection.
 const summary={
  items:cart.map(x=>({category:x.category,shade:x.shade,size:x.size,quantity:x.quantity})),
  subtotalNGN:cart.reduce((sum,item)=>sum+shop.PRODUCTS[item.category].demoPriceNGN*item.quantity,0),
  currency,
  completedAt:Date.now(),
  demo:true
 };
 try{sessionStorage.setItem(shop.SUCCESS_KEY,JSON.stringify(summary));}catch{}
 shop.saveCart([]);
 window.location.assign('./success.html');
});
document.querySelectorAll('.mobile-menu-links a').forEach(a=>a.addEventListener('click',()=>{
 const menu=document.querySelector('.mobile-menu');
 if(menu)menu.open=false;
}));
renderSummary();
