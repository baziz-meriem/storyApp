import crypto from 'crypto';

export function generateInviteCode() {
  return crypto.randomBytes(12).toString('base64url');
}
