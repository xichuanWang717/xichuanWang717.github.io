import * as THREE from 'three';

const sanitizeText = (text) => {
  if (!text) return text;
  const sanitizer = window.__FRAME_SANITIZE_TEXT__;
  return sanitizer ? sanitizer(text) : String(text).replaceAll('疫情', '特殊时期');
};
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export const poster = {};

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const GENRES = [
  '剧情/现实',
  '动作/冒险',
  '科幻/奇幻',
  '喜剧',
  '动画',
  '悬疑/惊悚',
  '战争/历史',
  '爱情',
  '纪录片',
  '儿童/家庭',
];



const YEAR_COLORS = {
  2018: 0x00645f,
  2019: 0x2f9a95,
  2020: 0x7fcac8,
  2021: 0xc9f0e6,
  2022: 0xf5a31a,
  2023: 0xf08a4b,
  2024: 0xd65a5a,
  2025: 0xf5c16c,
};

const GENRE_COLORS = {
  '剧情/现实': 0x9ed8d7,
  '动作/冒险': 0x00645f,
  '科幻/奇幻': 0xf5a31a,
  '喜剧': 0xc9f0e6,
  '动画': 0xd7dcfa,
  '悬疑/惊悚': 0xf5d9ca,
  '战争/历史': 0x54a8a3,
  '爱情': 0xdff0df,
  '纪录片': 0xffeeee,
  '儿童/家庭': 0xcfe6fb,
};

const GENRE_LABELS = {
  '剧情/现实': '剧情/现实',
  '动作/冒险': '动作/冒险',
  '科幻/奇幻': '科幻/奇幻',
  '喜剧': '喜剧',
  '动画': '动画',
  '悬疑/惊悚': '悬疑/惊悚',
  '战争/历史': '战争/历史',
  '爱情': '爱情',
  '纪录片': '纪录片',
  '儿童/家庭': '儿童/家庭',
};

const EMOJI_BY_GENRE = {
  '剧情/现实': '🎞',
  '动作/冒险': '⚔',
  '科幻/奇幻': '🚀',
  '喜剧': '☻',
  '动画': '✦',
  '悬疑/惊悚': '?',
  '战争/历史': '◆',
  '爱情': '♡',
  '纪录片': '▣',
  '儿童/家庭': '★',
};


const MOVIE_EMOJI = {
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


const TITLE_EMOJI_RULES = [
  ['哪吒', '🔥'],
  ['魔童', '🔥'],
  ['流浪地球', '🌏'],
  ['独行月球', '🌙'],
  ['红海行动', '⚔️'],
  ['唐人街探案', '🔍'],
  ['唐探', '🔍'],
  ['我不是药神', '💊'],
  ['西虹市首富', '💰'],
  ['复仇者联盟', '🛡️'],
  ['捉妖记', '👹'],
  ['毒液', '🕷️'],
  ['海王', '🔱'],
  ['侏罗纪', '🦖'],
  ['前任', '💔'],
  ['我和我的祖国', '🇨🇳'],
  ['我和我的家乡', '🏠'],
  ['我和我的父辈', '👨‍👩‍👧'],
  ['中国机长', '✈️'],
  ['外星人', '👽'],
  ['飞驰人生', '🏎️'],
  ['少年的你', '📘'],
  ['八佰', '🪖'],
  ['姜子牙', '⚡'],
  ['金刚川', '🌉'],
  ['夺冠', '🏆'],
  ['拆弹专家', '💣'],
  ['除暴', '🔨'],
  ['悬崖之上', '🧥'],
  ['长津湖', '❄️'],
  ['李焕英', '💐'],
  ['速度与激情', '🏁'],
  ['怒火', '🔥'],
  ['中国医生', '🏥'],
  ['哥斯拉', '🦖'],
  ['人生大事', '🎆'],
  ['万里归途', '🧭'],
  ['奇迹', '🏗️'],
  ['满江红', '🏮'],
  ['孤注一掷', '🎲'],
  ['消失的她', '🕯️'],
  ['封神', '⚔️'],
  ['八角笼中', '🥊'],
  ['长安三万里', '🍶'],
  ['坚如磐石', '🪨'],
  ['热辣滚烫', '🥊'],
  ['抓娃娃', '🧸'],
  ['第二十条', '⚖️'],
  ['默杀', '🔪'],
  ['年会不能停', '🎉'],
  ['志愿军', '⭐'],
  ['疯狂动物城', '🦊'],
  ['南京照相馆', '📷'],
  ['蛟龙行动', '🐉'],
  ['功夫熊猫', '🐼'],
  ['星际穿越', '🌌'],
  ['熊出没', '🐻'],
  ['731', '🧪'],
];

const GENRE_EMOJI_OPTIONS = {
  '剧情/现实': ['🎭', '🏙️', '🕯️', '📷', '💬', '🌊'],
  '动作/冒险': ['⚔️', '🏁', '💥', '🛡️', '🚁'],
  '科幻/奇幻': ['🚀', '🌏', '🌙', '✨', '🪐'],
  '喜剧': ['😂', '🎉', '💰', '☀️'],
  '动画': ['🐻', '🦊', '🌈', '✨'],
  '悬疑/惊悚': ['🔍', '🕯️', '🔪', '🧩'],
  '战争/历史': ['🪖', '🏮', '⚔️', '⭐'],
  '爱情': ['💔', '💐', '♡'],
  '纪录片': ['📷', '▣'],
  '儿童/家庭': ['🏠', '🧸', '🌈'],
};

function pickFromTitle(name, genre) {
  for (const [key, emoji] of TITLE_EMOJI_RULES) {
    if (name.includes(key)) return emoji;
  }
  const options = GENRE_EMOJI_OPTIONS[genreKey({ g: genre })] || ['🎬'];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return options[hash % options.length];
}

let sceneRef;
let cameraRef;
let controlsRef;
let rendererRef;
let uiContainer;
let clickHandler;
let wheelHandler = null;
let bubbles = [];
let supportObjects = [];
let top5Lines = [];
let hitObjects = [];
let bursts = [];
let poppedIdx = null;
let time = 0;
let gestureMode = false;
let gestureHelpVisible = false;
let cameraOn = false;
let mpReady = false;
let handData = { hands: [], ts: 0 };
let lastPinch = false;
let pinchFrames = 0;
let prevPos = null;
let prevHandDistance = null;
let waveSamples = [];
let filterMode = 'all';
let oT = 0;
let oP = 0.18;
let oD = 1450;
let originalControlLimits = null;
let hintTimer = null;
let hintBlankClicks = 0;
let hintBlankClickTimer = null;



function yearColor(movie) {
  return YEAR_COLORS[Number(movie.y)] || 0xf5c16c;
}

function getYearRadius(year) {
  const idx = Math.max(0, YEARS.indexOf(Number(year)));
  return 140 + (YEARS.length - 1 - idx) * 105;
}

function genreKey(movie) {
  const g = String(movie.g || '');
  if (g.includes('动作')) return '动作/冒险';
  if (g.includes('科幻') || g.includes('奇幻')) return '科幻/奇幻';
  if (g.includes('喜剧')) return '喜剧';
  if (g.includes('动画')) return '动画';
  if (g.includes('悬疑') || g.includes('惊悚') || g.includes('犯罪')) return '悬疑/惊悚';
  if (g.includes('战争') || g.includes('历史')) return '战争/历史';
  if (g.includes('爱情')) return '爱情';
  if (g.includes('纪录')) return '纪录片';
  if (g.includes('儿童') || g.includes('家庭')) return '儿童/家庭';
  return '剧情/现实';
}

function getEmoji(movie) {
  const name = String(movie.n || '');
  const genre = String(movie.g || '');
  const titleEmoji = pickFromTitle(name, genre);
  if (titleEmoji) return titleEmoji;
  if (MOVIE_EMOJI[name]) return MOVIE_EMOJI[name];
  for (const key of Object.keys(MOVIE_EMOJI)) {
    if (name.includes(key) || key.includes(name)) return MOVIE_EMOJI[key];
  }
  const options = GENRE_EMOJI_OPTIONS[genreKey(movie)] || ['🎬'];
  return options[0];
}

function makeLabel(text, cssText) {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.cssText = cssText;
  return new CSS2DObject(div);
}

function addSupport(obj) {
  supportObjects.push(obj);
  sceneRef.add(obj);
  return obj;
}



function getBubbleMovies() {
  const filtered = (window.__MOVIES__ || [])
    .filter((m) => YEARS.includes(Number(m.y)) && Number(m.s) > 0.008)
    .slice()
    .sort((a, b) => (Number(a.r) - Number(b.r)));
  const byYear = new Map();
  filtered.forEach((movie) => {
    const year = Number(movie.y);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(movie);
  });
  return YEARS.flatMap((year) => (byYear.get(year) || []).slice(0, 20));
}

function getActiveGenres() {
  const active = new Set(getBubbleMovies().map((m) => genreKey(m)));
  return GENRES.filter((genre) => active.has(genre));
}









function showGestureHelp() {
  const old = document.getElementById('gesture-help');
  if (old) old.remove();
  gestureHelpVisible = true;
  const help = document.createElement('div');
  help.id = 'gesture-help';
  help.style.cssText = [
    'position:fixed',
    'right:24px',
    'top:50%',
    'transform:translateY(-50%)',
    'z-index:46',
    'width:286px',
    'padding:15px 16px',
    'background:rgba(8,6,4,.78)',
    'border:1px solid rgba(78,205,196,.30)',
    'backdrop-filter:blur(14px)',
    'box-shadow:0 20px 70px rgba(0,0,0,.42)',
    'color:rgba(247,239,224,.78)',
    'font-size:13px',
    'line-height:1.85',
    'letter-spacing:1px',
    'pointer-events:none',
  ].join(';');
  help.innerHTML = [
    '<div style="color:#4ecdc4;font-weight:800;margin-bottom:6px">手势操作</div>',
    '<div><b style="color:#f5c16c">单手捏合</b>：选择气泡</div>',
    '<div><b style="color:#f5c16c">双手移动</b>：旋转星海</div>',
    '<div><b style="color:#f5c16c">双手分开/靠近</b>：放大/缩小</div>',
    '<div><b style="color:#f5c16c">挥手</b>：关闭此说明或关闭电影详情</div>',
    '<div><b style="color:#f5c16c">空白连点</b>：连续点击空白处也可关闭说明</div>',
    '<div style="margin-top:8px;color:rgba(247,239,224,.48);font-size:12px">打开电影详情时，手势控制会暂停。</div>',
    '<div style="color:rgba(247,239,224,.48);font-size:12px">手势模式下，鼠标拖拽、滚轮、点击仍然可用。</div>',
  ].join('');
  document.body.appendChild(help);
}

function closeGestureHelp() {
  const help = document.getElementById('gesture-help');
  if (!help) return;
  help.style.opacity = '0';
  window.setTimeout(() => help.remove(), 260);
  gestureHelpVisible = false;
}

function showEntryHint() {
  document.getElementById('bubble-entry-hint')?.remove();
  closeGestureHelp();
  const hint = document.createElement('div');
  hint.id = 'bubble-entry-hint';
  hint.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:45',
    'pointer-events:none',
    'background:linear-gradient(90deg,rgba(3,2,1,.72),rgba(3,2,1,.54) 42%,rgba(3,2,1,.34))',
    'display:flex',
    'align-items:center',
    'justify-content:flex-end',
    'padding-right:8vw',
    'opacity:0',
    'transition:opacity .35s ease',
    'font-family:inherit',
  ].join(';');
  hint.innerHTML = [
    '<div style="max-width:300px;padding:16px 18px;background:rgba(8,6,4,.74);border:1px solid rgba(245,193,108,.28);box-shadow:0 18px 60px rgba(0,0,0,.38);color:rgba(247,239,224,.78);font-size:13px;line-height:1.8;letter-spacing:1px">',
    '<div style="color:#f5c16c;font-weight:800;margin-bottom:5px">操作提示</div>',
    '<div>左侧是叙事区，不响应旋转。</div>',
    '<div style="color:rgba(78,205,196,.9)">请在右侧星海区域拖拽旋转。</div>',
    '<div style="color:rgba(247,239,224,.48);font-size:12px;margin-top:4px">点击气泡查看详情，滚轮缩放星海。</div>',
    '<div style="color:rgba(245,193,108,.72);font-size:12px;margin-top:6px">连续点击空白处跳过提示。</div>',
    '</div>',
  ].join('');
  document.body.appendChild(hint);
  requestAnimationFrame(() => { hint.style.opacity = '1'; });
  if (hintTimer) window.clearTimeout(hintTimer);
  hintTimer = null;
}



function dismissEntryHint() {
  const hint = document.getElementById('bubble-entry-hint');
  if (!hint) return;
  hint.style.opacity = '0';
  window.setTimeout(() => hint.remove(), 420);
}

function registerBlankHintClick() {
  const entryHint = document.getElementById('bubble-entry-hint');
  const rules = document.getElementById('bubble-rules');
  const gestureHelp = document.getElementById('gesture-help');
  const rulesOpen = rules && rules.style.display !== 'none';
  if (!entryHint && !rulesOpen && !gestureHelp) return;
  hintBlankClicks += 1;
  if (hintBlankClickTimer) window.clearTimeout(hintBlankClickTimer);
  hintBlankClickTimer = window.setTimeout(() => {
    hintBlankClicks = 0;
    hintBlankClickTimer = null;
  }, 820);
  if (hintBlankClicks >= 2) {
    if (rulesOpen) { rules.style.display = 'none'; refreshButtons(); }
    if (entryHint) dismissEntryHint();
    if (gestureHelp) closeGestureHelp();
    hintBlankClicks = 0;
    if (hintBlankClickTimer) {
      window.clearTimeout(hintBlankClickTimer);
      hintBlankClickTimer = null;
    }
  }
}

function buildYearRings() {
  YEARS.forEach((year, idx) => {
    const radius = getYearRadius(year);
    const outerWeight = (radius - 140) / (105 * (YEARS.length - 1));
    const geo = new THREE.RingGeometry(radius - 1.35, radius + 1.35, 180);
    const mat = new THREE.MeshBasicMaterial({
      color: YEAR_COLORS[year] || 0xf2eadc,
      transparent: true,
      opacity: 0.28 + outerWeight * 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(220, -46, 0);
    addSupport(ring);

    const yearHex = `#${(YEAR_COLORS[year] || 0xf2eadc).toString(16).padStart(6, '0')}`;
    const label = makeLabel(String(year), [
      `color:${yearHex}`,
      'font-size:12px',
      'font-weight:800',
      'letter-spacing:1px',
      'padding:3px 8px',
      'border-radius:999px',
      'background:rgba(6,5,3,.62)',
      `border:1px solid ${yearHex}88`,
      `box-shadow:0 0 14px ${yearHex}44`,
      'pointer-events:none',
      'white-space:nowrap',
    ].join(';'));
    label.position.set(220 + radius, -28, 0);
    addSupport(label);
  });
}

function buildGenreLabels() {
  const radius = 1040;
  const activeGenres = getActiveGenres();
  activeGenres.forEach((genre, idx) => {
    const angle = (idx / activeGenres.length) * Math.PI * 2 - Math.PI / 2;
    const x = 220 + Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const color = `#${GENRE_COLORS[genre].toString(16).padStart(6, '0')}`;
    const label = makeLabel(GENRE_LABELS[genre], [
      `color:${color}`,
      'font-size:12px',
      'font-weight:800',
      'letter-spacing:1px',
      'padding:4px 9px',
      'border-radius:999px',
      'background:rgba(6,5,3,.42)',
      `border:1px solid ${color}55`,
      'box-shadow:0 0 18px rgba(0,0,0,.22)',
      'pointer-events:none',
      'white-space:nowrap',
    ].join(';'));
    label.position.set(x, 32, z);
    addSupport(label);
  });
}

function makeCurveLine(from, to, color, opacity, topRank) {
  const mid = from.clone().lerp(to, 0.5);
  mid.y += topRank === 1 ? 150 : 80;
  const curve = new THREE.CatmullRomCurve3([from, mid, to]);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(42));
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const line = new THREE.Line(geo, mat);
  line.userData.baseOpacity = opacity;
  top5Lines.push(line);
  addSupport(line);
}

function buildMovies() {
  const movies = getBubbleMovies();

  const byYear = new Map();
  movies.forEach((movie) => {
    const year = Number(movie.y);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(movie);
  });

  const yearAnchors = new Map();
  YEARS.forEach((year, idx) => {
    const radius = getYearRadius(year);
    const anchor = new THREE.Vector3(220 + radius, 82, 0);
    yearAnchors.set(year, anchor);
  });

  const activeGenres = getActiveGenres();
  movies.forEach((movie, idx) => {
    const yearIndex = Math.max(0, YEARS.indexOf(Number(movie.y)));
    const yearRadius = getYearRadius(movie.y);
    const genre = genreKey(movie);
    const genreIndex = Math.max(0, activeGenres.indexOf(genre));
    const baseAngle = (genreIndex / activeGenres.length) * Math.PI * 2 - Math.PI / 2;
    const sameYear = byYear.get(Number(movie.y)) || [];
    const localRank = sameYear.indexOf(movie);
    const spiral = (localRank % 13 - 6) * 0.045;
    const jitterR = ((localRank * 47) % 128) - 64;
    const angle = baseAngle + spiral;
    const radius = yearRadius + jitterR + Math.floor(localRank / 13) * 58;
    const rating = Number(movie.rt) || 6.5;
    const share = Number(movie.s) || 0.01;
    const isTop5 = Number(movie.r) <= 5;
    const isTop1 = Number(movie.r) === 1;
    const color = yearColor(movie);

    const x = 220 + Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (rating - 6.7) * 78 + (localRank % 7 - 3) * 24;
    const size = Math.max(7, Math.min(34, 7 + share * 78 + (isTop5 ? 4 : 0)));

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(size, 24, 18),
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: isTop5 ? 0.88 : 0.66,
        roughness: 0.34,
        metalness: 0.04,
        clearcoat: 0.32,
        emissive: color,
        emissiveIntensity: isTop5 ? 0.12 : 0.035,
      }),
    );
    mesh.position.set(x, y, z);
    mesh.userData = {
      idx,
      fp: Math.random() * 6,
      fs: 0.26 + Math.random() * 0.24,
      targetOpacity: isTop5 ? 0.88 : 0.66,
    };
    sceneRef.add(mesh);

    const hitMesh = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(size * 1.05, 14), 12, 8),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    hitMesh.position.copy(mesh.position);
    hitMesh.userData = { idx };
    hitObjects.push(hitMesh);
    sceneRef.add(hitMesh);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(size * (isTop5 ? 1.75 : 1.35), 16, 12),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: isTop5 ? 0.16 : 0.055,
        depthWrite: false,
      }),
    );
    glow.position.copy(mesh.position);
    glow.userData.baseOpacity = isTop5 ? 0.16 : 0.055;
    sceneRef.add(glow);

    let crown = null;
    if (isTop5) {
      crown = new THREE.Mesh(
        new THREE.TorusGeometry(size * 1.28, isTop1 ? 1.7 : 1.1, 8, 54),
        new THREE.MeshBasicMaterial({
          color: isTop1 ? 0xf5c16c : 0xf08a4b,
          transparent: true,
          opacity: isTop1 ? 0.72 : 0.42,
          depthWrite: false,
        }),
      );
      crown.rotation.x = Math.PI / 2;
      crown.position.copy(mesh.position);
      sceneRef.add(crown);

      const anchor = yearAnchors.get(Number(movie.y));
      // TOP5 is now indicated by halo/ring only; light chords were removed to keep the star field clean.
    }

    const label = makeLabel(getEmoji(movie), [
      `font-size:${Math.max(14, size * 0.62)}px`,
      'font-family:"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif',
      `opacity:${isTop5 ? 1 : .62}`,
      'filter:drop-shadow(0 1px 4px rgba(0,0,0,.34))',
      'pointer-events:none',
    ].join(';'));
    label.position.copy(mesh.position);
    sceneRef.add(label);

    const yearLabel = makeLabel(String(movie.y), [
      'font-size:9px',
      'font-weight:600',
      'color:rgba(247,239,224,.34)',
      'text-align:center',
      'pointer-events:none',
      'white-space:nowrap',
    ].join(';'));
    yearLabel.position.set(x, y - size - 14, z);
    sceneRef.add(yearLabel);

    bubbles.push({
      mesh,
      hitMesh,
      glow,
      crown,
      label,
      yearLabel,
      movie,
      idx,
      x,
      y,
      z,
      size,
      isTop5,
      isTop1,
    });
  });
}

function buildUI() {
  if (uiContainer) uiContainer.remove();
  uiContainer = document.createElement('div');
  uiContainer.id = 'bubble-ui';
  uiContainer.style.cssText = 'position:fixed;inset:0;z-index:40;pointer-events:none;font-family:inherit';

  const controls = document.createElement('div');
  controls.style.cssText = [
    'position:absolute',
    'left:22px',
    'bottom:104px',
    'display:flex',
    'align-items:center',
    'gap:6px',
    'padding:6px',
    'background:rgba(8,6,4,.62)',
    'border:1px solid rgba(245,193,108,.22)',
    'backdrop-filter:blur(12px)',
    'box-shadow:0 14px 40px rgba(0,0,0,.32)',
    'pointer-events:auto',
  ].join(';');

  const allBtn = makeButton('全部');
  const topBtn = makeButton('TOP5');
  const resetBtn = makeButton('重置');
  const rulesBtn = makeButton('规则');
  const handBtn = makeButton('手势');
  handBtn.id = 'bubble-hand-btn';
  controls.append(allBtn, topBtn, resetBtn, rulesBtn, handBtn);
  uiContainer.appendChild(controls);

  const status = document.createElement('div');
  status.id = 'bubble-gs';
  status.style.cssText = [
    'display:none',
    'position:absolute',
    'right:24px',
    'bottom:104px',
    'min-width:168px',
    'padding:11px 13px',
    'background:rgba(8,6,4,.62)',
    'border:1px solid rgba(78,205,196,.22)',
    'backdrop-filter:blur(12px)',
    'font-size:12px',
    'line-height:1.68',
    'pointer-events:none',
    'box-shadow:0 14px 40px rgba(0,0,0,.32)',
  ].join(';');
  status.innerHTML = [
    '<div><span style="color:rgba(247,239,224,.45)">摄像头：</span><span id="gs-cam" style="color:#f5c16c">未连接</span></div>',
    '<div><span style="color:rgba(247,239,224,.45)">手势：</span><span id="gs-hand" style="color:#4ecdc4">未识别</span></div>',
  ].join('');
  uiContainer.appendChild(status);


  const rules = document.createElement('div');
  rules.id = 'bubble-rules';
  rules.style.cssText = [
    'display:none',
    'position:absolute',
    'left:22px',
    'bottom:170px',
    'width:330px',
    'padding:14px 15px',
    'background:rgba(8,6,4,.74)',
    'border:1px solid rgba(245,193,108,.25)',
    'backdrop-filter:blur(14px)',
    'box-shadow:0 18px 54px rgba(0,0,0,.38)',
    'color:rgba(247,239,224,.72)',
    'font-size:12px',
    'line-height:1.68',
    'pointer-events:auto',
  ].join(';');
  rules.innerHTML = [
    '<div style="color:#f5c16c;font-weight:800;letter-spacing:2px;margin-bottom:6px">星海规则</div>',
    '<div><b style="color:#f5c16c">样本</b>：每一年取票房占比进入前 20 的影片，形成同等口径的年度星群。</div>',
    '<div><b style="color:#f5c16c">类型口径</b>：按本页实际出现影片的主要叙事驱动力归类。</div>',
    '<div style="font-size:12px;color:rgba(247,239,224,.64);line-height:1.75">剧情/现实：现实处境、家庭关系、社会议题或人物命运。动作/冒险：追逐、战斗、任务与冒险推进。科幻/奇幻：未来科技、宇宙想象或超现实设定。喜剧：以幽默冲突和轻松节奏为核心。动画：动画制作为主要形式。悬疑/惊悚：谜题、犯罪、恐惧或紧张感驱动。战争/历史：战争事件、历史人物或时代叙事。爱情：爱情关系本身构成核心矛盾。</div>',
    '<div><b style="color:#f5c16c">颜色</b>：年份。2018-2025 使用不同颜色，越靠后的年份越偏暖、越明亮。</div>',
    '<div><b style="color:#f5c16c">大小</b>：票房占比。越大的星球，市场占比越高。</div>',
    '<div><b style="color:#f5c16c">高度/光晕</b>：豆瓣评分。评分越高，位置和光感越突出。</div>',
    '<div><b style="color:#f5c16c">金色外环</b>：年度 TOP5 影片，TOP1 更亮；普通气泡戳破时只散开粒子。</div>',
    '<div><b style="color:#f5c16c">Emoji</b>：电影内容符号，用来帮助快速辨认影片。</div>',
    '<div style="margin-top:8px;color:rgba(78,205,196,.86)">手势：单手捏合选择、挥手关闭；双手移动旋转、双手距离缩放；鼠标操作仍然可用。</div>',
    '<div style="margin-top:8px;color:rgba(245,193,108,.72);font-size:12px">连续点击空白处可关闭规则。</div>',
  ].join('');
  uiContainer.appendChild(rules);

  const hint = document.createElement('div');
  hint.id = 'bubble-hint';
  hint.style.cssText = [
    'position:absolute',
    'left:50%',
    'bottom:42px',
    'transform:translateX(-50%)',
    'padding:7px 16px',
    'background:rgba(8,6,4,.46)',
    'border:1px solid rgba(245,193,108,.12)',
    'color:rgba(247,239,224,.58)',
    'font-size:11px',
    'letter-spacing:1px',
    'white-space:nowrap',
    'pointer-events:none',
  ].join(';');
  hint.textContent = '鼠标拖拽旋转 · 滚轮缩放 · 点击气泡查看电影';
  uiContainer.appendChild(hint);

  document.body.appendChild(uiContainer);

  allBtn.onclick = () => { playUiSfx(); setFilter('all'); };
  topBtn.onclick = () => { playUiSfx(); setFilter('top5'); };
  resetBtn.onclick = () => { playUiSfx(); resetView(); };
  rulesBtn.onclick = () => {
    playUiSfx();
    rules.style.display = rules.style.display === 'none' ? 'block' : 'none';
    refreshButtons();
  };
  handBtn.onclick = () => { playUiSfx(); toggleGesture(); };
  refreshButtons();
}

function playUiSfx() {
  window.__FRAME_PLAY_PAGE_SFX__?.();
}

function makeButton(text) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.cssText = [
    'height:30px',
    'min-width:48px',
    'padding:0 11px',
    'border:1px solid rgba(245,193,108,.26)',
    'background:rgba(245,193,108,.06)',
    'color:rgba(247,239,224,.72)',
    'font-size:12px',
    'font-weight:700',
    'cursor:pointer',
    'font-family:inherit',
  ].join(';');
  return btn;
}

function refreshButtons() {
  const buttons = uiContainer?.querySelectorAll('button') || [];
  buttons.forEach((btn) => {
    const rules = document.getElementById('bubble-rules');
    const rulesOpen = rules && rules.style.display !== 'none';
    const active = (btn.textContent === '全部' && filterMode === 'all')
      || (btn.textContent === 'TOP5' && filterMode === 'top5')
      || (btn.textContent === '规则' && rulesOpen)
      || (btn.id === 'bubble-hand-btn' && gestureMode);
    btn.style.background = active ? '#f5c16c' : 'rgba(245,193,108,.06)';
    btn.style.color = active ? '#120b05' : 'rgba(247,239,224,.72)';
  });
}

function setFilter(mode) {
  filterMode = mode;
  bubbles.forEach((b) => {
    const visible = mode === 'all' || b.isTop5;
    b.mesh.visible = visible;
    b.hitMesh.visible = visible;
    b.glow.visible = visible;
    if (b.crown) b.crown.visible = visible;
    b.label.visible = visible;
    b.label.element.style.opacity = mode === 'top5' ? (b.isTop5 ? '1' : '0') : (b.isTop5 ? '1' : '.62');
    b.yearLabel.visible = mode === 'all' ? visible : b.isTop5;
  });
  top5Lines.forEach((line) => {
    line.visible = false;
    line.material.opacity = 0;
  });
  refreshButtons();
}

function resetView() {
  oT = 0;
  oP = 0.18;
  oD = 1180;
  if (cameraRef) {
    cameraRef.position.set(0, 280, 1450);
    cameraRef.lookAt(0, 0, 0);
  }
  if (controlsRef) {
    controlsRef.target.set(0, 0, 0);
    controlsRef.update();
  }
}

async function toggleGesture() {
  gestureMode = !gestureMode;
  const status = document.getElementById('bubble-gs');
  const hint = document.getElementById('bubble-hint');
  if (!gestureMode) {
    status.style.display = 'none';
    document.getElementById('cam-bg')?.classList.remove('active');
    if (controlsRef) controlsRef.enabled = true;
    hint.textContent = '鼠标拖拽旋转 · 滚轮缩放 · 点击气泡查看电影';
    closeGestureHelp();
    refreshButtons();
    return;
  }

  status.style.display = 'block';
  const camText = document.getElementById('gs-cam');
  camText.textContent = '连接中...';
  if (!mpReady && typeof Hands !== 'undefined' && typeof Camera !== 'undefined') await initMP();
  if (!cameraOn) {
    camText.textContent = '失败，请用鼠标探索';
    gestureMode = false;
    refreshButtons();
    return;
  }
  document.getElementById('cam-bg')?.classList.add('active');
  if (controlsRef) controlsRef.enabled = true;
  if (cameraRef) {
    const p = cameraRef.position;
    oD = Math.hypot(p.x, p.y, p.z);
    oT = Math.atan2(p.x, p.z);
    oP = Math.asin(Math.max(-1, Math.min(1, p.y / oD)));
  }
  hint.textContent = '单手捏合选择 · 双手旋转/缩放 · 鼠标仍可操作';
  showGestureHelp();
  refreshButtons();
}



function createBurst(bubble) {
  if (!bubble) return;
  const origin = bubble.mesh.position.clone();
  const color = yearColor(bubble.movie);
  const group = new THREE.Group();
  group.position.copy(origin);
  const particles = [];
  const count = bubble.isTop5 ? 46 : 34;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const lift = ((i % 5) - 2) * 0.32;
    const speed = 88 + (i % 9) * 16 + bubble.size * 1.2;
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(bubble.isTop5 ? 5.2 : 4.1, 10, 8),
      new THREE.MeshBasicMaterial({
        color: i % 4 === 0 ? 0xf5c16c : color,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
    dot.userData.velocity = new THREE.Vector3(Math.cos(angle) * speed, lift * speed + 16, Math.sin(angle) * speed);
    particles.push(dot);
    group.add(dot);
  }

  let ring = null;
  if (bubble.isTop5) {
    ring = new THREE.Mesh(
      new THREE.TorusGeometry(Math.max(bubble.size * 1.9, 28), 3.2, 10, 96),
      new THREE.MeshBasicMaterial({
        color: 0xf5c16c,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }
  sceneRef.add(group);
  bursts.push({ group, particles, ring, start: performance.now(), duration: 1150 });
}

function showDetail(idx) {
  if (idx == null || idx === poppedIdx) return;
  if (poppedIdx !== null) restoreBubble(bubbles[poppedIdx]);
  poppedIdx = idx;

  const b = bubbles[idx];
  window.__FRAME_PLAY_PAGE_SFX__?.();
  createBurst(b);
  const movie = b.movie;
  const colorNum = yearColor(movie);
  const color = `#${colorNum.toString(16).padStart(6, '0')}`;
  document.getElementById('detail-emoji').textContent = getEmoji(movie);
  document.getElementById('detail-emoji').parentElement.style.background = `linear-gradient(135deg,${color},${color}66)`;
  document.getElementById('detail-title').textContent = String(movie.n);
  const pillTextColor = Number(movie.y) === 2021 ? 'rgba(92,84,72,.92)' : color;
  document.getElementById('detail-meta').innerHTML = [
    pill(String(movie.y), color, pillTextColor),
    pill(GENRE_LABELS[genreKey(movie)], color, pillTextColor),
    pill(`票房占比 ${(Number(movie.s) * 100).toFixed(1)}%`, color, pillTextColor),
    Number(movie.r) <= 5 ? pill(`年度 TOP${movie.r}`, '#f5c16c') : '',
  ].join('');
  document.getElementById('detail-desc').textContent = sanitizeText(Number(movie.rt)
    ? `豆瓣评分 ${Number(movie.rt).toFixed(1)}。星球大小代表票房占比，高度和光晕呼应口碑评分。`
    : '星球大小代表票房占比，高度和光晕呼应口碑评分。');
  document.getElementById('detail-overlay').style.display = 'none';
  document.getElementById('detail-card').style.transform = 'scale(.94)';
  window.setTimeout(() => {
    if (poppedIdx === idx) {
      document.getElementById('detail-overlay').style.display = 'flex';
      document.getElementById('detail-card').style.transform = 'scale(1)';
    }
  }, 420);

  b.mesh.material.opacity = 0;
  b.glow.material.opacity = 0;
  b.label.visible = false;
  b.yearLabel.visible = false;
  if (b.crown) b.crown.visible = false;
}

function pill(text, color, textColor = color) {
  return `<span style="background:${color}22;color:${textColor};padding:2px 9px;border-radius:4px;font-size:12px;font-weight:600">${text}</span>`;
}

function restoreBubble(b) {
  if (!b) return;
  b.mesh.material.opacity = b.mesh.userData.targetOpacity;
  b.glow.material.opacity = b.glow.userData.baseOpacity;
  b.label.visible = true;
  b.label.element.style.opacity = b.isTop5 ? '1' : '.62';
  b.yearLabel.visible = filterMode === 'all' || b.isTop5;
  if (b.crown) b.crown.visible = true;
}

function closeDetail() {
  document.getElementById('detail-card').style.transform = 'scale(.94)';
  document.getElementById('detail-overlay').style.display = 'none';
  if (poppedIdx !== null) restoreBubble(bubbles[poppedIdx]);
  poppedIdx = null;
}

async function initMP() {
  try {
    const camStatus = document.getElementById('gs-cam');
    if (camStatus) camStatus.textContent = '连接中...';
    const hands = new Hands({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}` });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    const video = document.getElementById('hand-video');
    const cam = new Camera(video, {
      onFrame: async () => { await hands.send({ image: video }); },
      width: 640,
      height: 480,
    });
    await cam.start();
    mpReady = true;
    cameraOn = true;
    const camBg = document.getElementById('cam-bg');
    if (camBg && video.srcObject) {
      camBg.srcObject = video.srcObject;
      await camBg.play();
    }
    if (camStatus) camStatus.textContent = '已连接';
    hands.onResults((result) => {
      const now = performance.now();
      handData = result.multiHandLandmarks && result.multiHandLandmarks.length > 0
        ? {
            hands: result.multiHandLandmarks.map((lm, i) => ({
              handedness: result.multiHandedness?.[i]?.label || 'Unknown',
              landmarks: lm.map((p) => ({ x: p.x, y: p.y, z: p.z })),
            })),
            ts: now,
          }
        : { hands: [], ts: now };
    });
  } catch (error) {
    console.error('[MediaPipe]', error);
    mpReady = true;
    cameraOn = false;
    const camStatus = document.getElementById('gs-cam');
    if (camStatus) camStatus.textContent = '失败';
  }
}

function processGestures() {
  const hands = handData.hands;
  const camStatus = document.getElementById('gs-cam');
  const handStatus = document.getElementById('gs-hand');
  if (camStatus) camStatus.textContent = cameraOn ? '已连接' : '未连接';
  if (handStatus) handStatus.textContent = hands.length > 1 ? '双手' : hands.length === 1 ? '单手' : '未识别';
  if (!gestureMode || hands.length === 0) {
    lastPinch = false;
    pinchFrames = 0;
    prevPos = null;
    prevHandDistance = null;
    return;
  }

  const detailOpen = document.getElementById('detail-overlay').style.display === 'flex';
  if (detailOpen) {
    lastPinch = false;
    pinchFrames = 0;
    prevPos = null;
    prevHandDistance = null;
    checkWave(hands[0]);
    return;
  }

  if (gestureHelpVisible) {
    checkWave(hands[0]);
    if (document.getElementById('gesture-help')) return;
  }

  if (hands.length >= 2) processTwoHands(hands);
  else processOneHand(hands[0]);
}

function handState(hand) {
  const lm = hand.landmarks;
  const pinch = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
  if (pinch < 0.038) return 'pinch';
  return 'open';
}

function processOneHand(hand) {
  const state = handState(hand);
  const lm = hand.landmarks;
  if (state === 'pinch') {
    pinchFrames += 1;
    if (!lastPinch && pinchFrames >= 2) {
      const mx = (lm[4].x + lm[8].x) / 2;
      const my = (lm[4].y + lm[8].y) / 2;
      pickAt((1 - mx) * window.innerWidth, my * window.innerHeight);
      lastPinch = true;
    }
    return;
  }

  pinchFrames = 0;
  lastPinch = false;
  prevPos = null;
  prevHandDistance = null;
  if (document.getElementById('detail-overlay').style.display === 'flex') checkWave(hand);
}

function processTwoHands(hands) {
  const h0 = hands[0].landmarks[9];
  const h1 = hands[1].landmarks[9];
  const ax = (1 - h0.x + 1 - h1.x) / 2;
  const ay = (h0.y + h1.y) / 2;
  const distance = Math.hypot(h0.x - h1.x, h0.y - h1.y);
  if (prevPos) {
    oT += (ax - prevPos.x) * 2.8;
    oP -= (ay - prevPos.y) * 2.35;
    oP = Math.max(-1.15, Math.min(1.15, oP));
  }
  if (prevHandDistance != null) {
    oD -= (distance - prevHandDistance) * 2200;
    oD = Math.max(180, Math.min(3600, oD));
  }
  prevPos = { x: ax, y: ay };
  prevHandDistance = distance;
}

function checkWave(hand) {
  const lm = hand.landmarks || [];
  const points = [0, 5, 9, 13, 17].map((idx) => lm[idx]).filter(Boolean);
  if (!points.length) return;
  const x = 1 - points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const now = performance.now();
  waveSamples.push({ x, y, t: now });
  while (waveSamples.length && waveSamples[0].t < now - 1050) waveSamples.shift();
  if (waveSamples.length < 6) return;
  let travel = 0;
  let vertical = 0;
  let turns = 0;
  let lastDir = 0;
  for (let i = 1; i < waveSamples.length; i++) {
    const dx = waveSamples[i].x - waveSamples[i - 1].x;
    const dy = waveSamples[i].y - waveSamples[i - 1].y;
    travel += Math.abs(dx);
    vertical += Math.abs(dy);
    const dir = Math.sign(dx);
    if (dir && lastDir && dir !== lastDir) turns += 1;
    if (dir) lastDir = dir;
  }
  const net = Math.abs(waveSamples.at(-1).x - waveSamples[0].x);
  const horizontalEnough = travel > 0.16 && travel > vertical * 1.25;
  const backAndForth = turns >= 1 || net < travel * 0.72;
  if (horizontalEnough && backAndForth) {
    if (document.getElementById('gesture-help')) closeGestureHelp();
    else closeDetail();
    waveSamples = [];
  }
}



function isInteractiveUiTarget(target) {
  return !!target.closest?.('#bubble-ui, #detail-card, #detail-overlay, #film-nav, .film-node, button');
}

function handleBubbleWheel(event) {
  if (!cameraRef || !controlsRef) return;
  if (isInteractiveUiTarget(event.target)) return;
  const rect = rendererRef?.domElement?.getBoundingClientRect?.() || {
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const starZoneLeft = rect.left + rect.width * 0.34;
  const navTop = window.innerHeight - 176;
  if (event.clientX < starZoneLeft || event.clientY > navTop) return;

  event.preventDefault();
  const target = controlsRef.target || new THREE.Vector3(0, 0, 0);
  const offset = cameraRef.position.clone().sub(target);
  const currentDistance = offset.length();
  const scale = event.deltaY > 0 ? 1.1 : 0.9;
  const minDistance = controlsRef.minDistance || 280;
  const maxDistance = controlsRef.maxDistance || 2400;
  const nextDistance = Math.max(minDistance, Math.min(maxDistance, currentDistance * scale));
  offset.setLength(nextDistance);
  cameraRef.position.copy(target).add(offset);
  oD = nextDistance;
  controlsRef.update();
}


function isPickBlockedByOverlay() {
  const entryHint = document.getElementById('bubble-entry-hint');
  const rules = document.getElementById('bubble-rules');
  const gestureHelp = document.getElementById('gesture-help');
  const detail = document.getElementById('detail-overlay');
  const rulesOpen = rules && rules.style.display !== 'none';
  const detailOpen = detail && detail.style.display === 'flex';
  return !!entryHint || !!gestureHelp || !!rulesOpen || !!detailOpen;
}

function pickAt(clientX, clientY) {
  if (!cameraRef) return;
  if (isPickBlockedByOverlay()) {
    registerBlankHintClick();
    return;
  }
  const rect = rendererRef?.domElement?.getBoundingClientRect?.() || { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    registerBlankHintClick();
    return;
  }
  const tmp = new THREE.Vector3();
  let best = null;

  bubbles.forEach((b) => {
    if (!b.mesh.visible) return;
    tmp.copy(b.mesh.position).project(cameraRef);
    if (tmp.z < -1 || tmp.z > 1) return;
    const sx = rect.left + (tmp.x * 0.5 + 0.5) * rect.width;
    const sy = rect.top + (-tmp.y * 0.5 + 0.5) * rect.height;
    const dist = Math.hypot(clientX - sx, clientY - sy);
    const radius = Math.max(30, Math.min(62, b.size * 1.35 + (b.isTop5 ? 14 : 9)));
    if (dist <= radius && (!best || dist < best.dist)) best = { bubble: b, dist };
  });

  if (best) showDetail(best.bubble.idx);
  else registerBlankHintClick();
}

function init(scene, camera, controls, renderer) {
  sceneRef = scene;
  cameraRef = camera;
  controlsRef = controls;
  rendererRef = renderer;
  controlsRef.target.set(0, 0, 0);
  controlsRef.enabled = true;
  originalControlLimits = {
    minPolarAngle: controlsRef.minPolarAngle,
    maxPolarAngle: controlsRef.maxPolarAngle,
    minDistance: controlsRef.minDistance,
    maxDistance: controlsRef.maxDistance,
  };
  controlsRef.minPolarAngle = 0.08;
  controlsRef.maxPolarAngle = Math.PI - 0.08;
  controlsRef.minDistance = 180;
  controlsRef.maxDistance = 3600;
  resetView();
  document.body.classList.add('bubble-active');
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';

  const posterTop = document.getElementById('poster-top');
  if (posterTop) {
    posterTop.dataset.originalHTML = posterTop.innerHTML;
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setText('poster-chapter', '🌌 ACT 05 · 下一帧');
    setText('poster-title', '下一帧 · 进入影像宇宙');
    setText('poster-sub', '这里不再是统计，而是影像的集合。\n每一帧数据，都来自一部真实的电影。\n你正在进入被时间筛选后的视觉记忆。');
    setText('poster-stat', '604 帧记忆影像');
    setText('poster-stat-label', '');
    setText('poster-desc', '');
  }
  const quote = document.getElementById('chapter-quote');
  if (quote) {
    quote.dataset.originalHTML = quote.innerHTML;
    quote.innerHTML = '每一帧影像都在继续播放，<span>每一次观看，都在重新发生。</span>';
  }

  const legend = document.getElementById('legend');
  if (legend) legend.style.display = 'none';

  buildYearRings();
  buildGenreLabels();
  buildMovies();
  buildUI();
  showEntryHint();

  if (clickHandler) document.removeEventListener('click', clickHandler);
  clickHandler = (event) => {
    if (event.target.closest?.('#bubble-ui') || event.target.closest?.('#detail-card') || event.target.closest?.('#detail-overlay')) return;
    pickAt(event.clientX, event.clientY);
  };
  document.addEventListener('click', clickHandler);
  wheelHandler = handleBubbleWheel;
  document.addEventListener('wheel', wheelHandler, { passive: false, capture: true });

  document.getElementById('detail-close')?.addEventListener('click', closeDetail);
  document.getElementById('detail-overlay')?.addEventListener('click', (event) => {
    if (event.target.id === 'detail-overlay') {
      event.stopPropagation();
      closeDetail();
    }
  });
}

function destroy() {
  if (hintTimer) {
    window.clearTimeout(hintTimer);
    hintTimer = null;
  }
  if (hintBlankClickTimer) {
    window.clearTimeout(hintBlankClickTimer);
    hintBlankClickTimer = null;
  }
  hintBlankClicks = 0;
  document.getElementById('bubble-entry-hint')?.remove();
  closeGestureHelp();
  document.body.classList.remove('bubble-active');
  document.body.style.userSelect = '';
  document.body.style.webkitUserSelect = '';
  if (uiContainer) {
    uiContainer.remove();
    uiContainer = null;
  }
  if (clickHandler) {
    document.removeEventListener('click', clickHandler);
    clickHandler = null;
  }
  if (wheelHandler) {
    document.removeEventListener('wheel', wheelHandler, { capture: true });
    wheelHandler = null;
  }
  const posterTop = document.getElementById('poster-top');
  if (posterTop?.dataset.originalHTML) {
    posterTop.innerHTML = posterTop.dataset.originalHTML;
    delete posterTop.dataset.originalHTML;
  }
  const quote = document.getElementById('chapter-quote');
  if (quote?.dataset.originalHTML) {
    quote.innerHTML = quote.dataset.originalHTML;
    delete quote.dataset.originalHTML;
  }
  const legend = document.getElementById('legend');
  if (legend) legend.style.display = '';
  document.getElementById('detail-overlay').style.display = 'none';
  document.getElementById('cam-bg')?.classList.remove('active');
  [...bubbles.flatMap((b) => [b.mesh, b.hitMesh, b.glow, b.crown, b.label, b.yearLabel]), ...supportObjects].forEach((obj) => {
    if (!obj) return;
    obj.parent?.remove(obj);
    obj.geometry?.dispose?.();
    obj.material?.dispose?.();
  });
  bubbles = [];
  supportObjects = [];
  top5Lines = [];
  bursts.forEach((burst) => burst.group.parent?.remove(burst.group));
  bursts = [];
  poppedIdx = null;
  rendererRef = null;
  handData = { hands: [], ts: 0 };
  pinchFrames = 0;
  gestureMode = false;
  prevPos = null;
  prevHandDistance = null;
  if (controlsRef) {
    controlsRef.enabled = true;
    if (originalControlLimits) {
      controlsRef.minPolarAngle = originalControlLimits.minPolarAngle;
      controlsRef.maxPolarAngle = originalControlLimits.maxPolarAngle;
      controlsRef.minDistance = originalControlLimits.minDistance;
      controlsRef.maxDistance = originalControlLimits.maxDistance;
    }
  }
  originalControlLimits = null;
}

function animate(t) {
  time = (t || 0) * 0.001;
  if (gestureMode) {
    processGestures();
    if (cameraRef) {
      cameraRef.position.x = oD * Math.sin(oT) * Math.cos(oP);
      cameraRef.position.y = oD * Math.sin(oP);
      cameraRef.position.z = oD * Math.cos(oT) * Math.cos(oP);
      cameraRef.lookAt(0, 0, 0);
    }
  }

  bubbles.forEach((b) => {
    const float = Math.sin(time * b.mesh.userData.fs + b.mesh.userData.fp) * (b.isTop5 ? 10 : 6);
    b.mesh.position.y = b.y + float;
    b.hitMesh.position.y = b.y + float;
    b.glow.position.y = b.y + float;
    if (b.crown) {
      b.crown.position.y = b.y + float;
      b.crown.rotation.z += b.isTop1 ? 0.006 : 0.003;
    }
    b.label.position.y = b.y + float;
    b.yearLabel.position.y = b.y + float - b.size - 14;
    b.glow.material.opacity = (b.glow.userData.baseOpacity || 0.06) * (1 + Math.sin(time * 1.5 + b.mesh.userData.fp) * 0.16);
  });

  bursts.forEach((burst) => {
    const elapsed = performance.now() - burst.start;
    const p = Math.min(elapsed / burst.duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    burst.particles.forEach((dot) => {
      dot.position.x = dot.userData.velocity.x * ease;
      dot.position.y = dot.userData.velocity.y * ease - 18 * p * p;
      dot.position.z = dot.userData.velocity.z * ease;
      dot.material.opacity = 0.98 * (1 - p);
      dot.scale.setScalar(1 + p * 0.8);
    });
    if (burst.ring) {
      burst.ring.scale.setScalar(1 + p * 3.8);
      burst.ring.material.opacity = 0.72 * (1 - p);
    }
    if (p >= 1) {
      burst.group.parent?.remove(burst.group);
      burst.group.traverse((obj) => {
        obj.geometry?.dispose?.();
        obj.material?.dispose?.();
      });
    }
  });
  bursts = bursts.filter((burst) => performance.now() - burst.start < burst.duration);

}

export { init, destroy, animate };
