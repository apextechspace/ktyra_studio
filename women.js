'use strict';
/* KTYRA STUDIO: two silhouettes, five authentic image colorways each.
   Browsing-only concept: no fabricated price, availability or size data. */
const SHADES=[
  {slug:'onyx',name:'Onyx Black',color:'#252429',bg:'#d5cec8',note:'Timeless depth.'},
  {slug:'plum',name:'Royal Plum',color:'#552639',bg:'#ddcdd0',note:'A richly considered tone.'},
  {slug:'taupe',name:'Soft Taupe',color:'#9f8779',bg:'#ded1c4',note:'Quiet, versatile elegance.'},
  {slug:'emerald',name:'Emerald',color:'#115347',bg:'#cdd8ce',note:'Grace with distinction.'},
  {slug:'sand',name:'Sand Beige',color:'#d6bf9d',bg:'#e5dac8',note:'An effortless neutral.'}
];
const GROUPS={
  abayas:{
    name:'Signature Abayas',
    singular:'The Signature Abaya',
    kicker:'THE SIGNATURE ABAYA',
    folder:'women/abayas',prefix:'embroidered-abaya-',
    description:'Embroidered details, graceful proportions and beautifully considered draping.',
    preview:'A graceful silhouette, finished with considered embroidered detail.'
  },
  khimars:{
    name:'Full Khimars',
    singular:'The Full Khimar',
    kicker:'THE FULL KHIMAR',
    folder:'women/hijabs',prefix:'full-khimar-',
    description:'Beautifully full coverage, generous flowing fabric and effortless movement.',
    preview:'Fluid, full-length coverage with a silhouette made for understated presence.'
  }
};
const GROUP_KEYS=['abayas','khimars'];
const garmentSrc=(group,shade)=>'./assets/products/'+GROUPS[group].folder+'/'+GROUPS[group].prefix+shade.slug+'.webp';
const tabs=document.querySelectorAll('.womens-tab');
const catalog=document.getElementById('womenGroups');
const resultCount=document.getElementById('womenResultCount');
const shadeFilter=document.getElementById('shadeFilter');
const preview=document.getElementById('womenPreview');
const previewTitle=document.getElementById('previewTitle');
const previewShade=document.getElementById('previewShade');
const previewKicker=document.getElementById('previewKicker');
const previewDescription=document.getElementById('previewDescription');
const previewImage=document.getElementById('previewImage');
const previewSwatches=document.getElementById('previewSwatches');
const toast=document.getElementById('womenToast');
let selectedCategory='all';
let selectedShade='all';
let activeGroup='abayas';
let activeShade=SHADES[0];
let toastTimer;
function validCategory(value){return value==='all'||GROUP_KEYS.includes(value);}
function drawCatalog(){
  const groups=selectedCategory==='all'?GROUP_KEYS:[selectedCategory];
  let number=0;
  const sections=groups.map(group=>{
    const collection=GROUPS[group];
    const shades=SHADES.filter(shade=>selectedShade==='all'||shade.slug===selectedShade);
    number+=shades.length;
    if(!shades.length)return '';
    const products=shades.map(shade=>{
      const rank=String(SHADES.indexOf(shade)+1).padStart(2,'0');
      return '<article class="womens-product">'+
        '<button type="button" class="womens-product__image" data-preview-group="'+group+'" data-preview-shade="'+shade.slug+'" aria-label="Preview '+shade.name+' '+collection.singular+'" style="--product-bg:'+shade.bg+'">'+
          '<span class="womens-product__number">'+rank+' / 05</span>'+
          '<img loading="lazy" decoding="async" src="'+garmentSrc(group,shade)+'" alt="'+shade.name+' '+collection.singular+'" width="760" height="1040">'+
        '</button>'+
        '<div class="womens-product__details"><div>'+
          '<p class="womens-product__kicker">'+collection.kicker+'</p>'+
          '<h4>'+shade.name+'</h4>'+
          '<p>'+shade.note+'</p>'+
        '</div><span class="womens-product__swatch" role="img" aria-label="'+shade.name+' shade" style="--shade:'+shade.color+'"></span></div>'+
      '</article>';
    }).join('');
    return '<section class="womens-group" id="'+group+'" aria-label="'+collection.name+'">'+
      '<div class="womens-group__heading"><div><p class="mens-overline mens-overline--warm">'+(group==='abayas'?'01 / THE ABAYA EDIT':'02 / THE KHIMAR EDIT')+'</p><h3>'+collection.name+'</h3></div>'+
      '<p>'+collection.description+'</p></div>'+
      '<div class="womens-grid">'+products+'</div></section>';
  }).join('');
  catalog.innerHTML=sections||'<p class="womens-empty">No garments match these filters. Try another category or shade.</p>';
  resultCount.textContent='Showing '+number+' '+(number===1?'colorway':'colorways')+(selectedCategory!=='all'?' in '+GROUPS[selectedCategory].name:'');
}
function setCategory(value){
  if(!validCategory(value))return;
  selectedCategory=value;
  tabs.forEach(button=>{
    const active=button.dataset.category===value;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  drawCatalog();
}
function setShadeFilter(value){
  selectedShade=value==='all'||SHADES.some(s=>s.slug===value)?value:'all';
  shadeFilter.value=selectedShade;
  drawCatalog();
}
function drawPreview(){
  const collection=GROUPS[activeGroup];
  previewImage.src=garmentSrc(activeGroup,activeShade);
  previewImage.alt=activeShade.name+' '+collection.singular;
  previewTitle.textContent=collection.singular;
  previewKicker.textContent='THE WOMEN\'S EDIT / '+collection.name.toUpperCase();
  previewShade.textContent=activeShade.name;
  previewDescription.textContent=collection.preview;
  previewSwatches.innerHTML=SHADES.map(s=>'<button type="button" data-preview-color="'+s.slug+'" style="--shade:'+s.color+'" aria-label="Select '+s.name+'" title="'+s.name+'" aria-pressed="'+String(activeShade.slug===s.slug)+'"></button>').join('');
}
function selectPreviewShade(slug){
  const shade=SHADES.find(s=>s.slug===slug);
  if(!shade)return;
  activeShade=shade;
  drawPreview();
}
function openPreview(group,slug){
  if(!GROUP_KEYS.includes(group))return;
  const shade=SHADES.find(s=>s.slug===slug);
  if(!shade)return;
  activeGroup=group;
  activeShade=shade;
  drawPreview();
  if(!preview.open)preview.showModal();
}
function closePreview(){if(preview.open)preview.close();}
tabs.forEach(button=>button.addEventListener('click',()=>setCategory(button.dataset.category)));
shadeFilter.addEventListener('change',()=>setShadeFilter(shadeFilter.value));
catalog.addEventListener('click',event=>{
  const button=event.target.closest('[data-preview-group]');
  if(button)openPreview(button.dataset.previewGroup,button.dataset.previewShade);
});
previewSwatches.addEventListener('click',event=>{
  const button=event.target.closest('[data-preview-color]');
  if(button)selectPreviewShade(button.dataset.previewColor);
});
document.getElementById('previewClose').addEventListener('click',closePreview);
document.getElementById('previewBack').addEventListener('click',closePreview);
preview.addEventListener('click',event=>{if(event.target===preview)closePreview();});
preview.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  const step=event.key==='ArrowRight'?1:-1;
  const current=SHADES.findIndex(s=>s.slug===activeShade.slug);
  selectPreviewShade(SHADES[(current+step+SHADES.length)%SHADES.length].slug);
});
document.querySelectorAll('[data-select-category]').forEach(link=>link.addEventListener('click',()=>{
  setShadeFilter('all');
  setCategory(link.dataset.selectCategory);
}));
const categoryFromQuery=new URLSearchParams(window.location.search).get('category');
if(validCategory(categoryFromQuery))selectedCategory=categoryFromQuery;
setCategory(selectedCategory);
document.getElementById('womenBag').addEventListener('click',()=>{
  toast.textContent='The shopping bag will be available in the product-details phase.';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),3200);
});
document.querySelectorAll('.mobile-menu-links a').forEach(link=>link.addEventListener('click',()=>{
  const menu=document.querySelector('.mobile-menu');
  if(menu)menu.open=false;
}));
