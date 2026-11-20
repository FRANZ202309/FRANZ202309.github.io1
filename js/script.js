'use strict';
/* CONFIGURACIÓN: reemplazá el número por tu WhatsApp real, con código 591 y sin +. */
const CONFIG = { whatsapp: '59167922772', promoEnd: '' }; // Ejemplo de WhatsApp: '+591 73897550'. No inventar un número real.
const $=(q,base=document)=>base.querySelector(q), $$=(q,base=document)=>[...base.querySelectorAll(q)];
const cards=$$('.producto');let category='todos';
function sendWhatsApp(message){
 if(!/^591\d{8}$/.test(CONFIG.whatsapp)){alert('Antes de habilitar las consultas, agregá tu número real en js/script.js (CONFIG.whatsapp).');return}
 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
}
function productName(card){return card.dataset.nombre}
function productMessage(card){return `Hola, soy cliente de RYJO Sneakers. Me interesa ${productName(card)} (Bs ${card.dataset.precio}). ¿Me confirman tallas y disponibilidad?`}
function applyFilters(){const search=$('#search').value.trim().toLocaleLowerCase('es');const brand=$('#brandFilter').value;const size=$('#sizeFilter').value;const max=Number($('#priceFilter').value)||Infinity;let n=0;
 for(const c of cards){const filter=category==='todos'||(category==='ofertas'?c.dataset.oferta==='si':c.dataset.categoria===category||c.dataset.genero===category);const show=filter&&(!search||(c.dataset.nombre+' '+c.dataset.marca+' '+c.dataset.categoria).toLocaleLowerCase('es').includes(search))&&(!brand||c.dataset.marca===brand)&&(!size||c.dataset.tallas.split(',').includes(size))&&Number(c.dataset.precio)<=max;c.hidden=!show;if(show)n++}
 $('#resultCount').textContent=`${n} producto${n===1?'':'s'}`;$('#noResults').hidden=n>0; $$('.chip').forEach(b=>b.classList.toggle('active',b.dataset.filter===category));
}
['#search','#brandFilter','#sizeFilter','#priceFilter'].forEach(id=>$(id).addEventListener('input',applyFilters));
$$('.chip').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;applyFilters()}));
$('#resetFilters').addEventListener('click',()=>{$('#search').value='';$('#brandFilter').value='';$('#sizeFilter').value='';$('#priceFilter').value='';category='todos';applyFilters()});
$$('[data-brand]').forEach(b=>b.addEventListener('click',()=>{$('#brandFilter').value=b.dataset.brand;category='todos';applyFilters();$('#catalogo').scrollIntoView({behavior:'smooth'})}));
$('#offerLink').addEventListener('click',()=>{category='ofertas';$('#brandFilter').value='';applyFilters()});
const modal=$('#productModal');let selected=null;
function showProduct(card){selected=card;$('#modalImg').src=$('img',card).src;$('#modalImg').alt=$('img',card).alt;$('#modalBrand').textContent=card.dataset.marca+' · '+card.dataset.categoria;$('#modalTitle').textContent=productName(card);$('#modalDescription').textContent=card.dataset.descripcion;$('#modalPrice').textContent='Bs '+card.dataset.precio;$('#modalSizes').textContent='Tallas referenciales: '+card.dataset.tallas.replaceAll(',',', ');$('#modalColors').textContent='Colores: '+card.dataset.colores;modal.showModal()}
$$('.details').forEach(b=>b.addEventListener('click',()=>showProduct(b.closest('.producto'))));
$$('.ask').forEach(b=>b.addEventListener('click',()=>sendWhatsApp(productMessage(b.closest('.producto')))));
$('#modalAsk').addEventListener('click',()=>{if(selected)sendWhatsApp(productMessage(selected))});$('#closeModal').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
// Carrusel principal: sus fotografías están escritas en HTML (banner y tarjetas) y se reutilizan aquí.
const heroImages=['imagenes/banner.svg','imagenes/tenis-03.svg','imagenes/tenis-10.svg'];let heroIndex=0;
function showHero(){ $('#heroPhoto').src=heroImages[heroIndex];$('#heroCounter').textContent=`0${heroIndex+1} / 03` }
function nextHero(d=1){heroIndex=(heroIndex+d+heroImages.length)%heroImages.length;showHero()}
$('#nextHero').addEventListener('click',()=>nextHero());$('#prevHero').addEventListener('click',()=>nextHero(-1));
setInterval(()=>{if(!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)nextHero()},6500);
let featuredIndex=0;const featuredIndices=[0,4,9,2];
function showFeatured(){const c=cards[featuredIndices[featuredIndex]];$('#featuredImg').src=$('img',c).src;$('#featuredImg').alt=$('img',c).alt;$('#featuredTitle').textContent=productName(c);$('#featuredPrice').textContent='Bs '+c.dataset.precio}
$('#featPrev').addEventListener('click',()=>{featuredIndex=(featuredIndex+featuredIndices.length-1)%featuredIndices.length;showFeatured()});$('#featNext').addEventListener('click',()=>{featuredIndex=(featuredIndex+1)%featuredIndices.length;showFeatured()});$('#featuredAsk').addEventListener('click',()=>sendWhatsApp(productMessage(cards[featuredIndices[featuredIndex]])));
const sizeData={adulto:[[36,5.5,23],[37,6,23.5],[38,7,24],[39,7.5,24.5],[40,8,25.5],[41,8.5,26],[42,9,27],[43,10,27.5],[44,10.5,28]],juvenil:[[33,2.5,21],[34,3,21.5],[35,3.5,22],[36,4,22.5],[37,4.5,23],[38,5.5,24],[39,6,24.5]]};
function renderSizes(){$('#sizeRows').innerHTML=sizeData[$('#sizeMode').value].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]} cm</td></tr>`).join('')};$('#sizeMode').addEventListener('change',renderSizes);renderSizes();
const galleryImgs=$$('.gallery-item img');const galleryModal=$('#galleryModal');let galleryIndex=0;
function renderGallery(){const img=galleryImgs[galleryIndex];$('#galleryLarge').src=img.src;$('#galleryLarge').alt=img.alt}
$$('.gallery-item').forEach((b,i)=>b.addEventListener('click',()=>{galleryIndex=i;renderGallery();galleryModal.showModal()}));
function galleryMove(d){galleryIndex=(galleryIndex+d+galleryImgs.length)%galleryImgs.length;renderGallery()}
$('#galleryPrev').addEventListener('click',()=>galleryMove(-1));$('#galleryNext').addEventListener('click',()=>galleryMove(1));$('#closeGallery').addEventListener('click',()=>galleryModal.close());galleryModal.addEventListener('click',e=>{if(e.target===galleryModal)galleryModal.close()});
$('#whatsappFloat').addEventListener('click',()=>sendWhatsApp('Hola, quisiera conocer los tenis disponibles en RYJO Sneakers.'));
$('#contactForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const msg=`Hola, RYJO Sneakers. Soy ${fd.get('nombre')}%0A`;const text=`Hola, RYJO Sneakers.\nNombre: ${fd.get('nombre')}\nCorreo: ${fd.get('correo')}\nCelular: ${fd.get('celular')}\nProducto: ${fd.get('producto')||'Sin especificar'}\nConsulta: ${fd.get('mensaje')}`;if(!/^591\d{8}$/.test(CONFIG.whatsapp)){$('#contactMessage').textContent='Configurá el número de WhatsApp en js/script.js para habilitar el envío.';return}$('#contactMessage').textContent='Se abrirá WhatsApp para que confirmes el envío.';sendWhatsApp(text)});
$('#menuBtn').addEventListener('click',()=>{const active=$('#mainNav').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(active))});$$('.nav a').forEach(a=>a.addEventListener('click',()=>{$('#mainNav').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false')}));
$('#toTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));$('#year').textContent=new Date().getFullYear();applyFilters();
