const BASE_URL = 'http://localhost:6543/api';

async function request(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: 'Server error' };
    }
    throw errorData;
  }

  // Kalau response 204 No Content, tidak ada body JSON
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function register(data) {
  return request(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function login(data) {
  return request(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// Contoh fungsi untuk request API yang membutuhkan token
export async function authorizedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw { error: 'Unauthorized: token not found' };
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return request(url, {
    ...options,
    headers,
  });
}
