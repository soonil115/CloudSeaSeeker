/* app.js — CloudSeaSeeker 메인 애플리케이션 */

// ── 지도 링크 헬퍼 ────────────────────────────────────────────
function mapLinksHTML(loc) {
  const { lat, lng, name } = loc;
  const q   = encodeURIComponent(name);
  const nav  = `https://map.naver.com/v5/search/${q}?c=${lng},${lat},15,0,0,0,dh`;
  const kak  = `https://map.kakao.com/link/map/${q},${lat},${lng}`;
  const goo  = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
  return `<span class="map-links">` +
    `<a class="map-link map-naver" href="${nav}" target="_blank" rel="noopener" title="네이버 지도">N</a>` +
    `<a class="map-link map-kakao" href="${kak}" target="_blank" rel="noopener" title="카카오맵">K</a>` +
    `<a class="map-link map-google" href="${goo}" target="_blank" rel="noopener" title="구글 지도">G</a>` +
  `</span>`;
}

const DEFAULT_LOCATIONS = [
  // ── 서울 근교 운해 명소 25곳 ──
  { id:  1, name: '명지산',        lat: 37.9281, lng: 127.5058, province: '경기도',     city: '가평군',   group: '서울근교' },
  { id:  2, name: '화악산',        lat: 37.9514, lng: 127.5433, province: '경기도',     city: '가평군',   group: '서울근교' },
  { id:  3, name: '유명산',        lat: 37.7669, lng: 127.5411, province: '경기도',     city: '가평군',   group: '서울근교' },
  { id:  4, name: '연인산',        lat: 37.8211, lng: 127.5081, province: '경기도',     city: '가평군',   group: '서울근교' },
  { id:  5, name: '칼봉산',        lat: 37.7719, lng: 127.4431, province: '경기도',     city: '가평군',   group: '서울근교' },
  { id:  6, name: '석룡산',        lat: 37.8581, lng: 127.5228, province: '경기도',     city: '가평군',   group: '서울근교' },
  { id:  7, name: '불기산',        lat: 37.8031, lng: 127.6192, province: '경기도',     city: '가평군',   group: '서울근교' },
  { id:  8, name: '용문산',        lat: 37.5497, lng: 127.6300, province: '경기도',     city: '양평군',   group: '서울근교' },
  { id:  9, name: '주금산',        lat: 37.5997, lng: 127.5242, province: '경기도',     city: '양평군',   group: '서울근교' },
  { id: 10, name: '도일봉',        lat: 37.5289, lng: 127.6872, province: '경기도',     city: '양평군',   group: '서울근교' },
  { id: 11, name: '운길산',        lat: 37.5956, lng: 127.3536, province: '경기도',     city: '남양주시', group: '서울근교' },
  { id: 12, name: '천마산',        lat: 37.5986, lng: 127.3325, province: '경기도',     city: '남양주시', group: '서울근교' },
  { id: 13, name: '축령산',        lat: 37.6631, lng: 127.3600, province: '경기도',     city: '남양주시', group: '서울근교' },
  { id: 14, name: '예봉산',        lat: 37.5592, lng: 127.3114, province: '경기도',     city: '남양주시', group: '서울근교' },
  { id: 15, name: '수종사 뷰포인트', lat: 37.5975, lng: 127.3397, province: '경기도',   city: '남양주시', group: '서울근교' },
  { id: 16, name: '소요산',        lat: 37.9211, lng: 127.0809, province: '경기도',     city: '동두천시', group: '서울근교' },
  { id: 17, name: '운악산',        lat: 37.8861, lng: 127.2661, province: '경기도',     city: '포천시',   group: '서울근교' },
  { id: 18, name: '광덕산',        lat: 38.0061, lng: 127.3461, province: '경기도',     city: '포천시',   group: '서울근교' },
  { id: 19, name: '감악산',        lat: 37.9331, lng: 126.9197, province: '경기도',     city: '파주시',   group: '서울근교' },
  { id: 20, name: '남한산성 수어장대', lat: 37.4786, lng: 127.1778, province: '경기도', city: '광주시',   group: '서울근교' },
  { id: 21, name: '청계산 옥녀봉', lat: 37.4194, lng: 127.0275, province: '경기도',     city: '성남시',   group: '서울근교' },
  { id: 22, name: '마니산',        lat: 37.6575, lng: 126.4208, province: '인천광역시', city: '강화군',   group: '서울근교' },
  { id: 23, name: '북한산 백운대', lat: 37.6597, lng: 126.9772, province: '서울특별시', city: '종로구',   group: '서울근교' },
  { id: 24, name: '도봉산 자운봉', lat: 37.7153, lng: 127.0217, province: '서울특별시', city: '도봉구',   group: '서울근교' },
  { id: 25, name: '관악산',        lat: 37.4447, lng: 126.9647, province: '서울특별시', city: '관악구',   group: '서울근교' },

  // ── 전국 운해 명소 25곳 ──
  { id: 26, name: '지리산 천왕봉', lat: 35.3367, lng: 127.7303, province: '경상남도',   city: '산청군',   group: '전국명소' },
  { id: 27, name: '설악산 대청봉', lat: 38.1194, lng: 128.4658, province: '강원도',     city: '속초시',   group: '전국명소' },
  { id: 28, name: '한라산 백록담', lat: 33.3622, lng: 126.5292, province: '제주도',     city: '제주시',   group: '전국명소' },
  { id: 29, name: '덕유산 향적봉', lat: 35.8719, lng: 127.7300, province: '전라북도',   city: '무주군',   group: '전국명소' },
  { id: 30, name: '가야산 상왕봉', lat: 35.8172, lng: 128.1100, province: '경상남도',   city: '합천군',   group: '전국명소' },
  { id: 31, name: '소백산 비로봉', lat: 36.9628, lng: 128.4872, province: '충청북도',   city: '단양군',   group: '전국명소' },
  { id: 32, name: '태백산 천제단', lat: 37.0961, lng: 128.9178, province: '강원도',     city: '태백시',   group: '전국명소' },
  { id: 33, name: '오대산 비로봉', lat: 37.7961, lng: 128.5431, province: '강원도',     city: '평창군',   group: '전국명소' },
  { id: 34, name: '발왕산',        lat: 37.6503, lng: 128.6669, province: '강원도',     city: '평창군',   group: '전국명소' },
  { id: 35, name: '치악산 비로봉', lat: 37.3567, lng: 128.0931, province: '강원도',     city: '원주시',   group: '전국명소' },
  { id: 36, name: '황매산',        lat: 35.4969, lng: 128.0181, province: '경상남도',   city: '합천군',   group: '전국명소' },
  { id: 37, name: '신불산',        lat: 35.5475, lng: 129.0550, province: '경상남도',   city: '울주군',   group: '전국명소' },
  { id: 38, name: '팔공산 비로봉', lat: 35.9900, lng: 128.6925, province: '대구광역시', city: '동구',     group: '전국명소' },
  { id: 39, name: '주왕산 주봉',   lat: 36.3939, lng: 129.1556, province: '경상북도',   city: '청송군',   group: '전국명소' },
  { id: 40, name: '속리산 천왕봉', lat: 36.5436, lng: 127.8659, province: '충청북도',   city: '보은군',   group: '전국명소' },
  { id: 41, name: '월악산 영봉',   lat: 36.8639, lng: 128.0772, province: '충청북도',   city: '제천시',   group: '전국명소' },
  { id: 42, name: '민주지산',      lat: 36.0400, lng: 127.8767, province: '충청북도',   city: '영동군',   group: '전국명소' },
  { id: 43, name: '계룡산 천황봉', lat: 36.3475, lng: 127.2083, province: '충청남도',   city: '공주시',   group: '전국명소' },
  { id: 44, name: '내장산 신선봉', lat: 35.4669, lng: 126.8836, province: '전라북도',   city: '정읍시',   group: '전국명소' },
  { id: 45, name: '운장산',        lat: 35.8600, lng: 127.3547, province: '전라북도',   city: '진안군',   group: '전국명소' },
  { id: 46, name: '모악산',        lat: 35.7206, lng: 127.0806, province: '전라북도',   city: '완주군',   group: '전국명소' },
  { id: 47, name: '조계산 장군봉', lat: 34.9586, lng: 127.2697, province: '전라남도',   city: '순천시',   group: '전국명소' },
  { id: 48, name: '두륜산 가련봉', lat: 34.4700, lng: 126.6042, province: '전라남도',   city: '해남군',   group: '전국명소' },
  { id: 49, name: '추월산',        lat: 35.3169, lng: 127.0169, province: '전라남도',   city: '담양군',   group: '전국명소' },
  { id: 50, name: '무등산 천왕봉', lat: 35.1261, lng: 126.9892, province: '광주광역시', city: '북구',     group: '전국명소' },
];

// ── 상태 ─────────────────────────────────────────────────────
let locations  = loadLocations();
let weatherMap = { today: {}, tomorrow: {} }; // day → id → weather
let resultMap  = { today: {}, tomorrow: {} }; // day → id → result
let editMode   = false;
let map        = null;
let mapMarkers = {};
let nextId     = Math.max(0, ...locations.map(l => l.id)) + 1;

// 오늘/내일 토글 (기본: 내일)
let activeDay = loadDaySetting();

// 필터 상태
let selectedProvinces = new Set();
let selectedCities    = new Set();

// ── LocalStorage ─────────────────────────────────────────────
function loadLocations() {
  try {
    const raw = localStorage.getItem('css_locations');
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.length && !saved[0].province) return DEFAULT_LOCATIONS.map(l => ({ ...l }));
      return saved;
    }
  } catch {}
  return DEFAULT_LOCATIONS.map(l => ({ ...l }));
}
function saveLocations() {
  localStorage.setItem('css_locations', JSON.stringify(locations));
}

function loadDaySetting() {
  return localStorage.getItem('css_activeDay') || 'tomorrow';
}
function saveDaySetting() {
  localStorage.setItem('css_activeDay', activeDay);
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

// ── WMO 날씨 코드 → 아이콘·라벨 ─────────────────────────────
function weatherIcon(code) {
  if (code == null)  return { icon: '—',  label: '—' };
  if (code === 0)    return { icon: '☀️', label: '맑음' };
  if (code <= 2)     return { icon: '🌤️', label: '구름조금' };
  if (code === 3)    return { icon: '☁️', label: '흐림' };
  if (code <= 48)    return { icon: '🌫️', label: '안개' };
  if (code <= 55)    return { icon: '🌦️', label: '이슬비' };
  if (code <= 65)    return { icon: '🌧️', label: '비' };
  if (code <= 77)    return { icon: '🌨️', label: '눈' };
  if (code <= 82)    return { icon: '🌧️', label: '소나기' };
  if (code <= 94)    return { icon: '🌧️', label: '비' };
  return                  { icon: '⛈️', label: '천둥번개' };
}

// ── Weather API (Open-Meteo 시간별) ──────────────────────────
async function fetchWeather(lat, lng) {
  const base =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&wind_speed_unit=ms&timezone=Asia%2FSeoul&forecast_days=2`;

  const coreParams =
    `&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,wind_speed_10m,cloud_cover` +
    `&daily=temperature_2m_max,temperature_2m_min,sunrise`;

  const fullParams =
    `&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,wind_speed_10m,cloud_cover,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,sunrise`;

  async function doFetch(url, timeoutMs) {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      return { data: await res.json(), timedOut: false };
    } catch (e) {
      clearTimeout(timer);
      if (e.name === 'AbortError') return { data: null, timedOut: true };
      throw e;
    }
  }

  // 2초 안에 전체 데이터(weather_code 포함) 시도
  let { data, timedOut } = await doFetch(base + fullParams, 2000);
  const hasWeatherCode = !timedOut;

  // 타임아웃이면 weather_code 없이 재시도 (안개 확률 계산용 최소 데이터)
  if (timedOut) {
    const retry = await doFetch(base + coreParams, 8000);
    data = retry.data;
    if (!data) throw new Error('fetch failed');
  }

  const avg = (arr, idxs) => idxs.reduce((s, i) => s + (arr[i] ?? 0), 0) / idxs.length;
  const todayIdx    = [5, 6, 7];
  const tomorrowIdx = [29, 30, 31];
  const h = data.hourly;
  const d = data.daily;
  const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  function sunriseWindow(sunriseStr, dayOffset) {
    const timePart = (sunriseStr || '').split('T')[1] || '06:00';
    const [srHStr, srMStr] = timePart.split(':');
    const srHour   = parseInt(srHStr, 10) || 6;
    const srMinute = parseInt(srMStr, 10) || 0;
    const startH   = srHour - 1;
    const slots    = [];
    for (let i = 0; i < 6; i++) {
      const hVal = startH + i;
      const idx  = dayOffset * 24 + hVal;
      slots.push({
        time:      `${String(hVal).padStart(2,'0')}:00`,
        temp:      h.temperature_2m[idx],
        code:      hasWeatherCode ? h.weather_code[idx] : null,
        isSunrise: i === 1,
      });
    }
    return {
      time:  `${String(srHour).padStart(2,'0')}:${String(srMinute).padStart(2,'0')}`,
      slots: hasWeatherCode ? slots : null, // 타임아웃이면 슬롯 null
    };
  }

  return {
    today: {
      temperature:      avg(h.temperature_2m,      todayIdx),
      relativeHumidity: avg(h.relative_humidity_2m, todayIdx),
      dewpoint:         avg(h.dew_point_2m,         todayIdx),
      windSpeed:        avg(h.wind_speed_10m,        todayIdx),
      cloudCover:       avg(h.cloud_cover,           todayIdx),
      tempMax:          d.temperature_2m_max[0],
      tempMin:          d.temperature_2m_min[0],
      sunrise:          sunriseWindow(d.sunrise[0], 0),
      fetchedAt:        `오늘 새벽 05–07시 예보 (조회: ${now})`,
    },
    tomorrow: {
      temperature:      avg(h.temperature_2m,      tomorrowIdx),
      relativeHumidity: avg(h.relative_humidity_2m, tomorrowIdx),
      dewpoint:         avg(h.dew_point_2m,         tomorrowIdx),
      windSpeed:        avg(h.wind_speed_10m,        tomorrowIdx),
      cloudCover:       avg(h.cloud_cover,           tomorrowIdx),
      tempMax:          d.temperature_2m_max[1],
      tempMin:          d.temperature_2m_min[1],
      sunrise:          sunriseWindow(d.sunrise[1], 1),
      fetchedAt:        `내일 새벽 05–07시 예보 (조회: ${now})`,
    },
  };
}

async function fetchAllWeather() {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.textContent = '불러오는 중…';

  const tasks = locations.map(async loc => {
    try {
      const both = await fetchWeather(loc.lat, loc.lng);
      weatherMap.today[loc.id]    = both.today;
      weatherMap.tomorrow[loc.id] = both.tomorrow;
      resultMap.today[loc.id]     = calcFogProbability(both.today);
      resultMap.tomorrow[loc.id]  = calcFogProbability(both.tomorrow);
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

// 현재 활성 day 기준 결과 반환
function getWeather(id) { return weatherMap[activeDay][id]; }
function getResult(id)  { return resultMap[activeDay][id]; }

// ── 뷰 전환 ──────────────────────────────────────────────────
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  document.querySelector(`[data-view="${name}"]`).classList.add('active');

  if (name === 'map' && !map) initMap();
  if (name === 'map' && map)  setTimeout(() => map.invalidateSize(), 50);
}

// ── 오늘/내일 토글 ────────────────────────────────────────────
function renderDayToggle() {
  const toggle = document.getElementById('dayToggle');
  toggle.innerHTML = `
    <button class="day-btn ${activeDay === 'today'    ? 'active' : ''}" data-day="today">오늘 새벽</button>
    <button class="day-btn ${activeDay === 'tomorrow' ? 'active' : ''}" data-day="tomorrow">내일 새벽</button>`;

  toggle.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeDay = btn.dataset.day;
      saveDaySetting();
      renderDayToggle();
      renderList();
      locations.forEach(loc => updateMapMarker(loc.id));
    });
  });
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

  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const { type, value } = chip.dataset;
      if (type === 'province') {
        if (selectedProvinces.has(value)) {
          selectedProvinces.delete(value);
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

// ── 필터 적용 + 정렬 ─────────────────────────────────────────
function getFilteredSortedLocations() {
  let list = [...locations];

  if (selectedProvinces.size) {
    list = list.filter(loc => {
      if (!selectedProvinces.has(loc.province)) return false;
      if (!selectedCities.size) return true;
      const provCities = [...selectedCities].filter(c => c.startsWith(loc.province + '||'));
      if (!provCities.length) return true;
      return selectedCities.has(`${loc.province}||${loc.city}`);
    });
  }

  list.sort((a, b) => {
    const pa = getResult(a.id)?.probability ?? -1;
    const pb = getResult(b.id)?.probability ?? -1;
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
  const w = getWeather(loc.id);
  const r = getResult(loc.id);
  const regionBadge = loc.province
    ? `<span class="region-badge">${esc(loc.province)} ${esc(loc.city)}</span>`
    : '';
  const rankBadge = rank ? `<span class="rank-badge">#${rank}</span>` : '';

  if (!w || !r) {
    return `
      <div class="card-body-click">
        <div class="card-header">
          <div>
            <div class="card-name-row">${rankBadge}<span class="card-name">${esc(loc.name)}</span>${mapLinksHTML(loc)}</div>
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

  // 일출 타임라인 HTML (weather_code 2초 타임아웃 시 slots=null → 미표시)
  const sr = w.sunrise;
  const timelineHTML = (sr && sr.slots) ? (() => {
    const slots = sr.slots.map(s => {
      const wi = weatherIcon(s.code);
      const tempStr = s.temp != null ? `${s.temp.toFixed(0)}°` : '—';
      return `
        <div class="hour-slot${s.isSunrise ? ' is-sunrise' : ''}">
          <span class="hs-time">${s.isSunrise ? '🌅' : ''}${s.time}</span>
          <span class="hs-icon">${wi.icon}</span>
          <span class="hs-temp">${tempStr}</span>
        </div>`;
    }).join('');
    return `
      <div class="sunrise-section">
        <div class="sunrise-header">일출 <strong>${sr.time}</strong></div>
        <div class="hourly-timeline">${slots}</div>
      </div>`;
  })() : (sr ? `<div class="sunrise-section"><div class="sunrise-header">일출 <strong>${sr.time}</strong></div></div>` : '');

  return `
    <div class="card-body-click">
      <div class="card-header">
        <div>
          <div class="card-name-row">${rankBadge}<span class="card-name">${esc(loc.name)}</span>${mapLinksHTML(loc)}</div>
          ${regionBadge}
          <div class="card-coords">${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E</div>
          <span class="card-grade grade-${grade.cls}">${grade.label}</span>
        </div>
        <div class="probability-ring ring-${grade.cls}">${ringHTML(r.probability)}</div>
      </div>
      ${timelineHTML}
      <div class="card-weather">
        <span class="weather-chip">💧 ${w.relativeHumidity.toFixed(0)}%</span>
        <span class="weather-chip">💨 ${w.windSpeed.toFixed(1)} m/s</span>
        <span class="weather-chip">🌙 운량 ${w.cloudCover.toFixed(0)}%</span>
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
    const name     = prompt('새 지점 이름을 입력하세요:');
    if (!name) return;
    const province = prompt('도·광역시를 입력하세요:') || '';
    const city     = prompt('시·군·구를 입력하세요:')   || '';
    addLocation(name, e.latlng.lat, e.latlng.lng, province, city);
  });
}

function markerColor(id) {
  const r = getResult(id);
  if (!r) return '#8b949e';
  const colors = { 'very-high': '#f85149', 'high': '#f0883e', 'medium': '#d29922', 'low': '#3fb950', 'very-low': '#58a6ff' };
  return colors[getGrade(r.probability).cls] || '#8b949e';
}

function addMapMarker(loc) {
  if (!map) return;
  const color = markerColor(loc.id);
  const prob  = getResult(loc.id)?.probability ?? '?';

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
  const r = getResult(loc.id);
  const prob  = r ? r.probability : '?';
  const grade = r ? getGrade(r.probability) : { label: '—', cls: 'very-low' };
  const region = loc.province ? `${loc.province} ${loc.city}` : '';
  const dayLabel = activeDay === 'tomorrow' ? '내일 새벽' : '오늘 새벽';
  return `
    <div class="popup-title">${esc(loc.name)} ${mapLinksHTML(loc)}</div>
    ${region ? `<div style="font-size:0.78rem;color:#8b949e;margin-bottom:4px">${esc(region)}</div>` : ''}
    <div style="font-size:0.75rem;color:#8b949e;margin-bottom:2px">${dayLabel} 기준</div>
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

  fetchWeather(lat, lng).then(both => {
    weatherMap.today[loc.id]    = both.today;
    weatherMap.tomorrow[loc.id] = both.tomorrow;
    resultMap.today[loc.id]     = calcFogProbability(both.today);
    resultMap.tomorrow[loc.id]  = calcFogProbability(both.tomorrow);
    renderList();
    renderFilters();
    updateMapMarker(loc.id);
  }).catch(() => { renderList(); renderFilters(); });

  showToast(`'${loc.name}' 추가되었습니다.`);
}

function deleteLocation(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  if (!confirm(`'${loc.name}'을(를) 삭제하시겠습니까?`)) return;
  locations = locations.filter(l => l.id !== id);
  saveLocations();
  delete weatherMap.today[id];
  delete weatherMap.tomorrow[id];
  delete resultMap.today[id];
  delete resultMap.tomorrow[id];
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
      <input id="editName"     type="text"   value="${esc(loc.name)}"         placeholder="지점 이름" />
      <div class="coord-row">
        <input id="editLat"    type="number" step="0.0001" value="${loc.lat}" placeholder="위도" />
        <input id="editLng"    type="number" step="0.0001" value="${loc.lng}" placeholder="경도" />
      </div>
      <input id="editProvince" type="text"   value="${esc(loc.province||'')}" placeholder="도·광역시" />
      <input id="editCity"     type="text"   value="${esc(loc.city||'')}"     placeholder="시·군·구" />
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
    fetchWeather(lat, lng).then(both => {
      weatherMap.today[id]    = both.today;
      weatherMap.tomorrow[id] = both.tomorrow;
      resultMap.today[id]     = calcFogProbability(both.today);
      resultMap.tomorrow[id]  = calcFogProbability(both.tomorrow);
      renderList(); renderFilters(); updateMapMarker(id);
    }).catch(() => { renderList(); renderFilters(); });
    closeModal();
    showToast(`'${name}' 수정되었습니다.`);
  });
}

// ── 상세 모달 ─────────────────────────────────────────────────
function openDetail(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  const w = getWeather(id);
  const r = getResult(id);

  if (!w || !r) {
    showToast('날씨 데이터를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
    return;
  }

  const grade    = getGrade(r.probability);
  const region   = loc.province ? `${loc.province} ${loc.city}` : '';
  const dayLabel = activeDay === 'tomorrow' ? '내일 새벽 05–07시 예보' : '오늘 새벽 05–07시 예보';

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
        <div class="score-item-value">예보값: <strong>${formatValue(d.id, d.rawValue)}</strong></div>
        <div class="score-item-criterion">기준: ${d.label}</div>
      </div>`;
  }).join('');

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">${esc(loc.name)} ${mapLinksHTML(loc)}</div>
    <div class="modal-coords">
      ${region ? `<span class="region-badge" style="margin-right:8px">${esc(region)}</span>` : ''}
      ${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E
    </div>
    <div class="day-label-badge">${dayLabel}</div>
    <div class="modal-big-prob prob-${grade.cls}">${r.probability}%</div>
    <div class="modal-grade grade-${grade.cls}" style="display:inline-block;padding:4px 14px;border-radius:12px;margin-bottom:16px">${grade.label}</div>
    <div class="score-list">${scoreItems}</div>
    <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;font-size:0.82rem;color:var(--text-muted)">
      <strong style="color:var(--text)">총 점수:</strong> ${r.totalScore} / 100점 →
      운해 발생 가능성 <strong style="color:var(--text)">${r.probability}%</strong><br><br>
      <em>점수 = 상대 습도(30) + 이슬점 근접도(25) + 풍속(20) + 야간 복사 냉각(15) + 일교차(5) + 계절 보정(5)</em>
    </div>
    <div class="modal-updated">${w.fetchedAt}</div>`;

  document.getElementById('detailModal').classList.remove('hidden');
}

function formatValue(id, v) {
  if (id === 'season')      return `${v}월`;
  if (id === 'dewpointGap') return `${v.toFixed(1)}°C`;
  if (id === 'humidity')    return `${v.toFixed(0)}%`;
  if (id === 'cloudCover')  return `${v.toFixed(0)}%`;
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
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function bindAddLocationBtn() {
  document.getElementById('addLocationBtn').addEventListener('click', () => {
    const name     = document.getElementById('newName').value.trim();
    const lat      = parseFloat(document.getElementById('newLat').value);
    const lng      = parseFloat(document.getElementById('newLng').value);
    const province = document.getElementById('newProvince').value.trim();
    const city     = document.getElementById('newCity').value.trim();
    if (!name)                   { showToast('지점 이름을 입력해 주세요.'); return; }
    if (isNaN(lat)||isNaN(lng))  { showToast('위도/경도를 올바르게 입력해 주세요.'); return; }
    if (lat<-90||lat>90)         { showToast('위도는 -90 ~ 90 범위여야 합니다.'); return; }
    if (lng<-180||lng>180)       { showToast('경도는 -180 ~ 180 범위여야 합니다.'); return; }
    addLocation(name, lat, lng, province, city);
    ['newName','newLat','newLng','newProvince','newCity'].forEach(id => {
      document.getElementById(id).value = '';
    });
  });
}

// ── 초기화 ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFilters();
  renderDayToggle();
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
