/* Istanbul rail app v23 — destination-first UX with predictable back navigation. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const labels={home:'الوجهة',results:'طريقك',tracker:'متابعة الرحلة',nearby:'أقرب محطة',map:'الخريطة',photo:'مساعدة بالصور',hours:'ساعات التشغيل'};
const screens=[...document.querySelectorAll('.app-screen[data-screen]')];
let active='home',nearbyLoaded=false;
function available(target){
if(!Object.prototype.hasOwnProperty.call(labels,target))return 'home';
if(target==='results'&&!$('tripOut')?.textContent?.trim())return 'home';
if(target==='tracker'&&!$('ridePanel')&&!$('trackerSlot')?.querySelector('#ridePanel'))return 'home';
return target
}
function relocateTracker(){
const panel=$('ridePanel'),holder=$('trackerSlot'),home=$('tripOut')?.querySelector('.ride-start');
if(active==='tracker'&&panel&&holder&&panel.parentNode!==holder)holder.appendChild(panel);
else if(active==='results'&&panel&&home&&panel.parentNode!==home)home.appendChild(panel);
}
function display(target,opt={}){
target=available(target);active=target;
for(const section of screens){const yes=section.dataset.screen===target;section.hidden=!yes;section.classList.toggle('is-active',yes)}
$('appTitle').textContent=labels[target];$('appBack').hidden=(target==='home');$('appHome').hidden=(target==='home');
relocateTracker();
if(opt.push){history.pushState({screen:target},'',location.pathname+location.search+'#'+target)}
if(target==='map')setTimeout(()=>window.dispatchEvent(new Event('resize')),160);
if(target==='photo')setTimeout(()=>window.PhotoSignHelper?.refresh?.(),0);
if(target==='nearby'&&!nearbyLoaded){nearbyLoaded=true;setTimeout(()=>{if(!$('out')?.textContent.trim())$('gpsBtn')?.click()},100)}
window.scrollTo(0,0);
}
function go(target){display(target,{push:true})}
function status(s,bad=false){const p=$('planStatus');if(p){p.textContent=s;p.classList.toggle('error',bad)}}
const to=$('toPlace'),from=$('fromPlace'),toggle=$('changeOrigin'),options=$('originOptions'),origin=$('originText');
function updateOrigin(){if(origin)origin.textContent=from?.value.trim()||'موقعك الحالي'}
if(toggle)toggle.onclick=()=>{options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden));toggle.textContent=options.hidden?'تغيير':'إخفاء';if(!options.hidden)from?.focus()};
if(from)from.addEventListener('input',updateOrigin);
if($('swapTrip'))$('swapTrip').addEventListener('click',()=>setTimeout(updateOrigin,0));
if(to)to.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('planBtn')?.click()}});
function resumePresent(){try{return !!localStorage.getItem('istanbul-rail-ride-progress-v20')}catch(e){return false}}
if(resumePresent()&&$('resumeTrip'))$('resumeTrip').hidden=false;
document.addEventListener('click',e=>{
const card=e.target.closest?.('[data-open-screen]');
if(card){e.preventDefault();go(card.dataset.openScreen);return}
const back=e.target.closest?.('[data-goto]');
if(back){e.preventDefault();go(back.dataset.goto);return}
const ride=e.target.closest?.('#rideStartBtn');
if(ride){$('resumeTrip').hidden=false;setTimeout(()=>go('tracker'),0);return}
if(e.target.closest?.('[data-ride]')){if(resumePresent()&&$('resumeTrip'))$('resumeTrip').hidden=false}
});
$('appBack')?.addEventListener('click',()=>{
const to=(active==='tracker'||active==='photo')&&$('tripOut')?.textContent?.trim()?'results':'home';
go(to)
});
$('appHome')?.addEventListener('click',()=>go('home'));
window.addEventListener('popstate',()=>{const target=location.hash.slice(1);display(target)});
window.addEventListener('hashchange',()=>{const target=location.hash.slice(1);if(target!==active)display(target)});
window.AppNav={go,show:display,active:()=>active,resultsReady:()=>{},status};
display(location.hash.slice(1)||'home');
})();