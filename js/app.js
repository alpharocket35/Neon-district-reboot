(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  let soundOn = true, audioCtx = null, busy = false;
  const soundState = $('#sound-state');
  function tone(freq=600, duration=.07, type='sine', volume=.035, slide=0) {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40,freq+slide), audioCtx.currentTime+duration);
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime+duration);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime+duration);
    } catch(e) {}
  }
  function uiHover(){tone(780,.045,'square',.012,180)}
  function uiClick(){tone(430,.08,'sawtooth',.025,360);setTimeout(()=>tone(920,.05,'sine',.018),45)}
  function glitchSound(){tone(120,.22,'sawtooth',.04,850);setTimeout(()=>tone(1100,.08,'square',.018,-600),90)}
  function successSound(){tone(520,.09,'sine',.025,260);setTimeout(()=>tone(880,.16,'sine',.025,180),100)}
  $$('#sound-toggle').forEach(b=>b.addEventListener('click',()=>{soundOn=!soundOn;soundState.textContent=soundOn?'ACTIVÉ':'COUPÉ';b.textContent=soundOn?'◖))':'×';if(soundOn)uiClick()}));
  $$('button').forEach(b=>{b.addEventListener('mouseenter',uiHover);b.addEventListener('focus',uiHover)});
  function hack(done) {
    if (busy) return; busy=true;
    const overlay=$('#transition'), bar=$('#hack-progress'), pct=$('#hack-percent'), status=$('#hack-status'), terminal=$('#terminal');
    overlay.classList.add('show'); terminal.innerHTML=''; glitchSound();
    const lines=['> HANDSHAKE REQUESTED','> ROUTING THROUGH NODE_09','> BYPASSING LOCAL FIREWALL','> DECRYPTING DISTRICT GRID','> AUTHENTICATING GUEST_077','> CONNECTION ESTABLISHED'];
    let n=0, line=0;
    const interval=setInterval(()=>{
      n=Math.min(100,n+Math.floor(Math.random()*5)+2);bar.style.width=n+'%';pct.textContent=String(n).padStart(2,'0')+'%';
      if(n>20)status.textContent='ANALYSE DU RÉSEAU...';
      if(n>48)status.textContent='CONTOURNEMENT DU PARE-FEU...';
      if(n>76)status.textContent='ÉTABLISSEMENT DE LA CONNEXION...';
      if(line<lines.length && n>(line+1)*14){const d=document.createElement('div');d.textContent=lines[line++];terminal.append(d)}
      if(n>=100){clearInterval(interval);status.textContent='ACCÈS AUTORISÉ';successSound();setTimeout(()=>{overlay.classList.remove('show');busy=false;done()},500)}
    },75);
  }
  $('#continue').addEventListener('click',()=>{uiClick();hack(()=>{ $('#title').classList.add('hidden');$('#app').classList.remove('hidden');document.body.classList.remove('title-screen');showPage('home',false)})});
  function showPage(name, withLoader=true) {
    const apply=()=>{$$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+name));$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===name));};
    if(withLoader) hack(apply); else apply();
  }
  $$('[data-page]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();const name=el.dataset.page;if(!$('#app').classList.contains('hidden')){uiClick();showPage(name,true)}}));
  $('#clock').textContent='23:48:09';
  setInterval(()=>{const d=new Date();$('#clock').textContent=d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})},1000);
})();