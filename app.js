/* app.js — CloudSeaSeeker 메인 애플리케이션 */

// ── 기본 지점 데이터 (서울 근교 25 + 전국 25) ────────────────────
const DEFAULT_LOCATIONS = [
  // ── 서울 근교 운해 명소 25곳 ──
  { id:  1, name: '명지산',        lat: 37.9278, lng: 127.5056, province: '경기도',      city: '가평군',  group: '서울근교' },
  { id:  2, name: '화악산',        lat: 37.9517, lng: 127.5422, province: '경기도',      city: '가평군',  group: '서울근교' },
  { id:  3, name: '유명산',        lat: 37.7667, lng: 127.5408, province: '경기도',      city: '가평군',  group: '서울근교' },
  { id:  4, name: '연인산',        lat: 37.8208, lng: 127.5083, province: '경기도',      city: '가평군',  group: '서울근교' },
  { id:  5, name: '칼봉산',        lat: 37.7717, lng: 127.4428, province: '경기도',      city: '가평군',  group: '서울근교' },
  { id:  6, name: '석룡산',        lat: 37.8578, lng: 127.5225, province: '경기도',      city: '가평군',  group: '서울근교' },
  { id:  7, name: '불기산',        lat: 37.8028, lng: 127.6189, province: '경기도',      city: '가평군',  group: '서울근교' },
  { id:  8, name: '용문산',        lat: 37.5494, lng: 127.6297, province: '경기도',      city: '양평군',  group: '서울근교' },
  { id:  9, name: '주금산',        lat: 37.5994, lng: 127.5239, province: '경기도',      city: '양평군',  group: '서울근교' },
  { id: 10, name: '도일봉',        lat: 37.5286, lng: 127.6869, province: '경기도',      city: '양평군',  group: '서울근교' },
  { id: 11, name: '수종사',        lat: 37.5972, lng: 127.3394, province: '경기도',      city: '남양주시', group: '서울근교' },
  { id: 12, name: '천마산',        lat: 37.5983, lng: 127.3322, province: '경기도',      city: '남양주시', group: '서울근교' },
  { id: 13, name: '축령산',        lat: 37.6628, lng: 127.3597, province: '경기도',      city: '남양주시', group: '서울근교' },
  { id: 14, name: '예봉산',        lat: 37.5589, lng: 127.3111, province: '경기도',      city: '남양주시', group: '서울근교' },
  { id: 15, name: '운길산',        lat: 37.5953, lng: 127.3533, province: '경기도',      city: '남양주시', group: '서울근교' },
  { id: 16, name: '소요산',        lat: 37.9208, lng: 127.0806, province: '경기도',      city: '동두천시', group: '서울근교' },
  { id: 17, name: '운악산',        lat: 37.8858, lng: 127.2658, province: '경기도',      city: '포천시',  group: '서울근교' },
  { id: 18, name: '광덕산',        lat: 38.0058, lng: 127.3458, province: '경기도',      city: '포천시',  group: '서울근교' },
  { id: 19, name: '감악산',        lat: 37.9328, lng: 126.9194, province: '경기도',      city: '파주시',  group: '서울근교' },
  { id: 20, name: '남한산성',      lat: 37.4783, lng: 127.1775, province: '경기도',      city: '광주시',  group: '서울근교' },
  { id: 21, name: '청계산',        lat: 37.4192, lng: 127.0272, province: '경기도',      city: '성남시',  group: '서울근교' },
  { id: 22, name: '마니산',        lat: 37.6572, lng: 126.4206, province: '인천광역시',  city: '강화군',  group: '서울근교' },
  { id: 23, name: '북한산 백운대', lat: 37.6600, lng: 126.9769, province: '서울특별시',  city: '종로구',  group: '서울근교' },
  { id: 24, name: '도봉산',        lat: 37.7150, lng: 127.0214, province: '서울특별시',  city: '도봉구',  group: '서울근교' },
  { id: 25, name: '관악산',        lat: 37.4444, lng: 126.9644, province: '서울특별시',  city: '관악구',  group: '서울근교' },

  // ── 전국 운해 명소 25곳 ──
  { id: 26, name: '지리산 천왕봉', lat: 35.3375, lng: 127.7306, province: '경상남도',    city: '산청군',  group: '전국명소' },
  { id: 27, name: '설악산 대청봉', lat: 38.1200, lng: 128.4650, province: '강원도',      city: '속초시',  group: '전국명소' },
  { id: 28, name: '한라산 백록담', lat: 33.3617, lng: 126.5292, province: '제주도',      city: '제주시',  group: '전국명소' },
  { id: 29, name: '덕유산 향적봉', lat: 35.8717, lng: 127.7297, province: '전라북도',    city: '무주군',  group: '전국명소' },
  { id: 30, name: '가야산 상왕봉', lat: 35.8169, lng: 128.1097, province: '경상남도',    city: '합천군',  group: '전국명소' },
  { id: 31, name: '소백산 비로봉', lat: 36.9625, lng: 128.4869, province: '충청북도',    city: '단양군',  group: '전국명소' },
  { id: 32, name: '태백산 천제단', lat: 37.0958, lng: 128.9175, province: '강원도',      city: '태백시',  group: '전국명소' },
  { id: 33, name: '오대산 비로봉', lat: 37.7958, lng: 128.5428, province: '강원도',      city: '평창군',  group: '전국명소' },
  { id: 34, name: '발왕산',        lat: 37.6500, lng: 128.6667, province: '강원도',      city: '평창군',  group: '전국명소' },
  { id: 35, name: '치악산 비로봉', lat: 37.3564, lng: 128.0928, province: '강원도',      city: '원주시',  group: '전국명소' },
  { id: 36, name: '황매산',        lat: 35.4967, lng: 128.0178, province: '경상남도',    city: '합천군',  group: '전국명소' },
  { id: 37, name: '신불산',        lat: 35.5472, lng: 129.0547, province: '경상남도',    city: '울주군',  group: '전국명소' },
  { id: 38, name: '팔공산',        lat: 35.9897, lng: 128.6922, province: '대구광역시',  city: '동구',    group: '전국명소' },
  { id: 39, name: '주왕산',        lat: 36.3936, lng: 129.1553, province: '경상북도',    city: '청송군',  group: '전국명소' },
  { id: 40, name: '속리산 천왕봉', lat: 36.5433, lng: 127.8656, province: '충청북도',    city: '보은군',  group: '전국명소' },
  { id: 41, name: '월악산 영봉',   lat: 36.8636, lng: 128.0769, province: '충청북도',    city: '제천시',  group: '전국명소' },
  { id: 42, name: '민주지산',      lat: 36.0397, lng: 127.8764, province: '충청북도',    city: '영동군',  group: '전국명소' },
  { id: 43, name: '계룡산 천황봉', lat: 36.3472, lng: 127.2081, province: '충청남도',    city: '공주시',  group: '전국명소' },
  { id: 44, name: '내장산',        lat: 35.4667, lng: 126.8833, province: '전라북도',    city: '정읍시',  group: '전국명소' },
  { id: 45, name: '운장산',        lat: 35.8597, lng: 127.3544, province: '전라북도',    city: '진안군',  group: '전국명소' },
  { id: 46, name: '모악산',        lat: 35.7203, lng: 127.0803, province: '전라북도',    city: '완주군',  group: '전국명소' },
  { id: 47, name: '조계산',        lat: 34.9583, lng: 127.2694, province: '전라남도',    city: '순천시',  group: '전국명소' },
  { id: 48, name: '두륜산',        lat: 34.4697, lng: 126.6039, province: '전라남도',    city: '해남군',  group: '전국명소' },
  { id: 49, name: '추월산',        lat: 35.3167, lng: 127.0167, province: '전라남도',    city: '담양군',  group: '전국명소' },
  { id: 50, name: '무등산',        lat: 35.1258, lng: 126.9889, province: '광주광역시',  city: '북구',    group: '전국명소' },
];

// ── 상태 ─────────────────────────────────────────────────────
let locations  = loadLocations();
let weatherMap = {};
let resultMap  = {};
let editMode   = false;
let map        = null;
let mapMarkers = {};
let nextId     = Math.max(0, ...locations.map(l => l.id)) + 1;

// 필터 상태
let selectedProvinces = new Set();
let selectedCities    = new Set(); // "province||city" 형태

// ── LocalStorage ─────────────────────────────────────────────
function loadLocations() {
  try {
    const raw = localStorage.getItem('css_locations');
    if (raw) {
      const saved = JSON.parse(raw);
      // 저장된 데이터에 province/city 없으면 기본값으로 교체
      if (saved.length && !saved[0].province) return DEFAULT_LOCATIONS.map(l => ({ ...l }));
      return saved;
    }
  } catch {}
  return DEFAULT_LOCATIONS.map(l => ({ ...l }));
}
function saveLocations() {
  localStorage.setItem('css_locations', JSON.stringify(locations));
}

function loadFilters() {
  try {
    const raw = localStorage.getItem('css_filters');
    if (raw) {
      const f = JSON.parse(raw);
      selectedProvinces = new Set(f.provinces || []);
      selectedCities    = new Set(f.cities    || []);
    }
  } catch {}
}
function saveFilters() {
  localStorage.setItem('css_filters', JSON.stringify({
    provinces: [...selectedProvinces],
    cities:    [...selectedCities],
  }));
}

// ── Weather API (Open-Meteo) ──────────────────────────────────
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
  });

  await Promise.allSettled(tasks);

  btn.disabled = false;
  btn.textContent = '🔄 날씨 업데이트';
  renderList();
  locations.forEach(loc => updateMapMarker(loc.id));
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

// ── 필터 렌더링 ───────────────────────────────────────────────
function getProvinces() {
  return [...new Set(locations.map(l => l.province || '기타'))].sort();
}

function getCitiesForProvinces(provinces) {
  if (!provinces.size) return [];
  return [...new Set(
    locations
      .filter(l => provinces.has(l.province))
      .map(l => `${l.province}||${l.city}`)
  )].sort((a, b) => a.split('||')[1].localeCompare(b.split('||')[1], 'ko'));
}

function renderFilters() {
  const container = document.getElementById('filterArea');
  const provinces = getProvinces();

  const provinceChips = provinces.map(p => {
    const active = selectedProvinces.has(p);
    return `<button class="filter-chip ${active ? 'active' : ''}" data-type="province" data-value="${esc(p)}">${esc(p)}</button>`;
  }).join('');

  let cityChipsHTML = '';
  if (selectedProvinces.size) {
    const cities = getCitiesForProvinces(selectedProvinces);
    cityChipsHTML = `
      <div class="filter-row filter-cities">
        <span class="filter-label">시·군·구</span>
        ${cities.map(key => {
          const city = key.split('||')[1];
          const active = selectedCities.has(key);
          return `<button class="filter-chip city-chip ${active ? 'active' : ''}" data-type="city" data-value="${esc(key)}">${esc(city)}</button>`;
        }).join('')}
      </div>`;
  }

  container.innerHTML = `
    <div class="filter-row">
      <span class="filter-label">도·광역시</span>
      ${provinceChips}
      ${selectedProvinces.size || selectedCities.size
        ? `<button class="filter-reset" id="filterResetBtn">전체 보기</button>` : ''}
    </div>
    ${cityChipsHTML}`;

  // 이벤트 바인딩
  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const { type, value } = chip.dataset;
      if (type === 'province') {
        if (selectedProvinces.has(value)) {
          selectedProvinces.delete(value);
          // 해당 도의 도시 선택 해제
          [...selectedCities].forEach(c => { if (c.startsWith(value + '||')) selectedCities.delete(c); });
        } else {
          selectedProvinces.add(value);
        }
      } else if (type === 'city') {
        if (selectedCities.has(value)) selectedCities.delete(value);
        else selectedCities.add(value);
      }
      saveFilters();
      renderFilters();
      renderList();
    });
  });

  const resetBtn = document.getElementById('filterResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selectedProvinces.clear();
      selectedCities.clear();
      saveFilters();
      renderFilters();
      renderList();
    });
  }
}

// ── 필터 적용 ─────────────────────────────────────────────────
function getFilteredSortedLocations() {
  let list = [...locations];

  // 필터 적용
  if (selectedProvinces.size) {
    list = list.filter(loc => {
      if (!selectedProvinces.has(loc.province)) return false;
      if (!selectedCities.size) return true;
      // 선택된 도에 속한 도시 필터가 있을 때
      const provCities = [...selectedCities].filter(c => c.startsWith(loc.province + '||'));
      if (!provCities.length) return true; // 이 도의 도시 선택 없으면 도 전체 표시
      return selectedCities.has(`${loc.province}||${loc.city}`);
    });
  }

  // 확률 내림차순 정렬 (데이터 없으면 뒤로)
  list.sort((a, b) => {
    const pa = resultMap[a.id]?.probability ?? -1;
    const pb = resultMap[b.id]?.probability ?? -1;
    return pb - pa;
  });

  return list;
}

// ── 목록 렌더링 ────────────────────────────────────────────────
function renderList() {
  const grid = document.getElementById('locationList');
  grid.innerHTML = '';
  if (editMode) grid.classList.add('edit-mode');
  else          grid.classList.remove('edit-mode');

  const list = getFilteredSortedLocations();

  if (!list.length) {
    grid.innerHTML = `<div class="no-result">선택한 지역에 해당하는 지점이 없습니다.</div>`;
    return;
  }

  list.forEach((loc, idx) => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.id = `card-${loc.id}`;
    card.innerHTML = buildCardHTML(loc, idx + 1);
    card.querySelector('.card-body-click').addEventListener('click', () => openDetail(loc.id));
    const editBtn   = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    if (editBtn)   editBtn.addEventListener('click', e => { e.stopPropagation(); openEditModal(loc.id); });
    if (deleteBtn) deleteBtn.addEventListener('click', e => { e.stopPropagation(); deleteLocation(loc.id); });
    if (editMode) card.classList.add('edit-mode');
    grid.appendChild(card);
  });
}

function buildCardHTML(loc, rank) {
  const w = weatherMap[loc.id];
  const r = resultMap[loc.id];
  const province = loc.province || '';
  const city     = loc.city     || '';

  const regionBadge = province
    ? `<span class="region-badge">${esc(province)} ${esc(city)}</span>`
    : '';
  const rankBadge = rank
    ? `<span class="rank-badge">#${rank}</span>`
    : '';

  if (!w || !r) {
    return `
      <div class="card-body-click">
        <div class="card-header">
          <div>
            <div class="card-name-row">${rankBadge}<span class="card-name">${esc(loc.name)}</span></div>
            ${regionBadge}
            <div class="card-coords">${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E</div>
          </div>
          <div class="probability-ring ring-very-low">${ringHTML(0)}</div>
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
          <div class="card-name-row">${rankBadge}<span class="card-name">${esc(loc.name)}</span></div>
          ${regionBadge}
          <div class="card-coords">${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E</div>
          <span class="card-grade grade-${grade.cls}">${grade.label}</span>
        </div>
        <div class="probability-ring ring-${grade.cls}">${ringHTML(r.probability)}</div>
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
    const province = prompt('도·광역시를 입력하세요:') || '';
    const city     = prompt('시·군·구를 입력하세요:') || '';
    addLocation(name, e.latlng.lat, e.latlng.lng, province, city);
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
  const region = loc.province ? `${loc.province} ${loc.city}` : '';
  return `
    <div class="popup-title">${esc(loc.name)}</div>
    ${region ? `<div style="font-size:0.78rem;color:#8b949e;margin-bottom:4px">${esc(region)}</div>` : ''}
    <div class="popup-prob prob-${grade.cls}">${prob}%</div>
    <div style="font-size:0.82rem;color:#8b949e">${grade.label}</div>
    <button class="popup-detail-btn" data-id="${loc.id}">상세 보기</button>`;
}

function updateMapMarker(id) {
  if (!map) return;
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  if (mapMarkers[id]) { mapMarkers[id].remove(); delete mapMarkers[id]; }
  addMapMarker(loc);
}

function removeMapMarker(id) {
  if (mapMarkers[id]) { mapMarkers[id].remove(); delete mapMarkers[id]; }
}

// ── 지점 CRUD ─────────────────────────────────────────────────
function addLocation(name, lat, lng, province = '', city = '') {
  const loc = { id: nextId++, name: name.trim(), lat, lng, province, city, group: '사용자' };
  locations.push(loc);
  saveLocations();
  addMapMarker(loc);

  fetchWeather(lat, lng).then(w => {
    weatherMap[loc.id] = w;
    resultMap[loc.id]  = calcFogProbability(w);
    renderList();
    renderFilters();
    updateMapMarker(loc.id);
  }).catch(() => {
    renderList();
    renderFilters();
  });

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
  removeMapMarker(id);
  renderList();
  renderFilters();
  showToast(`'${loc.name}' 삭제되었습니다.`);
}

function openEditModal(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">지점 편집</div>
    <div class="edit-form">
      <input id="editName"     type="text"   value="${esc(loc.name)}"     placeholder="지점 이름" />
      <div class="coord-row">
        <input id="editLat"    type="number" step="0.0001" value="${loc.lat}" placeholder="위도" />
        <input id="editLng"    type="number" step="0.0001" value="${loc.lng}" placeholder="경도" />
      </div>
      <input id="editProvince" type="text"   value="${esc(loc.province || '')}" placeholder="도·광역시" />
      <input id="editCity"     type="text"   value="${esc(loc.city     || '')}" placeholder="시·군·구" />
      <div class="edit-form-btns">
        <button class="btn-cancel" id="editCancelBtn">취소</button>
        <button class="btn-primary btn-save" id="editSaveBtn">저장</button>
      </div>
    </div>`;

  document.getElementById('detailModal').classList.remove('hidden');

  document.getElementById('editCancelBtn').addEventListener('click', closeModal);
  document.getElementById('editSaveBtn').addEventListener('click', () => {
    const name     = document.getElementById('editName').value.trim();
    const lat      = parseFloat(document.getElementById('editLat').value);
    const lng      = parseFloat(document.getElementById('editLng').value);
    const province = document.getElementById('editProvince').value.trim();
    const city     = document.getElementById('editCity').value.trim();
    if (!name || isNaN(lat) || isNaN(lng)) { showToast('입력값을 확인해 주세요.'); return; }
    Object.assign(loc, { name, lat, lng, province, city });
    saveLocations();
    fetchWeather(lat, lng).then(w => {
      weatherMap[id] = w;
      resultMap[id]  = calcFogProbability(w);
      renderList();
      renderFilters();
      updateMapMarker(id);
    }).catch(() => { renderList(); renderFilters(); });
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
  const region = loc.province ? `${loc.province} ${loc.city}` : '';

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
    <div class="modal-coords">
      ${region ? `<span class="region-badge" style="margin-right:8px">${esc(region)}</span>` : ''}
      ${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E
    </div>
    <div class="modal-big-prob prob-${grade.cls}">${r.probability}%</div>
    <div class="modal-grade grade-${grade.cls}" style="display:inline-block;padding:4px 14px;border-radius:12px;margin-bottom:16px">${grade.label}</div>
    <div class="score-list">${scoreItems}</div>
    <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;font-size:0.82rem;color:var(--text-muted)">
      <strong style="color:var(--text)">총 점수:</strong> ${r.totalScore} / 100점 →
      운해 발생 가능성 <strong style="color:var(--text)">${r.probability}%</strong>
      <br><br>
      <em>점수 = 상대 습도(30) + 이슬점 근접도(25) + 풍속(20) + 야간 복사 냉각(15) + 일교차(5) + 계절 보정(5)</em>
    </div>
    <div class="modal-updated">데이터 기준: ${w.fetchedAt}</div>`;

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

// ── 편집 패널 지점 추가 ───────────────────────────────────────
function bindAddLocationBtn() {
  document.getElementById('addLocationBtn').addEventListener('click', () => {
    const name     = document.getElementById('newName').value.trim();
    const lat      = parseFloat(document.getElementById('newLat').value);
    const lng      = parseFloat(document.getElementById('newLng').value);
    const province = document.getElementById('newProvince').value.trim();
    const city     = document.getElementById('newCity').value.trim();
    if (!name) { showToast('지점 이름을 입력해 주세요.'); return; }
    if (isNaN(lat) || isNaN(lng)) { showToast('위도/경도를 올바르게 입력해 주세요.'); return; }
    if (lat < -90 || lat > 90)   { showToast('위도는 -90 ~ 90 범위여야 합니다.'); return; }
    if (lng < -180 || lng > 180) { showToast('경도는 -180 ~ 180 범위여야 합니다.'); return; }
    addLocation(name, lat, lng, province, city);
    ['newName','newLat','newLng','newProvince','newCity'].forEach(id => {
      document.getElementById(id).value = '';
    });
  });
}

// ── 초기화 ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFilters();
  renderFilters();
  renderList();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.getElementById('editModeBtn').addEventListener('click', toggleEditMode);
  bindAddLocationBtn();

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('detailModal').addEventListener('click', e => {
    if (e.target === document.getElementById('detailModal')) closeModal();
  });

  document.getElementById('refreshBtn').addEventListener('click', fetchAllWeather);

  fetchAllWeather();
});
