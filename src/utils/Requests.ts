import axios from 'axios';

const serverUrl = import.meta.env.VITE_API_GATEWAY ?? 'http://localhost:3001';

const authHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem('authToken')}`,
});

export async function get<T = unknown>(url: string): Promise<T> {
  const response = await axios.get(serverUrl + url, {
    headers: authHeader(),
  });
  return response.data;
}

export async function post<T = unknown>(
  url: string,
  object: unknown
): Promise<T> {
  const response = await axios.post(serverUrl + url, object, {
    headers: authHeader(),
  });
  return response.data;
}

export async function patch<T = unknown>(
  url: string,
  object: unknown
): Promise<T> {
  const response = await axios.patch(serverUrl + url, object, {
    headers: authHeader(),
  });
  return response.data;
}

export async function put<T = unknown>(
  url: string,
  object: unknown
): Promise<T> {
  const response = await axios.put(serverUrl + url, object, {
    headers: authHeader(),
  });
  return response.data;
}

export async function del<T = unknown>(url: string): Promise<T> {
  const response = await axios.delete(serverUrl + url, {
    headers: authHeader(),
  });
  return response.data;
}
