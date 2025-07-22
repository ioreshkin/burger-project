import { BASE_URL } from '../../utils/constants.ts';

export const request = (endpoint: string, options?: RequestInit) => {
  return fetch(BASE_URL + 'api/' + endpoint, options).then(checkResponse);
};

export const requestWithAuth = async (
  endpoint: string,
  options?: RequestInit
): Promise<unknown> => {
  try {
    const updatedOptions = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    };
    const res = await fetch(BASE_URL + 'api/' + endpoint, updatedOptions);
    if (res.ok) {
      return checkResponse(res);
    }

    const errorData = await res.json();
    if (errorData.message === 'jwt expired') {
      await refreshToken();

      const updatedOptions = {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      };
      return requestWithAuth(endpoint, updatedOptions);
    }
    return Promise.reject(errorData);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const refreshToken = async () => {
  try {
    const res = await request('auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
    });

    if (res.success) {
      localStorage.setItem(
        'accessToken',
        res.accessToken.replace('Bearer ', '')
      );
      localStorage.setItem('refreshToken', res.refreshToken);
      return res;
    }

    throw new Error('Не удалось обновить токен.');
  } catch (err) {
    console.error('Ошибка при обновлении токена:', err);
    throw err;
  }
};

const checkResponse = (res: Response) => {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};
