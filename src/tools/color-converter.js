
const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

function hexToRgb(hex) {
  let value = hex.replace(/^#/, '').trim();

  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    value = [...value].map(char => char + char).join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error('Enter a valid HEX color, such as #4169FF.');
  }

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = 60 * (((g - b) / delta) % 6);
        break;
      case g:
        h = 60 * ((b - r) / delta + 2);
        break;
      default:
        h = 60 * ((r - g) / delta + 4);
    }
  }

  return {
    h: Math.round((h + 360) % 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(value => value.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function parseRgb(value) {
  const match = value.match(
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
  );

  if (!match) {
    throw new Error('Enter RGB as rgb(65, 105, 255).');
  }

  const [r, g, b] = match.slice(1).map(Number);

  if ([r, g, b].some(value => value > 255)) {
    throw new Error('RGB values must be between 0 and 255.');
  }

  return { r, g, b };
}

function parseHsl(value) {
  const match = value.match(
    /^hsl\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)$/i
  );

  if (!match) {
    throw new Error('Enter HSL as hsl(226, 100%, 63%).');
  }

  const [, h, s, l] = match;
  const hue = Number(h);
  const saturation = Number(s);
  const lightness = Number(l);

  if (saturation > 100 || lightness > 100) {
    throw new Error('HSL saturation and lightness must be 0–100%.');
  }

  const hueNormalized = ((hue % 360) + 360) % 360;
  const sat = saturation / 100;
  const light = lightness / 100;

  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const x = chroma * (1 - Math.abs((hueNormalized / 60) % 2 - 1));
  const m = light - chroma / 2;

  let rgb;

  if (hueNormalized < 60) rgb = [chroma, x, 0];
  else if (hueNormalized < 120) rgb = [x, chroma, 0];
  else if (hueNormalized < 180) rgb = [0, chroma, x];
  else if (hueNormalized < 240) rgb = [0, x, chroma];
  else if (hueNormalized < 300) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  const [r, g, b] = rgb.map(value =>
    Math.round((value + m) * 255)
  );

  return { r, g, b };
}

function initColorConverter() {
  const root = document.querySelector('#color-converter');

  if (!root) return;

  const hexInput = root.querySelector('#color-hex');
  const rgbInput = root.querySelector('#color-rgb');
  const hslInput = root.querySelector('#color-hsl');
  const picker = root.querySelector('#color-picker');
  const preview = root.querySelector('#color-preview');
  const error = root.querySelector('#color-error');

  function updateColor(rgb, source) {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    hexInput.value = hex;
    rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    preview.style.backgroundColor = hex;

    if (source !== 'picker') picker.value = hex;
    error.textContent = '';
  }

  function handleConversion(callback) {
    try {
      const rgb = callback();
      updateColor(rgb);
    } catch (err) {
      error.textContent = err.message;
    }
  }

  hexInput.addEventListener('input', () => {
    handleConversion(() => hexToRgb(hexInput.value));
  });

  rgbInput.addEventListener('change', () => {
    handleConversion(() => parseRgb(rgbInput.value));
  });

  hslInput.addEventListener('change', () => {
    handleConversion(() => parseHsl(hslInput.value));
  });

  picker.addEventListener('input', () => {
    updateColor(hexToRgb(picker.value), 'picker');
  });

  root.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const input = root.querySelector(button.dataset.copy);

      try {
        await navigator.clipboard.writeText(input.value);
        button.textContent = 'Copied ✓';

        setTimeout(() => {
          button.textContent = 'Copy';
        }, 1200);
      } catch {
        error.textContent = 'Clipboard access is unavailable.';
      }
    });
  });

  updateColor(hexToRgb('#4169FF'));
}

export { initColorConverter };
