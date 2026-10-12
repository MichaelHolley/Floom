import { createHmac, timingSafeEqual } from 'node:crypto';
import { error } from '@sveltejs/kit';
import { ADMIN_PASSWORD } from '$app/env/private';
import { getRequestEvent } from '$app/server';

const COOKIE = 'floom_session';
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const attempts = new Map<string, { count: number; resetAt: number }>();

// Signing with the password means changing the password ends every session.
function sign(expires: string) {
	return createHmac('sha256', ADMIN_PASSWORD).update(expires).digest();
}

export function isAdmin() {
	const [expires, signature] = (getRequestEvent().cookies.get(COOKIE) ?? '').split('.');
	if (!expires || !signature || Number(expires) < Date.now()) return false;
	const given = Buffer.from(signature, 'hex');
	const expected = sign(expires);
	return given.length === expected.length && timingSafeEqual(given, expected);
}

export function requireAdmin() {
	if (!isAdmin()) error(401, 'Nicht angemeldet');
}

export function startSession() {
	const expires = String(Date.now() + SESSION_SECONDS * 1000);
	getRequestEvent().cookies.set(COOKIE, `${expires}.${sign(expires).toString('hex')}`, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: SESSION_SECONDS
	});
}

export function endSession() {
	getRequestEvent().cookies.delete(COOKIE, { path: '/' });
}

export function verifyPassword(password: string) {
	return password === ADMIN_PASSWORD;
}

/** Counts a login attempt for the caller's address and reports whether it may proceed. */
export function allowLoginAttempt() {
	const address = getRequestEvent().getClientAddress();
	const now = Date.now();
	const entry = attempts.get(address);
	if (!entry || entry.resetAt < now) {
		attempts.set(address, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
		return true;
	}
	entry.count += 1;
	return entry.count <= MAX_ATTEMPTS;
}

export function clearLoginAttempts() {
	attempts.delete(getRequestEvent().getClientAddress());
}
