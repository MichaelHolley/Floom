const MAX_EDGE = 1024;

/** Shrinks a photo in the browser so the AI request stays small. */
export async function toSmallJpegBase64(file: File) {
	const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
}
