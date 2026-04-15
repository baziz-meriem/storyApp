import * as authService from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.validated);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.validated);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.userId);
    res.json({ user });
  } catch (e) {
    next(e);
  }
}
