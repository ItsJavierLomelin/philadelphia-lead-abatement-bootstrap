(function(){
var pending=new Map(),CONF='backend.leadconnectorhq.com/external-tracking/events';
function digits(f){var p=f.elements.phone,d=p.value.replace(/\D/g,''),t=(d.length===11&&d[0]==='1')?d.slice(1):d;
 if(/^[2-9]\d{2}[2-9]\d{6}$/.test(t)){p.value='+1'+t;p.setCustomValidity('');return true}
 p.setCustomValidity('Please enter a 10-digit US phone number.');return false}
function show(f,ok,msg){var st=f.querySelector('.form-status');st.textContent=msg||'';
 if(!ok)return;var card=f.closest('.form-card');f.hidden=true;card.querySelector('.form-card-head').hidden=true;
 var s=card.querySelector('.lead-success');if(!s){s=document.createElement('div');s.className='lead-success';s.setAttribute('role','status');s.tabIndex=-1;
  s.innerHTML='<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="none" stroke="#2f8f5b" stroke-width="5"/><path d="M21 33.5l7.5 7.5L43.5 25" fill="none" stroke="#2f8f5b" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></svg><h2>Request received</h2><p>We have your request and will follow up by phone or email.</p><button type="button">Submit another request</button>';
  card.appendChild(s);s.querySelector('button').addEventListener('click',function(){f.reset();f.hidden=false;card.querySelector('.form-card-head').hidden=false;s.hidden=true;f.elements.full_name.focus()})}
 s.hidden=false;s.focus({preventScroll:true})}
document.querySelectorAll('[data-lead-form]').forEach(function(f){
 f.elements.phone.addEventListener('input',function(){f.elements.phone.setCustomValidity('')});
 f.addEventListener('submit',function(e){e.preventDefault();
  if(f.elements.website.value){e.stopImmediatePropagation();return}
  if(!digits(f)){e.stopImmediatePropagation();f.elements.phone.reportValidity();return}
  if(!f.checkValidity()){e.stopImmediatePropagation();f.reportValidity();return}
  var job={name:f.elements.full_name.value.trim(),phone:f.elements.phone.value,email:f.elements.email.value.trim()};
  pending.set(f,job);f.querySelector('.form-status').textContent='Submitting...';
  setTimeout(function(){if(pending.get(f)===job){pending.delete(f);show(f,false,'We could not confirm that this went through. Please try again or call instead.')}},12000);
 },true)});
var nf=window.fetch.bind(window);
window.fetch=function(u,o){var p=nf(u,o);try{var a=typeof u==='string'?u:(u&&u.url);
 if(a&&a.indexOf(CONF)>-1&&o&&String(o.method).toUpperCase()==='POST'){var body=JSON.parse(o.body),d=body.formData||{};
  pending.forEach(function(job,f){if(body.type==='external_form_submission'&&d.full_name===job.name&&d.phone===job.phone&&(d.email||'')===job.email){
   p.then(function(r){return r.clone().json().then(function(j){if(pending.get(f)!==job)return;if(r.status===200&&j&&j.status==='ok'){pending.delete(f);show(f,true)}else throw 0})}).catch(function(){if(pending.get(f)===job){pending.delete(f);show(f,false,'We could not confirm that this went through. Please try again or call instead.')}})}})}}catch(x){}
 return p};
})();
