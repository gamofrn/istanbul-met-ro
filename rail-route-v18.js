/* Istanbul rail route planner v18 | ordered operating lines from Metro Istanbul and TCDD */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const LINE_LIST={
"M1A":"Yenikapı|Aksaray|Emniyet-Fatih|Topkapı-Ulubatlı|Bayrampaşa-Maltepe|Sağmalcılar|Kocatepe|Otogar|Terazidere|Davutpaşa-YTÜ|Merter|Zeytinburnu|Bakırköy-İncirli|Bahçelievler|Ataköy-Şirinevler|Yenibosna|DTM-İstanbul Fuar Merkezi|Atatürk Havalimanı",
"M1B":"Yenikapı|Aksaray|Emniyet-Fatih|Topkapı-Ulubatlı|Bayrampaşa-Maltepe|Sağmalcılar|Kocatepe|Otogar|Esenler|Menderes|Üçyüzlü|Bağcılar Meydan|Kirazlı-Bağcılar",
"M2":"Yenikapı|Vezneciler-İstanbul Ü.|Haliç|Şişhane|Taksim|Osmanbey|Şişli-Mecidiyeköy|Gayrettepe|Levent|4.Levent|Sanayi Mahallesi|İTÜ-Ayazağa|Atatürk Oto Sanayi|Darüşşafaka|Hacıosman",
"M3":"Bakırköy Sahil|Özgürlük Meydanı|İncirli|Haznedar|İlkyuva|Yıldıztepe|Molla Gürani|Kirazlı-Bağcılar|Yenimahalle|Mahmutbey|İSTOÇ|İkitelli Sanayi|Turgut Özal|Siteler|Başak Konutları|Başakşehir-Metrokent|Onurkent|Şehir Hastanesi|Toplu Konutlar|Kayaşehir Merkez",
"M4":"Kadıköy|Ayrılık Çeşmesi|Acıbadem|Ünalan|Göztepe|Yenisahra|Kozyatağı|Bostancı|Küçükyalı|Maltepe|Huzurevi|Gülsuyu|Esenkent|Hastane-Adliye|Soğanlık|Kartal|Yakacık-Adnan Kahveci|Pendik|Tavşantepe|Fevzi Çakmak-Hastane|Yayalar-Şeyhli|Kurtköy|Sabiha Gökçen Havalimanı",
"M5":"Üsküdar|Fıstıkağacı|Bağlarbaşı|Altunizade|Kısıklı|Bulgurlu|Ümraniye|Çarşı|Yamanevler|Çakmak|Ihlamurkuyu|Altınşehir|İmam Hatip Lisesi|Dudullu|Necip Fazıl|Çekmeköy|Meclis|Sarıgazi|Sancaktepe Şehir Hastanesi|Sancaktepe|Samandıra Merkez|Veysel Karani|Hasanpaşa|Sultanbeyli",
"M6":"Levent|Nispetiye|Etiler|Boğaziçi Ü.-Hisarüstü",
"M7":"Yıldız|Fulya|Mecidiyeköy|Çağlayan|Kağıthane|Nurtepe|Alibeyköy|Çırçır Mahallesi|Veysel Karani-Akşemsettin|Yeşilpınar|Kazım Karabekir|Yenimahalle|Karadeniz Mahallesi|Giyimkent-Tekstilkent|Oruç Reis|Göztepe Mahallesi|Mahmutbey",
"M8":"Bostancı|Emin Ali Paşa|Ayşekadın|Kozyatağı|Küçükbakkalköy|İçerenköy|Kayışdağı|Mevlana|İMES|MODOKO-KEYAP|Dudullu|Huzur|Parseller",
"M9":"Ataköy|Yenibosna|Çobançeşme|29 Ekim Cumhuriyet|Doğu Sanayi|Mimar Sinan|15 Temmuz|Halkalı Caddesi|Atatürk Mahallesi|Bahariye|MASKO|İkitelli Sanayi|Ziya Gökalp Mahallesi|Olimpiyat",
"T1":"Kabataş|Fındıklı-Mimar Sinan Ü.|Tophane|Karaköy|Eminönü|Sirkeci|Gülhane|Sultanahmet|Çemberlitaş|Beyazıt-Kapalıçarşı|Laleli-İstanbul Ü.|Aksaray|Yusufpaşa|Haseki|Fındıkzade|Çapa-Şehremini|Pazartekke|Topkapı|Cevizlibağ-AÖY|Merkezefendi|Seyitnizam-Akşemsettin|Mithatpaşa|Zeytinburnu|Mehmet Akif|Merter Tekstil Merkezi|Güngören|Akıncılar|Soğanlı|Yavuzselim|Güneştepe|Bağcılar",
"T4":"Topkapı|Fetihkapı|Vatan|Edirnekapı|Şehitlik|Demirkapı|Topçular|Rami|Uluyol Bereç|Sağmalcılar|Bosna Çukurçeşme|Ali Fuat Başgil|Taşköprü|Karadeniz|Kiptaş-Venezia|Cumhuriyet Mahallesi|50.Yıl-Baştabya|Hacı Şükrü|Yenimahalle|Sultançiftliği|Cebeci|Mescid-i Selam",
"T5":"Eminönü|Küçükpazar|Cibali|Fener|Balat|Ayvansaray|Feshane|Eyüpsultan Teleferik|Eyüpsultan Devlet Hastanesi|Silahtarağa Mahallesi|Üniversite|Alibeyköy Merkez|Alibeyköy Metro|Alibeyköy Cep Otogarı",
"F1":"Taksim|Kabataş",
"F4":"Boğaziçi Ü.-Hisarüstü|Aşiyan",
"B1":"Halkalı|Mustafa Kemal|Küçükçekmece|Florya|Florya Akvaryum|Yeşilköy|Yeşilyurt|Ataköy|Bakırköy|Yenimahalle|Zeytinburnu|Kazlıçeşme|Yenikapı|Sirkeci|Üsküdar|Ayrılık Çeşmesi|Söğütlüçeşme|Feneryolu|Göztepe|Erenköy|Suadiye|Bostancı|Küçükyalı|İdealtepe|Süreyya Plajı|Maltepe|Cevizli|Atalar|Başak|Kartal|Yunus|Pendik|Kaynarca|Tersane|Güzelyalı|Aydıntepe|İçmeler|Tuzla|Çayırova|Fatih|Osmangazi|Darıca|Gebze"
};
const COLORS={"M1A":"#d32f2f","M1B":"#be2929","M2":"#1b9c5d","M3":"#63a6cf","M4":"#e16632","M5":"#7742a1","M6":"#9b8c21","M7":"#eb6683","M8":"#9262bd","M9":"#dfad2d","T1":"#285dcb","T4":"#eeb45f","T5":"#7c3bb6","F1":"#636a77","F4":"#438f9c","B1":"#627786"};
const TRANSFERS=[
["M2","Yenikapı","B1","Yenikapı",6],["M2","Yenikapı","M1A","Yenikapı",5],["M2","Yenikapı","M1B","Yenikapı",5],
["M1A","Yenikapı","B1","Yenikapı",5],["M1B","Yenikapı","B1","Yenikapı",5],
["M1A","Aksaray","M1B","Aksaray",3],["M1A","Otogar","M1B","Otogar",4],
["M2","Şişli-Mecidiyeköy","M7","Mecidiyeköy",7],["M2","Levent","M6","Levent",5],
["M2","Taksim","F1","Taksim",5],["F1","Kabataş","T1","Kabataş",5],
["M2","Haliç","T5","Küçükpazar",12],["M2","Vezneciler-İstanbul Ü.","T1","Laleli-İstanbul Ü.",13],
["M1A","Aksaray","T1","Aksaray",12],["M1B","Aksaray","T1","Aksaray",12],
["M1A","Zeytinburnu","T1","Zeytinburnu",6],["M1B","Bağcılar Meydan","T1","Bağcılar",9],
["M1A","Bakırköy-İncirli","M3","İncirli",7],["M1A","Yenibosna","M9","Yenibosna",6],
["M1A","Topkapı-Ulubatlı","T4","Vatan",11],["M1B","Topkapı-Ulubatlı","T4","Vatan",11],
["M3","Kirazlı-Bağcılar","M1B","Kirazlı-Bağcılar",5],["M3","Mahmutbey","M7","Mahmutbey",5],
["M3","İkitelli Sanayi","M9","İkitelli Sanayi",5],["M7","Alibeyköy","T5","Alibeyköy Metro",5],["M7","Karadeniz Mahallesi","T4","Kiptaş-Venezia",9],
["M4","Ayrılık Çeşmesi","B1","Ayrılık Çeşmesi",5],["M5","Üsküdar","B1","Üsküdar",5],
["M8","Bostancı","B1","Bostancı",5],["M4","Kozyatağı","M8","Kozyatağı",5],["M5","Dudullu","M8","Dudullu",6],
["T1","Sirkeci","B1","Sirkeci",7],["T1","Eminönü","T5","Eminönü",5],
["T1","Topkapı","T4","Topkapı",6],["M9","Ataköy","B1","Ataköy",6],
["M6","Boğaziçi Ü.-Hisarüstü","F4","Boğaziçi Ü.-Hisarüstü",4]
];
const FIXED={
"osmanbey":[41.0539,28.9874],"taksim":[41.0369,28.985],"sislimecidiyekoy":[41.0674,28.9923],
"mecidiyekoy":[41.0674,28.9923],"yenikapi":[41.0055,28.9524],"halic":[41.0215,28.9652],
"sishane":[41.0286,28.9743],"gayrettepe":[41.0795,29.002],"levent":[41.0827,29.0104],
"kabatas":[41.0332,28.9935],"eminonu":[41.017,28.9705],"sirkeci":[41.0144,28.9766],
"sultanahmet":[41.0054,28.9768],"kadikoy":[40.9912,29.0249],"ayrilikcesmesi":[40.9968,29.0435],
"uskudar":[41.0267,29.015],"merter":[41.0078,28.8868],"zeytinburnu":[40.994,28.904],
"bostanci":[40.953,29.094],"kozyatagi":[40.9697,29.095],"yildiz":[41.049,29.009],
"kagithane":[41.082,28.97],"mahmutbey":[41.053,28.83],"kirazlibagcilar":[41.033,28.841],
"florya":[40.974,28.789],"bakirkoy":[40.98,28.872],"halkali":[41.018,28.767],
"kazlicesme":[40.992,28.917],"gebze":[40.799,29.439],"gumgoren":[41.019,28.876],
"aksaray":[41.009,28.9503],"topkapi":[41.021,28.929],"sabiha gokcenhavalimani":[40.905,29.316]
};
const PLACE_ALIASES={
"كاديكوي":[40.9912,29.0249],"كاديكوى":[40.9912,29.0249],"تقسيم":[41.0369,28.985],
"شيشلي":[41.060,28.987],"نيشانتاشي":[41.052,28.993],"نيشانتشي":[41.052,28.993],
"بشكتاش":[41.043,29.007],"اسكودار":[41.0267,29.015],"اوسكودار":[41.0267,29.015],
"مرتر":[41.0078,28.8868],"سلطان احمد":[41.0054,28.9768],"الفاتح":[41.016,28.95],
"امينونو":[41.017,28.9705],"اورتاكوي":[41.0479,29.0266],"اورتاكوى":[41.0479,29.0266],
"باكيركوي":[40.978,28.87],"اكسراي":[41.009,28.9503],"كاراكوي":[41.0222,28.9764],
"نيشان تاشي":[41.052,28.993],"سيركجي":[41.0144,28.9766],"فلوريا":[40.974,28.789],
"كباتاش":[41.0332,28.9935],"عثمان بيه":[41.0539,28.9874],"ساحل كاديكوي":[40.9912,29.0249]
};
let gpsPoint=null,networkGraph=null;
const norm=s=>String(s||'').toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const ar=s=>String(s||'').toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();
function dist(a,b,c,d){let p=Math.PI/180,x=(c-a)*p,y=(d-b)*p;return 12742000*Math.asin(Math.sqrt(Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2))}
function fmt(m){return m>=1000?(m/1000).toFixed(1)+' كم':Math.round(m)+' م'}
function safe(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function urlWalk(from,to){return 'https://www.google.com/maps/dir/?api=1&origin='+from.join(',')+'&destination='+to.join(',')+'&travelmode=walking'}
function sourceStations(){try{return typeof stations!=='undefined'?stations:[]}catch(e){return []}}
function getCoord(stop,line){
let target=norm(stop);
if(target==='mecidiyekoy')target='sislimecidiyekoy';
if(target==='ayrilikcesmesi')target='ayrilikcesmesi';
const list=sourceStations().filter(x=>Array.isArray(x)&&Number.isFinite(x[1])&&Number.isFinite(x[2])&&
(norm(x[0])===target||(target==='sislimecidiyekoy'&&norm(x[0])==='mecidiyekoy')));
if(list.length){const good=list.filter(x=>String(x[3]||'').toUpperCase().split(/[^A-Z0-9]+/).includes(line));const matches=good.length?good:list;
if(matches.length===1)return [matches[0][1],matches[0][2]];
// Repeated place names on different sides of Istanbul must not be guessed without line identification.
if(good.length===1)return [good[0][1],good[0][2]];
}
return FIXED[target]||FIXED[norm(stop)]||null
}
function makeGraph(){
const nodes=new Map(),edges=new Map(),lines={};
for(const [code,chain] of Object.entries(LINE_LIST)){
const stops=chain.split('|');lines[code]=stops;
for(let i=0;i<stops.length;i++){
const id=code+':'+i;nodes.set(id,{id,line:code,stop:stops[i],i,coord:getCoord(stops[i],code)});edges.set(id,[]);
if(i){const prev=code+':'+(i-1),weight=code==='B1'?2.5:(code[0]==='T'?2.3:2.2);
edges.get(id).push({to:prev,cost:weight,type:'ride',line:code});
edges.get(prev).push({to:id,cost:weight,type:'ride',line:code})}
}}
function connect(lineA,nameA,lineB,nameB,minutes){
const i=lines[lineA]?.findIndex(s=>norm(s)===norm(nameA));
const j=lines[lineB]?.findIndex(s=>norm(s)===norm(nameB));
if(i<0||j<0||i===undefined||j===undefined)return;
const idA=lineA+':'+i,idB=lineB+':'+j;
if(!nodes.has(idA)||!nodes.has(idB))return;
edges.get(idA).push({to:idB,cost:minutes,type:'transfer'});
edges.get(idB).push({to:idA,cost:minutes,type:'transfer'})
}
for(const t of TRANSFERS)connect(...t);
return {nodes,edges,lines}
}
function getGraph(){if(!networkGraph)networkGraph=makeGraph();return networkGraph}
function pointCandidates(point,limit=12,max=1700){
const g=getGraph(),out=[];
for(const node of g.nodes.values()){if(!node.coord)continue;const d=dist(...point,...node.coord);
if(d>max)continue;out.push({node,d})}
out.sort((a,b)=>a.d-b.d);
const dedup=new Set();
return out.filter(x=>{const key=norm(x.node.stop);if(dedup.has(key))return false;dedup.add(key);return true}).slice(0,limit)
}
function stopCandidates(point,limit=12,max=1700){
const near=pointCandidates(point,limit,max);
const ids=new Map();
for(const c of near){
for(const n of getGraph().nodes.values())if(n.coord&&norm(n.stop)===norm(c.node.stop)&&dist(...n.coord,...c.node.coord)<300){
const d=dist(...point,...n.coord);if(d<=max)ids.set(n.id,{node:n,d})
}}
return [...ids.values()]
}
function shortest(from,to){
const g=getGraph(),starts=stopCandidates(from,12,1900),ends=stopCandidates(to,12,1900);
if(!starts.length||!ends.length)return {error:!starts.length?'لا توجد محطة قريبة معروفة من نقطة الانطلاق ضمن 1.9 كم بخط مستقيم.':'لا توجد محطة قريبة معروفة من الوجهة ضمن 1.9 كم بخط مستقيم.'};
const queue=[],best=new Map(),prev=new Map(),begin=new Map();
for(const s of starts){const score=s.d/62+2;best.set(s.node.id,score);queue.push({id:s.node.id,cost:score});begin.set(s.node.id,s)}
let winner=null,total=Infinity,ending=null;
while(queue.length){
queue.sort((a,b)=>b.cost-a.cost);const cur=queue.pop();if(cur.cost!==best.get(cur.id))continue;
for(const e of ends)if(e.node.id===cur.id){const c=cur.cost+e.d/62;
if(c<total){winner=cur.id;total=c;ending=e}}
if(cur.cost>total)break;
for(const edge of g.edges.get(cur.id)||[]){
const cost=cur.cost+edge.cost;if(cost<(best.get(edge.to)??Infinity)){best.set(edge.to,cost);prev.set(edge.to,{id:cur.id,edge});begin.set(edge.to,begin.get(cur.id));queue.push({id:edge.to,cost})}}
}
if(!winner)return {error:'لم أجد ربطاً واضحاً بين المحطات ضمن الخطوط المدعومة حالياً.'};
const path=[winner],links=[];
while(prev.has(path[0])){const p=prev.get(path[0]);links.unshift(p.edge);path.unshift(p.id)}
const start=begin.get(winner);
return {path,links,start,end:ending,total}
}
function parseCoords(text){
const t=String(text).trim();
let m=t.match(/!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/i)||t.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
if(!m)m=t.match(/(?:^|[^\d])(-?\d{1,2}\.\d+)\s*[,،]\s*(-?\d{1,3}\.\d+)/);
if(m){const p=[+m[1],+m[2]];if(p[0]>40&&p[0]<42&&p[1]>27&&p[1]<31)return p}
return null
}
async function geocode(s){
if(!s.trim())return null;
const p=parseCoords(s);if(p)return p;
const known=PLACE_ALIASES[ar(s)];if(known)return known;
if(/maps\.app\.goo\.gl|goo\.gl\/maps/i.test(s))throw Error('رابط Google Maps المختصر ما نقدر نفكّه مباشرة هنا. افتحه وانسخ اسم المكان أو إحداثياته.');
const hints={"kadikoy":"Kadıköy","uskudar":"Üsküdar","sisli":"Şişli","taksim":"Taksim","ortakoy":"Ortaköy","besiktas":"Beşiktaş","nisantasi":"Nişantaşı","sultanahmet":"Sultanahmet"};
const q=hints[norm(s)]||s,ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8500);
try{
const r=await fetch('https://photon.komoot.io/api/?q='+encodeURIComponent(q)+'&lat=41.04&lon=28.99&limit=7&lang=en',{signal:ctl.signal});
if(r.ok){const j=await r.json();const f=(j.features||[]).find(x=>{const c=x.geometry?.coordinates;return c&&c[0]>27.5&&c[0]<30.1&&c[1]>40.7&&c[1]<41.7});
if(f)return [f.geometry.coordinates[1],f.geometry.coordinates[0]]}
}catch(e){}finally{clearTimeout(timer)}
const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8500);
try{const r=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=tr&q='+encodeURIComponent(q+', Istanbul'),{signal:controller.signal});
if(!r.ok)return null;const j=await r.json();const found=j.find(x=>+x.lat>40.7&&+x.lat<41.7&&+x.lon>27.5&&+x.lon<30.1);
return found?[+found.lat,+found.lon]:null}catch(e){return null}finally{clearTimeout(timeout)}
}
function gps(){
return new Promise((resolve,reject)=>{
if(!navigator.geolocation)return reject(Error('خدمة الموقع غير مدعومة'));
navigator.geolocation.getCurrentPosition(p=>{gpsPoint=[p.coords.latitude,p.coords.longitude];resolve(gpsPoint)},e=>reject(Error('تعذّر تحديد موقعك. فعّل إذن الموقع أو اكتب منطقة الانطلاق.')),{enableHighAccuracy:true,maximumAge:90000,timeout:15000})
})
}
function badge(code){return '<span class="rail-line" style="background:'+safe(COLORS[code]||'#60758a')+'">'+safe(code==='B1'?'Marmaray':code)+'</span>'}
function stepsFrom(route){
const g=getGraph(),steps=[],ids=route.path;
for(let i=0;i<route.links.length;i++){
const a=g.nodes.get(ids[i]),b=g.nodes.get(ids[i+1]),edge=route.links[i];
if(edge.type==='transfer'){steps.push({type:'transfer',a,b});continue}
const last=steps[steps.length-1];
if(last&&last.type==='ride'&&last.code===a.line&&last.end.id===a.id){last.end=b;last.count++}
else steps.push({type:'ride',code:a.line,start:a,end:b,count:1})
}
return steps
}
function prettyLine(code){return code==='B1'?'قطار Marmaray':code.startsWith('T')?'ترام '+code:code.startsWith('F')?'فونيكولار '+code:'مترو '+code}
function round5(n){return Math.max(5,Math.round(n/5)*5)}
function journeyEstimate(route,steps){
const rides=steps.filter(x=>x.type==='ride').length;
const base=route.total+rides*3.5; // Interchange penalties and modeled stop times already in total.
return [round5(Math.max(5,base-7)),round5(base+7)]
}
function stationTimeline(step,graph){
const stops=graph.lines[step.code]||[];
const inc=step.end.i>=step.start.i?1:-1;
const sequence=[];
for(let i=step.start.i;i!==step.end.i+inc;i+=inc){if(i<0||i>=stops.length)break;sequence.push(stops[i])}
return sequence.map((name,i)=>'<li class="'+(i===0?'rail-board':i===sequence.length-1?'rail-alight':'')+'"><span class="rail-stop-num">'+(i+1)+'</span><span>'+safe(name)+'</span>'+(i===0?'<strong>اركب هنا</strong>':i===sequence.length-1?'<strong>انزل هنا</strong>':'')+'</li>').join('')
}
function routeMarkup(route,origin,destination){
const graph=getGraph();
const first=graph.nodes.get(route.path[0]),last=graph.nodes.get(route.path[route.path.length-1]);
const steps=stepsFrom(route),rideCount=steps.filter(s=>s.type==='ride').length,transfers=steps.filter(s=>s.type==='transfer').length;
const [low,high]=journeyEstimate(route,steps);
let html='<section class="rail-result"><div class="rail-good">✅ طريق مقترح بالمترو والقطارات</div>'+
'<div class="rail-journey-head"><div><span>⏳ المدة التقريبية</span><strong>'+low+'–'+high+' دقيقة</strong><small>تقدير حسابي، وليس موعداً حياً</small></div><div><span>🔁 التبديلات</span><strong>'+transfers+'</strong><small>'+rideCount+' وسيلة نقل بالسكك</small></div></div>'+
'<div class="rail-kpis"><span>🚉 من '+safe(first.stop)+'</span><span>🏁 إلى '+safe(last.stop)+'</span><span>🚶 '+fmt(route.start.d+route.end.d)+' خط مستقيم إجمالاً</span></div>';
html+='<div class="rail-step"><div class="rail-num">1</div><div><strong>📍 امشِ إلى محطة '+safe(first.stop)+'</strong><p>المسافة بخط مستقيم: '+fmt(route.start.d)+'. '+(first.coord?'<a target="_blank" rel="noopener" href="'+urlWalk(origin,first.coord)+'">اعرض المشي الفعلي ↗</a>':'')+'</p></div></div>';
let no=2,rideIndex=0;
for(const step of steps){
if(step.type==='transfer'){
html+='<div class="rail-transfer"><div class="rail-transfer-icon">🔁</div><div><strong>بدّل من '+badge(step.a.line)+' إلى '+badge(step.b.line)+'</strong><p>في محطة <b>'+safe(step.a.stop)+'</b>'+(norm(step.a.stop)!==norm(step.b.stop)?' باتجاه <b>'+safe(step.b.stop)+'</b>':'')+'. تابع لوحات التحويل داخل المحطة.</p></div></div>';
continue
}
rideIndex++;
const arr=graph.lines[step.code]||[];
const toward=arr[step.end.i>step.start.i?arr.length-1:0]||'نهاية الخط';
const count=Math.abs(step.end.i-step.start.i);
const countLabel=count===1?'محطة واحدة':count===2?'محطتين':count+' محطات';
html+='<div class="rail-segment">'+
'<div class="rail-segment-title"><div class="rail-segment-heading"><span class="rail-segment-index">'+rideIndex+'</span><span>'+safe(prettyLine(step.code))+' '+badge(step.code)+'</span></div><div class="rail-toward">الاتجاه المكتوب على اللوحات: <strong>'+safe(toward)+'</strong></div></div>'+
'<div class="rail-segment-points"><span>🟢 اركب: <b>'+safe(step.start.stop)+'</b></span><span>🔴 انزل: <b>'+safe(step.end.stop)+'</b></span></div>'+
'<details class="rail-station-details" '+(count<=7?'open':'')+'><summary>🚉 '+countLabel+' — '+(count<=7?'إخفاء':'عرض')+' المحطات بالترتيب</summary><ol class="rail-station-list">'+stationTimeline(step,graph)+'</ol></details>'+
'</div>'
}
html+='<div class="rail-step rail-finish"><div class="rail-num">✓</div><div><strong>🎉 وصلت محطة '+safe(last.stop)+'</strong><p>تبقى المشي إلى الوجهة، والمسافة بخط مستقيم '+fmt(route.end.d)+'. '+(last.coord?'<a target="_blank" rel="noopener" href="'+urlWalk(last.coord,destination)+'">اتجاهات المشي الأخيرة ↗</a>':'')+'</p></div></div>';
html+='<p class="rail-warning">⚠️ أسماء المحطات واتجاهات الخطوط مبنية على شبكة السكك المعروفة، لكن البيانات قد تتغير وقد توجد فروع أو تحويلات غير مغطاة. المدة تقريبية من نموذج حسابي يشمل أوقات انتظار تقديرية؛ ليست بيانات حية. المسافات خط مستقيم وليست وقت المشي الحقيقي. تأكد من خرائط Google ولوحات المحطات قبل الركوب.</p></section>';
const points=route.path.map(id=>graph.nodes.get(id).coord).filter(Boolean);
try{window.dispatchEvent(new CustomEvent('rail-route',{detail:{points}}))}catch(e){}
return html
}
function navLinks(from,to){
const base='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(to)+'&travelmode=';
const origin=from?'&origin='+encodeURIComponent(from):'';
return '<div class="rail-links"><a target="_blank" rel="noopener" href="'+base+'transit'+origin+'">🗺️ تأكد من مسارات النقل في Google Maps ↗</a><a target="_blank" rel="noopener" href="'+base+'walking'+origin+'">🚶 مسار المشي ↗</a></div>'
}
function nearestMarkup(p){
const nearby=pointCandidates(p,4,2200);
if(!nearby.length)return '<div class="rail-note">⚠️ لم نجد محطة ضمن 2.2 كم من هذه النقطة في قاعدة المواقع الحالية.</div>';
const closest=nearby[0];
return '<div class="rail-nearest"><strong>📍 أقرب محطة مسجلة لك: '+safe(closest.node.stop)+' '+badge(closest.node.line)+'</strong><p>'+fmt(closest.d)+' بخط مستقيم (ليس مشياً فعلياً).</p><a target="_blank" rel="noopener" href="'+urlWalk(p,closest.node.coord)+'">🚶 افتح طريق المشي للمحطة ↗</a></div>'
}
function setBusy(s){const o=$('tripOut');o.innerHTML='<div class="rail-note">'+safe(s)+'</div>'}
async function findNearest(){
setBusy('📍 أحدد موقعك الحالي وأبحث عن أقرب محطة...');
try{const here=await gps();$('tripOut').innerHTML=nearestMarkup(here)+'<p class="rail-tip">اكتب وجهتك فوق، وبعدها اضغط «اعرض طريق المترو بالتبديلات».</p>'}catch(e){$('tripOut').innerHTML='<div class="rail-note">'+safe(e.message)+'</div>'}
}
async function plan(){
const fromText=$('fromPlace').value.trim(),toText=$('toPlace').value.trim();
if(!toText){setBusy('⚠️ اكتب المنطقة أو المكان اللي تبي تروح له.');return}
setBusy('🧭 أحدد أقرب محطات الانطلاق والوجهة وأحسب التبديلات...');
try{
const [from,to]=await Promise.all([fromText?geocode(fromText):gps(),geocode(toText)]);
if(!from||!to){setBusy('⚠️ ما لقيت أحد المواقع. جرّب اسم الحي أو الإحداثيات، أو اضغط على الخريطة لتحديده.');return}
const route=shortest(from,to),start=nearestMarkup(from);
let body=start;
if(!route.error){const selected=getGraph().nodes.get(route.path[0]);const closest=pointCandidates(from,1,2200)[0];if(closest&&norm(closest.node.stop)!==norm(selected.stop))body+='<p class="rail-tip">💡 اخترنا '+safe(selected.stop)+' كبداية للمسار لأن الرحلة منه أسهل حسب الخطوط والتبديلات، مع أنه ليس بالضرورة أقرب محطة جغرافياً.</p>';}
if(route.error)body+='<div class="rail-note">⚠️ '+safe(route.error)+' لا يعني عدم وجود مواصلات أخرى. جرّب خرائط Google.</div>';
else body+=routeMarkup(route,from,to);
body+=navLinks(fromText||from.join(','),toText);
$('tripOut').innerHTML=body;
}catch(e){$('tripOut').innerHTML='<div class="rail-note">⚠️ '+safe(e.message)+'</div>'+navLinks(fromText,toText)}
}
function install(){
const button=$('planBtn');if(!button)return;
const orig=$('fromPlace'),dest=$('toPlace');
const find=document.createElement('button');
find.id='findClosestRail';find.type='button';find.textContent='📍 اعرف أقرب محطة من موقعي';find.className='rail-geo';find.onclick=findNearest;
orig.insertAdjacentElement('afterend',find);
button.textContent='🚇 اعرض طريق المترو والتبديلات';
button.onclick=plan; // Overrides old launcher without affecting independent station search.
const msg=document.createElement('p');msg.className='rail-tip';msg.textContent='يربط المحطات والتبديلات بالترتيب، ويفتح Google Maps للتحقق من أوقات الرحلة والمشي.';
button.insertAdjacentElement('afterend',msg);
window.addEventListener('stations-updated',()=>{networkGraph=null});
if($('version'))$('version').textContent='الإصدار 19 · رحلة خطوة بخطوة';
}
try{install()}catch(e){console.error('Rail planner failed',e)}
})();