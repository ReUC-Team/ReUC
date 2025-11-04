// Nota: Necesitarás ajustar la importación según tu configuración de API
// import { fetchWithAuthAndAutoRefresh } from '../../../lib/api/client';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getCSRFToken() {
  try {
    const res = await fetch(`${API_URL}/csrf-token`, {
      credentials: 'include',
    });

    const { csrfToken } = await res.json();
    return csrfToken;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw error;
  }
}

export async function create(data: any) {
  try {
    const csrfToken = await getCSRFToken();

    // Si necesitas usar fetchWithAuthAndAutoRefresh, descomenta esto:
    // const res = await fetchWithAuthAndAutoRefresh(`${API_URL}/project/create`, {
    //   method: 'POST',
    //   headers: {
    //     'X-CSRF-Token': csrfToken,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    // Implementación temporal con fetch estándar:
    const res = await fetch(`${API_URL}/project/create`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const bodyRes = await res.json();

    if (!res.ok) {
      if (res.status === 403)
        return { success: false, err: bodyRes.err, logout: true };

      return { success: false, err: bodyRes.err, logout: false };
    }

    return { success: true, data: bodyRes.data.application };
  } catch (error: any) {
    return { success: false, err: error.message, logout: false };
  }
}

export async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      credentials: 'include',
    });

    const bodyRes = await res.json();

    if (!res.ok) {
      return { success: false, err: bodyRes.err };
    }

    return { success: true, data: bodyRes.data };
  } catch (error: any) {
    return { success: false, err: error.message };
  }
}

export async function getProjectById(id: string) {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      credentials: 'include',
    });

    const bodyRes = await res.json();

    if (!res.ok) {
      return { success: false, err: bodyRes.err };
    }

    return { success: true, data: bodyRes.data };
  } catch (error: any) {
    return { success: false, err: error.message };
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const csrfToken = await getCSRFToken();

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const bodyRes = await res.json();

    if (!res.ok) {
      return { success: false, err: bodyRes.err };
    }

    return { success: true, data: bodyRes.data };
  } catch (error: any) {
    return { success: false, err: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    const csrfToken = await getCSRFToken();

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
    });

    const bodyRes = await res.json();

    if (!res.ok) {
      return { success: false, err: bodyRes.err };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, err: error.message };
  }
}

export async function toggleFavorite(projectId: string) {
  try {
    const csrfToken = await getCSRFToken();

    const res = await fetch(`${API_URL}/projects/${projectId}/favorite`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
    });

    const bodyRes = await res.json();

    if (!res.ok) {
      return { success: false, err: bodyRes.err };
    }

    return { success: true, data: bodyRes.data };
  } catch (error: any) {
    return { success: false, err: error.message };
  }
}