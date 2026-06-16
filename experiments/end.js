import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export const poster = { legend: null };

let group = null;

function addText(text, size, x, y, color = '#f2eadc', weight = 400, spacing = '0.08em') {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.cssText = `font-family:Noto Sans SC,Source Han Sans SC,Arial,sans-serif;font-size:${size}px;color:${color};font-weight:${weight};letter-spacing:${spacing};white-space:nowrap;text-shadow:0 0 16px rgba(245,193,108,.22);pointer-events:none;text-align:center`;
  const label = new CSS2DObject(div);
  label.position.set(x, y, 8);
  group.add(label);
  return label;
}

function addRule(y, width = 520, opacity = 0.22) {
  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-width / 2, y, 0), new THREE.Vector3(width / 2, y, 0)]),
    new THREE.LineBasicMaterial({ color: 0xf5c16c, transparent: true, opacity })
  ));
}

function init(scene, camera, controls) {
  controls.target.set(0, 0, 0);
  controls.enabled = false;
  group = new THREE.Group();
  scene.add(group);
  group.position.set(0, -76, 0);
  group.scale.setScalar(0.9);

  addRule(54, 540, 0.20);
  addRule(-84, 360, 0.12);

  addText('DATA SOURCES', 11, 0, 32, 'rgba(245,193,108,.78)', 700, '0.30em');
  addText('猫眼专业版 · 灯塔专业版 App · 豆瓣电影', 15, 0, 0, '#f8edda', 700, '0.10em');
  addText('2018-2025 中国电影市场样本 · 剔除年度票房占比低于 0.1% 的影片', 11, 0, -34, 'rgba(247,239,224,.58)', 400, '0.04em');
  addText('王嘉欣 · 尚小彤', 11, 0, -112, 'rgba(245,193,108,.72)', 500, '0.18em');

  camera.position.set(0, 0, 700);
  camera.lookAt(0, 0, 0);
}

function destroy() {
  group?.parent?.remove(group);
  group = null;
}

function animate(t) {
  if (!group) return;
  group.position.y = -76 + Math.sin(t * 0.0008) * 1.2;
}

export { init, destroy, animate };
