import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { makeLabel } from '../label-helper.js';

export const poster = {
  legend: [
    { n: '动作/冒险', c: '#F08A4B' },
    { n: '剧情/现实', c: '#F5C16C' },
    { n: '科幻/奇幻', c: '#4ECDC4' },
    { n: '喜剧', c: '#D65A5A' },
    { n: '动画', c: '#A26BF2' },
  ],
};

const GC = {
  '动作/冒险': 0xf08a4b, '剧情/现实': 0xf5c16c, '科幻/奇幻': 0x4ecdc4,
  '喜剧': 0xd65a5a, '动画': 0xa26bf2, '战争/历史': 0xe8a36a,
  '悬疑': 0x6d5c49, '爱情': 0xf1948a, '纪录片': 0x8a8175,
};

let group, dots = [], startTime = null, rendererRef = null, cameraRef = null, sceneRef = null;
let hoverLabel = null, hoverDotRef = null;

function init(scene, camera, controls, renderer) {
  sceneRef = scene; cameraRef = camera; rendererRef = renderer;
  controls.target.set(0, 0, 0);
  controls.enabled = false;
  group = new THREE.Group();
  scene.add(group);
  group.position.set(265, -22, 0);
  group.scale.setScalar(0.66);

  const movies = (window.__MOVIES__ || []).filter(m => m.rt != null && m.s > 0.003);

  // Auto-scale axes
  const maxShare = Math.max(...movies.map(m => m.s));
  const maxRating = Math.max(...movies.map(m => m.rt));
  const minRating = Math.min(...movies.map(m => m.rt));
  const xMax = Math.ceil(maxShare * 100) / 100; // round up to 2 decimals
  const yMin = Math.floor(minRating);
  const yMax = Math.ceil(maxRating);

  const w = 950, h = 380;
  const padL = 60, padR = 30, padT = 50, padB = 60;
  const ox = -w / 2 + padL - 50, oy = -h / 2 + padB;
  const pw = w - padL - padR, ph = h - padT - padB;
  function mx(v) { return ox + (v / xMax) * pw; }
  function my(v) { return oy + ((v - yMin) / (yMax - yMin)) * ph; }

  // X grid (5 ticks)
  const gm = new THREE.LineBasicMaterial({ color: 0x2b2118, transparent: true, opacity: 0.18 });
  for (let i = 0; i <= 4; i++) {
    const v = (xMax / 4) * i;
    const x = mx(v);
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, oy, 0), new THREE.Vector3(x, oy + ph, 0)]);
    group.add(new THREE.Line(g, gm));
    group.add(makeLabel((v * 100).toFixed(1) + '%', 9, x, oy - 16, 3, '#8A8175'));
  }
  group.add(makeLabel('票房占比 →', 10, ox + pw / 2, oy - 38, 3, '#8a8175'));

  // Y grid
  for (let i = 0; i <= 5; i++) {
    const v = yMin + (yMax - yMin) / 5 * i;
    const y = my(v);
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(ox, y, 0), new THREE.Vector3(ox + pw, y, 0)]);
    group.add(new THREE.Line(g, gm));
    group.add(makeLabel(String(Math.round(v * 10) / 10), 9, ox - 12, y, 3, '#8A8175', 'right'));
  }
  group.add(makeLabel('评分 →', 10, ox - 50, oy + ph / 2, 3, '#8a8175'));

  // Note: poster text (sub/stat/desc) is now shown normally. No hiding needed.

  // Mean lines
  const ms = movies.reduce((s, m) => s + m.s, 0) / movies.length;
  const mr = movies.reduce((s, m) => s + m.rt, 0) / movies.length;
  const ml = new THREE.LineBasicMaterial({ color: 0x6d5c49, transparent: true, opacity: 0.32 });
  const vg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(mx(ms), oy, 0), new THREE.Vector3(mx(ms), oy + ph, 0)]);
  group.add(new THREE.Line(vg, ml));
  const hg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(ox, my(mr), 0), new THREE.Vector3(ox + pw, my(mr), 0)]);
  group.add(new THREE.Line(hg, ml));
  group.add(makeLabel('高票房·低评分', 10, ox + pw - 100, oy + 30, 3, '#8a8175'));
  group.add(makeLabel('低票房·高评分', 10, ox + 100, oy + ph - 30, 3, '#8a8175'));

  // Scatter dots — each gets a movie name stored
  movies.forEach((m, i) => {
    const col = GC[m.g] || 0x666;
    const x = mx(m.s), y = my(m.rt);
    const sz = Math.max(3, m.s * 60);
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(sz, 8, 8),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 })
    );
    dot.position.set(x, y, 0);
    dot.userData = { movie: m, idx: i, delay: i * 15, sz };
    dot.visible = false;
    group.add(dot);
    dots.push(dot);
  });

  // Hover label (CSS2D)
  const hDiv = document.createElement('div');
  hDiv.style.cssText = 'background:rgba(27,19,10,.86);border:1px solid rgba(245,193,108,.35);padding:5px 10px;font-size:12px;color:#f2eadc;font-family:Noto Sans SC,sans-serif;pointer-events:none;white-space:nowrap;display:none';
  hDiv.textContent = '';
  hoverLabel = new CSS2DObject(hDiv);
  hoverLabel.position.set(0, 0, 10);
  hoverLabel.visible = false;
  scene.add(hoverLabel);

  // Hover detection (document-level for reliability)
  document.addEventListener('mousemove', onHover);

  camera.position.set(0, 0, 700);
  camera.lookAt(0, 0, 0);
}

/* ── Hover — screen-distance with group-aware projection ── */
function onHover(e) {
  if (!cameraRef || dots.length === 0) return;
  const mx = e.clientX, my = e.clientY;
  let closest = null, closestDist = Infinity;
  const threshold = 50;
  if (group) group.updateMatrixWorld(true);
  const tmp = new THREE.Vector3();
  dots.forEach(d => {
    if (!d.visible) return;
    d.getWorldPosition(tmp);
    tmp.project(cameraRef);
    const sx = (tmp.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-tmp.y * 0.5 + 0.5) * window.innerHeight;
    const dist = Math.hypot(mx - sx, my - sy);
    if (dist < threshold && dist < closestDist) { closestDist = dist; closest = d; }
  });
  if (closest) {
    const mv = closest.userData.movie;
    const el = hoverLabel.element;
    el.textContent = `${mv.n} (${mv.y}) · ${(mv.s * 100).toFixed(1)}% · 评分${mv.rt}`;
    el.style.display = 'block';
    hoverLabel.position.set(550, -230, 10);
    hoverLabel.visible = true;
    if (hoverDotRef && hoverDotRef !== closest) hoverDotRef.material.opacity = 1;
    hoverDotRef = closest;
    hoverDotRef.material.opacity = 1;
  } else {
    hoverLabel.visible = false;
    if (hoverDotRef) { hoverDotRef.material.opacity = 0.6; hoverDotRef = null; }
  }
}

function destroy() {
  document.removeEventListener('mousemove', onHover);
  if (hoverLabel) { hoverLabel.parent?.remove(hoverLabel); hoverLabel = null; }
  group?.parent?.remove(group); group = null; dots = []; startTime = null;
  sceneRef = null; cameraRef = null;
}

function animate(t) {
  if (!startTime) startTime = t;
  const elapsed = t - startTime;
  dots.forEach(d => {
    const localT = elapsed - d.userData.delay;
    if (localT < 0) { d.visible = false; return; }
    d.visible = true;
    const progress = Math.min(localT / 400, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    d.material.opacity = ease * 0.6;
    // Zoom effect: scale from 0.3 to 1.0
    d.scale.setScalar(0.3 + ease * 0.7);
  });
}

export { init, destroy, animate };
