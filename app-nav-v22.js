/* v22 Single-page multi-screen router: keeps existing planner, GPS and map logic intact. */
(function(){
'use strict';
const names={home:'الرئيسية',plan:'خطط رحلتك',results:'نتيجة الرحلة',nearby:'أقرب محطة',map:'خريطة المحطات',tracker:'متابعة الرحلة',hours:'ساعات التشغيل'};
const allowed=Object.keys(names);
const get=id=>document.getElementById(id);
const sections=[...document.querySelectorAll('.app-screen[data-screen]')];
const appBack=get('appBack'),appHome=get('appHome'),appTitle=get('appTitle');
let active='';
let lastResults=false;
function show(screen,{push=false}={}){
if(!allowed.includes(screen))screen='home';
if(screen==='results'&&!lastResults&&!get('tripOut')?.textContent.trim())screen='plan';
if(screen==='tracker'&&!get('trackerSlot')?.querySelector('#ridePanel')&&!get('ridePanel'))screen='plan';
active=screen;
sections.forEach(section=>{
const match=section.dataset.screen===screen;
section.hidden=!match;
section.classList.toggle('is-active',match);
});
if(appBack)appBack.hidden=(screen==='home');
if(appHome)appHome.hidden=(screen==='home');
if(appTitle)appTitle.textContent=names[screen]||names.home;
if(push)history.pushState({screen},'',location.pathname+location.search+'#'+screen);
try{window.scrollTo({top:0,behavior:'instant'})}catch(e){window.scrollTo(0,0)}
if(screen==='map'){
setTimeout(()=>window.dispatchEvent(new Event('resize')),90);
setTimeout(()=>window.dispatchEvent(new Event('resize')),350);
}
if(screen==='tracker')activateTracker();
}
function go(screen){show(screen,{push:true})}
function activateTracker(){
const panel=get('ridePanel'),slot=get('trackerSlot');
if(panel&&slot&&panel.parentNode!==slot)slot.appendChild(panel);
if(!panel&&slot&&!slot.textContent.trim()){
slot.innerHTML='<p class="app-hint">ابدأ رحلة جديدة، ثم اضغط متابعة الرحلة داخل المترو.</p>';
}
}
function restore(){
const hash=location.hash.replace('#','');
show(allowed.includes(hash)?hash:'home');
}
document.addEventListener('click',e=>{
const card=e.target.closest?.('[data-open-screen]');
if(card){e.preventDefault();go(card.dataset.openScreen);return}
const start=e.target.closest?.('#rideStartBtn');
if(start){setTimeout(()=>go('tracker'),0);return}
const planner=e.target.closest?.('#planBtn');
if(planner){
get('trackerSlot')?.replaceChildren();
lastResults=true;
setTimeout(()=>go('results'),0);
return
}
const nearest=e.target.closest?.('#findClosestRail');
if(nearest){lastResults=true;setTimeout(()=>go('results'),0);return}
const backTo=e.target.closest?.('[data-goto]');
if(backTo){go(backTo.dataset.goto);return}
const oldNearest=e.target.closest?.('#gpsBtn, #searchBtn');
if(oldNearest&&active!=='nearby'){setTimeout(()=>go('nearby'),0)}
});
if(appBack)appBack.addEventListener('click',()=>{
const target=active==='results'?'plan':active==='tracker'?'results':'home';
go(target)
});
if(appHome)appHome.addEventListener('click',()=>go('home'));
window.addEventListener('popstate',restore);
window.addEventListener('hashchange',restore);
window.AppNav={go,show,active:()=>active,resultsReady:()=>{lastResults=true}};
const stored=(()=>{try{return !!localStorage.getItem('istanbul-rail-ride-progress-v20')}catch(e){return false}})();
if(stored){const resume=get('resumeTrip');if(resume)resume.hidden=false}
const initial=location.hash.replace('#','');
show(allowed.includes(initial)?initial:'home');
})();