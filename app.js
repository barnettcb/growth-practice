'use strict';
// Growth Practice 1.0.3 streamlined daily-first experience. No external runtime dependencies, trackers, or cloud storage.
const DB_NAME='growth-practice-v1', PBKDF_ITER=600000, LOCK_AFTER_MS=5*60*1000;
const validPin=p=>typeof p==='string'&&/^[0-9]{4}$/.test(p);
const TE=new TextEncoder(),TD=new TextDecoder();
let db=null, vaultKey=null, state=null, mode='today', selectedDate='', todayViewDate='', reviewStart=null, selectedLearnWeek=1;
let editablePastWeek=null, expandedEvents=new Set();
let pending=Promise.resolve(), saveTimer=null, lastActivity=Date.now(), hiddenAt=null, lastToast=null;
const e=sel=>document.querySelector(sel), es=(sel)=>[...document.querySelectorAll(sel)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b64=b=>btoa([...new Uint8Array(b)].map(n=>String.fromCharCode(n)).join(''));
const un64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const bytes=n=>crypto.getRandomValues(new Uint8Array(n));
const dayString=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseDay=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d,12);};
const plusDays=(s,n)=>{const d=parseDay(s);d.setDate(d.getDate()+n);return dayString(d);};
const weekStart=s=>{const d=parseDay(s);d.setDate(d.getDate()-((d.getDay()+6)%7));return dayString(d);};
const nice=(s,opts={month:'short',day:'numeric'})=>parseDay(s).toLocaleDateString('en-US',opts);
const weekday=s=>nice(s,{weekday:'long'});
const weekRange=s=>`${nice(s,{month:'short',day:'numeric'})} – ${nice(plusDays(s,6),{month:'short',day:'numeric',year:'numeric'})}`;
const stamp=()=>new Date().toISOString();
selectedDate=dayString(new Date());todayViewDate=selectedDate;
const blank=()=>({mindfulness:null,minutes:null,rehearsal:null,opportunity:null,recognition:null,actions:[],emotions:'',facts:'',interpretations:'',flag:false,events:[],completedAt:null,updatedAt:null});
const newState=()=>({schema:1,createdAt:stamp(),settings:{},lessons:{},weeks:{},lastBackupAt:null});
function getWeek(s){const start=weekStart(s);if(!state.weeks[start])state.weeks[start]={start,days:{},reviewNotes:'',createdAt:stamp()};return state.weeks[start];}
function getDay(s){const w=getWeek(s);if(!w.days[s])w.days[s]=blank();return w.days[s];}
function validateState(s){return !!(s&&s.schema===1&&s.weeks&&typeof s.weeks==='object'&&!Array.isArray(s.weeks)&&s.lessons&&typeof s.lessons==='object'&&!Array.isArray(s.lessons));}

// Safely surface existing 1.0.1 single-observation records as individual events.
function upgradeLegacyDays(s){let changed=false;
 for(const w of Object.values(s.weeks||{}))for(const [date,d] of Object.entries(w.days||{})){
  if(Array.isArray(d.events))continue;
  const has=Boolean(d.facts||d.interpretations||d.emotions||d.flag||d.recognition||(d.actions&&d.actions.length));
  d.events=has?[{id:'legacy-'+date,title:'Earlier observation',facts:d.facts||'',interpretations:d.interpretations||'',emotions:d.emotions||'',recognition:d.recognition||null,actions:[...(d.actions||[])],flag:!!d.flag,createdAt:d.updatedAt||stamp()}]:[];
  changed=true;
 }return changed;
}
function lessonForDate(date){const toUTC=x=>{const [y,m,d]=x.split('-').map(Number);return Date.UTC(y,m-1,d);};const days=Math.round((toUTC(weekStart(date))-toUTC(GP_CONTENT.startMonday))/86400000);return Math.max(1,Math.floor(days/7)+1);}
function curriculum(n){return GP_CONTENT['week'+n]||{number:n,title:'To be determined',subtitle:'Not assigned',status:'To be assigned at a Monday review',goal:'No content assigned.',rehearsalTitle:'No rehearsal assigned yet',rehearsalHow:'',resources:[],rehearsals:[]};}
function resourceKey(n,id){return n===1?id:'w'+n+':'+id;}
const rehearsalDays=[0,3,5]; // Sunday, Wednesday, Friday: flexible suggestions, not obligations.
function rehearsalPlanned(date){return rehearsalDays.includes(parseDay(date).getDay()) && lessonForDate(date)<=4;}
function setDirty(d){d.updatedAt=stamp();d.completedAt=null;scheduleSave(true);}
function findEvent(d,id){return (d.events||[]).find(x=>x.id===id);}

async function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{const v=r.result;if(!v.objectStoreNames.contains('meta'))v.createObjectStore('meta');if(!v.objectStoreNames.contains('vault'))v.createObjectStore('vault');};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
function dbGet(store,key){return new Promise((res,rej)=>{const r=db.transaction(store,'readonly').objectStore(store).get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
function dbPut(store,key,val){return new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(val,key);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);});}
function dbPutVaultAndSetup(payload,setup){return new Promise((res,rej)=>{const tx=db.transaction(['meta','vault'],'readwrite');tx.objectStore('vault').put(payload,'state');tx.objectStore('meta').put(setup,'setup');tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error||Error('Could not update the vault.'));});}
async function derive(pass,salt){const k=await crypto.subtle.importKey('raw',TE.encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:PBKDF_ITER,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function crypt(key,object){const iv=bytes(12);const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,TE.encode(JSON.stringify(object)));return {iv:b64(iv),data:b64(data)};}
async function decrypt(key,object){const b=await crypto.subtle.decrypt({name:'AES-GCM',iv:un64(object.iv)},key,un64(object.data));return JSON.parse(TD.decode(b));}
async function createVault(pin){
 if(!validPin(pin))throw Error('Enter exactly four digits.');
 const salt=bytes(16),key=await derive(pin,salt),newS=newState();
 const verifier=await crypt(key,{app:'growth-practice',schema:1});
 const payload=await crypt(key,newS);
 await dbPutVaultAndSetup(payload,{authMode:'pin4',salt:b64(salt),verifier});
 vaultKey=key;state=newS;selectedLearnWeek=1;
}
async function readVault(secret){
 const setup=await dbGet('meta','setup');if(!setup)throw Error('No vault found.');
 const key=await derive(secret,un64(setup.salt));let proof,loaded;
 try{proof=await decrypt(key,setup.verifier);loaded=await decrypt(key,await dbGet('vault','state'));}
 catch(_){throw Error(setup.authMode==='pin4'?'Incorrect PIN or unreadable data.':'Incorrect old passphrase or unreadable data.');}
 if(proof.app!=='growth-practice'||!validateState(loaded))throw Error('Stored data is unreadable or incompatible.');
 return {key,loaded,setup};
}
async function unlock(pin){if(!validPin(pin))throw Error('Enter exactly four digits.');
 const setup=await dbGet('meta','setup');if(setup?.authMode!=='pin4')throw Error('This vault needs passphrase-to-PIN conversion first.');
 const {key,loaded}=await readVault(pin);vaultKey=key;state=loaded;if(!state.settings||typeof state.settings!=='object')state.settings={};selectedLearnWeek=state.settings?.learnWeek||1;lastActivity=Date.now();if(upgradeLegacyDays(state))scheduleSave(true);
}
async function migrateLegacy(pass,newPin){
 if(!validPin(newPin))throw Error('Enter exactly four digits for your new PIN.');
 const setup=await dbGet('meta','setup');if(!setup||setup.authMode==='pin4')throw Error('This vault is already using a PIN.');
 // Read everything first. A failed old passphrase must never touch existing data.
 const {loaded}=await readVault(pass);
 const salt=bytes(16),key=await derive(newPin,salt);
 const verifier=await crypt(key,{app:'growth-practice',schema:1});
 const payload=await crypt(key,loaded);
 // Vault content and authentication metadata are replaced in one atomic IndexedDB transaction.
 await dbPutVaultAndSetup(payload,{authMode:'pin4',salt:b64(salt),verifier});
 vaultKey=key;state=loaded;if(!state.settings||typeof state.settings!=='object')state.settings={};selectedLearnWeek=state.settings?.learnWeek||1;lastActivity=Date.now();if(upgradeLegacyDays(state))scheduleSave(true);
}
async function verifyVaultPin(pin){if(!validPin(pin))throw Error('Enter exactly four digits.');
 const setup=await dbGet('meta','setup');if(setup?.authMode!=='pin4')throw Error('Switch your vault to PIN unlock first.');
 const key=await derive(pin,un64(setup.salt));
 try{const value=await decrypt(key,setup.verifier);if(value.app!=='growth-practice')throw Error('Invalid verifier.');}
 catch(_){throw Error('Incorrect PIN.');}
 return true;
}
function scheduleSave(immediate=false){if(!vaultKey||!state)return;const status=e('#save-status');if(status)status.textContent='Saving…';if(saveTimer)clearTimeout(saveTimer);if(immediate)commitSave();else saveTimer=setTimeout(commitSave,550);}
function commitSave(){if(!vaultKey||!state)return;saveTimer=null;const snapshot=structuredClone(state),key=vaultKey;pending=pending.catch(()=>{}).then(async()=>{const encrypted=await crypt(key,snapshot);await dbPut('vault','state',encrypted);const status=e('#save-status');if(status)status.textContent='Saved locally';}).catch(err=>{const status=e('#save-status');if(status)status.textContent='Save failed';notice('Save failed: '+err.message);});return pending;}
async function flushSave(){if(saveTimer){clearTimeout(saveTimer);commitSave();}await pending;}
function lock(){if(saveTimer){clearTimeout(saveTimer);commitSave();}vaultKey=null;state=null;mode='today';render();}
function notice(msg){const old=e('.toast');if(old)old.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=msg;document.body.appendChild(el);if(lastToast)clearTimeout(lastToast);lastToast=setTimeout(()=>el.remove(),4000);}
function navTo(dest){mode=(dest==='home'||dest==='diary')?'today':dest;if(mode==='today')selectedDate=dayString(new Date());render();window.scrollTo(0,0);}
const button=(label,act,cls='')=>`<button type="button" class="btn ${cls}" data-act="${act}">${label}</button>`;
function shell(body){
 const tabs=[['today','Today','▤'],['learn','Learn','◫'],['toolkit','Toolkit','⛨'],['review','Review','▦']];
 return `<div class="app"><header class="top"><div class="top-in wrap"><div><div class="eyebrow">Daily skills & reflection</div><div class="top-title">Growth Practice <small>v1.0.3</small></div></div><div class="top-actions"><div class="sticky-status" id="save-status">Saved locally</div><button aria-label="Settings and backup" data-go="settings" class="icon-btn">⚙</button></div></div></header><main class="content wrap">${body}</main><nav class="nav" aria-label="Main navigation"><div class="nav-inner">${tabs.map(([id,label,sym])=>`<button type="button" aria-label="${label}" class="${mode===id?'active':''}" data-go="${id}"><span class="sym">${sym}</span>${label}</button>`).join('')}</div></nav></div>`;
}

function pinField(id,label,autocomplete='off'){
 return `<label class="label" for="${id}">${label}</label><input class="field pin-input" id="${id}" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" minlength="4" autocomplete="${autocomplete}" required />`;
}
function lockScreen(initial){
 const legacy=!initial&&document.body.dataset.setup==='legacy';
 const title=initial?'Choose a 4-digit PIN':legacy?'Switch to 4-digit PIN':'Unlock Growth Practice';
 const subtitle=legacy?'You have an existing passphrase-protected Growth Practice vault. Enter your previous passphrase once to convert it, without deleting your entries.':initial?'Your entries will be encrypted locally using your four-digit PIN. This is convenient but substantially weaker than a strong passphrase.':'Enter your four-digit PIN to open your local practice and diary records.';
 const formFields=legacy?`<label class="label" for="old-password">Current vault passphrase</label><input class="field" id="old-password" type="password" autocomplete="current-password" required />${pinField('password','New 4-digit PIN','new-password')}${pinField('confirm','Confirm new PIN','new-password')}<div class="alert" style="margin:12px 0">Converting preserves this device's records. Existing passphrase-encrypted backups still need their original passphrase if restored later. First ensure you have a backup of your old vault.</div>`:initial?`${pinField('password','4-digit PIN','new-password')}${pinField('confirm','Confirm PIN','new-password')}<div class="alert" style="margin:12px 0">Four digits are easy to guess offline, especially if an encrypted backup is copied or stolen. Use device security and keep backups private. Your PIN cannot be reset without deleting inaccessible vault data. This is a NEW app vault; RO Diary and Conflict Training are separate.</div>`:pinField('password','4-digit PIN','off');
 return `<div class="lock-outer"><div class="lock-card"><div class="lock-logo">✦</div><div class="eyebrow">Local data · PIN access</div><h1>${title}</h1><p class="muted">${subtitle}</p><form id="vault-form">${formFields}<div class="lock-error" id="vault-error" aria-live="polite"></div><button type="submit" class="btn primary full">${legacy?'Convert to PIN and unlock':initial?'Create and enter app':'Unlock app'}</button></form><p class="small" style="margin-top:14px">No account, analytics, or cloud sync. Auto-lock after five minutes of inactivity.</p></div></div>`;
}
function dayBar(date){
 const atToday=date===dayString(new Date());
 return `<div class="day-nav"><button type="button" class="btn" data-act="prev-day" aria-label="Previous day">←</button><div class="dateline">${esc(nice(date,{weekday:'short',month:'short',day:'numeric',year:'numeric'}))}${atToday?' · Today':''}</div><button type="button" class="btn" data-act="next-day" aria-label="Next day" ${date>=dayString(new Date())?'disabled':''}>→</button></div>${!atToday?`<div class="back-today">${button('Back to today','diary-jump-today','soft')}</div>`:''}`;
}
function flagStatus(d){return d.completedAt?'Complete':d.updatedAt?'In progress':'Not started';}
function renderToday(){
 const d=getDay(selectedDate),date=selectedDate,n=lessonForDate(date),c=curriculum(n),past=weekStart(date)<weekStart(dayString(new Date())),readOnly=past&&editablePastWeek!==weekStart(date),events=d.events||[];
 const isCurrent=date===dayString(new Date()),noEvent=d.opportunity==='no'&&!events.length;
 return `<div class="stack">
 <section class="panel pad compact-header">${dayBar(date)}<div class="day-heading"><div><div class="eyebrow">Week ${n} · ${esc(flagStatus(d))}</div><h1>${isCurrent?'Today':'Daily entry'}</h1></div>${button('Week '+n+' lesson →','open-day-lesson','soft compact-cta')}</div><p class="week-subline">${esc(c.title)}</p>${past?`<div class="past-info"><span class="small">${readOnly?'Past week · read-only':'Past week · editing enabled'}</span>${button(readOnly?'Edit past week':'Finish editing','toggle-past','soft')}</div>`:''}</section>
 <fieldset class="entry-fieldset" ${readOnly?'disabled':''}>
 <section class="panel pad compact-practice"><h2>Daily practice</h2>
 <div class="practice-line"><div class="practice-head"><strong>Mindfulness</strong><span class="small">Breath + noting · 10 min</span></div>${choice('mindfulness',d.mindfulness,[['done','Done'],['not_done','Not today']])}${d.mindfulness==='unsure'?'<p class="hint">Earlier answer: Unclear</p>':''}${d.mindfulness==='done'?`<div class="minutes-row"><label for="minutes">Minutes</label><input id="minutes" class="field" type="number" min="1" max="180" value="${d.minutes??10}" /></div>`:''}${d.mindfulness!==null?`<button class="subtle-action" type="button" data-act="clear-mindfulness">Clear</button>`:''}</div>
 <div class="practice-line"><div class="practice-head"><strong>Skill rehearsal</strong><button class="inline-link" type="button" data-act="open-day-lesson">Learn →</button></div><p class="practice-cue">${esc(c.rehearsalTitle)}${rehearsalPlanned(date)?' · Suggested today':''}</p>${choice('rehearsal',d.rehearsal,[['done','Done'],['not_done','Planned, missed'],['not_scheduled','Not planned']])}${d.rehearsal!==null?`<button class="subtle-action" type="button" data-act="clear-rehearsal">Clear</button>`:''}</div>
 </section>
 <section class="panel pad"><div class="row between event-header"><h2>Events <span class="count">${events.length}</span></h2>${button('+ Add event','add-event','primary')}</div>
 ${events.length?events.map((evt,i)=>renderEvent(evt,i)).join(''):`<div class="no-event-area">${noEvent?'No events noted.':'Add a real-life moment, or leave blank.'}</div>`}
 ${!events.length?`<div class="quiet-row">${button(noEvent?'Clear “none noted”':'No events to note','toggle-no-events',noEvent?'soft':'ghost')}${d.opportunity==='yes'?'<span class="hint">Earlier entry noted an opportunity.</span>':d.opportunity==='unsure'?'<span class="hint">Earlier entry: unsure.</span>':''}</div>`:''}</section>
 <section class="panel pad end-row"><div><h2>Finish</h2><span class="small">${d.completedAt?'Completed · edits reopen this day':'Saved as you go'}</span></div>${button(d.completedAt?'Reopen day':'Mark complete','complete-day',d.completedAt?'soft':'primary')}</section></fieldset>
 </div>`;
}
function renderDiary(){return renderToday();}

const choice=(name,value,items,cols=3)=>`<div class="seg ${cols===4?'four':''}" role="group" aria-label="${esc(name)}">${items.map(([val,label])=>`<button type="button" data-choice="${esc(name)}" data-value="${esc(val)}" class="${value===val?'active':''}" aria-pressed="${value===val}">${esc(label)}</button>`).join('')}</div>`;
function renderDiary(){
 const d=getDay(selectedDate),past=weekStart(selectedDate)<weekStart(dayString(new Date())),pastReadOnly=past&&editablePastWeek!==weekStart(selectedDate);
 const n=lessonForDate(selectedDate),c=curriculum(n),events=d.events||[];
 return `<div class="stack"><section class="panel pad">${dayBar(selectedDate)}<div class="divider"></div><div class="eyebrow">Week ${n} · daily record</div><h1>Diary</h1><p class="muted">Track what actually occurred. An unmarked answer is different from “No.”</p>${past?`<div class="alert neutral">${pastReadOnly?'This earlier week is read-only.':'Editing an earlier week.'}</div><div style="margin-top:10px">${button(pastReadOnly?'Unlock past week to edit':'Return to read-only','toggle-past','soft')}</div>`:''}</section>
 <fieldset class="entry-fieldset" ${pastReadOnly?'disabled':''}>
 <section class="panel pad"><h2>1 · Anchored mindfulness</h2><p class="muted">Did you do the breath-anchored noting practice today?</p>${choice('mindfulness',d.mindfulness,[['done','Practiced'],['not_done','Did not']])}${d.mindfulness==='unsure'?'<p class="small">Older entry: “Unclear” — choose a current answer if you wish.</p>':''}${d.mindfulness!==null?`<button type="button" class="subtle-action" data-act="clear-mindfulness">Clear answer</button>`:''}${d.mindfulness==='done'?`<label class="label" for="minutes">Minutes practiced</label><input class="field" id="minutes" type="number" min="1" max="180" step="1" value="${d.minutes??10}" />`:''}</section>
 <section class="panel pad"><h2>2 · Skill rehearsal</h2><p><strong>Week ${n}: ${esc(c.rehearsalTitle)}</strong></p><p class="muted">${esc(c.rehearsalHow)}</p><p class="small">Suggested schedule: Wednesday, Friday and Sunday (three brief rehearsals weekly). ${rehearsalPlanned(selectedDate)?'This is a suggested practice day.':'Rehearsal is optional today.'} You can adapt the schedule.</p><label class="label">What happened today?</label>${choice('rehearsal',d.rehearsal,[['done','Practiced'],['not_done','Intended, not done'],['not_scheduled','Not planned']])}<p class="hint">“Not planned” means no rehearsal was intended for this day, not that you failed. Rehearsal is different from a real-life use of the skill.</p>${d.rehearsal!==null?`<button type="button" class="subtle-action" data-act="clear-rehearsal">Clear answer</button>`:''}</section>
 <section class="panel pad"><h2>3 · Actual situations and events</h2><p class="muted">A real-world opportunity is a situation in which you <em>could</em> have used this week's skill—even if you didn't notice until afterward, or didn't use it. It might happen during a disagreement at home or at work. It is not a test of success.</p>
 <label class="label">Did you encounter a relevant situation today?</label>${choice('opportunity',d.opportunity,[['yes','Yes'],['no','None noticed'],['unsure','Not sure']])}<p class="hint">You can add multiple events below. “None noticed” means no relevant situation came to your attention; it does not prove none occurred.</p>
 <div class="row between" style="margin-top:16px"><h3>Brief observations · ${events.length} event(s)</h3>${button('+ Add event','add-event','primary')}</div><p class="small">Each event is separate, like events in the original RO Diary. Record the moment, your response, and what you might discuss Monday. Add as many as are useful; ordinary positive moments are welcome too.</p>
 ${events.length?events.map((event,i)=>renderEvent(event,i)).join(''):'<div class="empty">No events recorded for this day. Tap “Add event” when there is something worth noting.</div>'}
 </section><section class="panel pad"><h2>4 · Finish the day</h2><p class="muted">Complete this when you've recorded what you want. No need to fill every field or invent an opportunity.</p><div class="action-row">${button(d.completedAt?'Marked complete · reopen entry':'Mark daily entry complete','complete-day',d.completedAt?'soft':'primary')}<span class="small">${d.completedAt?'Completed '+new Date(d.completedAt).toLocaleString('en-US'):'You can come back and edit.'}</span></div></section></fieldset></div>`;
}
function renderEvent(evt,i){
 const acts=[['paused','Paused'],['listened','Listened'],['continued','Kept defending'],['harsh','Harsh / hurtful'],['break','Set boundary / break'],['other','Other']];
 const id=esc(evt.id), label=esc(evt.title||`Event ${i+1}`), fields=(key,name,placeholder)=>`<label class="label" for="evt-${id}-${key}">${name}</label><textarea class="field area" id="evt-${id}-${key}" data-event-field="${key}" data-event-id="${id}" placeholder="${placeholder}">${esc(evt[key]||'')}</textarea>`;
 return `<div class="event-card"><div class="row between"><strong>${label}</strong>${button('Delete','delete-event:'+id,'danger mini')}</div><label class="label" for="evt-${id}-title">Label</label><input class="field" id="evt-${id}-title" data-event-field="title" data-event-id="${id}" value="${esc(evt.title||'')}" placeholder="e.g. difficult phone call" />
 ${fields('facts','What happened?','A few factual observations')}
 <details class="event-extra" ${expandedEvents.has(evt.id)?'open':''} data-expand-id="${id}"><summary>More detail (optional) ${evt.flag?'· flagged for review':''}</summary>
 <label class="label">Noticed my response</label>${eventChoice(id,evt.recognition,[['before','Before'],['during','During'],['after','After'],['not_noticed','Not noticed'],['unsure','Unsure']])}
 <label class="label">Actions</label><div class="event-actions">${acts.map(([key,text])=>`<label class="check-item compact"><input type="checkbox" data-event-action="${key}" data-event-id="${id}" ${(evt.actions||[]).includes(key)?'checked':''}/><span>${esc(text)}</span></label>`).join('')}</div>
 ${fields('emotions','Feelings / body cues','Optional')}
 ${fields('interpretations','Interpretations / uncertainty','Optional')}
 <label class="check-item"><input type="checkbox" data-event-flag="1" data-event-id="${id}" ${evt.flag?'checked':''}/><span>Flag for Monday review</span></label></details></div>`;
}

function eventChoice(id,value,items){return `<div class="seg">${items.map(([v,label])=>`<button type="button" data-event-choice="${esc(id)}" data-value="${v}" class="${value===v?'active':''}" aria-pressed="${value===v}">${esc(label)}</button>`).join('')}</div>`;}
function renderLearn(){
 const n=selectedLearnWeek,c=curriculum(n),resources=c.resources||[],marked=resources.filter(r=>state.lessons[resourceKey(n,r.id)]).length;
 return `<div class="stack"><section class="panel pad compact-header"><div class="eyebrow">Weekly learning</div><div class="row between"><h1>Learn</h1><span class="badge" id="learn-completed">${marked}/${resources.length} done</span></div><label class="label" for="learn-week">Week</label><select class="field" id="learn-week">${Array.from({length:8},(_,i)=>{const x=curriculum(i+1);return `<option value="${i+1}" ${n===i+1?'selected':''}>${i+1} · ${esc(x.title)}${i>=4?' · open':''}</option>`;}).join('')}</select><p class="week-subline">${esc(c.status)}</p><details class="info-details"><summary>Focus & goal</summary><p>${esc(c.goal)}</p><p>${esc(c.subtitle)}</p></details></section>
 <section class="panel pad"><h2>1 · Learn</h2><div class="resource-list">${resources.length?resources.map(r=>`<div class="resource"><div class="resource-main"><input type="checkbox" data-resource="${esc(resourceKey(n,r.id))}" ${state.lessons[resourceKey(n,r.id)]?'checked':''} aria-label="Completed ${esc(r.title)}" /><div class="grow"><div class="eyebrow">${esc(r.type)}</div><strong>${esc(r.title)}</strong><details class="info-details"><summary>Details</summary><p>${esc(r.detail)}</p>${r.explanation?`<p>${esc(r.explanation)}</p>`:''}</details>${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Watch video ↗</a>`:''}</div></div></div>`).join(''):'<p class="muted">No assignment yet.</p>'}</div>
 ${resources.some(r=>r.type==='ChatGPT session')?`<div class="compact-instructions"><strong>ChatGPT deep dive</strong><p>Copy the starter into a new Tuesday Skills Training chat.</p>${button('Copy lesson starter','copy-tuesday','soft')}<details class="info-details"><summary>How it works</summary><p>Copy → open ChatGPT Project → new chat → paste and send. Study first; rehearse afterward. The app does not send anything automatically.</p></details></div>`:''}</section>
 <section class="panel pad"><h2>2 · Practice</h2><p class="practice-cue"><strong>${esc(c.rehearsalTitle)}</strong></p><details class="info-details"><summary>Rehearsal instructions</summary><p>${esc(c.rehearsalHow)}</p></details>
 ${(c.rehearsals||[]).map((r,i)=>`<div class="resource"><strong>${esc(r.title)}</strong><details class="info-details"><summary>Scenario</summary><p>${esc(r.text)}</p></details><div class="button-row">${button('Copy for ChatGPT','copy-exercise:'+i,'soft')}</div></div>`).join('')}
 ${c.rehearsals.length?`<details class="info-details"><summary>ChatGPT rehearsal instructions</summary><p>Copy a scenario → paste into your Skills Training conversation → answer one step at a time. Record rehearsal in Today only after doing it.</p></details><div class="button-row">${button('Record rehearsal →','open-diary','soft')}</div>`:'<p class="muted">Rehearsal not assigned.</p>'}</section></div>`;
}

function renderToolkit(){return `<div class="stack"><section class="panel pad compact-header"><div class="eyebrow">Quick reference · Standard DBT</div><h1>STOP</h1><p class="week-subline">Interrupt the next impulsive response.</p></section>
 <section class="panel pad">${[['S','Stop','Don’t add the next angry sentence.'],['T','Take a step back','Pause; leaving is not required.'],['O','Observe','Notice anger, urges, words and context.'],['P','Proceed mindfully','Choose your next action.']].map(([x,y,z])=>`<div class="step" style="margin:9px 0"><div class="step-index">${x}</div><div class="step-details"><strong>${y}</strong><p class="muted">${z}</p></div></div>`).join('')}</section>
 <section class="panel pad"><h2>When anger is high</h2><p>Stop speaking. Breathe slowly. Stay present if safe and workable. Listen when you can. You do not have to concede.</p><p class="small">If you can't stop harmful words or the situation is unsafe, a boundary or break may be necessary—even if unwelcome.</p><details class="info-details"><summary>Afterward</summary><p>Record what happened in Today. For unwanted behavior, consider a standard DBT behavior chain; for missed intended practice, a Missing-Links Analysis.</p><p>This high-activation guidance is a custom application, not an official STOP step.</p></details><div class="button-row">${button('Log an event →','open-diary','primary')}</div></section></div>`;}

function fmt(v,mapping){return mapping[v]??'—';}
const mMap={done:'Done',not_done:'Not done',unsure:'Unclear (old)'},rMap={done:'Rehearsed',not_done:'Missed',not_scheduled:'Not planned'},oMap={yes:'Yes (earlier)',no:'None noted',unsure:'Unsure (earlier)'},recMap={before:'Before response',during:'After starting',after:'Afterwards',not_noticed:'Not noticed',unsure:'Unclear'},actMap={paused:'Paused / stopped',listened:'Listened',continued:'Continued explaining',harsh:'Harsh / aggressive language',break:'Boundary / break',other:'Other'};
function reportData(start){
 const w=getWeek(start),dates=Array.from({length:7},(_,i)=>plusDays(start,i)),n=lessonForDate(start),c=curriculum(n);
 const days=dates.filter(date=>w.days[date]&&w.days[date].updatedAt).map(date=>{
  const d=w.days[date],events=(d.events||[]).map((ev,i)=>({title:ev.title||`Event ${i+1}`,facts:ev.facts||'',interpretations:ev.interpretations||'',emotions:ev.emotions||'',recognition:fmt(ev.recognition,recMap),actions:(ev.actions||[]).map(x=>actMap[x]||x).join('; '),flag:!!ev.flag}));
  return {date:nice(date,{weekday:'short',month:'short',day:'numeric'}),mindfulness:fmt(d.mindfulness,mMap)+(d.mindfulness==='done'?` (${d.minutes??'?'} min)`:''),rehearsal:fmt(d.rehearsal,rMap),opportunity:events.length?`${events.length} event(s)`:fmt(d.opportunity,oMap),recognition:events.map(x=>x.recognition).filter(x=>x!=='—').join('; ')||fmt(d.recognition,recMap),actions:events.map(x=>x.actions).filter(Boolean).join('; '),emotions:events.map(x=>x.emotions).filter(Boolean).join('; '),facts:events.map(x=>x.facts).filter(Boolean).join('; '),interpretations:events.map(x=>x.interpretations).filter(Boolean).join('; '),flag:events.some(x=>x.flag),events};
 });
 return {range:weekRange(start),curriculum:`Week ${n}: ${c.title}`,overview:dates.map(date=>{const d=w.days[date];return [nice(date,{weekday:'short',month:'short',day:'numeric'}),d?fmt(d.mindfulness,mMap)+(d.mindfulness==='done'?' ('+(d.minutes??'?')+'m)':''):'—',d?fmt(d.rehearsal,rMap):'—',d?((d.events||[]).length?String(d.events.length):fmt(d.opportunity,oMap)):'—',d?.completedAt?'Complete':d?.updatedAt?'In progress':'Blank'];}),learning:(c.resources||[]).map(r=>({title:r.title,done:!!state.lessons[resourceKey(n,r.id)]&&String(state.lessons[resourceKey(n,r.id)]).slice(0,10)<=plusDays(start,6)})),days,notes:w.reviewNotes||''};
}
function mdReport(start){const r=reportData(start);let txt=`# Personal Growth — Weekly Review\n\nPeriod: ${r.range}\nContent: ${r.curriculum}\n\nBlank = not reported. These are observations and self-reports, not clinical measurements.\n\n## Learning activities\n`;
 r.learning.forEach(a=>txt+=`- ${a.done?'[x]':'[ ]'} ${a.title}\n`);
 txt+='\n## Daily records\n';r.days.forEach(d=>{txt+=`\n### ${d.date}${d.flag?' — Contains event marked for review':''}\n- Mindfulness: ${d.mindfulness}\n- Rehearsal: ${d.rehearsal}\n- Events: ${d.opportunity}\n`;
  if(!d.events.length)txt+='- Events: none recorded\n';
  d.events.forEach((ev,i)=>{txt+=`\n#### ${ev.title}${ev.flag?' [For Monday review]':''}\n- Recognition: ${ev.recognition}\n- Actions: ${ev.actions||'Not entered'}\n`;
   if(ev.facts)txt+=`- Observations: ${ev.facts}\n`;
   if(ev.emotions)txt+=`- Feelings/cues: ${ev.emotions}\n`;
   if(ev.interpretations)txt+=`- Interpretations/uncertainty: ${ev.interpretations}\n`;
  });
 });txt+='\n## Weekly notes\n'+(r.notes||'Not entered')+'\n';return txt;
}
function renderReview(){
 if(!reviewStart)reviewStart=weekStart(plusDays(dayString(new Date()),parseDay(dayString(new Date())).getDay()===1?-7:0));
 const r=reportData(reviewStart),current=weekStart(dayString(new Date())),readOnly=reviewStart<current&&editablePastWeek!==reviewStart;
 return `<div class="stack"><section class="panel pad"><div class="eyebrow">Monday · review and adapt</div><h1>Weekly review</h1><p class="muted">Look back at practice and events; choose the next focus on Monday.</p><div class="divider"></div><div class="day-nav"><button type="button" class="btn" data-act="prev-review">←</button><div class="dateline">${esc(r.range)}</div><button type="button" class="btn" data-act="next-review" ${reviewStart>=current?'disabled':''}>→</button></div><p class="small">${esc(r.curriculum)}</p></section>
 <section class="panel pad"><h2>Seven-day snapshot</h2><p class="small">Blank = unanswered.</p><div class="review-grid"><table><thead><tr><th>Day</th><th>Mindfulness</th><th>Rehearsal</th><th>Events</th><th>Diary</th></tr></thead><tbody>${r.overview.map(x=>`<tr>${x.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
 <section class="panel pad"><h2>Learning activities</h2>${r.learning.length?r.learning.map(x=>`<div class="row between resource"><span>${esc(x.title)}</span><span class="badge ${x.done?'':'dim'}">${x.done?'Marked done':'Unmarked'}</span></div>`).join(''):'<p class="muted">No learning activities assigned for this week yet.</p>'}</section>
 <section class="panel pad"><h2>Events by day</h2>${r.days.length?r.days.map(d=>`<div class="resource"><div class="row between"><strong>${esc(d.date)}</strong><span class="badge ${d.flag?'':'dim'}">${d.events.length} event(s)${d.flag?' · flagged':''}</span></div><p class="small">Mindfulness ${esc(d.mindfulness)} · Rehearsal ${esc(d.rehearsal)} · Events ${esc(d.opportunity)}</p>${d.events.map(ev=>`<div class="review-event"><strong>${esc(ev.title)}</strong>${ev.flag?'<span class="badge">For Monday</span>':''}${ev.facts?`<p>${esc(ev.facts)}</p>`:''}${ev.actions?`<p class="small">Actions: ${esc(ev.actions)}</p>`:''}${ev.interpretations?`<p class="small">Interpretations: ${esc(ev.interpretations)}</p>`:''}</div>`).join('')}</div>`).join(''):'<div class="empty">No daily entries recorded yet.</div>'}</section>
 <section class="panel pad"><h2>Notes for Monday</h2><label class="label" for="review-notes">Observations or questions (optional)</label><textarea class="field area" id="review-notes" ${readOnly?'disabled':''} placeholder="What deserves attention next?">${esc(getWeek(reviewStart).reviewNotes)}</textarea>${reviewStart<current?`<div class="button-row" style="margin-top:8px">${button(readOnly?'Unlock archived review notes':'Lock archived review notes','toggle-review-past','soft')}</div>`:''}<div class="divider"></div><div class="alert">PDF and copied reports are not encrypted. Share only intentionally.</div><div class="button-row" style="margin-top:12px">${button('Copy weekly report','copy-report','primary')} ${button('Download weekly PDF','export-pdf','soft')} ${button('Copy Monday starter','copy-monday')}</div><details class="info-details"><summary>Use with ChatGPT</summary><p>Paste the copied weekly report into a new Monday Review chat. The separate starter is optional. Nothing is sent automatically.</p></details></section></div>`;
}
function renderSettings(){return `<div class="stack"><section class="panel pad"><div class="eyebrow">Settings & data safety</div><h1>4-digit PIN vault</h1><p class="muted">Local-only records. No sync.</p><div class="alert">A four-digit PIN is convenient but provides weak protection if someone steals your encrypted backup or gains access to your browser's stored data. Encryption remains enabled, but a stolen copy can be attacked by trying all 10,000 PINs. Keep your phone and backup files protected.</div><div class="button-row" style="margin-top:12px">${button('Lock now','lock-now','soft')} ${button('Return Home','open-home')}</div></section><section class="panel pad"><h2>Encrypted PIN backup</h2><p>Browser data can be lost. Export a separate encrypted backup and store it in a private location. The backup uses the same 4-digit PIN as this vault; it is <strong>not strong protection against someone who obtains the file</strong>.</p>${pinField('backup-pass','Enter your vault PIN to confirm backup') }<div class="button-row" style="margin-top:10px">${button('Download PIN-encrypted backup','do-backup','primary')}</div><p class="small">${state.lastBackupAt?'Last backup: '+new Date(state.lastBackupAt).toLocaleString('en-US'):'No backup has been recorded.'}</p></section><section class="panel pad"><h2>Restore a backup</h2><p class="muted">Restoring REPLACES all current Growth Practice V1 records after confirmation. Make a fresh backup first. Earlier v1.0.0 passphrase-encrypted backups are supported and require the original passphrase.</p><label class="label" for="restore-file">Select backup file</label><input class="field" id="restore-file" type="file" accept=".igpbackup,application/json"/><label class="label" for="restore-pass">Backup PIN (or old backup passphrase)</label><input class="field" id="restore-pass" type="password" autocomplete="off" placeholder="Usually 4 digits; older backups require old passphrase" />${button('Restore and replace V1 data','do-restore','danger')}</section><section class="panel pad"><h2>Version and limitations</h2><p class="small">Growth Practice V1.0.3 · iPhone-first browser PWA · Monday reviews, Tuesday learning · Weeks 1–4 proposed curriculum, Weeks 5–8 open planning slots.</p><p class="small">Mindfulness is tracked, not timed. Videos are external links. Lessons aren't counted as practiced just by opening them. The app is not a therapist or emergency service.</p><p class="small">No PIN recovery is available. Face ID/biometric unlock has not been implemented. Browser data and installation are device-specific; backups are essential.</p></section></div>`;}
function render(){const root=e('#app');if(!root)return;if(!state){const has=document.body.dataset.setup!=='no';root.innerHTML=lockScreen(!has);return;}let body;switch(mode){case'learn':body=renderLearn();break;case'toolkit':body=renderToolkit();break;case'review':body=renderReview();break;case'settings':body=renderSettings();break;default:body=renderToday();}root.innerHTML=shell(body);}
function renderAtScroll(){const y=window.scrollY||0;render();window.scrollTo(0,y);}
function updateDay(field,val){const d=getDay(selectedDate);if(weekStart(selectedDate)<weekStart(dayString(new Date()))&&editablePastWeek!==weekStart(selectedDate))return;d[field]=val;if(field==='mindfulness'&&val==='done'&&!d.minutes)d.minutes=10;d.updatedAt=stamp();if(d.completedAt)d.completedAt=null;scheduleSave(field==='facts'||field==='interpretations'||field==='emotions'?false:true);}
function download(bytes,name,mime){const blob=bytes instanceof Blob?bytes:new Blob([bytes],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
async function copy(text){if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return true;}catch(_){}}const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();if(!ok)throw Error('Clipboard not available.');return true;}
async function doBackup(){
 const pin=e('#backup-pass')?.value||'';
 await verifyVaultPin(pin);
 await flushSave();
 const salt=bytes(16),key=await derive(pin,salt);
 const payload=await crypt(key,{fileType:'growth-practice-v1',schema:1,exportedAt:stamp(),data:state});
 const wrap={format:'GP-V1-PIN4',kdf:'PBKDF2-SHA256',iterations:PBKDF_ITER,salt:b64(salt),...payload};
 download(JSON.stringify(wrap),`Growth-Practice-PIN4-${dayString(new Date())}-${Date.now()}.igpbackup`,'application/json');
 state.lastBackupAt=stamp();scheduleSave(true);
 notice('PIN-encrypted backup downloaded. Keep it private; a 4-digit PIN is weak if the file is stolen.');
}
async function doRestore(){
 const file=e('#restore-file')?.files?.[0],secret=e('#restore-pass')?.value||'';
 if(!file)throw Error('Select a backup file.');
 if(file.size>10*1024*1024)throw Error('Backup is unexpectedly large.');
 let backup;
 try{backup=JSON.parse(await file.text());}catch(_){throw Error('This is not a readable backup file.');}
 const pinBackup=backup.format==='GP-V1-PIN4';
 const legacyBackup=backup.format==='GP-V1-ENCRYPTED';
 if(!pinBackup&&!legacyBackup||backup.iterations!==PBKDF_ITER||typeof backup.salt!=='string')throw Error('Unsupported backup format.');
 if(pinBackup&&!validPin(secret))throw Error('Enter the four-digit PIN used to encrypt the backup.');
 if(legacyBackup&&!secret)throw Error('Enter the old backup passphrase.');
 let unpacked;
 try{unpacked=await decrypt(await derive(secret,un64(backup.salt)),backup);}catch(_){throw Error('Incorrect backup PIN/passphrase or damaged backup.');}
 if(unpacked.fileType!=='growth-practice-v1'||!validateState(unpacked.data))throw Error('Incompatible backup data.');
 if(!confirm('This will REPLACE all current Growth Practice V1 data with the backup. Continue?'))return;
 await flushSave();state=unpacked.data;if(!state.settings||typeof state.settings!=='object')state.settings={};upgradeLegacyDays(state);selectedLearnWeek=state.settings.learnWeek||1;mode='today';reviewStart=null;scheduleSave(true);await flushSave();render();notice('Backup restored into this PIN vault.');
}
function touchEvent(id,apply,immediate=true){const d=getDay(selectedDate);if(weekStart(selectedDate)<weekStart(dayString(new Date()))&&editablePastWeek!==weekStart(selectedDate))return;const evt=findEvent(d,id);if(!evt)return;apply(evt);d.updatedAt=stamp();d.completedAt=null;scheduleSave(immediate);}
function trainingPrompt(n){const c=curriculum(n);if(n===1)return c.tuesdayPrompt;
 return `Skills Training — Week ${n}: ${c.title}. In my DBT/RO-DBT/ACT Project, give a detailed, source-based education phase on ${c.subtitle}, including the relevant primary-source locations (verify rather than invent page numbers), rationale, examples, limitations, and distinctions among models. Do not begin guided exercises until I tell you I am ready. This is a proposed week that can be revised at Monday review; do not assume homework was completed. Ask one question at a time in exercises.`;
}
function mondayPrompt(n){return n===1?GP_CONTENT.week1.mondayPrompt:`Monday Personal Growth Review — Week ${n}. I will paste my weekly report separately. Distinguish observations from interpretations, review whether learning and rehearsal really occurred, and decide what to train next using behavior chains only when unwanted behavior occurred or Missing-Links Analysis only when an intended behavior was missed. Do not diagnose anyone. Proceed one question at a time.`;}
function exercisePrompt(n,i){const c=curriculum(n),r=c.rehearsals[i];return `Continue Week ${n} Skills Training, Phase 2 guided practice, only now that I am ready. Theme: ${c.title}. Fictional scenario: ${r.title}. ${r.text} Guide me through one step at a time, wait for each of my responses, and do not assume my real-life experience. My aim is to rehearse while calm; please preserve disagreement and appropriate boundaries. After we finish I will manually record whether I rehearsed in the app.`;}
async function handleAction(act){
 if(act.startsWith('delete-event:')){const id=act.slice(13),d=getDay(selectedDate),evt=findEvent(d,id);if(evt&&confirm('Delete this event permanently?')){d.events=d.events.filter(x=>x.id!==id);expandedEvents.delete(id);setDirty(d);renderAtScroll();}return;}
 if(act.startsWith('copy-exercise:')){const i=Number(act.split(':')[1]),c=curriculum(selectedLearnWeek);if(!c.rehearsals[i])return;await copy(exercisePrompt(selectedLearnWeek,i));notice('Scenario copied. Paste into your Skills Training ChatGPT conversation.');return;}
 switch(act){
  case'prev-today':todayViewDate=plusDays(todayViewDate,-1);render();break;
  case'next-today':if(todayViewDate<dayString(new Date()))todayViewDate=plusDays(todayViewDate,1);render();break;
  case'jump-today':todayViewDate=dayString(new Date());render();break;
  case'diary-jump-today':selectedDate=dayString(new Date());editablePastWeek=null;render();break;
  case'prev-day':selectedDate=plusDays(selectedDate,-1);editablePastWeek=null;render();break;
  case'next-day':if(selectedDate<dayString(new Date()))selectedDate=plusDays(selectedDate,1);editablePastWeek=null;render();break;
  case'today-diary':selectedDate=todayViewDate;editablePastWeek=null;navTo('diary');break;
  case'home-diary':case'home-mindfulness':case'open-diary':selectedDate=dayString(new Date());editablePastWeek=null;navTo('today');break;
  case'open-monday':reviewStart=weekStart(plusDays(dayString(new Date()),-7));navTo('review');break;
  case'open-week-lesson':case'open-day-lesson':selectedLearnWeek=Math.min(8,lessonForDate(selectedDate));state.settings.learnWeek=selectedLearnWeek;scheduleSave(true);navTo('learn');break;
  case'open-tuesday':navTo('learn');break;
  case'open-toolkit':navTo('toolkit');break;
  case'open-home':navTo('today');break;
  case'open-today':navTo('today');break;
  case'open-settings':navTo('settings');break;
  case'prev-review':reviewStart=plusDays(reviewStart,-7);editablePastWeek=null;render();break;
  case'next-review':if(reviewStart<weekStart(dayString(new Date())))reviewStart=plusDays(reviewStart,7);editablePastWeek=null;render();break;
  case'toggle-past':{const st=weekStart(selectedDate);if(editablePastWeek===st)editablePastWeek=null;else if(confirm('Unlock this past calendar week for editing?'))editablePastWeek=st;render();break;}
  case'complete-day':{const d=getDay(selectedDate);d.completedAt=d.completedAt?null:stamp();d.updatedAt=stamp();scheduleSave(true);render();break;}
  case'clear-mindfulness':updateDay('mindfulness',null);render();break;
  case'clear-rehearsal':updateDay('rehearsal',null);render();break;
  case'add-event':{const d=getDay(selectedDate);if(!Array.isArray(d.events))d.events=[];const newId=crypto.randomUUID();expandedEvents.add(newId);d.events.push({id:newId,title:'',facts:'',interpretations:'',emotions:'',recognition:null,actions:[],flag:false,createdAt:stamp()});if(d.opportunity==='no')d.opportunity=null;setDirty(d);render();break;}
  case'toggle-no-events':{const d=getDay(selectedDate);if((d.events||[]).length)break;d.opportunity=d.opportunity==='no'?null:'no';setDirty(d);renderAtScroll();break;}
  case'toggle-review-past':{if(editablePastWeek===reviewStart)editablePastWeek=null;else if(confirm('Unlock archived review notes?'))editablePastWeek=reviewStart;render();break;}
  case'copy-tuesday':await copy(trainingPrompt(selectedLearnWeek));notice('Learning instructions copied. Paste in a NEW Skills Training chat in this Project.');break;
  case'copy-monday':await copy(mondayPrompt(lessonForDate(reviewStart)));notice('Monday review instructions copied. Paste into a Project review chat.');break;
  case'copy-report':if(!confirm('Copy this UNENCRYPTED weekly report for optional pasting into ChatGPT?'))return;await copy(mdReport(reviewStart));notice('Report copied.');break;
  case'export-pdf':if(!confirm('Generate an UNENCRYPTED PDF of weekly records?'))return;download(window.GrowthPDF.buildPdfBytes(reportData(reviewStart)),`Growth-Review-${reviewStart}-${Date.now()}.pdf`,'application/pdf');notice('PDF generated locally.');break;
  case'lock-now':await flushSave();lock();break;
  case'do-backup':await doBackup();break;
  case'do-restore':await doRestore();break;
 }
}
document.addEventListener('click',async ev=>{
 const nav=ev.target.closest('[data-go]'),act=ev.target.closest('[data-act]'),opt=ev.target.closest('[data-choice]'),evt=ev.target.closest('[data-event-choice]');
 if(!nav&&!act&&!opt&&!evt)return;lastActivity=Date.now();
 try{if(nav){await flushSave();navTo(nav.dataset.go);}else if(act){await handleAction(act.dataset.act);}else if(evt){touchEvent(evt.dataset.eventChoice,o=>{o.recognition=evt.dataset.value;});renderAtScroll();}else if(opt){updateDay(opt.dataset.choice,opt.dataset.value);renderAtScroll();}}
 catch(err){notice('Action could not complete: '+err.message);}
});
document.addEventListener('toggle',ev=>{const t=ev.target;if(t?.matches?.('[data-expand-id]')&&t.isConnected){if(t.open)expandedEvents.add(t.dataset.expandId);else expandedEvents.delete(t.dataset.expandId);}},true);
document.addEventListener('change',ev=>{
 if(!state)return;const t=ev.target;lastActivity=Date.now();
 if(t.id==='learn-week'){selectedLearnWeek=Number(t.value);state.settings.learnWeek=selectedLearnWeek;scheduleSave(true);render();}
 else if(t.matches('[data-resource]')){state.lessons[t.dataset.resource]=t.checked?stamp():null;scheduleSave(true);const badge=e('#learn-completed');if(badge){const c=curriculum(selectedLearnWeek);badge.textContent=(c.resources||[]).filter(r=>state.lessons[resourceKey(selectedLearnWeek,r.id)]).length+'/'+c.resources.length+' done';}}
 else if(t.matches('[data-event-action]')){touchEvent(t.dataset.eventId,o=>{const v=t.dataset.eventAction;o.actions=t.checked?[...new Set([...(o.actions||[]),v])]:(o.actions||[]).filter(x=>x!==v);});}
 else if(t.matches('[data-event-flag]')){touchEvent(t.dataset.eventId,o=>o.flag=t.checked);}
 else if(t.id==='minutes'){const v=Number(t.value);if(Number.isInteger(v)&&v>=1&&v<=180)updateDay('minutes',v);else notice('Minutes must be between 1 and 180.');}
});
document.addEventListener('input',ev=>{
 if(!state)return;const t=ev.target;lastActivity=Date.now();
 if(t.matches('[data-event-field]')){touchEvent(t.dataset.eventId,o=>o[t.dataset.eventField]=t.value,false);}
 else if(t.matches('[data-text]'))updateDay(t.dataset.text,t.value);
 else if(t.id==='review-notes'&&(!(reviewStart<weekStart(dayString(new Date())))||editablePastWeek===reviewStart)){getWeek(reviewStart).reviewNotes=t.value;scheduleSave(false);}
});
document.addEventListener('submit',async ev=>{
 if(ev.target.id!=='vault-form')return;ev.preventDefault();
 const b=e('#vault-form button[type=submit]'),err=e('#vault-error'),pin=e('#password').value;
 const initial=document.body.dataset.setup==='no',legacy=document.body.dataset.setup==='legacy';
 b.disabled=true;b.textContent='Working…';err.textContent='';
 try{
  if(!validPin(pin))throw Error('PIN must be exactly four numbers (0000–9999).');
  if(initial||legacy){if(e('#confirm').value!==pin)throw Error('PINs do not match.');}
  if(initial){await createVault(pin);document.body.dataset.setup='pin4';}
  else if(legacy){await migrateLegacy(e('#old-password').value,pin);document.body.dataset.setup='pin4';}
  else await unlock(pin);
  mode='today';selectedDate=dayString(new Date());render();
 }catch(ex){err.textContent=ex.message;b.disabled=false;b.textContent=legacy?'Convert to PIN and unlock':initial?'Create and enter app':'Unlock app';}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenAt=Date.now();document.body.classList.add('privacy-hidden');if(state)flushSave().catch(()=>{});}else{document.body.classList.remove('privacy-hidden');if(hiddenAt&&Date.now()-hiddenAt>=LOCK_AFTER_MS&&state)lock();hiddenAt=null;lastActivity=Date.now();}});
setInterval(()=>{if(state&&!document.hidden&&Date.now()-lastActivity>=LOCK_AFTER_MS)lock();},30000);
window.addEventListener('pagehide',()=>{if(state){if(saveTimer){clearTimeout(saveTimer);commitSave();}}});
(async function boot(){try{if(!isSecureContext||!crypto?.subtle){e('#app').innerHTML='<div class="lock-outer"><div class="lock-card"><h1>Secure connection required</h1><p>Host this app on HTTPS GitHub Pages or localhost. Do not open index.html directly as a file.</p></div></div>';return;}db=await openDB();const setup=await dbGet('meta','setup');document.body.dataset.setup=setup?(setup.authMode==='pin4'?'pin4':'legacy'):'no';render();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});}catch(err){e('#app').innerHTML=`<div class="lock-outer"><div class="lock-card"><h1>App could not start</h1><p>${esc(err.message)}</p></div></div>`;}})();
