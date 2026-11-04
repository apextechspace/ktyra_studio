'use strict';
// Five verified transparent WebP colorways from the existing KTYRA STUDIO assets.
const MEN_SHADES=[
  {slug:'pearl-white',name:'Pearl White',group:'light',hex:'#f1eee7',background:'#e5ded1',note:'A quietly luminous neutral.'},
  {slug:'desert-sand',name:'Desert Sand',group:'light',hex:'#c9af8f',background:'#e0d4c3',note:'Warmth with understated character.'},
  {slug:'midnight-navy',name:'Midnight Navy',group:'dark',hex:'#253653',background:'#d0d3d4',note:'A distinctive shade of deep blue.'},
  {slug:'graphite',name:'Graphite',group:'dark',hex:'#66666b',background:'#d7d0ca',note:'A refined modern grey.'},
  {slug:'onyx-black',name:'Onyx Black',group:'dark',hex:'#252429',background:'#d4cabd',note:'Classic depth, enduring presence.'}
];
const pathFor=shade=>'./assets/products/men/thobes/classic-thobe-'+shade.slug+'.webp';
const grid=document.getElementById('mensProducts');
const filters=document.querySelectorAll('.mens-filter');
const count=document.getElementById('resultsCount');
const dialog=document.getElementById('menPreview');
const previewImage=document.getElementById('previewImage');
const previewName=document.getElementById('previewName');
const previewShade=document.getElementById('previewShade');
const previewSwatches=document.getElementById('previewSwatches');
let currentFilter='all';
let activeShade=MEN_SHADES[0];
let toastTimer;

function renderProducts(){
  const visible=MEN_SHADES.filter(item=>currentFilter==='all'||item.group===currentFilter);
  grid.innerHTML=visible.map(item=>{
    const num=String(MEN_SHADES.indexOf(item)+1).padStart(2,'0');
    return '<article class="men-product">'+
    '<button type="button" class="men-product__image" style="--product-bg:'+item.background+'" data-preview="'+item.slug+'" aria-label="View '+item.name+' Classic Thobe preview">'+
      '<span class="men-product__number">'+num+' / 05</span>'+
      '<img loading="lazy" decoding="async" width="760" height="1040" src="'+pathFor(item)+'" alt="'+item.name+' Classic Thobe">'+
    '</button>'+
    '<div class="men-product__info"><div>'+
      '<p class="men-product__kicker">THE CLASSIC THOBE</p>'+
      '<h3>'+item.name+'</h3>'+
      '<p class="men-product__sub">'+item.note+'</p>'+
    '<a class="product-details-link" href="./product.html?category=thobes&shade='+item.slug+'" aria-label="View product details for '+item.name+' Classic Thobe">View details ↗</a></div><span class="men-product__swatch" style="--shade:'+item.hex+'" aria-label="'+item.name+' color swatch" role="img"></span></div>'+
    '</article>';
  }).join('');
  count.textContent='Showing '+visible.length+' '+(visible.length===1?'shade':'shades');
}
function selectFilter(next){
  if(!['all','light','dark'].includes(next))return;
  currentFilter=next;
  filters.forEach(button=>{
    const selected=button.dataset.filter===next;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  renderProducts();
}
function renderModalSwatches(){
  previewSwatches.innerHTML=MEN_SHADES.map(item=>'<button type="button" data-shade="'+item.slug+'" style="--shade:'+item.hex+'" aria-label="Select '+item.name+'" title="'+item.name+'" aria-pressed="'+String(item.slug===activeShade.slug)+'"></button>').join('');
}
function selectShade(slug){
  const found=MEN_SHADES.find(item=>item.slug===slug);
  if(!found)return;
  activeShade=found;
  previewImage.src=pathFor(found);
  previewImage.alt=found.name+' Classic Thobe';
  previewName.textContent='The Classic Thobe';
  previewShade.textContent=found.name;
  document.getElementById('previewProductLink').href='./product.html?category=thobes&shade='+encodeURIComponent(found.slug);
  renderModalSwatches();
}
function openPreview(slug){
  selectShade(slug);
  if(!dialog.open)dialog.showModal();
}
function closePreview(){if(dialog.open)dialog.close();}
filters.forEach(button=>button.addEventListener('click',()=>selectFilter(button.dataset.filter)));
grid.addEventListener('click',event=>{
  const button=event.target.closest('[data-preview]');
  if(button)openPreview(button.dataset.preview);
});
previewSwatches.addEventListener('click',event=>{
  const button=event.target.closest('[data-shade]');
  if(button)selectShade(button.dataset.shade);
});
document.getElementById('previewClose').addEventListener('click',closePreview);
document.getElementById('previewBack').addEventListener('click',closePreview);
dialog.addEventListener('click',event=>{if(event.target===dialog)closePreview();});
dialog.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  const current=MEN_SHADES.findIndex(x=>x.slug===activeShade.slug);
  const delta=event.key==='ArrowRight'?1:-1;
  selectShade(MEN_SHADES[(current+delta+MEN_SHADES.length)%MEN_SHADES.length].slug);
});
const toast=document.getElementById('mensToast');
document.getElementById('menBag').addEventListener('click',()=>{
  toast.textContent='Shopping bag and checkout will be introduced in the product-details phase.';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),3200);
});
document.querySelectorAll('.mobile-menu-links a').forEach(link=>link.addEventListener('click',()=>{
  const menu=document.querySelector('.mobile-menu');
  if(menu)menu.open=false;
}));
renderProducts();
