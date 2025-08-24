// src/services/authService.js
import api from './api';

// These helpers call the backend to check session and role
// They return a Promise<boolean>

export async function isAuthenticated() {
	try {
		const res = await api.get('/api/user/auth/session');
		return !!res.data.user;
	} catch {
		return false;
	}
}

export async function isAdmin() {
	try {
		const res = await api.get('/api/user/auth/session');
		return res.data.user?.role === 'admin';
	} catch {
		return false;
	}
}

export async function isUser() {
	try {
		const res = await api.get('/api/user/auth/session');
		return res.data.user?.role === 'user';
	} catch {
		return false;
	}
}
