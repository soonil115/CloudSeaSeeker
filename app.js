/* app.js — CloudSeaSeeker 메인 애플리케이션 */

// ── 기본 지점 데이터 ──────────────────────────────────────────
const DEFAULT_LOCATIONS = [
  { id: 1, name: '지리산 천왕봉',   lat: 35.3375, lng: 127.7306 },
  { id: 2, name: '설악산 대청봉',   lat: 38.1200, lng: 128.4650 },
  { id: 3, name: '한라산 백록담',   lat: 33.3617, lng: 126.5292 },
  { id: 4, name: '덕유산 향적봉',   lat: 35.8717, lng: 127.7297 },
  { id: 5, name: '가야산 상왕봉',   lat: 35.8169, lng: 128.1097 },
  { id: 6, name: '소백산 비로봉',   lat: 36.9625, lng: 128.4869 },
  { id: 7, name: '태백산 천제단',   lat: 37.0958, lng: 128.9175 },
  { id: 8, name: '오대산 비로봉',   lat: 37.7958, lng: 128.5428 },
];

// ── 상태 ─────────────────────────────────────────────────────
let locations  = loadLocations();
let weatherMap = {};      // id → weather result
let resultMap  = {};      // id → { probability, details }
let editMode   = false;
let map        = null;
let mapMarkers = {};      // id → Leaflet marker
let nextId     = Math.max(0, ...locations.map(l => l.id)) + 1;

// ── LocalStorage ─────────────────────────────────────────────
function loadLocations() {
  try {
    const raw = localStorage.getItem('css_locations');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_LOCATIONS.map(l => ({ ...l }));
}
function saveLocations() {
  localStorage.setItem('css_locations', JSON.stringify(locations));
}

// ── Weather API (Open-Meteo, 무료·무키) ───────────────────────
async function fetchWeather(lat, lng) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,dew_point_2m,` +
    `wind_speed_10m,cloud_cover` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&wind_speed_unit=ms` +
    `&timezone=Asia%2FSeoul` +
    `&forecast_days=1`;

  const res  = await fetch(url);
  const data = await res.json();
  const c    = data.current;
  const d    = data.daily;

  return {
    temperature:      c.temperature_2m,
    relativeHumidity: c.relative_humidity_2m,
    dewpoint:         c.dew_point_2m,
    windSpeed:        c.wind_speed_10m,
    cloudCover:       c.cloud_cover,
    tempMax:          d.temperature_2m_max[0],
    tempMin:          d.temperature_2m_min[0],
    fetchedAt:        new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
  };
}

async function fetchAllWeather() {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.textContent = '불러오는 중…';

  const tasks = locations.map(async loc => {
    try {
      const w = await fetchWeather(loc.lat, loc.lng);
      weatherMap[loc.id] = w;
      resultMap[loc.id]  = calcFogProbability(w);
    } catch (e) {
      console.error('weather fetch failed', loc.name, e);
    }
    renderCard(loc.id);
    updateMapMarker(loc.id);
  });

  await Promise.allSettled(tasks);
  btn.disabled = false;
  btn.textContent = '🔄 날씨 업데이트';
  showToast('날씨 데이터를 업데이트했습니다.');
}

// ── 뷰 전환 ──────────────────────────────────────────────────
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  document.querySelector(`[data-view="${name}"]`).classList.add('active');

  if (name === 'map' && !map) initMap();
  if (name === 'map' && map)  setTimeout(() => map.invalidateSize(), 50);
}

// ── 목록 렌더링 ────────────────────────────────────────────────
function renderList() {
  const grid = document.getElementById('locationList');
  grid.innerHTML = '';
  locations.forEach(loc => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.id = `card-${loc.id}`;
    card.innerHTML = buildCardHTML(loc);
    card.querySelector('.card-body-click').addEventListener('click', () => openDetail(loc.id));
    const editBtn   = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    if (editBtn)   editBtn.addEventListener('click', e => { e.stopPropagation(); openEditModal(loc.id); });
    if (deleteBtn) deleteBtn.addEventListener('click', e => { e.stopPropagation(); deleteLocation(loc.id); });
    grid.appendChild(card);
  });
  if (editMode) grid.classList.add('edit-mode');
  else          grid.classList.remove('edit-mode');
}

function buildCardHTML(loc) {
  const w = weatherMap[loc.id];
  const r = resultMap[loc.id];

  if (!w || !r) {
    return `
      <div class="card-body-click">
        <div class="card-header">
          <div>
            <div class="card-name">${esc(loc.name)}</div>
            <div class="card-coords">${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E</div>
          </div>
          <div class="probability-ring ring-very-low">
            ${ringHTML(0)}
          </div>
        </div>
        <div class="card-loading">날씨 데이터 불러오는 중…</div>
      </div>
      ${editActionsHTML()}`;
  }

  const grade = getGrade(r.probability);
  return `
    <div class="card-body-click">
      <div class="card-header">
        <div>
          <div class="card-name">${esc(loc.name)}</div>
          <div class="card-coords">${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E</div>
          <span class="card-grade grade-${grade.cls}">${grade.label}</span>
        </div>
        <div class="probability-ring ring-${grade.cls}">
          ${ringHTML(r.probability)}
        </div>
      </div>
      <div class="card-weather">
        <span class="weather-chip">🌡️ ${w.temperature.toFixed(1)}°C</span>
        <span class="weather-chip">💧 ${w.relativeHumidity}%</span>
        <span class="weather-chip">💨 ${w.windSpeed.toFixed(1)} m/s</span>
        <span class="weather-chip">🌙 운량 ${w.cloudCover}%</span>
      </div>
    </div>
    ${editActionsHTML()}`;
}

function editActionsHTML() {
  return `<div class="card-actions">
    <button class="btn-edit">✏️ 편집</button>
    <button class="btn-delete">🗑️ 삭제</button>
  </div>`;
}

function renderCard(id) {
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  card.innerHTML = buildCardHTML(loc);
  card.querySelector('.card-body-click').addEventListener('click', () => openDetail(id));
  const editBtn   = card.querySelector('.btn-edit');
  const deleteBtn = card.querySelector('.btn-delete');
  if (editBtn)   editBtn.addEventListener('click', e => { e.stopPropagation(); openEditModal(id); });
  if (deleteBtn) deleteBtn.addEventListener('click', e => { e.stopPropagation(); deleteLocation(id); });
  if (editMode) card.classList.add('edit-mode');
}

function ringHTML(prob) {
  const r = 28, c = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (prob / 100) * circumference;
  return `
    <svg width="${c*2}" height="${c*2}" viewBox="0 0 ${c*2} ${c*2}">
      <circle class="ring-bg" cx="${c}" cy="${c}" r="${r}" />
      <circle class="ring-fg"
        cx="${c}" cy="${c}" r="${r}"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}" />
    </svg>
    <div class="ring-label">
      <span class="pct">${prob}%</span>
    </div>`;
}

// ── 지도 ──────────────────────────────────────────────────────
function initMap() {
  map = L.map('map', { zoomControl: true }).setView([36.5, 128.0], 7);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO',
    maxZoom: 19,
  }).addTo(map);

  locations.forEach(loc => addMapMarker(loc));

  map.on('click', e => {
    if (!editMode) return;
    const name = prompt('새 지점 이름을 입력하세요:');
    if (!name) return;
    addLocation(name, e.latlng.lat, e.latlng.lng);
  });
}

function markerColor(id) {
  const r = resultMap[id];
  if (!r) return '#8b949e';
  const grade = getGrade(r.probability);
  const colors = {
    'very-high': '#f85149',
    'high':      '#f0883e',
    'medium':    '#d29922',
    'low':       '#3fb950',
    'very-low':  '#58a6ff',
  };
  return colors[grade.cls] || '#8b949e';
}

function addMapMarker(loc) {
  if (!map) return;
  const color = markerColor(loc.id);
  const prob  = resultMap[loc.id]?.probability ?? '?';

  const icon = L.divIcon({
    className: '',
    html: `<div class="map-marker-label" style="color:${color};border-color:${color}">${prob}%</div>`,
    iconAnchor: [0, 10],
  });

  const marker = L.marker([loc.lat, loc.lng], { icon })
    .addTo(map)
    .bindPopup(buildPopup(loc), { maxWidth: 220 });

  marker.on('popupopen', () => {
    const btn = document.querySelector('.popup-detail-btn[data-id]');
    if (btn) btn.addEventListener('click', () => openDetail(parseInt(btn.dataset.id)));
  });

  mapMarkers[loc.id] = marker;
}

function buildPopup(loc) {
  const r = resultMap[loc.id];
  const prob = r ? r.probability : '?';
  const grade = r ? getGrade(r.probability) : { label: '—', cls: 'very-low' };
  return `
    <div class="popup-title">${esc(loc.name)}</div>
    <div class="popup-prob prob-${grade.cls}">${prob}%</div>
    <div style="font-size:0.82rem;color:#8b949e">${grade.label}</div>
    <button class="popup-detail-btn" data-id="${loc.id}">상세 보기</button>`;
}

function updateMapMarker(id) {
  if (!map) return;
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  if (mapMarkers[id]) {
    mapMarkers[id].remove();
    delete mapMarkers[id];
  }
  addMapMarker(loc);
}

function removeMapMarker(id) {
  if (mapMarkers[id]) {
    mapMarkers[id].remove();
    delete mapMarkers[id];
  }
}

// ── 지점 CRUD ─────────────────────────────────────────────────
function addLocation(name, lat, lng) {
  const loc = { id: nextId++, name: name.trim(), lat, lng };
  locations.push(loc);
  saveLocations();

  // render card
  const grid = document.getElementById('locationList');
  const card = document.createElement('div');
  card.className = 'location-card';
  card.id = `card-${loc.id}`;
  card.innerHTML = buildCardHTML(loc);
  card.querySelector('.card-body-click').addEventListener('click', () => openDetail(loc.id));
  const editBtn   = card.querySelector('.btn-edit');
  const deleteBtn = card.querySelector('.btn-delete');
  if (editBtn)   editBtn.addEventListener('click', e => { e.stopPropagation(); openEditModal(loc.id); });
  if (deleteBtn) deleteBtn.addEventListener('click', e => { e.stopPropagation(); deleteLocation(loc.id); });
  if (editMode) card.classList.add('edit-mode');
  grid.appendChild(card);

  addMapMarker(loc);

  // auto-fetch
  fetchWeather(lat, lng).then(w => {
    weatherMap[loc.id] = w;
    resultMap[loc.id]  = calcFogProbability(w);
    renderCard(loc.id);
    updateMapMarker(loc.id);
  }).catch(() => {});

  showToast(`'${loc.name}' 추가되었습니다.`);
}

function deleteLocation(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  if (!confirm(`'${loc.name}'을(를) 삭제하시겠습니까?`)) return;
  locations = locations.filter(l => l.id !== id);
  saveLocations();
  delete weatherMap[id];
  delete resultMap[id];
  document.getElementById(`card-${id}`)?.remove();
  removeMapMarker(id);
  showToast(`'${loc.name}' 삭제되었습니다.`);
}

function openEditModal(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">지점 편집</div>
    <div class="modal-coords" style="margin-bottom:16px">ID: ${loc.id}</div>
    <div class="edit-form">
      <input id="editName" type="text" value="${esc(loc.name)}" placeholder="지점 이름" />
      <div class="coord-row">
        <input id="editLat" type="number" step="0.0001" value="${loc.lat}" placeholder="위도" />
        <input id="editLng" type="number" step="0.0001" value="${loc.lng}" placeholder="경도" />
      </div>
      <div class="edit-form-btns">
        <button class="btn-cancel" id="editCancelBtn">취소</button>
        <button class="btn-primary btn-save" id="editSaveBtn">저장</button>
      </div>
    </div>`;

  document.getElementById('detailModal').classList.remove('hidden');

  document.getElementById('editCancelBtn').addEventListener('click', closeModal);
  document.getElementById('editSaveBtn').addEventListener('click', () => {
    const name = document.getElementById('editName').value.trim();
    const lat  = parseFloat(document.getElementById('editLat').value);
    const lng  = parseFloat(document.getElementById('editLng').value);
    if (!name || isNaN(lat) || isNaN(lng)) { showToast('입력값을 확인해 주세요.'); return; }
    loc.name = name; loc.lat = lat; loc.lng = lng;
    saveLocations();
    renderCard(id);
    updateMapMarker(id);
    // re-fetch weather for new coords
    fetchWeather(lat, lng).then(w => {
      weatherMap[id] = w;
      resultMap[id]  = calcFogProbability(w);
      renderCard(id);
      updateMapMarker(id);
    }).catch(() => {});
    closeModal();
    showToast(`'${name}' 수정되었습니다.`);
  });
}

// ── 상세 모달 ─────────────────────────────────────────────────
function openDetail(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  const w = weatherMap[id];
  const r = resultMap[id];

  if (!w || !r) {
    showToast('날씨 데이터를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
    return;
  }

  const grade = getGrade(r.probability);

  const scoreItems = r.details.map(d => {
    const barColor = d.pctOfMax >= 70 ? '#3fb950' : d.pctOfMax >= 40 ? '#d29922' : '#f85149';
    return `
      <div class="score-item">
        <div class="score-item-header">
          <span class="score-item-name">${d.icon} ${d.name}</span>
          <span class="score-item-pts" style="color:${barColor}">${d.score} / ${d.maxScore}점</span>
        </div>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${d.pctOfMax}%;background:${barColor}"></div>
        </div>
        <div class="score-item-value">측정값: <strong>${formatValue(d.id, d.rawValue)}</strong></div>
        <div class="score-item-criterion">기준: ${d.label}</div>
      </div>`;
  }).join('');

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">${esc(loc.name)}</div>
    <div class="modal-coords">${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E</div>
    <div class="modal-big-prob prob-${grade.cls}">${r.probability}%</div>
    <div class="modal-grade grade-${grade.cls}" style="display:inline-block;padding:4px 14px;border-radius:12px;margin-bottom:16px">${grade.label}</div>
    <div class="score-list">${scoreItems}</div>
    <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;font-size:0.82rem;color:var(--text-muted)">
      <strong style="color:var(--text)">총 점수:</strong> ${r.totalScore} / 100점 →
      운해 발생 가능성 <strong style="color:var(--text)">${r.probability}%</strong>
      <br><br>
      <em>점수는 상대 습도(30) + 이슬점 근접도(25) + 풍속(20) + 야간 복사 냉각(15) + 일교차(5) + 계절 보정(5) = 100점 만점으로 산출됩니다.</em>
    </div>
    <div class="modal-updated">데이터 기준 시각: ${w.fetchedAt}</div>`;

  document.getElementById('detailModal').classList.remove('hidden');
}

function formatValue(id, v) {
  if (id === 'season')      return `${v}월`;
  if (id === 'dewpointGap') return `${v.toFixed(1)}°C`;
  if (id === 'humidity')    return `${v}%`;
  if (id === 'cloudCover')  return `${v}%`;
  if (id === 'windSpeed')   return `${v.toFixed(1)} m/s`;
  if (id === 'tempRange')   return `${v.toFixed(1)}°C`;
  return String(v);
}

function closeModal() {
  document.getElementById('detailModal').classList.add('hidden');
}

// ── 편집 모드 ─────────────────────────────────────────────────
function toggleEditMode() {
  editMode = !editMode;
  const btn   = document.getElementById('editModeBtn');
  const panel = document.getElementById('editPanel');
  const grid  = document.getElementById('locationList');

  btn.classList.toggle('active', editMode);
  btn.textContent = editMode ? '✓ 편집 완료' : '편집 모드';
  panel.classList.toggle('hidden', !editMode);
  grid.classList.toggle('edit-mode', editMode);

  // 각 카드에 edit-mode 클래스 적용
  document.querySelectorAll('.location-card').forEach(c => c.classList.toggle('edit-mode', editMode));
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 2500);
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 초기화 ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderList();

  // nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // edit mode
  document.getElementById('editModeBtn').addEventListener('click', toggleEditMode);

  // add location
  document.getElementById('addLocationBtn').addEventListener('click', () => {
    const name = document.getElementById('newName').value.trim();
    const lat  = parseFloat(document.getElementById('newLat').value);
    const lng  = parseFloat(document.getElementById('newLng').value);
    if (!name) { showToast('지점 이름을 입력해 주세요.'); return; }
    if (isNaN(lat) || isNaN(lng)) { showToast('위도/경도를 올바르게 입력해 주세요.'); return; }
    if (lat < -90 || lat > 90)    { showToast('위도는 -90 ~ 90 범위여야 합니다.'); return; }
    if (lng < -180 || lng > 180)  { showToast('경도는 -180 ~ 180 범위여야 합니다.'); return; }
    addLocation(name, lat, lng);
    document.getElementById('newName').value = '';
    document.getElementById('newLat').value  = '';
    document.getElementById('newLng').value  = '';
  });

  // modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('detailModal').addEventListener('click', e => {
    if (e.target === document.getElementById('detailModal')) closeModal();
  });

  // refresh
  document.getElementById('refreshBtn').addEventListener('click', fetchAllWeather);

  // initial fetch
  fetchAllWeather();
});
