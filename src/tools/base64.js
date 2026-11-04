
export function initBase64Tool() {
  const tool = document.querySelector('#base64-tool');

  if (!tool) return;

  const input = tool.querySelector('#base64-input');
  const output = tool.querySelector('#base64-output');
  const status = tool.querySelector('#base64-status');

  const encodeBtn = tool.querySelector('#base64-encode');
  const decodeBtn = tool.querySelector('#base64-decode');
  const clearBtn = tool.querySelector('#base64-clear');
  const copyBtn = tool.querySelector('#base64-copy');

  // Convert text to Base64 (supports Unicode)
  function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    const binary = Array.from(bytes, byte =>
      String.fromCharCode(byte)
    ).join('');

    return btoa(binary);
  }

  // Convert Base64 back to text (supports Unicode)
  function decodeBase64(value) {
    const cleanValue = value.replace(/\s/g, '');

    if (!cleanValue || !/^[A-Za-z0-9+/]*={0,2}$/.test(cleanValue)) {
      throw new Error('Please enter valid Base64 text.');
    }

    const binary = atob(cleanValue);
    const bytes = Uint8Array.from(binary, char =>
      char.charCodeAt(0)
    );

    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  encodeBtn.addEventListener('click', () => {
    try {
      output.value = encodeBase64(input.value);
      status.textContent = 'Text encoded successfully.';
      status.className = 'base64-status success';
    } catch (error) {
      status.textContent = error.message;
      status.className = 'base64-status error';
    }
  });

  decodeBtn.addEventListener('click', () => {
    try {
      output.value = decodeBase64(input.value);
      status.textContent = 'Base64 decoded successfully.';
      status.className = 'base64-status success';
    } catch (error) {
      output.value = '';
      status.textContent = error.message || 'Invalid Base64 input.';
      status.className = 'base64-status error';
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    status.textContent = '';
  });

  copyBtn.addEventListener('click', async () => {
    if (!output.value) {
      status.textContent = 'There is no output to copy.';
      status.className = 'base64-status error';
      return;
    }

    try {
      await navigator.clipboard.writeText(output.value);
      status.textContent = 'Copied to clipboard!';
      status.className = 'base64-status success';
    } catch {
      status.textContent = 'Unable to copy. Please copy manually.';
      status.className = 'base64-status error';
    }
  });
}
