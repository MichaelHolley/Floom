import { invalid, redirect } from '@sveltejs/kit';
import * as z from 'zod';
import { form, query } from '$app/server';
import {
	allowLoginAttempt,
	clearLoginAttempts,
	endSession,
	isAdmin,
	startSession,
	verifyPassword
} from './server/auth.ts';

export const getIsAdmin = query(() => isAdmin());

export const login = form(z.object({ _password: z.string().min(1) }), async (data, issue) => {
	if (!allowLoginAttempt()) {
		invalid('Zu viele Versuche. In 15 Minuten geht es wieder.');
	}
	if (!(await verifyPassword(data._password))) {
		invalid(issue._password('Das Passwort stimmt nicht.'));
	}
	clearLoginAttempts();
	startSession();
	redirect(303, '/');
});

export const logout = form(() => {
	endSession();
	redirect(303, '/');
});
