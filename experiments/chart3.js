import * as THREE from 'three';
import { makeLabel } from '../label-helper.js';

export const poster = {
  legend: [
    { n: '冷光轨迹', c: '#3FA9F5' },
    { n: '金色爆款脉冲', c: '#F5C16C' },
    { n: '4% 基准暗线', c: '#8A8175' },
  ],
};

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const RATIO = [3.2, 10.7, 4.1, 3.8, 14.6, 5.2, 4.5, 32.5];
const BOOM = { 2019: '哪吒', 2022: '独行月球', 2025: '哪吒魔童闹海' };

let group, beams = [], rings = [], startTime = null;

function init(scene, camera, controls) {
  controls.target.set(0, 0, 0);
  controls.enabled = false;
  group = new THREE.Group();
  scene.add(group);
  group.position.set(255, -12, 0);
  group.scale.setScalar(0.80);

  const w = 720, h = 360;
  const ox = -w / 2, oy = -130;
  const pw = w, ph = 260;
  const mx = i => ox + (i / 7) * pw;
  const my = v => oy + (v / 40) * ph;

  // Dark baseline: a quiet universe before pulses.
  const baseY = my(4);
  const base = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(ox, baseY, 0), new THREE.Vector3(ox + pw, baseY, 0)]),
    new THREE.LineDashedMaterial({ color: 0x8a8175, dashSize: 8, gapSize: 8, opacity: 0.38, transparent: true })
  );
  base.computeLineDistances();
  group.add(base);
  group.add(makeLabel('4% 非爆款基准线', 10, ox + pw + 70, baseY, 5, '#7c6a55', 'left'));

  // Star track.
  YEARS.forEach((y, i) => {
    const x = mx(i);
    const tick = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, oy - 8, 0), new THREE.Vector3(x, oy + ph + 8, 0)]),
      new THREE.LineBasicMaterial({ color: 0x1b130a, opacity: 0.08, transparent: true })
    );
    group.add(tick);
    group.add(makeLabel(String(y), 11, x, oy - 30, 5, '#6d5c49'));
  });

  RATIO.forEach((v, i) => {
    const x = mx(i), y = my(v);
    const isBoom = !!BOOM[YEARS[i]];
    const col = isBoom ? 0xf5c16c : 0x4ecdc4;
    const h = y - oy;

    const beam = new THREE.Mesh(
      new THREE.PlaneGeometry(isBoom ? 18 : 10, Math.max(5, h)),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 })
    );
    beam.position.set(x, oy + h / 2, 1);
    group.add(beam);
    beams.push({ mesh: beam, fullH: h, baseY: oy, delay: i * 110, target: isBoom ? 0.76 : 0.32 });

    const star = new THREE.Mesh(
      new THREE.CircleGeometry(isBoom ? 9 : 5, 32),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 })
    );
    star.position.set(x, y, 6);
    group.add(star);
    beams.push({ mesh: star, delay: i * 110 + 180, target: isBoom ? 1 : 0.58, isStar: true });

    group.add(makeLabel(`${v}%`, 11, x, y + 20, 5, isBoom ? '#8a3d14' : '#27615d'));

    if (isBoom) {
      for (let r = 0; r < 3; r++) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(18 + r * 22, 20 + r * 22, 64),
          new THREE.MeshBasicMaterial({ color: 0xf5c16c, transparent: true, opacity: 0, side: THREE.DoubleSide })
        );
        ring.position.set(x, y, 4 - r);
        group.add(ring);
        rings.push({ mesh: ring, delay: i * 260 + r * 260, base: 18 + r * 22 });
      }
      group.add(makeLabel(BOOM[YEARS[i]], 12, x, y + 48, 5, '#7a3b12'));
    }
  });

  // Connect the pulse path with a soft curve.
  const pts = YEARS.map((_, i) => new THREE.Vector3(mx(i), my(RATIO[i]), 2));
  const curve = new THREE.CatmullRomCurve3(pts);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(curve.getPoints(120)),
    new THREE.LineBasicMaterial({ color: 0x4ecdc4, opacity: 0.42, transparent: true })
  );
  group.add(line);
  group.add(makeLabel('科幻/奇幻不是稳定上升，而是被少数爆款点亮的脉冲', 13, 0, 200, 5, '#6d5c49'));

  camera.position.set(0, 0, 680);
  camera.lookAt(0, 0, 0);
}

function destroy() { group?.parent?.remove(group); group = null; beams = []; rings = []; startTime = null; }
function animate(t) {
  if (!startTime) startTime = t;
  const elapsed = t - startTime;
  beams.forEach(b => {
    const lt = elapsed - b.delay;
    if (lt < 0) return;
    const p = Math.min(lt / 700, 1);
    const e = 1 - Math.pow(1 - p, 3);
    b.mesh.material.opacity = b.target * e;
    if (!b.isStar) b.mesh.scale.y = 0.05 + e * 0.95;
    else b.mesh.scale.setScalar(0.6 + e * 0.4 + Math.sin(t * 0.004) * 0.04);
  });
  rings.forEach(r => {
    const lt = (elapsed - r.delay) % 1800;
    if (elapsed < r.delay) return;
    const p = lt / 1800;
    const s = 0.5 + p * 1.8;
    r.mesh.scale.setScalar(s);
    r.mesh.material.opacity = Math.max(0, 0.32 * (1 - p));
  });
}

export { init, destroy, animate };
