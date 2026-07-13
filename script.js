import { computeTrainState } from './physics-model.mjs';

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const progressTasks = new Set(JSON.parse(localStorage.getItem('electricTrainProgress') || '[]'));
const progressText = document.querySelector('#progressText');
const progressBar = document.querySelector('#progressBar');

function updateProgress() {
  const count = progressTasks.size;
  progressText.textContent = `${count} / 4 個學習任務`;
  progressBar.style.width = `${count * 25}%`;
  localStorage.setItem('electricTrainProgress', JSON.stringify([...progressTasks]));
}

function completeTask(task) {
  progressTasks.add(task);
  updateProgress();
}

function activateTab(tab) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    const active = panel.id === tab.getAttribute('aria-controls');
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
  document.querySelector('main').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    activateTab(tabs[next]);
  });
});

const predictionFeedback = document.querySelector('#predictionFeedback');
document.querySelectorAll('[data-prediction]').forEach((button) => {
  button.addEventListener('click', () => {
    const correct = button.dataset.prediction === 'closed';
    document.querySelectorAll('[data-prediction]').forEach((item) => item.classList.remove('correct', 'incorrect'));
    button.classList.add(correct ? 'correct' : 'incorrect');
    predictionFeedback.textContent = correct
      ? '好假設！磁鐵接觸裸銅線後，電池才有完整的電流路徑。'
      : '再看一次：影片在水平的直線、圓形與 8 字線圈都能運行；軌道形狀或斜坡不是共同條件。';
    if (correct) completeTask('prediction');
  });
});

const coilBack = document.querySelector('#coilBack');
const poweredCoil = document.querySelector('#poweredCoil');
for (let x = 70; x <= 925; x += 28) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${x} 120 Q${x - 25} 210 ${x} 300`);
  coilBack.append(path);
  if (x >= 360 && x <= 700) {
    const activePath = path.cloneNode();
    poweredCoil.append(activePath);
  }
}

const controls = {
  circuitClosed: document.querySelector('#circuitToggle'),
  magnetMode: document.querySelector('#magnetSelect'),
  polarity: document.querySelector('#polaritySelect'),
  voltage: document.querySelector('#voltageRange')
};
const trainGroup = document.querySelector('#trainGroup');
const forceArrows = document.querySelector('#forceArrows');
const powered = document.querySelector('#poweredCoil');
const circuitBadge = document.querySelector('#circuitBadge');
const forceReadout = document.querySelector('#forceReadout');
const directionText = document.querySelector('#directionText');
const simFeedback = document.querySelector('#simFeedback');
const voltageOutput = document.querySelector('#voltageOutput');
const positiveLabel = document.querySelector('#positiveLabel');
const negativeLabel = document.querySelector('#negativeLabel');
const rightPoleLabel = document.querySelector('.right-pole-label');
const rightPoleRects = document.querySelectorAll('#rightMagnet rect:not(:first-child)');
const arrows = document.querySelectorAll('.force-arrow');

let trainX = 365;
let running = false;
let lastTime = 0;

function getInput() {
  return {
    circuitClosed: controls.circuitClosed.checked,
    magnetMode: controls.magnetMode.value,
    polarity: controls.polarity.value,
    voltage: controls.voltage.value
  };
}

function renderSim() {
  const input = getInput();
  const state = computeTrainState(input);
  voltageOutput.textContent = `${Number(input.voltage).toFixed(1)} V`;
  circuitBadge.textContent = state.circuitClosed ? '迴路閉合' : '迴路斷開';
  circuitBadge.classList.toggle('off', !state.circuitClosed);
  circuitBadge.classList.toggle('on', state.circuitClosed);
  forceReadout.textContent = `相對推力 ${state.relativeForcePercent}%`;
  directionText.textContent = state.moving ? `預測：會向${state.direction > 0 ? '右' : '左'}移動` : '預測：不會持續前進';
  simFeedback.textContent = state.explanation;
  powered.style.opacity = state.circuitClosed ? String(.3 + state.forceFraction * .7) : '0';
  forceArrows.style.opacity = state.moving ? '1' : '.15';
  forceArrows.style.transformOrigin = '167px 120px';
  forceArrows.style.transform = state.direction < 0 ? 'translateX(334px) scaleX(-1)' : 'none';
  if (!state.moving) running = false;

  const reversed = input.magnetMode === 'opposed';
  rightPoleLabel.textContent = reversed ? 'N S' : 'S N';
  if (rightPoleRects.length === 2) {
    rightPoleRects[0].setAttribute('fill', reversed ? '#ef4444' : '#2563eb');
    rightPoleRects[1].setAttribute('fill', reversed ? '#2563eb' : '#ef4444');
  }
  const positiveRight = input.polarity === 'right';
  positiveLabel.textContent = positiveRight ? '＋' : '−';
  negativeLabel.textContent = positiveRight ? '−' : '＋';
  arrows.forEach((arrow) => arrow.setAttribute('stroke-dasharray', state.moving ? 'none' : '8 8'));
  return state;
}

function animate(time) {
  const state = renderSim();
  if (running && state.moving && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const dt = Math.min(32, time - lastTime || 16);
    trainX += state.direction * state.forceFraction * dt * .055;
    if (trainX > 615) trainX = 95;
    if (trainX < 95) trainX = 615;
    trainGroup.setAttribute('transform', `translate(${trainX} 0)`);
  }
  lastTime = time;
  requestAnimationFrame(animate);
}

Object.values(controls).forEach((control) => control.addEventListener('input', renderSim));
document.querySelector('#runSim').addEventListener('click', () => {
  const state = renderSim();
  running = state.moving;
  if (state.moving) completeTask('simulation');
});
document.querySelector('#pauseSim').addEventListener('click', () => { running = false; simFeedback.textContent = '模型已暫停；目前畫面仍保留電路與磁極狀態。'; });
document.querySelector('#resetSim').addEventListener('click', () => { running = false; trainX = 365; trainGroup.setAttribute('transform', `translate(${trainX} 0)`); renderSim(); });
document.querySelector('#labEvidence').addEventListener('change', (event) => { if (event.target.checked) completeTask('simulation'); });

document.querySelector('#quizForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const cards = [...document.querySelectorAll('.quiz-card')];
  let score = 0;
  const hints = [
    '觀察「接觸成迴路」：漆包線的絕緣層會讓磁鐵無法直接導通。',
    '回看原理解剖圖：兩個接觸點界定了主要通電區段。',
    '回到控制台實測：反轉正負極會反轉電流與模型運動方向。',
    '比較影片三種軌道：水平圓形與 8 字仍能持續運行。'
  ];
  cards.forEach((card, index) => {
    const chosen = card.querySelector('input:checked');
    const correct = chosen?.value === card.dataset.answer;
    card.classList.toggle('pass', correct);
    card.classList.toggle('fail', !correct);
    card.querySelector('.quiz-feedback').textContent = correct ? '✓ 證據與因果關係一致。' : `再想一步：${hints[index]}`;
    if (correct) score += 1;
  });
  const result = document.querySelector('#quizResult');
  result.textContent = score === cards.length ? '4 / 4｜你已能用電路、磁場與受力證據解釋影片。' : `${score} / ${cards.length}｜修正標紅的題目，再重新檢查。`;
  if (score === cards.length) completeTask('quiz');
});

document.querySelector('#safetyEvidence').addEventListener('change', (event) => { if (event.target.checked) completeTask('safety'); });

window.TrainPhysics = { computeTrainState };
updateProgress();
renderSim();
requestAnimationFrame(animate);
