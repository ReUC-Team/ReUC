const API_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(url, options = {}) {
  const accessToken = sessionStorage.getItem("accessToken");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

export async function fetchWithAuthAndAutoRefresh(url, options = {}) {
  let res = await fetchWithAuth(url, options);

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      sessionStorage.setItem("accessToken", accessToken);

      const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      };

      res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  return res;
}
