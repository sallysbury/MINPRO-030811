'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createToken(token: string, url: string = '/') {
  cookies().set('token', token);
  redirect(url);
}

export async function deleteToken(key: string, url: string) {
  cookies().delete(key);
  redirect(url);
}

export async function getToken() {
  return cookies().get('token');
}
