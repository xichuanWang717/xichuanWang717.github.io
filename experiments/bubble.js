import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export const poster = {};

const GC = {
  '动作/冒险':0xf08a4b,'喜剧':0xd65a5a,'剧情/现实':0xf5c16c,
  '科幻/奇幻':0x4ecdc4,'动画':0xa26bf2,'战争/历史':0xe8a36a,
  '悬疑':0x6d5c49,'犯罪':0x6d5c49,'爱情':0xf1948a,'纪录片':0x8a8175,
  '儿童/家庭':0x6bc2a1,'动作/悬疑':0xf08a4b,
};

const EMOJI = {
  '红海行动':'⚔️','唐人街探案2':'🔍','我不是药神':'💊','西虹市首富':'💰',
  '复仇者联盟3':'🛡️','复仇者联盟4':'🛡️','捉妖记2':'🐉','毒液':'🦎',
  '海王':'⚡','侏罗纪世界2':'🦕','侏罗纪世界3':'🦖','前任3':'💔',
  '哪吒之魔童降世':'🔥','哪吒之魔童闹海':'🌊','流浪地球':'🌍','流浪地球2':'🚀',
  '流浪地球3':'🌌','我和我的祖国':'🇨🇳','我和我的家乡':'🏘️','我和我的父辈':'👨‍👩‍👧‍👦',
  '中国机长':'✈️','疯狂的外星人':'👽','飞驰人生':'🏎️','飞驰人生2':'🏎️',
  '少年的你':'📚','八佰':'🏴','姜子牙':'⚡','金刚川':'🌉','夺冠':'🏆',
  '拆弹专家2':'💣','除暴':'🔫','悬崖之上':'🎭','长津湖':'❄️',
  '长津湖之水门桥':'🌉','你好，李焕英':'💕','唐人街探案3':'🗼','速度与激情9':'🚗',
  '怒火·重案':'⚔️','中国医生':'🏥','哥斯拉大战金刚':'🦍','独行月球':'🌙',
  '这个杀手不太冷静':'🎭','人生大事':'🎆','万里归途':'🛤️','奇迹·笨小孩':'🏗️',
  '满江红':'🗡️','孤注一掷':'🎰','消失的她':'🔪','封神第一部':'⚔️','八角笼中':'🥊',
  '长安三万里':'🐎','坚如磐石':'🪨','热辣滚烫':'🥊','抓娃娃':'🎪','第二十条':'⚖️',
  '默杀':'🔇','年会不能停！':'🎉','志愿军':'⭐','志愿军2':'⭐',
  '疯狂动物城2':'🐰','唐探1900':'🔍','南京照相馆':'📷','蛟龙行动':'🐉',
  '功夫熊猫4':'🐼','星际穿越':'🌌','熊出没·伴我熊芯':'🐻','熊出没·逆转时空':'🐻',
};

function getEmoji(m) {
  if(EMOJI[m.n])return EMOJI[m.n];
  const g=m.g||'';if(g.includes('动作'))return'⚔️';if(g.includes('喜剧'))return'😂';
  if(g.includes('剧情'))return'🎬';if(g.includes('科幻'))return'🚀';
  if(g.includes('动画'))return'🎨';if(g.includes('战争'))return'🏛️';
  if(g.includes('悬疑')||g.includes('犯罪'))return'🔍';if(g.includes('爱情'))return'💕';
  if(g.includes('纪录'))return'📷';if(g.includes('儿童'))return'🧸';return'🎬';
}

let sceneRef,cameraRef,controlsRef;
let bubbles=[], poppedIdx=null, time=0;
let gestureMode=false, cameraOn=false, mpReady=false;
let handData={hands:[],ts:0};
let lastPinch=false, prevPos=null, waveSamples=[];
let clickHandler=null;
let oT=0, oP=0.18, oD=950;
let uiContainer=null;
const STORY_SAFE_SHIFT_X = 240;

function init(scene,camera,controls,renderer,lr){
  try{
  try{
  const d2=document.getElementById('layer-debug');
  if(d2)d2.textContent+='[INIT STARTED]';
  }catch(ee){}
  sceneRef=scene;cameraRef=camera;controlsRef=controls;
  controls.target.set(0,0,0);controls.enabled=true;

  // Build UI dynamically
  buildUI();

  // Hide chart extras
  const pd=document.getElementById('page-dots');if(pd)pd.style.opacity='0';
  const lg=document.getElementById('legend');if(lg)lg.style.display='none';

  // Title (save original, replace with bubble title)
  const tb=document.getElementById('poster-top');
  if(tb){tb.dataset.originalHTML=tb.innerHTML;tb.innerHTML='<div style="font-size:13px;font-weight:600;color:#f5c16c;letter-spacing:3px">帧相</div><div style="font-size:10px;color:rgba(180,160,125,0.5);margin-top:2px">2018-2025 中国电影票房</div>';}

  // Load movies
  const all=window.__MOVIES__||[];
  const movies=all.filter(m=>m.s>0.008).slice(0,80);
  const years=[...new Set(movies.map(m=>m.y))].sort();
  const TY=years.length;

  movies.forEach((m,i)=>{
    const yi=years.indexOf(m.y), a=(yi/TY)*Math.PI*2;
    const ym=movies.filter(x=>x.y===m.y), rk=ym.indexOf(m);
    let vy=0;if(rk>0)vy=rk%2===1?((rk+1)/2)*110:-(rk/2)*110;
    const r=380+rk*25;
    const x=Math.cos(a)*r+(Math.random()-0.5)*15 + STORY_SAFE_SHIFT_X;
    const z=Math.sin(a)*r+(Math.random()-0.5)*15;
    const y=vy+(Math.random()-0.5)*8;
    const col=GC[m.g]||0x7ac1c1;
    const sz=18+(10-rk)*2;

    const mesh=new THREE.Mesh(new THREE.SphereGeometry(sz,20,20),
      new THREE.MeshPhysicalMaterial({color:col,transparent:true,opacity:0.75,roughness:0.3,metalness:0.05,clearcoat:0.2}));
    mesh.position.set(x,y,z);
    mesh.userData={idx:i,fp:Math.random()*6,fs:0.3+Math.random()*0.3};
    scene.add(mesh);

    const glow=new THREE.Mesh(new THREE.SphereGeometry(sz*1.4,12,12),
      new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.08}));
    glow.position.copy(mesh.position);
    scene.add(glow);

    const div=document.createElement('div');
    div.textContent=getEmoji(m);
    div.style.fontSize=`${Math.max(16,sz*0.65)}px`;
    div.style.filter='drop-shadow(0 1px 3px rgba(0,0,0,0.3))';
    div.style.pointerEvents='none';
    const lab=new CSS2DObject(div);
    lab.position.set(x,y,z);
    scene.add(lab);

    const ydiv=document.createElement('div');
    ydiv.textContent=m.y;ydiv.style.fontSize='9px';
    ydiv.style.color='rgba(255,255,255,0.2)';ydiv.style.textAlign='center';
    const ylab=new CSS2DObject(ydiv);
    ylab.position.set(x,y-sz-12,z);
    scene.add(ylab);

    bubbles.push({mesh,glow,lab,ylab,movie:m,idx:i,x,y,z,sz});
  });

  // Click handler
  if(clickHandler)document.removeEventListener('click',clickHandler);
  clickHandler=e=>{
    if(!cameraRef)return;
    const rc=new THREE.Raycaster();
    const m=new THREE.Vector2((e.clientX/window.innerWidth)*2-1,-(e.clientY/window.innerHeight)*2+1);
    rc.setFromCamera(m,cameraRef);
    const hit=rc.intersectObjects(bubbles.map(b=>b.mesh));
    if(hit.length>0)sel(hit[0].object.userData.idx);
  };
  document.addEventListener('click',clickHandler);

  // Build UI
  buildUI();

  const di2=document.getElementById('layer-debug');
  if(di2)di2.textContent+=' | init complete';
  }catch(e){alert('BUBBLE INIT ERROR: '+e.message+'\n'+e.stack);}
}

function buildUI(){
  if(uiContainer)uiContainer.remove();
  uiContainer=document.createElement('div');
  uiContainer.id='bubble-ui';
  uiContainer.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:40;pointer-events:none';

  // Mode toggle
  const toggle=document.createElement('div');
  toggle.style.cssText='position:absolute;bottom:100px;left:20px;display:flex;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);border-radius:10px;padding:3px;gap:2px;pointer-events:auto';

  const btnM=document.createElement('button');
  btnM.textContent='🖱️ 鼠标';
  btnM.style.cssText='padding:8px 14px;border:none;border-radius:8px;font-size:12px;cursor:pointer;background:#F5C16C;color:#fff';

  const btnH=document.createElement('button');
  btnH.textContent='🖐️ 手势';
  btnH.style.cssText='padding:8px 14px;border:none;border-radius:8px;font-size:12px;cursor:pointer;background:transparent;color:rgba(255,255,255,0.5)';

  toggle.appendChild(btnM);
  toggle.appendChild(btnH);
  uiContainer.appendChild(toggle);

  // Gesture status
  const gs=document.createElement('div');
  gs.id='bubble-gs';
  gs.style.cssText='display:none;position:absolute;bottom:100px;right:20px;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);border-radius:12px;padding:10px 14px;font-size:12px;min-width:140px;pointer-events:none';
  gs.innerHTML='<div style="display:flex;align-items:center;gap:6px;padding:2px 0"><span>📷</span><span style="color:rgba(255,255,255,0.4)">摄像头</span><span id="gs-cam" style="color:rgba(255,255,255,0.3)">未连接</span></div><div style="display:flex;align-items:center;gap:6px;padding:2px 0"><span>🖐️</span><span style="color:rgba(255,255,255,0.4)">手势</span><span id="gs-hand" style="color:rgba(255,255,255,0.3)">未识别</span></div>';
  uiContainer.appendChild(gs);

  // Bottom hint
  const hint=document.createElement('div');
  hint.id='bubble-hint';
  hint.style.cssText='position:absolute;bottom:40px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.3);border-radius:12px;padding:6px 16px;font-size:11px;color:rgba(255,255,255,0.3);white-space:nowrap;pointer-events:none';
  hint.textContent='🖱️ 拖拽旋转 · 点击气泡 | 左下切换手势控制';
  uiContainer.appendChild(hint);

  document.body.appendChild(uiContainer);

  // Events
  btnM.onclick=()=>{
    gestureMode=false;
    btnM.style.background='#F5C16C';btnM.style.color='#fff';
    btnH.style.background='transparent';btnH.style.color='rgba(255,255,255,0.5)';
    gs.style.display='none';
    document.getElementById('cam-bg')?.classList.remove('active');
    controlsRef.enabled=true;
    hint.textContent='🖱️ 拖拽旋转 · 点击气泡 | 左下切换手势控制';
  };

  btnH.onclick=async()=>{
    gestureMode=true;
    btnH.style.background='#F5C16C';btnH.style.color='#fff';
    btnM.style.background='transparent';btnM.style.color='rgba(255,255,255,0.5)';
    gs.style.display='block';
    document.getElementById('gs-cam').textContent='连接中...';
    if(!mpReady&&typeof Hands!=='undefined')await initMP();
    if(cameraOn)document.getElementById('cam-bg')?.classList.add('active');
    controlsRef.enabled=false;
    const p=cameraRef.position;
    oD=Math.hypot(p.x,p.y,p.z);oT=Math.atan2(p.x,p.z);
    oP=Math.asin(Math.max(-1,Math.min(1,p.y/oD)));
    hint.textContent='🖐️ 🤙拖拽旋转 · 🤏捏合选气泡 · 🖐️挥手关闭';
  };
}

function sel(idx){
  if(idx===null||idx===poppedIdx)return;
  if(poppedIdx!==null){
    const p=bubbles[poppedIdx];
    p.mesh.material.opacity=0.75;p.glow.material.opacity=0.08;
    p.lab.element.style.display='';p.ylab.element.style.display='';
  }
  poppedIdx=idx;
  const b=bubbles[idx],m=b.movie;
  const em=getEmoji(m);
  const col='#'+((GC[m.g]||0x7ac1c1)>>>0).toString(16).padStart(6,'0');
  document.getElementById('detail-emoji').textContent=em;
  document.getElementById('detail-emoji').parentElement.style.background=`linear-gradient(135deg,${col},${col}66)`;
  document.getElementById('detail-title').textContent=m.n;
  document.getElementById('detail-meta').innerHTML=`
    <span style="background:${col}22;color:${col};padding:2px 10px;border-radius:4px;font-size:12px;font-weight:500">${m.y}</span>
    <span style="background:${col}22;color:${col};padding:2px 10px;border-radius:4px;font-size:12px;font-weight:500">${m.g}</span>
    <span style="background:${col}22;color:${col};padding:2px 10px;border-radius:4px;font-size:12px;font-weight:500">${(m.s*100).toFixed(1)}%</span>`;
  document.getElementById('detail-desc').textContent=m.rt?`豆瓣评分 ${m.rt}`:'';
  document.getElementById('detail-overlay').style.display='flex';
  document.getElementById('detail-card').style.transform='scale(1)';
  b.mesh.material.opacity=0;b.glow.material.opacity=0;
  b.lab.element.style.display='none';b.ylab.element.style.display='none';
}

function closeD(){
  document.getElementById('detail-card').style.transform='scale(0.9)';
  document.getElementById('detail-overlay').style.display='none';
}
document.getElementById('detail-close')?.addEventListener('click',closeD);
document.getElementById('detail-overlay')?.addEventListener('click',e=>{
  if(e.target.id==='detail-overlay')closeD();
});

async function initMP(){
  try{
    document.getElementById('gs-cam').textContent='连接中...';
    const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`});
    hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.5,minTrackingConfidence:0.5});
    const video=document.getElementById('hand-video');
    const cam=new Camera(video,{onFrame:async()=>{await hands.send({image:video});},width:640,height:480});
    await cam.start();
    mpReady=true;
    const cb=document.getElementById('cam-bg');
    if(cb&&video.srcObject){cb.srcObject=video.srcObject;await cb.play();}
    cameraOn=true;
    document.getElementById('gs-cam').textContent='已连接';
    hands.onResults(r=>{
      const now=performance.now();
      handData=r.multiHandLandmarks&&r.multiHandLandmarks.length>0
        ?{hands:r.multiHandLandmarks.map((lm,i)=>({handedness:r.multiHandedness?.[i]?.label||'Unknown',landmarks:lm.map(p=>({x:p.x,y:p.y,z:p.z}))})),ts:now}
        :{hands:[],ts:now};
    });
  }catch(e){console.error('[MP]',e);mpReady=true;document.getElementById('gs-cam').textContent='失败';}
}

function processG(){
  const h=handData.hands;
  const gc=document.getElementById('gs-cam');
  const gh=document.getElementById('gs-hand');
  if(gh)gh.textContent=h.length>0?(h.length>=2?'双手':'单手'):'未识别';
  if(gc)gc.textContent=cameraOn?'已连接':'未连接';
  if(!gestureMode||h.length===0){lastPinch=false;prevPos=null;waveSamples=[];return;}
  if(h.length>=2){proc2(h);}else{proc1(h[0]);}
}

function handState(hand){
  const lm=hand.landmarks,p9=lm[9];
  const pinch = Math.hypot(lm[4].x-lm[8].x, lm[4].y-lm[8].y);
  // Pinch detected first (more specific)
  if(pinch<0.065)return'pinch';
  // Six: thumb+pinky extended, index curled
  const td=Math.hypot(lm[4].x-p9.x,lm[4].y-p9.y);
  const id=Math.hypot(lm[8].x-p9.x,lm[8].y-p9.y);
  const pd=Math.hypot(lm[20].x-p9.x,lm[20].y-p9.y);
  if(td>0.12&&pd>0.12&&id<0.1)return'six';
  return'open';
}

function proc1(hand){
  const s=handState(hand),lm=hand.landmarks;
  if(s==='six'){
    const cx=1-lm[9].x,cy=lm[9].y;
    if(prevPos){oT+=(cx-prevPos.x)*2.5;oP-=(cy-prevPos.y)*2.5;oP=Math.max(-1.2,Math.min(1.2,oP));}
    prevPos={x:cx,y:cy};return;
  }
  prevPos=null;
  if(s==='pinch'){
    if(!lastPinch){
      // Use midpoint between thumb(4) and index(8) for better accuracy
      const mx = (lm[4].x + lm[8].x) / 2;
      const my = (lm[4].y + lm[8].y) / 2;
      const sx = (1 - mx) * window.innerWidth, sy = my * window.innerHeight;
      if(cameraRef){
        const rc=new THREE.Raycaster();
        const m=new THREE.Vector2((sx/window.innerWidth)*2-1,-(sy/window.innerHeight)*2+1);
        rc.setFromCamera(m,cameraRef);
        const hit=rc.intersectObjects(bubbles.map(b=>b.mesh));
        if(hit.length>0)sel(hit[0].object.userData.idx);
      }
    }
    lastPinch=true;return;
  }
  lastPinch=false;
  if(document.getElementById('detail-overlay').style.display==='flex')checkW(hand);
}

function checkW(hand){
  const x=1-hand.landmarks[9].x,now=performance.now();
  waveSamples.push({x,t:now});
  while(waveSamples.length&&waveSamples[0].t<now-1000)waveSamples.shift();
  if(waveSamples.length<8)return;
  let tp=0;for(let i=1;i<waveSamples.length;i++)tp+=Math.abs(waveSamples[i].x-waveSamples[i-1].x);
  if(tp>0.35&&Math.abs(waveSamples[waveSamples.length-1].x-waveSamples[0].x)<tp*0.3){closeD();waveSamples=[];}
}

function proc2(hands){
  const rh=hands.find(h=>h.handedness==='Right')||hands[0];
  const lh=hands.find(h=>h.handedness==='Left')||hands[hands.length-1];
  const ax=(1-rh.landmarks[9].x+1-lh.landmarks[9].x)/2;
  const ay=(rh.landmarks[9].y+lh.landmarks[9].y)/2;
  if(prevPos&&prevPos.x!==0){oT+=(ax-prevPos.x)*2;oP-=(ay-prevPos.y)*2;oP=Math.max(-1.2,Math.min(1.2,oP));}
  prevPos={x:ax,y:ay};
}

function destroy(){
  if(uiContainer){uiContainer.remove();uiContainer=null;}
  const tb=document.getElementById('poster-top');
  if(tb&&tb.dataset.originalHTML){tb.innerHTML=tb.dataset.originalHTML;delete tb.dataset.originalHTML;}
  const pd=document.getElementById('page-dots');if(pd)pd.style.opacity='1';
  const lg=document.getElementById('legend');if(lg)lg.style.display='';
  const d=document.getElementById('bubble-dbg');if(d)d.remove();
  document.getElementById('detail-overlay').style.display='none';
  if(clickHandler){document.removeEventListener('click',clickHandler);clickHandler=null;}
  bubbles=[];poppedIdx=null;cameraRef=null;handData={hands:[],ts:0};
  controlsRef.enabled=true;
}

function animate(t){
  time=(t||0)*0.001;
  if(gestureMode){
    processG();
    if(cameraRef){
      cameraRef.position.x=oD*Math.sin(oT)*Math.cos(oP);
      cameraRef.position.y=oD*Math.sin(oP);
      cameraRef.position.z=oD*Math.cos(oT)*Math.cos(oP);
      cameraRef.lookAt(0,0,0);
    }
  }
  bubbles.forEach(b=>{
    const f=Math.sin(time*b.mesh.userData.fs+b.mesh.userData.fp)*8;
    b.mesh.position.y=b.y+f;b.glow.position.y=b.y+f;
    b.lab.position.y=b.y+f;b.ylab.position.y=b.y+f-b.sz-12;
  });
}

export {init,destroy,animate};
