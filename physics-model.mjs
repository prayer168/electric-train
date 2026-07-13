export function computeTrainState({ circuitClosed, magnetMode, polarity, voltage }) {
  const safeVoltage = Math.min(1.5, Math.max(0.5, Number(voltage) || 0.5));
  const aligned = magnetMode === 'aligned';
  const closed = Boolean(circuitClosed);
  const direction = closed && aligned ? (polarity === 'left' ? -1 : 1) : 0;
  const forceFraction = closed && aligned ? safeVoltage / 1.5 : 0;

  return {
    circuitClosed: closed,
    aligned,
    direction,
    forceFraction,
    relativeForcePercent: Math.round(forceFraction * 60),
    moving: direction !== 0,
    explanation: !closed
      ? '接觸中斷，沒有閉合電路，因此線圈中沒有由電池驅動的持續電流。'
      : !aligned
        ? '翻轉一側磁鐵後，兩端作用不再同向相加；此概念模型以淨推力為零表示。'
        : `迴路閉合且磁極配置正確，模型預測向${direction > 0 ? '右' : '左'}移動。`
  };
}
