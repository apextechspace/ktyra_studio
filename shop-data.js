'use strict';
/* KTYRA STUDIO: shared static product data for a FRONTEND-ONLY DESIGN DEMO.
   All prices and exchange rates are invented demonstration fixtures.
   Do not use these values for actual commerce or treat as market FX. */
(function(){
 const PRODUCTS={
  thobes:{
    title:'The Classic Thobe',headline:'The Classic <em>Thobe.</em>',
    categoryLabel:"THE MEN'S EDIT",collectionLabel:"Men's Collection",collectionUrl:'./men.html',
    description:'A contemporary interpretation of timeless form. A clean, considered silhouette designed to carry presence.',
    details:'Refined lines, coordinating headwear and understated character. This concept image illustrates the proposed aesthetic, not an available SKU.',
    folder:'men/thobes/',prefix:'classic-thobe-',demoPriceNGN:95000,sizes:['S','M','L','XL'],
    shades:[
      ['pearl-white','Pearl White','#f1eee7'],
      ['desert-sand','Desert Sand','#c9af8f'],
      ['midnight-navy','Midnight Navy','#253653'],
      ['graphite','Graphite','#66666b'],
      ['onyx-black','Onyx Black','#252429']
    ]
  },
  abayas:{
    title:'The Signature Abaya',headline:'The Signature <em>Abaya.</em>',
    categoryLabel:"THE WOMEN'S EDIT",collectionLabel:'Signature Abayas',collectionUrl:'./women.html?category=abayas#collection',
    description:'A flowing expression of understated elegance, with signature embroidery and considered detail.',
    details:'An embroidered full-length abaya concept featuring elegant proportions and a refined finish. Exact fabric specifications require verification before launch.',
    folder:'women/abayas/',prefix:'embroidered-abaya-',demoPriceNGN:140000,sizes:['S','M','L','XL'],
    shades:[
      ['onyx','Onyx Black','#252429'],
      ['plum','Royal Plum','#552639'],
      ['taupe','Soft Taupe','#9f8779'],
      ['emerald','Emerald','#115347'],
      ['sand','Sand Beige','#d6bf9d']
    ]
  },
  khimars:{
    title:'The Full Khimar',headline:'The Full <em>Khimar.</em>',
    categoryLabel:"THE WOMEN'S EDIT",collectionLabel:'Full Khimars',collectionUrl:'./women.html?category=khimars#collection',
    description:'Beautifully full coverage and graceful movement in a fluid, effortlessly modest silhouette.',
    details:'Full-length coverage with generous draping. Shown as a one-size concept; real garment measurements and sizing remain to be specified.',
    folder:'women/hijabs/',prefix:'full-khimar-',demoPriceNGN:82000,sizes:['One size'],
    shades:[
      ['onyx','Onyx Black','#252429'],
      ['plum','Royal Plum','#552639'],
      ['taupe','Soft Taupe','#9f8779'],
      ['emerald','Emerald','#115347'],
      ['sand','Sand Beige','#d6bf9d']
    ]
  }
};
 const CART_KEY='ktyra-studio-demo-cart-v1';
 const CURRENCY_KEY='ktyra-studio-currency-v1';
 const SUCCESS_KEY='ktyra-studio-demo-completed-v1';
 // Explicitly fictional rates used to preview USD and GBP layouts offline.
 const DEMO_RATES=Object.freeze({NGN:1,USD:0.00065,GBP:0.00049});
 function formatCurrency(amount,currency='NGN'){
   return new Intl.NumberFormat('en-NG',{style:'currency',currency,
    minimumFractionDigits:currency==='NGN'?0:2,
    maximumFractionDigits:currency==='NGN'?0:2}).format(amount);
 }
 function imagePath(category,shade){
   const product=PRODUCTS[category];
   return product?'./assets/products/'+product.folder+product.prefix+shade+'.webp':'';
 }
 function isValidItem(item){
   const p=PRODUCTS[item?.category];
   return Boolean(p && p.shades.some(s=>s[0]===item.shade) &&
     p.sizes.includes(item.size) && Number.isInteger(item.quantity) &&
     item.quantity>0 && item.quantity<=10);
 }
 function readCart(){
   try{
     const value=JSON.parse(localStorage.getItem(CART_KEY)||'[]');
     if(!Array.isArray(value))return [];
     return value.filter(isValidItem).slice(0,60);
   }catch{return [];}
 }
 function saveCart(items){
   try{localStorage.setItem(CART_KEY,JSON.stringify(items.filter(isValidItem).slice(0,60)));}catch{}
 }
 function formatDemoPrice(ngn,currency){
   return formatCurrency(ngn*DEMO_RATES[currency],currency);
 }
 window.KTYRA_SHOP={PRODUCTS,CART_KEY,CURRENCY_KEY,SUCCESS_KEY,DEMO_RATES,formatCurrency,formatDemoPrice,imagePath,isValidItem,readCart,saveCart};
})();
