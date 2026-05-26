import { FIREBASE_DB_URL } from '../config';

export async function firebaseGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const cleanPath = path.replace(/^\/+/, '');
  const url = new URL(`${FIREBASE_DB_URL}/${cleanPath}.json`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Firebase GET ${cleanPath} thất bại: ${res.status}\n${text}\n\n` +
        `Nếu lỗi permission_denied, hãy mở public read riêng node exams trong Realtime Database Rules.`,
    );
  }

  return res.json();
}
