import { useState, useEffect } from 'react';

// Custom hook for fetching data from the API
export function useApiData(apiCall, initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiCall]);

  return { data, loading, error, refetch: apiCall };
}

// Hook for authentication
export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('authToken');
    // Clear invalid/old tokens on load
    if (storedToken) {
      try {
        // Check if token has the new format with userId
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (!payload.userId) {
          // Old token format, clear it
          localStorage.removeItem('authToken');
          return null;
        }
        return storedToken;
      } catch (e) {
        // Invalid token, clear it
        localStorage.removeItem('authToken');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      // This will be implemented when backend is ready
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return { user, token, loading, login, logout, isAuthenticated: !!token };
}
