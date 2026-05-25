const USER_TOKEN_KEY = "scaleops_user_token";
const ADMIN_TOKEN_KEY = "scaleops_admin_token";
let memoryUserToken = "";
let memoryAdminToken = "";

function getStorageToken(storage, key) {
  if (typeof window === "undefined") {
    return "";
  }

  if (key === USER_TOKEN_KEY) {
    storage.removeItem(key);
    return memoryUserToken;
  }

  if (key === ADMIN_TOKEN_KEY) {
    storage.removeItem(key);
    return memoryAdminToken;
  }

  return storage.getItem(key) ?? "";
}

function setStorageToken(storage, key, token) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    if (key === USER_TOKEN_KEY) {
      memoryUserToken = token;
      storage.removeItem(key);
      return;
    }

    if (key === ADMIN_TOKEN_KEY) {
      memoryAdminToken = token;
      storage.removeItem(key);
      return;
    }

    storage.setItem(key, token);
    return;
  }

  if (key === USER_TOKEN_KEY) {
    memoryUserToken = "";
  }

  if (key === ADMIN_TOKEN_KEY) {
    memoryAdminToken = "";
  }

  storage.removeItem(key);
}

export function getStoredUserToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return getStorageToken(window.localStorage, USER_TOKEN_KEY);
}

export function setStoredUserToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  setStorageToken(window.localStorage, USER_TOKEN_KEY, token);
}

export function getStoredAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return getStorageToken(window.sessionStorage, ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  setStorageToken(window.sessionStorage, ADMIN_TOKEN_KEY, token);
}

export function clearStoredAdminToken() {
  setStoredAdminToken("");
}
