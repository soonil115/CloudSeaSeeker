/* fog.js — 운해 발생 가능성 계산 엔진 */

const FOG_CRITERIA = [
  {
    id: 'humidity',
    name: '상대 습도',
    icon: '💧',
    maxScore: 30,
    unit: '%',
    description: '습도가 높을수록 수증기 응결이 쉬워집니다.',
    thresholds: [
      { min: 90,  max: Infinity, score: 30, label: '≥ 90% — 매우 유리' },
      { min: 80,  max: 90,       score: 22, label: '80–89% — 유리' },
      { min: 70,  max: 80,       score: 14, label: '70–79% — 보통' },
      { min: 60,  max: 70,       score: 7,  label: '60–69% — 낮음' },
      { min: -Infinity, max: 60, score: 0,  label: '< 60% — 매우 낮음' },
    ],
  },
  {
    id: 'dewpointGap',
    name: '이슬점 근접도 (T − Td)',
    icon: '🌡️',
    maxScore: 25,
    unit: '°C',
    description: '기온과 이슬점의 차이가 작을수록 응결이 임박합니다.',
    thresholds: [
      { min: -Infinity, max: 1, score: 25, label: '< 1°C — 매우 유리' },
      { min: 1, max: 2,         score: 18, label: '1–2°C — 유리' },
      { min: 2, max: 4,         score: 10, label: '2–4°C — 보통' },
      { min: 4, max: 6,         score: 5,  label: '4–6°C — 낮음' },
      { min: 6, max: Infinity,  score: 0,  label: '> 6°C — 매우 낮음' },
    ],
    invertedScale: true,
  },
  {
    id: 'windSpeed',
    name: '풍속',
    icon: '💨',
    maxScore: 20,
    unit: 'm/s',
    description: '바람이 약할수록 형성된 안개층이 흩어지지 않습니다.',
    thresholds: [
      { min: -Infinity, max: 1, score: 20, label: '< 1 m/s — 매우 유리' },
      { min: 1, max: 2,         score: 14, label: '1–2 m/s — 유리' },
      { min: 2, max: 4,         score: 8,  label: '2–4 m/s — 보통' },
      { min: 4, max: 6,         score: 3,  label: '4–6 m/s — 낮음' },
      { min: 6, max: Infinity,  score: 0,  label: '> 6 m/s — 매우 낮음' },
    ],
    invertedScale: true,
  },
  {
    id: 'cloudCover',
    name: '야간 복사 냉각 (운량)',
    icon: '🌙',
    maxScore: 15,
    unit: '%',
    description: '운량이 낮을수록 지표 복사 냉각 효과가 큽니다.',
    thresholds: [
      { min: -Infinity, max: 20, score: 15, label: '< 20% — 매우 유리' },
      { min: 20, max: 40,        score: 10, label: '20–40% — 유리' },
      { min: 40, max: 60,        score: 5,  label: '40–60% — 보통' },
      { min: 60, max: Infinity,  score: 0,  label: '> 60% — 낮음' },
    ],
    invertedScale: true,
  },
  {
    id: 'tempRange',
    name: '일교차',
    icon: '🌅',
    maxScore: 5,
    unit: '°C',
    description: '일교차가 클수록 야간 복사 냉각이 강해집니다.',
    thresholds: [
      { min: 15,  max: Infinity, score: 5, label: '≥ 15°C — 매우 유리' },
      { min: 10,  max: 15,       score: 3, label: '10–14°C — 유리' },
      { min: 5,   max: 10,       score: 1, label: '5–9°C — 보통' },
      { min: -Infinity, max: 5,  score: 0, label: '< 5°C — 낮음' },
    ],
  },
  {
    id: 'season',
    name: '계절 보정',
    icon: '📅',
    maxScore: 5,
    unit: '월',
    description: '가을·봄은 복사 안개와 활승 안개가 잘 발생하는 계절입니다.',
    thresholds: [
      { min: 9,  max: 11, score: 5, label: '9–11월 (가을)' },
      { min: 3,  max: 5,  score: 4, label: '3–5월 (봄)' },
      { min: 12, max: 12, score: 2, label: '12월 (겨울)' },
      { min: 1,  max: 2,  score: 2, label: '1–2월 (겨울)' },
      { min: 6,  max: 8,  score: 1, label: '6–8월 (여름)' },
    ],
  },
];

const MAX_TOTAL_SCORE = FOG_CRITERIA.reduce((s, c) => s + c.maxScore, 0); // 100

function scoreFromThresholds(value, criterion) {
  for (const t of criterion.thresholds) {
    if (criterion.id === 'season') {
      if (value >= t.min && value <= t.max) return { score: t.score, label: t.label };
    } else if (criterion.invertedScale) {
      if (value < t.max) return { score: t.score, label: t.label };
    } else {
      if (value >= t.min) return { score: t.score, label: t.label };
    }
  }
  return { score: 0, label: '— 기준 미달' };
}

function calcFogProbability(weather) {
  const month = new Date().getMonth() + 1;
  const inputs = {
    humidity:    weather.relativeHumidity,
    dewpointGap: Math.max(0, weather.temperature - weather.dewpoint),
    windSpeed:   weather.windSpeed,
    cloudCover:  weather.cloudCover,
    tempRange:   weather.tempMax - weather.tempMin,
    season:      month,
  };

  const details = FOG_CRITERIA.map(criterion => {
    const raw = inputs[criterion.id];
    const { score, label } = scoreFromThresholds(raw, criterion);
    return {
      ...criterion,
      rawValue: raw,
      score,
      label,
      pctOfMax: (score / criterion.maxScore) * 100,
    };
  });

  const totalScore = details.reduce((s, d) => s + d.score, 0);
  const probability = Math.round((totalScore / MAX_TOTAL_SCORE) * 100);

  return { probability, totalScore, details };
}

function getGrade(prob) {
  if (prob >= 80) return { label: '매우 높음 🌊', cls: 'very-high' };
  if (prob >= 60) return { label: '높음 ☁️',    cls: 'high' };
  if (prob >= 40) return { label: '보통 🌤️',    cls: 'medium' };
  if (prob >= 20) return { label: '낮음 🌞',     cls: 'low' };
  return               { label: '매우 낮음 ☀️', cls: 'very-low' };
}
