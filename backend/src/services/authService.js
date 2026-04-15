import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const SALT_ROUNDS = 12;

export async function registerUser({ email, password, name }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  let user;
  try {
    user = await User.create({ email, passwordHash, name: name || '' });
  } catch (e) {
    if (e?.code === 11000) {
      const err = new Error('Email already registered');
      err.status = 409;
      throw err;
    }
    throw e;
  }
  const token = signToken({ sub: user._id.toString() });
  return { user: toPublicUser(user), token };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const token = signToken({ sub: user._id.toString() });
  return { user: toPublicUser(user), token };
}

export async function getUserById(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return toPublicUser(user);
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name || '',
    premiumUnlocked: !!user.premiumUnlocked,
  };
}
