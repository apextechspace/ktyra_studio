'use strict';
/* KTYRA STUDIO: product-led editorial hero. All image paths match committed GitHub assets. */
const collections={
  thobes:{title:'The Classic Thobe',edition:"MEN'S COLLECTION",detail:'A modern expression of timeless form.',folder:'men/thobes/',prefix:'classic-thobe-',items:[
    {name:'Pearl White',slug:'pearl-white',sw:'#f1eee7',wash:'#b49a80'},
    {name:'Desert Sand',slug:'desert-sand',sw:'#c9af8f',wash:'#b68a5c'},
    {name:'Midnight Navy',slug:'midnight-navy',sw:'#253653',wash:'#405b87'},
    {name:'Graphite',slug:'graphite',sw:'#66666b',wash:'#77747b'},
    {name:'Onyx Black',slug:'onyx-black',sw:'#252429',wash:'#62535d'}
  ]},
  abayas:{title:'The Signature Abaya',edition:"WOMEN'S COLLECTION",detail:'A graceful silhouette, finished with considered detail.',folder:'women/abayas/',prefix:'embroidered-abaya-',items:[
    {name:'Onyx Black',slug:'onyx',sw:'#242125',wash:'#665560'},
    {name:'Royal Plum',slug:'plum',sw:'#552639',wash:'#87516d'},
    {name:'Soft Taupe',slug:'taupe',sw:'#9f8779',wash:'#b09a88'},
    {name:'Emerald',slug:'emerald',sw:'#115347',wash:'#377568'},
    {name:'Sand Beige',slug:'sand',sw:'#d6bf9d',wash:'#c9a879'}
  ]},
  khimars:{title:'The Full Khimar',edition:"WOMEN'S COLLECTION",detail:'Beautifully full coverage, with fluid movement.',folder:'women/hijabs/',prefix:'full-khimar-',items:[
    {name:'Onyx Black',slug:'onyx',sw:'#242125',wash:'#665560'},
    {name:'Royal Plum',slug:'plum',sw:'#552639',wash:'#87516d'},
    {name:'Soft Taupe',slug:'taupe',sw:'#9f8779',wash:'#b09a88'},
    {name:'Emerald',slug:'emerald',sw:'#115347',wash:'#377568'},
    {name:'Sand Beige',slug:'sand',sw:'#d6bf9d',wash:'#c9a879'}
  ]}
};
const hero=document.querySelector('.hero'),switcher=document.getElementById('categorySwitch'),swatches=document.getElementById('swatches');
let front=document.getElementById('imageFront'),back=document.getElementById('imageBack');
let category='thobes',index=0,transitionToken=0,toastTimer;
const productPath=(kind,item)=>'./assets/products/'+collections[kind].folder+collections[kind].prefix+item.slug+'.webp';
function renderSwatches(){
  swatches.replaceChildren();
  collections[category].items.forEach((item,i)=>{
    const button=document.createElement('button');button.type='button';
    button.className='swatch'+(i===index?' active':'');
    button.style.setProperty('--sw',item.sw);
    button.title=item.name;button.setAttribute('aria-label',item.name);
    button.setAttribute('aria-pressed',String(i===index));
    button.addEventListener('click',()=>selectShade(i));
    swatches.appendChild(button);
  });
}
function selectCategory(next){
  if(!collections[next] || (next===category && index===0))return;
  category=next;index=0;render();
}
function selectShade(next){const items=collections[category].items;index=(next+items.length)%items.length;render();}
function render(){
  const data=collections[category],item=data.items[index];
  document.getElementById('productEdition').textContent=data.edition;
  document.getElementById('productTitle').textContent=data.title;
  document.getElementById('productDetail').textContent=data.detail;
  document.getElementById('collectionLink').href=category==='thobes'?'./men.html':category==='abayas'?'./women.html?category=abayas#collection':'./women.html?category=khimars#collection';
  document.getElementById('shadeName').textContent=item.name;
  document.getElementById('slideCount').textContent=String(index+1).padStart(2,'0')+' / '+String(data.items.length).padStart(2,'0');
  document.getElementById('selectionNumber').textContent=String(index+1).padStart(2,'0')+' — '+String(data.items.length).padStart(2,'0');
  hero.style.setProperty('--hero-wash',item.wash);
  switcher.querySelectorAll('[data-category]').forEach(button=>{
    const active=button.dataset.category===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
  renderSwatches();
  const src=productPath(category,item),alt=item.name+' '+data.title;
  if(front.getAttribute('src')===src){front.alt=alt;return;}
  const token=++transitionToken;
  const nextImage=new Image();
  nextImage.onload=()=>{
    if(token!==transitionToken)return;
    back.src=src;back.alt=alt;back.removeAttribute('aria-hidden');
    back.classList.add('visible');front.classList.remove('visible');
    const oldFront=front;front=back;back=oldFront;
    back.setAttribute('aria-hidden','true');
  };
  nextImage.onerror=()=>{if(token===transitionToken)notify('This product image could not be loaded.')};
  nextImage.src=src;
}
function notify(message){let toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3000)}
switcher.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>selectCategory(button.dataset.category)));
document.getElementById('prev').addEventListener('click',()=>selectShade(index-1));
document.getElementById('next').addEventListener('click',()=>selectShade(index+1));
let swipeX=null;const stage=document.getElementById('stage');
stage.addEventListener('touchstart',e=>{swipeX=e.changedTouches[0].clientX},{passive:true});
stage.addEventListener('touchend',e=>{if(swipeX===null)return;const movement=e.changedTouches[0].clientX-swipeX;swipeX=null;if(Math.abs(movement)>50)selectShade(index+(movement<0?1:-1))},{passive:true});
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowLeft')selectShade(index-1);if(e.key==='ArrowRight')selectShade(index+1)});
document.getElementById('bag').addEventListener('click',()=>notify('KTYRA STUDIO is a portfolio concept. Shopping is coming later.'));
render();

// Close the compact mobile menu after a navigation choice.
document.querySelectorAll('.mobile-menu-links a').forEach(link=>link.addEventListener('click',()=>{const menu=document.querySelector('.mobile-menu');if(menu)menu.open=false;}));

// Editorial link opens the relevant collection in the existing live hero.
// This is a functional in-page destination until collection pages are built.
document.querySelectorAll('[data-featured-category]').forEach(link=>{
  link.addEventListener('click',()=>{
    const next=link.dataset.featuredCategory;
    if(collections[next])selectCategory(next);
  });
});
