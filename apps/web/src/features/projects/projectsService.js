import { fetchWithAuthAndAutoRefresh } from "../../lib/api/client";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCSRFToken() {
  const res = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  const { csrfToken } = await res.json();

  return csrfToken;
}

export async function getExploreApplicationsMetadata() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/metadata/explore`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // fetchWithAuthAndAutoRefresh ya retorna { success, data?, error? }
  if (!response.success) {
    return { success: false, err: response.error };
  }

  return { success: true, data: response.data.metadata };
}

export async function exploreApplications(facultyId = null, page = 1, limit = 9) {
  let url = `${API_URL}/application/explore?page=${page}&limit=${limit}`;
  if (facultyId) {
    url += `&facultyId=${facultyId}`;
  }

  const response = await fetchWithAuthAndAutoRefresh(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.success) {
    return { success: false, err: response.error };
  }

  const applications = response.data.applications.map((app) => ({
    ...app,
    bannerUrl: app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
  }));

  return { success: true, data: { ...response.data, applications } };
}

export async function getCreateMetadata() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/metadata/create`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // response ya es { success, data?, error? }
  if (!response.success) {
    return { success: false, err: response.error };
  }

  // Convertir URLs de banners a absolutas
  const metadata = response.data.metadata;
  if (metadata.defaultBanners) {
    metadata.defaultBanners = metadata.defaultBanners.map((banner) => ({
      ...banner,
      url: `${API_URL}${banner.url}`,
    }));
  }

  return { success: true, data: metadata };
}

export async function createApplication(formData) {
  // Obtener CSRF token
  const csrfToken = await getCSRFToken();

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/create`,
    {
      method: "POST",
      headers: {
        "csrf-token": csrfToken,
      },
      body: formData,
    }
  );

  // response ya es { success, data?, error? }
  if (!response.success) {
    return {
      success: false,
      err: response.error,
    };
  }

  return { success: true, data: response.data };
}

export async function getProfileStatus() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/profile/status`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.success) {
    return { success: false, err: response.error };
  }

  return { success: true, data: response.data };
}

export async function getApplicationDetails(uuid) {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/${uuid}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.success) {
    return { success: false, err: response.error };
  }

  const app = response.data.application;

  // Convertir URLs relativas a absolutas
  const bannerUrl = app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null;
  const attachments = (app.attachments || []).map((a) => ({
    ...a,
    url: `${API_URL}${a.url}`,
  }));

  return {
    success: true,
    data: {
      ...app,
      bannerUrl,
      attachments,
    },
  };
}