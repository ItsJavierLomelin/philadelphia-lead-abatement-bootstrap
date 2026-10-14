(function(){
// Keep existing exported pages compatible with Bootstrap dropdown toggles.
document.querySelectorAll('.dd-btn[data-bs-target]').forEach(function(button){
 var menu=button.closest('.has-dd')?.querySelector('ul.dd');
 if(menu){menu.id=button.getAttribute('data-bs-target').slice(1);menu.classList.add('collapse')}
});
var b=document.getElementById('burger'),n=document.getElementById('mnav');
if(b&&n){
 function state(o){b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.style.overflow=o?'hidden':''}
 n.addEventListener('show.bs.collapse',function(e){if(e.target===n)state(true)});
 n.addEventListener('hide.bs.collapse',function(e){if(e.target===n)state(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')bootstrap.Collapse.getOrCreateInstance(n,{toggle:false}).hide()});
 window.matchMedia('(min-width:1001px)').addEventListener('change',function(e){if(e.matches)bootstrap.Collapse.getOrCreateInstance(n,{toggle:false}).hide()});
}
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="tel:"]');if(a){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'phone_click',link_url:a.getAttribute('href'),page_location:location.href});if(typeof window.gtag==='function')window.gtag('event','phone_click',{link_url:a.getAttribute('href'),page_location:location.href})}});
})();
