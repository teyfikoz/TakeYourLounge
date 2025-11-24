/**
 * Device Fingerprinting for Anonymous User Tracking
 */

export function generateDeviceId(): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device Fingerprint', 2, 2);

  const canvasData = canvas.toDataURL();

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasData,
  ];

  const fingerprint = components.join('|');
  return hashCode(fingerprint).toString();
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';

  const stored = localStorage.getItem('deviceId');
  if (stored) return stored;

  const newId = generateDeviceId();
  localStorage.setItem('deviceId', newId);
  return newId;
}
