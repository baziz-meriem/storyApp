import * as paymentService from '../services/paymentService.js';

export async function createSession(req, res, next) {
  try {
    const { successUrl, cancelUrl } = req.body || {};
    const result = await paymentService.createCheckoutSession(req.userId, { successUrl, cancelUrl });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function webhook(req, res, next) {
  try {
    const sig = req.headers['stripe-signature'];
    const result = await paymentService.handleStripeWebhook(req.body, sig);
    res.json(result);
  } catch (e) {
    next(e);
  }
}
