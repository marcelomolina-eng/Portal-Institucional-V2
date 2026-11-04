/**
 * Utility for SHA-256 cryptographic hashing in the browser
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Authorized Admin Emails (Strictly limited as requested)
export const AUTHORIZED_ADMIN_EMAILS = [
  'rrhh@educarsrl.com.ar',
  'marcelo.molina@educarsrl.com.ar'
];

// Pre-computed SHA-256 hashes for standard passwords:
// 'educar2026' -> a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf
// 'admin2026' -> c0e6ca70fc46efc55bd13dbd74c935472851cf27ce0903328eef6066266cf17f
// 'operacion2026' -> 245dbfa2c9ee5ea6cff1eaef664a7c73dbca88a531cf542981ce81bf2ba81ae8
export const DEFAULT_ADMIN_HASHES: Record<string, string> = {
  'rrhh@educarsrl.com.ar': 'a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf',
  'marcelo.molina@educarsrl.com.ar': 'a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf',
};

const CUSTOM_HASH_STORAGE_KEY = 'ci_admin_custom_hashes';

export function getStoredAdminHashes(): Record<string, string> {
  try {
    const stored = localStorage.getItem(CUSTOM_HASH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading custom admin hashes', e);
  }
  return {};
}

export function isAuthorizedEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.includes(normalized);
}

export async function verifyAdminCredentials(email: string, passwordAttempt: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedEmail(cleanEmail)) return false;

  const attemptHash = await sha256(passwordAttempt);
  const customHashes = getStoredAdminHashes();
  const customHash = customHashes[cleanEmail];

  // If the admin has saved a custom password, check against it
  if (customHash) {
    return attemptHash === customHash;
  }

  // Otherwise check against default hash or baseline password
  const expectedHash = DEFAULT_ADMIN_HASHES[cleanEmail];
  return attemptHash === expectedHash || passwordAttempt === 'educar2026' || passwordAttempt === 'admin2026';
}

export async function updateAdminPassword(
  email: string,
  currentPasswordAttempt: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedEmail(cleanEmail)) {
    return { success: false, message: 'Dirección de correo institucional no autorizada.' };
  }

  const isValidCurrent = await verifyAdminCredentials(cleanEmail, currentPasswordAttempt);
  if (!isValidCurrent) {
    return { success: false, message: 'La contraseña actual no coincide con nuestros registros.' };
  }

  if (newPassword.trim().length < 6) {
    return { success: false, message: 'La nueva contraseña debe tener como mínimo 6 caracteres.' };
  }

  const newHash = await sha256(newPassword);
  const currentHashes = getStoredAdminHashes();
  currentHashes[cleanEmail] = newHash;

  try {
    localStorage.setItem(CUSTOM_HASH_STORAGE_KEY, JSON.stringify(currentHashes));
  } catch (err) {
    console.error('Error saving updated hash to localStorage', err);
    return { success: false, message: 'No se pudo guardar la contraseña en el dispositivo.' };
  }

  return { success: true, message: '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión con tu nueva clave de seguridad.' };
}
