import * as THREE from 'three';
import { makeLabel } from '../label-helper.js';

export const poster = {
  legend: [
    { n: '胶片光座', c: '#F5C16C' },
    { n: '暗场空座', c: '#2A2118' },
    { n: '冷色放映光', c: '#4ECDC4' },
  ],
};

const PHASES = [
  { label: '疫情前', sub: '2018-2019', cr: 0.45, lit: 0.72, color: 0xf5c16c, line: '观众仍分散在更多影片之间' },
  { label: '疫情期', sub: '2020-2022', cr: 0.61, lit: 0.42, color: 0x6d5c49, line: '影院暗下，中腰部先退场' },
  { label: '后疫情', sub: '2023-2025', cr: 0.79, lit: 0.58, color: 0x4ecdc4, line: '观众回归，但更集中地涌向头部' },
];

let group, seats = [], beams = [], startTime = null;

function seatMaterial(color, opacity) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
}

function init(scene, camera, controls) {
  controls.target.set(0, 0, 0);
  controls.enabled = false;
  group = new THREE.Group();
  scene.add(group);
  group.position.set(255, -18, 0);
  group.scale.setScalar(0.78);

  const cols = 11, rows = 7;
  const seatGeo = new THREE.BoxGeometry(16, 8, 10);
  const phaseGap = 250;
  const startX = -phaseGap;
  const baseY = -130;

  PHASES.forEach((p, pi) => {
    const cx = startX + pi * phaseGap;
    const litSeats = Math.round(cols * rows * p.lit);

    // Projection beam = concentration: higher CR means narrower/brighter spotlight.
    const beamH = 160 + p.cr * 190;
    const beamW = 170 - p.cr * 70;
    const beamShape = new THREE.Shape();
    beamShape.moveTo(cx - beamW / 2, baseY + 38);
    beamShape.lineTo(cx + beamW / 2, baseY + 38);
    beamShape.lineTo(cx + 22, baseY + beamH);
    beamShape.lineTo(cx - 22, baseY + beamH);
    beamShape.lineTo(cx - beamW / 2, baseY + 38);
    const beam = new THREE.Mesh(
      new THREE.ShapeGeometry(beamShape),
      new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0 })
    );
    beam.position.z = -8;
    group.add(beam);
    beams.push({ mesh: beam, target: 0.16 + p.cr * 0.18, delay: pi * 280 });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const rowCurve = (r - rows / 2) * 4;
        const x = cx + (c - (cols - 1) / 2) * 18 + rowCurve;
        const y = baseY + r * 18;
        const isLit = idx < litSeats;
        const mat = seatMaterial(isLit ? p.color : 0x2a2118, 0);
        const seat = new THREE.Mesh(seatGeo, mat);
        seat.position.set(x, y, 4);
        seat.scale.set(1, 1, 1);
        group.add(seat);
        seats.push({ mesh: seat, lit: isLit, targetOpacity: isLit ? 0.82 : 0.20, delay: pi * 260 + idx * 10 });
      }
    }

    group.add(makeLabel(p.label, 15, cx, baseY - 38, 5, '#1b130a'));
    group.add(makeLabel(p.sub, 11, cx, baseY - 62, 5, '#6d5c49'));
    const crY = baseY + beamH + 32;
    const lineY = crY + 28 + pi * 4;
    group.add(makeLabel(`CR10 = ${p.cr.toFixed(2)}`, 16, cx, crY, 5, '#1b130a'));
    group.add(makeLabel(p.line, 11, cx, lineY, 5, '#6d5c49'));
  });

  group.add(makeLabel('放映厅断层扫描：空座越多，市场越脆弱；光束越窄，头部越集中', 13, 30, 292, 5, '#6d5c49'));
  camera.position.set(0, 40, 690);
  camera.lookAt(0, 0, 0);
}

function destroy() { group?.parent?.remove(group); group = null; seats = []; beams = []; startTime = null; }
function animate(t) {
  if (!startTime) startTime = t;
  const elapsed = t - startTime;
  seats.forEach(s => {
    const lt = elapsed - s.delay;
    if (lt < 0) return;
    const p = Math.min(lt / 560, 1);
    const e = 1 - Math.pow(1 - p, 3);
    s.mesh.material.opacity = s.targetOpacity * e;
    s.mesh.scale.setScalar(0.72 + e * 0.28);
  });
  beams.forEach(b => {
    const lt = elapsed - b.delay;
    if (lt < 0) return;
    const p = Math.min(lt / 900, 1);
    const e = 1 - Math.pow(1 - p, 3);
    b.mesh.material.opacity = b.target * e * (0.9 + 0.1 * Math.sin(t * 0.002));
  });
}

export { init, destroy, animate };
