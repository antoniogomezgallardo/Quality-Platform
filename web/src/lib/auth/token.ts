import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY = 7; // 7 days

export const tokenManager = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { 
      expires: TOKEN_EXPIRY,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  hasToken: (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
  }
};

// JWT decode utility (simple implementation without external library)
export const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};