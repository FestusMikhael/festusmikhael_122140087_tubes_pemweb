const BASE_URL = 'http://localhost:6543/api';

async function request(url, options) {
  const response = await fetch(url, options);

  // Check if response is not OK (status not 2xx)
  if (!response.ok) {
    // Try to parse JSON error, otherwise throw generic error
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: 'Server error' };
    }
    throw errorData;
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