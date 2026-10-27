import axios from "axios";

const server = process.env.NEXT_PUBLIC_API_URL;

/* ------------------------------------------------------------------ */
/*  Récupère le token (localStorage)                                   */
/* ------------------------------------------------------------------ */
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("Access_Token") || null;
  }
  return null;
};

/* ------------------------------------------------------------------ */
/*  Headers dynamiques                                                 */
/* ------------------------------------------------------------------ */
const defaultHeaders = {};

// ➜ Ajouter la signature, si elle existe
if (process.env.NEXT_PUBLIC_SIGNATURE) {
  defaultHeaders["X-Signature-web"] = process.env.NEXT_PUBLIC_SIGNATURE;
}

/* ------------------------------------------------------------------ */
/*  Instance Axios                                                     */
/* ------------------------------------------------------------------ */
export const api = axios.create({
  baseURL: server,
  headers: defaultHeaders,
});

/* ------------------------------------------------------------------ */
/*  Interceptor : ajoute automatiquement le Bearer token              */
/* ------------------------------------------------------------------ */
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ------------------------------------------------------------------ */
/*  Fonction générique fetchData                                      */
/* ------------------------------------------------------------------ */
export const fetchAPI = async (
  method,
  url,
  { params = {}, body = null, additionalHeaders = {}, isBlob = false } = {},
) => {
  try {
    const headers = { ...additionalHeaders };
    let finalBody = body;

    // ➜ Si ce n’est PAS du FormData → JSON
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      finalBody = JSON.stringify(body);
    }

    const response = await api({
      method,
      url,
      params,
      data: finalBody,
      headers,
      responseType: isBlob ? "blob" : "json",
    });

    return method.toLowerCase() === "get"
      ? isBlob
        ? { data: response.data, headers: response.headers }
        : response.data
      : { status: response.status, data: response.data };
  } catch (error) {
    console.error("API Request Error:", error.response || error);
    throw error;
  }
};
