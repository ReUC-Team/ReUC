import { fetchWithAuthAndAutoRefresh } from "../../lib/api/client";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCSRFToken() {
  const res = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  const { csrfToken } = await res.json();

  return csrfToken;
}

export async function getMetadata() {
  const res = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/metadata`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const bodyRes = await res.json();

  if (!res.ok) {
    return { success: false, err: bodyRes.err };
  }

  const transformedBanners = bodyRes.data.metadata.defaultBanners.map(
    (banner) => {
      return {
        name: banner.name,
        uuid: banner.uuid,
        url: `${API_URL}${banner.url}`,
      };
    }
  );

  const finalMetadata = {
    ...bodyRes.data.metadata,
    defaultBanners: transformedBanners,
  };

  return { success: true, data: finalMetadata };
}

export async function create(data) {
  const csrfToken = await getCSRFToken();

  const res = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/create`,
    {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      body: data,
    }
  );

  const bodyRes = await res.json();

  if (!res.ok) {
    if (res.status === 403)
      return { success: false, err: bodyRes.err, logout: true };

    return { success: false, err: bodyRes.err, logout: false };
  }

  return { success: true, data: bodyRes.data.application };
}
