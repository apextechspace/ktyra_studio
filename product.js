'use strict';
/* KTYRA STUDIO — frontend-only product detail prototype.
   All NGN prices below are DEMO values (not offers or actual merchant pricing).
   Checkout, stock, payment processing and international settlement are NOT implemented. */
const {PRODUCTS,CART_KEY,CURRENCY_KEY}=window.KTYRA_SHOP;
const qs=new URLSearchParams(location.search);
let category=Object.hasOwn(PRODUCTS,qs.get('category'))?qs.get('category'):'thobes';
let product=PRODUCTS[category];
let shade=product.shades.find(s=>s[0]===qs.get('shade'))||product.shades[0];
let qty=1,cart=[],toastTimer;
let currency='NGN';
const $=id=>document.getElementById(id);
function storageRead(key){try{return localStorage.getItem(key);}catch{return null;}}
function storageWrite(key,value){try{localStorage.setItem(key,value);}catch{/* in-memory demo bag still works */}}
function currencyAmount(amount,c='NGN'){
  return new Intl.NumberFormat('en-NG',{style:'currency',currency:c,
    maximumFractionDigits:c==='NGN'?0:2,minimumFractionDigits:c==='NGN'?0:2}).format(amount);
}
function imageFor(p,s){return './assets/products/'+p.folder+p.prefix+s[0]+'.webp';}
function restoreCart(){
  try{
    const parsed=JSON.parse(storageRead(CART_KEY)||'[]');
    if(!Array.isArray(parsed))return [];
    return parsed.filter(item=>{
      const p=PRODUCTS[item.category];
      return p && p.shades.some(s=>s[0]===item.shade)&&p.sizes.includes(item.size)&&
        Number.isInteger(item.quantity)&&item.quantity>0&&item.quantity<=10;
    }).slice(0,60);
  }catch{return [];}
}
cart=restoreCart();
function saveCart(){storageWrite(CART_KEY,JSON.stringify(cart));$('bagCount').textContent=String(cart.reduce((a,x)=>a+x.quantity,0));}
function showToast(message){
  $('productToast').textContent=message;
  $('productToast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('productToast').classList.remove('show'),2800);
}
function renderPrice(){
  $('productPrice').textContent=window.KTYRA_SHOP.formatDemoPrice(product.demoPriceNGN,currency);
  $('rateNotice').textContent=currency==='NGN'
    ?'Illustrative NGN price only. This is a design demonstration — no payment is processed.'
    :'Illustrative '+currency+' display using a fixed, fictional exchange rate. Not live FX and not a checkout quote.';
}
function renderShades(){
  $('shadeButtons').replaceChildren();
  for(const item of product.shades){
    const button=document.createElement('button');
    button.type='button';button.dataset.shade=item[0];
    button.title=item[1];button.setAttribute('aria-label','Select '+item[1]);
    button.setAttribute('aria-pressed',String(item[0]===shade[0]));
    button.style.setProperty('--shade',item[2]);
    button.addEventListener('click',()=>selectShade(item[0]));
    $('shadeButtons').appendChild(button);
  }
}
function selectShade(slug){
  const selected=product.shades.find(s=>s[0]===slug);
  if(!selected)return;
  shade=selected;
  $('selectedShade').textContent=shade[1];
  $('productImage').src=imageFor(product,shade);
  $('productImage').alt=shade[1]+' '+product.title;
  $('imageCaption').textContent=(shade[1]+' / '+product.title).toUpperCase();
  renderShades();
  const url=new URL(location.href);
  url.searchParams.set('category',category);url.searchParams.set('shade',slug);
  history.replaceState(null,'',url.pathname+url.search+url.hash);
}
function renderProduct(){
  document.title=product.title+' | KTYRA STUDIO';
  $('crumbCollection').textContent=product.collectionLabel;$('crumbCollection').href=product.collectionUrl;
  $('crumbProduct').textContent=product.title;
  $('productKicker').textContent=product.categoryLabel;
  $('productName').innerHTML=product.headline;
  $('productDescription').textContent=product.description;
  $('detailsText').textContent=product.details;
  const select=$('sizeSelect');
  select.replaceChildren(new Option('Choose a size',''));
  product.sizes.forEach(s=>select.add(new Option(s,s)));
  $('quantity').textContent=String(qty);
  selectShade(shade[0]);renderPrice();
}
$('decreaseQty').addEventListener('click',()=>{qty=Math.max(1,qty-1);$('quantity').textContent=String(qty)});
$('increaseQty').addEventListener('click',()=>{qty=Math.min(10,qty+1);$('quantity').textContent=String(qty)});
function addToBag(){
  const size=$('sizeSelect').value;
  if(!product.sizes.includes(size)){$('sizeSelect').focus();showToast('Select a size to continue.');return;}
  const entry=cart.find(x=>x.category===category&&x.shade===shade[0]&&x.size===size);
  if(entry)entry.quantity=Math.min(10,entry.quantity+qty);
  else cart.push({category,shade:shade[0],size,quantity:qty});
  saveCart();showToast('Added to your demo bag.');openBag();
}
$('addToBag').addEventListener('click',addToBag);
function renderBag(){
  const body=$('bagItems');body.replaceChildren();
  if(!cart.length){const p=document.createElement('p');p.textContent='Your bag is empty. Discover a favorite shade to begin.';body.append(p);}
  let total=0;
  for(const [index,item] of cart.entries()){
    const p=PRODUCTS[item.category],s=p.shades.find(x=>x[0]===item.shade);
    if(!s)continue;
    total+=p.demoPriceNGN*item.quantity;
    const row=document.createElement('div');row.className='bag-row';
    const img=document.createElement('img');img.src=imageFor(p,s);img.alt=s[1]+' '+p.title;
    const label=document.createElement('div');
    const title=document.createElement('strong');title.textContent=p.title;
    const desc=document.createElement('small');desc.textContent=s[1]+' · '+item.size+' · Qty '+item.quantity;
    const price=document.createElement('div');price.className='bag-row__price';
    const amt=document.createElement('div');amt.textContent=currencyAmount(p.demoPriceNGN*item.quantity);
    const remove=document.createElement('button');remove.type='button';remove.className='bag-row__remove';remove.textContent='Remove';
    remove.setAttribute('aria-label','Remove '+s[1]+' '+p.title+' from demo bag');
    remove.addEventListener('click',()=>{cart.splice(index,1);saveCart();renderBag();});
    label.append(title,desc);price.append(amt,remove);row.append(img,label,price);body.appendChild(row);
  }
  $('bagTotal').textContent=currencyAmount(total);
  $('proceedCheckout').hidden=cart.length===0;
}
function openBag(){renderBag();if(!$('bagDialog').open)$('bagDialog').showModal();}
$('openBag').addEventListener('click',openBag);
$('closeBag').addEventListener('click',()=>$('bagDialog').close());
$('continueShopping').addEventListener('click',()=>$('bagDialog').close());
$('bagDialog').addEventListener('click',e=>{if(e.target===$('bagDialog'))$('bagDialog').close();});
$('sizeGuide').addEventListener('click',()=>$('sizeDialog').showModal());
$('closeSize').addEventListener('click',()=>$('sizeDialog').close());
$('dismissSize').addEventListener('click',()=>$('sizeDialog').close());
$('sizeDialog').addEventListener('click',e=>{if(e.target===$('sizeDialog'))$('sizeDialog').close();});
$('currencySelect').addEventListener('change',()=>{
  currency=$('currencySelect').value;
  storageWrite(CURRENCY_KEY,currency);
  renderPrice();
});
for(const link of document.querySelectorAll('.mobile-menu-links a'))link.addEventListener('click',()=>{
  const menu=document.querySelector('.mobile-menu');if(menu)menu.open=false;
});
saveCart();renderProduct();
const savedCurrency=storageRead(CURRENCY_KEY);
if(['NGN','USD','GBP'].includes(savedCurrency)){currency=savedCurrency;$('currencySelect').value=currency;renderPrice();}
if(location.hash==='#bag')openBag();
