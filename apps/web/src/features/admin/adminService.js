import { fetchWithAuthAndAutoRefresh } from "../../lib/api/client";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCSRFToken() {
  const res = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  const { csrfToken } = await res.json();

  return csrfToken;
}

export async function getTables() {
  const res = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/admin/meta/tables`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const bodyRes = await res.json();

  if (!res.ok) {
    if (res.status === 403 || res.status === 401)
      return { success: false, err: bodyRes.err, authorized: false };

    return { success: false, err: bodyRes.err, authorized: true };
  }

  return { success: true, data: bodyRes.data };
}

export async function getFields(table) {
  const res = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/admin/meta/tables/${table}/fields`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const bodyRes = await res.json();

  if (!res.ok) {
    const errorResponse = {
      success: false,
      found: false,
      authorized: res.status !== 403,
      err: bodyRes.err,
    };

    if (res.status === 404) {
      errorResponse.success = true;
      errorResponse.data = {};
    }

    return errorResponse;
  }

  return {
    success: true,
    found: true,
    data: bodyRes.data,
  };
}

export async function getRecords(table, page, perPage, query, sort) {
  const csrfToken = await getCSRFToken();

  const res = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/admin/data/${table}`,
    {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page, perPage, query, sort }),
    }
  );

  const bodyRes = await res.json();

  if (!res.ok) {
    if (res.status === 403) {
      return {
        success: false,
        found: false,
        authorized: false,
        err: bodyRes.err,
      };
    } else if (res.status === 404) {
      return {
        success: true,
        found: false,
        authorized: true,
        err: bodyRes.err,
      };
    }

    return {
      success: false,
      found: false,
      authorized: true,
      err: bodyRes.err,
    };
  }

  return {
    success: true,
    found: true,
    data: bodyRes.data,
  };
}
