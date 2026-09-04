import { UnitSystem } from '../types';

export interface ScaledIngredient {
  displayText: string;
  quantityHighlight: string;
  originalText: string;
}

export function parseFractionOrNumber(str: string): number | null {
  const clean = str.trim();
  try {
    if (clean.includes(' ')) {
      // e.g. "1 1/2"
      const parts = clean.split(' ');
      const whole = parseFloat(parts[0]) || 0;
      const fracParts = parts[1].split('/');
      const num = parseFloat(fracParts[0]) || 0;
      const den = parseFloat(fracParts[1]) || 1;
      return whole + num / den;
    } else if (clean.includes('/')) {
      const fracParts = clean.split('/');
      const num = parseFloat(fracParts[0]) || 0;
      const den = parseFloat(fracParts[1]) || 1;
      return num / den;
    } else {
      const val = parseFloat(clean);
      return isNaN(val) ? null : val;
    }
  } catch {
    return null;
  }
}

export function formatQuantity(value: number): string {
  const whole = Math.floor(value);
  const frac = value - whole;

  let fracStr: string | null = null;
  if (frac >= 0.20 && frac <= 0.29) fracStr = '1/4';
  else if (frac >= 0.30 && frac <= 0.38) fracStr = '1/3';
  else if (frac >= 0.45 && frac <= 0.55) fracStr = '1/2';
  else if (frac >= 0.62 && frac <= 0.70) fracStr = '2/3';
  else if (frac >= 0.71 && frac <= 0.80) fracStr = '3/4';

  if (fracStr !== null && whole === 0) return fracStr;
  if (fracStr !== null && whole > 0) return `${whole} ${fracStr}`;
  if (frac < 0.05) return `${whole}`;

  // round to at most 2 decimal places
  return Number(value.toFixed(2)).toString();
}

function pluralizeUnit(value: number, unit: string): string {
  const isPlural = value > 1.05;
  const u = unit.toLowerCase();
  if (u.startsWith('cup')) return isPlural ? 'cups' : 'cup';
  if (u.startsWith('lb') || u.startsWith('pound')) return isPlural ? 'lbs' : 'lb';
  if (u.startsWith('oz') || u.startsWith('ounce')) return isPlural ? 'oz' : 'oz';
  if (u.startsWith('tbsp') || u.startsWith('tablespoon')) return isPlural ? 'tbsp' : 'tbsp';
  if (u.startsWith('tsp') || u.startsWith('teaspoon')) return isPlural ? 'tsp' : 'tsp';
  if (u.startsWith('clove')) return isPlural ? 'cloves' : 'clove';
  if (u.startsWith('slice')) return isPlural ? 'slices' : 'slice';
  if (u.startsWith('can')) return isPlural ? 'cans' : 'can';
  return unit;
}

function convertToMetric(scaledValue: number, unit: string): [string, string] {
  const u = unit.toLowerCase();
  if (u.startsWith('cup') || u === 'c.') {
    const ml = Math.round(scaledValue * 240);
    return [`${ml}`, 'ml'];
  }
  if (u.startsWith('lb') || u.startsWith('pound')) {
    const grams = Math.round(scaledValue * 450);
    if (grams >= 1000) {
      return [Number((grams / 1000).toFixed(2)).toString(), 'kg'];
    }
    return [`${grams}`, 'g'];
  }
  if (u.startsWith('oz') || u.startsWith('ounce')) {
    const grams = Math.max(1, Math.round(scaledValue * 28.35));
    return [`${grams}`, 'g'];
  }
  if (u.startsWith('tbsp') || u.startsWith('tablespoon')) {
    const ml = Math.max(1, Math.round(scaledValue * 15));
    return [`${ml}`, `ml (${formatQuantity(scaledValue)} tbsp)`];
  }
  if (u.startsWith('tsp') || u.startsWith('teaspoon')) {
    const ml = Math.max(1, Math.round(scaledValue * 5));
    return [`${ml}`, `ml (${formatQuantity(scaledValue)} tsp)`];
  }
  if (u.startsWith('quart')) {
    const liters = Number((scaledValue * 0.95).toFixed(2)).toString();
    return [`${liters}`, 'L'];
  }
  if (u.startsWith('pint') || u === 'pt') {
    const ml = Math.round(scaledValue * 475);
    return [`${ml}`, 'ml'];
  }
  return [formatQuantity(scaledValue), unit];
}

export function scaleAndConvert(
  rawText: string,
  multiplier: number,
  unitSystem: UnitSystem
): ScaledIngredient {
  const trimmed = rawText.trim();
  const match = trimmed.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*(.*)/);

  if (!match) {
    return {
      displayText: trimmed,
      quantityHighlight: '',
      originalText: trimmed
    };
  }

  const numStr = match[1];
  const remainder = match[2];

  const baseValue = parseFractionOrNumber(numStr) ?? 1.0;
  const scaledValue = baseValue * multiplier;

  // Check if remainder starts with a recognizable unit
  const unitMatch = remainder.match(
    /^(cups?|c\.|lbs?|pounds?|oz|ounces?|tbsp|tablespoons?|tsp|teaspoons?|cloves?|slices?|cans?|stalks?|bunches?|pinch|pinches|quarts?|pts?|pints?)\b\s*(.*)/i
  );

  if (!unitMatch) {
    const formattedQty = formatQuantity(scaledValue);
    return {
      displayText: `${formattedQty} ${remainder}`.trim(),
      quantityHighlight: formattedQty,
      originalText: trimmed
    };
  }

  const unit = unitMatch[1].toLowerCase();
  const itemName = unitMatch[2];

  if (unitSystem === UnitSystem.METRIC) {
    const [metricQty, metricUnit] = convertToMetric(scaledValue, unit);
    const metricHighlight = `${metricQty} ${metricUnit}`;
    const display = `${metricHighlight} ${itemName}`.trim();
    return {
      displayText: display,
      quantityHighlight: metricHighlight,
      originalText: trimmed
    };
  } else {
    const formattedQty = formatQuantity(scaledValue);
    const displayUnit = pluralizeUnit(scaledValue, unit);
    const imperialHighlight = `${formattedQty} ${displayUnit}`;
    const display = `${imperialHighlight} ${itemName}`.trim();
    return {
      displayText: display,
      quantityHighlight: imperialHighlight,
      originalText: trimmed
    };
  }
}
