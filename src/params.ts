import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	integer: (param) => (/^[1-9]\d{0,9}$/.test(param) ? Number(param) : undefined)
});
