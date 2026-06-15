import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { makeLabel } from '../label-helper.js';

export const poster = {
  legend: [
    { n: 'CR5/CR10 头部聚光', c: '#F5C16C' },
    { n: 'CR10/CR20 腰部余光', c: '#F08A4B' },
    { n: '年度评分均值', c: '#4ECDC4' },
  ],
};

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const CR5_10 = [0.617, 0.699, 0.781, 0.750, 0.720, 0.697, 0.729, 0.828];
const CR10_20 = [0.685, 0.731, 0.770, 0.762, 0.780, 0.750, 0.760, 0.855];
const RATINGS = [7.1, 6.8, 6.5, 6.4, 6.6, 6.7, 6.5, 6.3];

let group, fallingDots = [], dataLines = [], allLabels = [];
let startTime = null, animPhase = 'fall';

function init(scene, camera, controls) {
  controls.target.set(0, 0, 0);
  controls.enabled = false;
  group = new THREE.Group();
  scene.add(group);
  group.position.set(260, -8, 0);
  group.scale.setScalar(0.82);

  const w = 600, h = 380;
  const padL = 90, padR = 70, padT = 50, padB = 60;
  const ox = -w / 2 + padL, oy = -h / 2 + padB;
  const pw = w - padL - padR, ph = h - padT - padB;
  function mx(i) { return ox + (i / 7) * pw; }
  function myV(v) { return oy + ((v - 0.55) / 0.35) * ph; }
  function myR(v) { return oy + ((v - 5.5) / 3.0) * ph; }

  // Grid
  const gMat = new THREE.LineBasicMaterial({ color: 0x2b2118, transparent: true, opacity: 0.18 });
  for (let i = 0; i <= 4; i++) {
    const v = 0.55 + i * 0.1, y = oy + (i / 4) * ph;
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(ox, y, 0), new THREE.Vector3(ox + pw, y, 0)]);
    group.add(new THREE.Line(geo, gMat));
    group.add(makeLabel((v * 100).toFixed(0) + '%', 10, ox - 12, y, 5, '#8A8175', 'right'));
  }
  group.add(makeLabel('集中度', 11, ox - 60, oy + ph / 2, 5, '#8a8175'));
  YEARS.forEach((y, i) => group.add(makeLabel(String(y), 11, mx(i), oy - 22, 5, '#8A8175')));

  // Rating axis
  for (let i = 0; i <= 4; i++)
    group.add(makeLabel((6 + i * 0.5).toFixed(1), 10, ox + pw + 12, myR(6 + i * 0.5), 5, '#8A8175', 'left'));
  group.add(makeLabel('评分', 11, ox + pw + 24, oy + ph / 2, 5, '#8a8175'));

  // Annotation + leader line (always visible)
  group.add(makeLabel('2025年 CR5/CR10 = 0.828', 12, mx(7), myV(0.828) + 40, 5, '#7a3b12'));
  const ldr = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(mx(7), myV(0.828), 5), new THREE.Vector3(mx(7), myV(0.828) + 28, 5)]),
    new THREE.LineBasicMaterial({ color: 0xf5c16c, opacity: 0.3, transparent: true })
  );
  group.add(ldr);

  // ---- Falling dots ----
  const FALL_OFFSET = 250;
  function makeFallingDots(values, mapFn, color, labelColors) {
    const dots = [];
    const pts = values.map((v, i) => {
      const pos = mapFn(v, i);
      const targetY = pos.y;

      // Dot (starts above)
      const dot = new THREE.Mesh(new THREE.CircleGeometry(4, 10), new THREE.MeshBasicMaterial({ color }));
      dot.position.set(pos.x, targetY + FALL_OFFSET, pos.z || 5);
      dot.visible = false;
      group.add(dot);

      // Label (hidden until dot lands)
      const lbl = makeLabel(v.toFixed(3), 10, pos.x, targetY + 20, 5, labelColors || '#7a3b12');
      lbl.visible = false;
      group.add(lbl);
      allLabels.push(lbl);

      dots.push({ dot, lbl, targetX: pos.x, targetY, startY: targetY + FALL_OFFSET, delay: i * 100 });
      return pos;
    });
    return dots;
  }

  // Series 1 (CR5/10): 8 dots falling
  const d1 = makeFallingDots(CR5_10, (v, i) => new THREE.Vector3(mx(i), myV(v), 5), 0xf5c16c, '#7a3b12');
  fallingDots.push(...d1);

  // Series 2 (CR10/20): 8 dots
  const d2 = []; const pts2 = [];
  CR10_20.forEach((v, i) => {
    const targetY = myV(v);
    const dot = new THREE.Mesh(new THREE.CircleGeometry(4, 10), new THREE.MeshBasicMaterial({ color: 0xf08a4b }));
    dot.position.set(mx(i), targetY + FALL_OFFSET, 3);
    dot.visible = false; group.add(dot);
    pts2.push(new THREE.Vector3(mx(i), targetY, 3));
    d2.push({ dot, lbl: null, targetX: mx(i), targetY, startY: targetY + FALL_OFFSET, delay: 800 + i * 100 });
  });
  fallingDots.push(...d2);

  // Series 3 (Ratings): 8 dots
  const d3 = []; const pts3 = [];
  RATINGS.forEach((v, i) => {
    const targetY = myR(v);
    const dot = new THREE.Mesh(new THREE.CircleGeometry(3, 8), new THREE.MeshBasicMaterial({ color: 0x4ecdc4, opacity: 0.7, transparent: true }));
    dot.position.set(mx(i), targetY + FALL_OFFSET, 1);
    dot.visible = false; group.add(dot);
    pts3.push(new THREE.Vector3(mx(i), targetY, 1));
    d3.push({ dot, lbl: null, targetX: mx(i), targetY, startY: targetY + FALL_OFFSET, delay: 1600 + i * 100 });
  });
  fallingDots.push(...d3);

  // Lines — interpolated smooth curves (100 segments each for smooth draw)
  function makeSmoothLine(pts, color, dashed) {
    if (pts.length < 3) { // fallback for too few points
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color }));
      l.geometry.setDrawRange(0, 0); return { line: l, vc: pts.length };
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const smoothPts = curve.getPoints(100);
    const g = new THREE.BufferGeometry().setFromPoints(smoothPts);
    const mat = dashed
      ? new THREE.LineDashedMaterial({ color, dashSize: 5, gapSize: 4, opacity: 0.7 })
      : new THREE.LineBasicMaterial({ color });
    const l = dashed ? new THREE.Line(g, mat) : new THREE.Line(g, mat);
    if (dashed) l.computeLineDistances();
    l.geometry.setDrawRange(0, 0);
    return { line: l, vc: smoothPts.length };
  }

  const l1Data = makeSmoothLine(YEARS.map((_, i) => new THREE.Vector3(mx(i), myV(CR5_10[i]), 5)), 0xf5c16c, false);
  group.add(l1Data.line); dataLines.push(l1Data);

  const l2Data = makeSmoothLine(pts2, 0xf08a4b, false);
  group.add(l2Data.line); dataLines.push(l2Data);

  const l3Data = makeSmoothLine(pts3, 0x4ecdc4, true);
  group.add(l3Data.line); dataLines.push(l3Data);

  camera.position.set(0, 0, 700);
  camera.lookAt(0, 0, 0);
}

function destroy() { group?.parent?.remove(group); group = null; fallingDots = []; dataLines = []; allLabels = []; startTime = null; animPhase = 'fall'; }

function animate(t) {
  if (!startTime) startTime = t;
  const elapsed = t - startTime;

  if (animPhase === 'fall') {
    // Determine the last dot's total delay + fall duration
    const totalFallMs = 2400 + 8 * 100 + 600; // series 1 (100*7+600) + series2 (800) + series3 (800) + margin
    // Check if all dots should have landed
    let allLanded = true;

    fallingDots.forEach(fd => {
      const localT = elapsed - fd.delay;
      if (localT < 0) { fd.dot.visible = false; if (fd.lbl) fd.lbl.visible = false; allLanded = false; return; }
      fd.dot.visible = true;
      const progress = Math.min(localT / 500, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out
      const currentY = fd.targetY + (fd.startY - fd.targetY) * (1 - ease);
      fd.dot.position.y = currentY;
      if (fd.lbl) { fd.lbl.visible = progress >= 1; if (fd.lbl.visible) fd.lbl.position.y = currentY + 20; }
      if (progress < 1) allLanded = false;
    });

    if (allLanded && elapsed > totalFallMs) {
      animPhase = 'line';
      startTime = t; // reset timer for line phase
    }
  }

  if (animPhase === 'line') {
    const lineElapsed = t - startTime;
    const progress = Math.min(lineElapsed / 2000, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    dataLines.forEach(dl => {
      dl.line.geometry.setDrawRange(0, Math.floor(ease * dl.vc));
    });
    if (progress >= 1) animPhase = 'done';
  }

  // Subtle pulse on leader line (always)
  const anno = dataLines[0]?.line;
  if (anno) {
    const adj = group?.children?.find(c => c.type === 'Line' && c.material?.opacity === 0.3);
    if (adj) adj.material.opacity = 0.2 + Math.sin(elapsed * 0.002) * 0.1;
  }
}

export { init, destroy, animate };
