const API_URL = import.meta.env.VITE_API_URL;

export async function getCSRFToken() {
  const res = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  const { csrfToken } = await res.json();

  return csrfToken;
}

export async function register(data) {
  const csrfToken = await getCSRFToken();

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const bodyRes = await res.json();

  if (!res.ok) {
    const msg =
      res.status === 429
        ? "Demasiadas solicitudes en un corto período de tiempo. Por favor, espera antes de intentar nuevamente."
        : res.status === 422
        ? bodyRes.err || "Error en los datos proporcionados para el registro."
        : "Ocurrió un problema inesperado durante el registro.";

    return { success: false, err: msg };
  }

  const { accessToken, user } = bodyRes.data;
  sessionStorage.setItem("accessToken", accessToken);

  return { success: true, data: user };
}

export async function login(data) {
  const csrfToken = await getCSRFToken();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const bodyRes = await res.json();

  if (!res.ok) {
    const msg =
      res.status === 429
        ? "Demasiadas solicitudes en un corto período de tiempo. Por favor, espera antes de intentar nuevamente."
        : res.status === 422
        ? bodyRes.err || "Error en los datos proporcionados para el registro."
        : "Ocurrió un problema inesperado durante el registro.";

    return { success: false, err: msg };
  }

  const { accessToken, user } = bodyRes.data;
  sessionStorage.setItem("accessToken", accessToken);

  return { success: true, data: user };
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const bodyRes = await res.json();

  if (!res.ok) return { success: false, err: bodyRes.err };

  return { success: true, message: bodyRes.message };
}
