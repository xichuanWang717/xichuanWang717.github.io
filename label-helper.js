import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export function makeLabel(text, size = 11, x = 0, y = 0, z = 5, color = '#333', align = 'center') {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.color = color;
  div.style.fontSize = size + 'px';
  div.style.fontWeight = '400';
  div.style.fontFamily = 'Noto Sans SC, Source Han Sans SC, Arial, sans-serif';
  div.style.padding = size >= 12 ? '2px 7px' : '1px 5px';
  div.style.borderRadius = '999px';
  div.style.background = 'rgba(242,234,220,0.42)';
  div.style.backdropFilter = 'blur(2px)';
  div.style.textShadow = '0 1px 0 rgba(255,255,255,.35)';
  div.style.pointerEvents = 'none';
  div.style.whiteSpace = 'nowrap';
  div.style.lineHeight = '1.4';
  if (align === 'right') div.style.textAlign = 'right';
  else if (align === 'left') div.style.textAlign = 'left';
  else div.style.textAlign = 'center';
  const label = new CSS2DObject(div);
  label.position.set(x, y, z);
  return label;
}
