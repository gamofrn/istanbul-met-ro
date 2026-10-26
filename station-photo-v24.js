/* Photo-guided station signage helper v24
   Reads printed Turkish/English signs on-device (Tesseract OCR), then compares with the planned route.
   This is NOT general computer vision, nor a guarantee of physical direction or platform.
*/
(function(){
'use strict';
const $=id=>document.getElementById(id);
const state={worker:null,loader:null,photo:null,previewURL:null,rawText:'',confidence:null,busy:false,manual:false};
const ES=String.raw;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const search=(text,needle)=>{const n=clean(needle);if(!n)return false;return (' '+clean(text)+' ').includes(' '+n+' ')};
function trip(){try{return window.RailPhotoContext?.()||null}catch(e){return null}}
function directionForLine(t){return t?.legs?.[$('photoLeg')?.value===''?t.selected:Number($('photoLeg')?.value)]||t?.legs?.[t.selected]||null}
function summary(){
const context=trip(),select=$('photoLeg'),tip=$('photoTripInfo');
if(!select||!tip)return;
if(!context){
select.replaceChildren();select.disabled=true;
tip.innerHTML='<strong>ما عندك رحلة محددة حالياً</strong><p>تقدر تصور لوحة ونقرأ النص، لكن عشان نقول لك هل اتجاهها يناسبك، خطط رحلة أولاً ثم ارجع هنا.</p><button type="button" data-goto="home">🧭 خطط رحلة أولاً</button>';
return;
}
const current=select.value===''?NaN:Number(select.value),selected=Number.isInteger(current)&&current>=0&&current<context.legs.length?current:context.selected;
select.replaceChildren();
for(const l of context.legs){
const option=document.createElement('option');option.value=String(l.index);
option.textContent=(l.index+1)+'. '+(l.code==='B1'?'Marmaray':l.code)+' → '+l.toward;
select.appendChild(option);
}
select.disabled=false;select.value=String(selected);
tip.innerHTML='<span>الخط المطلوب</span><strong>'+esc(context.legs[selected].code==='B1'?'Marmaray':context.legs[selected].code)+' باتجاه '+esc(context.legs[selected].toward)+'</strong><small>من '+esc(context.legs[selected].from)+' إلى '+esc(context.legs[selected].to)+'</small>';
}
function setStatus(msg,kind='neutral'){
const e=$('photoStatus');if(!e)return;e.textContent=msg;e.dataset.kind=kind;
}
function normalizeForMatch(text){
let value=clean(text).replace(/\b([mtf])\s+(\d{1,2})\b/g,'$1$2');
value=value.replace(/\bkadikoy\b/g,'kadikoy').replace(/\bskd?r\b/g,'uskudar');
return value;
}
function has(text,needle){
const norm=normalizeForMatch(text),look=normalizeForMatch(needle);
if(!look)return false;
return (' '+norm+' ').includes(' '+look+' ');
}
function assess(text,leg,confidence,manual){
const original=String(text||'').trim(),t=normalizeForMatch(original);
if(!original||t.length<3)return {kind:'unknown',title:'ما قدرت أقرأ اللوحة',body:'قرّب الكاميرا من اسم الخط أو الاتجاه، وتأكد إن الكتابة واضحة والإضاءة كافية.'};
if(!leg)return {kind:'unknown',title:'قرأت نص اللوحة، لكن ما عندي مسار أقارنه',body:'خطط رحلتك أولاً، ثم ارجع واختَر الخط المطلوب. تقدر أيضاً تقرأ الكلمات المستخرجة تحت.'};
if(!manual&&Number.isFinite(confidence)&&confidence<35)return {kind:'unknown',title:'الكتابة غير واضحة بما يكفي للحكم',body:'الصورة غير واضحة لتحليل الاتجاه بثقة. أعد التصوير أو اكتب ما تقرؤه من اللوحة يدوياً.'};
const correct=has(t,leg.toward),opposite=has(t,leg.opposite)||(leg.code==='M4'&&has(leg.toward,'Kadıköy')&&has(t,'Tavşantepe'));
const lineWord=leg.code==='B1'?'marmaray':leg.code;
const line=has(t,lineWord);
const transfer=has(t,'aktarma')||has(t,'transfer')||has(t,'aktarmalar');
const exit=has(t,'cikis')||has(t,'exit');
if(correct&&opposite)return {kind:'caution',title:'اللوحة تذكر الاتجاهين',body:'ابحث عن السهم المكتوب بجانب '+leg.toward+'، ثم تحقق من لوحة الرصيف. قراءة الكلمات وحدها لا تحدد أي ممر تختار.'};
if(correct)return {kind:'positive',title:'اتجاه رحلتك مذكور في اللوحة',body:'وجدت '+leg.toward+(line?' مع '+lineWord:'')+'. اتبع السهم المرتبط بهذا الاسم، وتحقق من اتجاه القطار على الرصيف قبل الركوب. ما أقدر أحدد اليمين أو اليسار من النص وحده.'};
if(opposite)return {kind:'caution',title:'انتبه: ظهر اسم الاتجاه المقابل',body:'اللوحة تذكر '+leg.opposite+'، بينما رحلتك تحتاج '+leg.toward+'. لا تعتمد على هذه اللوحة للركوب؛ ابحث عن الاتجاه المطلوب أو صوّر لوحة الرصيف بوضوح.'};
if(exit&&!transfer)return {kind:'caution',title:'هذه تبدو لوحة خروج',body:'ظهرت كلمة خروج أو Exit. إذا كنت داخل محطة تبديل، لا تتجه إلى الخارج إلا بعد التأكد من أن رحلة التبديل تتطلب ذلك. ابحث عن لوحات '+lineWord+' / '+leg.toward+'.'};
if(line||transfer)return {kind:'caution',title:'ظهر خط أو تحويل، لكن الاتجاه غير واضح',body:'ابحث على اللوحات عن '+lineWord+' باتجاه '+leg.toward+'. صوّر لوحة الاتجاهات الأقرب أو اكتب الاسم الظاهر.'};
return {kind:'unknown',title:'ما وجدت اسم الاتجاه المطلوب في النص المقروء',body:'رحلتك تحتاج '+lineWord+' باتجاه '+leg.toward+'. جرّب تصوير اسم الخط والوجهة النهائية بشكل أقرب. لا تفترض أن الاتجاه صحيح من هذه الصورة.'};
}
function resultMarkup(result,raw,confidence,manual){
const icon={positive:'✅',caution:'⚠️',unknown:'❔'}[result.kind];
return '<div class="photo-decision '+result.kind+'">'+
'<div class="photo-decision-head">'+icon+' '+esc(result.title)+'</div>'+
'<p>'+esc(result.body)+'</p></div>'+
'<details class="photo-readback"><summary>🔎 الكلمات التي قرأها النظام</summary><pre dir="auto">'+esc(raw.trim().slice(0,2500))+'</pre>'+
(!manual&&Number.isFinite(confidence)?'<p>جودة قراءة تقريبية: '+Math.round(confidence)+'٪ (لا تعني تأكيد الاتجاه).</p>':'')+'</details>'+
'<p class="photo-guard">⚠️ التحليل يقرأ نص اللوحة فقط. لا يستطيع معرفة اتجاه السهم أو موقع الرصيف أو حالة التشغيل بدقة. اعتمد على لوحات المحطة عند الشك.</p>';
}
function renderText(text,confidence=null,manual=false){
const r=assess(text,directionForLine(trip()),confidence,manual);
$('photoResult').innerHTML=resultMarkup(r,text,confidence,manual);
$('photoResult').hidden=false;
}
function script(){
if(window.Tesseract?.createWorker)return Promise.resolve(window.Tesseract);
if(state.loader)return state.loader;
state.loader=new Promise((resolve,reject)=>{
const tag=document.createElement('script');
let complete=false;
const timeout=setTimeout(()=>{if(complete)return;complete=true;reject(Error('تعذر تحميل قارئ الصور. تأكد من الإنترنت أو اكتب النص الظاهر يدوياً.'))},22000);
tag.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';tag.async=true;
tag.onload=()=>{if(complete)return;complete=true;clearTimeout(timeout);if(window.Tesseract?.createWorker)resolve(window.Tesseract);else reject(Error('لم يتم تشغيل قارئ الصور'))};
tag.onerror=()=>{if(complete)return;complete=true;clearTimeout(timeout);reject(Error('تعذر تحميل قارئ الصور. جرّب الاتصال بالإنترنت أو أدخل النص يدوياً.'))};
document.head.appendChild(tag);
}).catch(e=>{state.loader=null;throw e});
return state.loader;
}
async function worker(){
if(state.worker)return state.worker;
const lib=await script();
const obj=await lib.createWorker(['tur','eng'],1,{logger:m=>{
if(m.status==='loading language traineddata')setStatus('أحمّل ملفات اللغة التركية والإنجليزية لأول استخدام...');
else if(m.status==='recognizing text')setStatus('أقرأ الكلمات الظاهرة... '+Math.round((m.progress||0)*100)+'٪');
}});
state.worker=obj;return obj;
}
function resized(file){
return new Promise(resolve=>{
const img=new Image(),url=URL.createObjectURL(file);
img.onload=()=>{
const max=1800,ratio=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
if(ratio===1){URL.revokeObjectURL(url);resolve(file);return}
const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*ratio);c.height=Math.round(img.naturalHeight*ratio);
try{c.getContext('2d').drawImage(img,0,0,c.width,c.height);
c.toBlob(blob=>{URL.revokeObjectURL(url);resolve(blob||file)},'image/jpeg',.9)}
catch(e){URL.revokeObjectURL(url);resolve(file)}
};
img.onerror=()=>{URL.revokeObjectURL(url);resolve(file)};
img.src=url;
});
}
async function analyzePhoto(){
if(!state.photo||state.busy)return;
state.busy=true;
const btn=$('photoAnalyze');btn.disabled=true;
$('photoResult').hidden=true;
setStatus('أجهّز الصورة وأحمّل قارئ النصوص...', 'busy');
try{
const prepared=await resized(state.photo);
const w=await worker();
setStatus('أحلّل النص الظاهر في الصورة...', 'busy');
const output=await w.recognize(prepared);
const raw=output?.data?.text||'';
const confidence=output?.data?.confidence??null;
state.rawText=raw;state.confidence=confidence;state.manual=false;
if(raw.trim()){renderText(raw,confidence,false);setStatus('اكتمل تحليل اللوحة. راجع النتيجة أدناه.','success')}
else{renderText('',confidence,false);setStatus('ما ظهرت كلمات مقروءة. جرّب صورة أوضح.','warning')}
}catch(e){setStatus(e?.message||'تعذّر تحليل الصورة. جرّب مرة ثانية أو اكتب النص يدوياً.','warning');
$('photoResult').innerHTML='<div class="photo-decision unknown"><div class="photo-decision-head">تعذر قراءة الصورة</div><p>يمكنك كتابة اسم الخط والاتجاه الموجودين على اللوحة في خانة النص أسفل الصورة، ثم الضغط على «افحص النص».</p></div>';
$('photoResult').hidden=false;
}finally{state.busy=false;btn.disabled=false}
}
function selectedFile(file){
if(!file)return;
if(!file.type.startsWith('image/')){setStatus('اختر صورة JPG أو PNG أو صورة من كاميرا الجوال.','warning');return}
if(file.size>22*1024*1024){setStatus('الصورة كبيرة جدًا. جرّب تصوير اللوحة من جديد أو اختر صورة أصغر.','warning');return}
state.photo=file;
if(state.previewURL)URL.revokeObjectURL(state.previewURL);
state.previewURL=URL.createObjectURL(file);
$('photoPreview').src=state.previewURL;$('photoPreviewWrap').hidden=false;$('photoAnalyze').hidden=false;
$('photoResult').hidden=true;
setStatus('وصلت الصورة. جاري قراءة اللوحة...', 'busy');
analyzePhoto();
}
function initialize(){
const take=$('photoCapture'),pick=$('photoGallery'),manual=$('photoManual'),button=$('photoAnalyze'),inspect=$('photoCheckManual');
if(!take||!pick||!manual||!button||!inspect)return;
take.addEventListener('change',()=>{selectedFile(take.files?.[0]);take.value=''});
pick.addEventListener('change',()=>{selectedFile(pick.files?.[0]);pick.value=''});
button.addEventListener('click',analyzePhoto);
inspect.addEventListener('click',()=>{
const text=manual.value.trim();
if(!text){setStatus('اكتب العبارة الظاهرة على اللوحة أولاً.','warning');manual.focus();return}
state.rawText=text;state.manual=true;state.confidence=null;
renderText(text,null,true);setStatus('تم فحص النص المكتوب بناءً على رحلتك.','success')
});
$('photoLeg')?.addEventListener('change',()=>{
summary();
if(state.rawText)renderText(state.rawText,state.confidence,state.manual)
});
window.addEventListener('hashchange',()=>{if(location.hash==='#photo')summary()});
document.addEventListener('click',e=>{if(e.target.closest?.('[data-open-screen="photo"]'))setTimeout(summary,0)});
summary();
}
window.PhotoSignHelper={assess,normalizeForMatch,refresh:summary,inspect:(text,leg)=>assess(text,leg,null,true)};
try{initialize()}catch(e){console.error('Photo guidance setup error',e)}
})();