// // src/scripts/utils/api.js
// import CONFIG from '../config.js';

// const BASE = CONFIG.BASE_URL; // https://story-api.dicoding.dev/v1

// async function request(url, method = 'GET', data = null, token = null) {
//   const headers = {};
//   if (token) headers['Authorization'] = `Bearer ${token}`;

//   let options = { method, headers };

//   if (data) {
//     if (data instanceof FormData) {
//       // multipart/form-data otomatis ditangani oleh FormData
//       options.body = data;
//     } else {
//       headers['Content-Type'] = 'application/json';
//       options.body = JSON.stringify(data);
//     }
//   }

//   const response = await fetch(`${BASE_URL}${url}`, options);
//   return response.json();
// }

// export const StoryAPI = {
//   async getStories({ location = 0, token }) {
//     return await request(`/stories?location=${location}`, 'GET', null, token);
//   },

//   async getStoryDetail(id, token) {
//     return await request(`/stories/${id}`, 'GET', null, token);
//   },

//   /**
//    * Login existing user, save token
//    * POST /login
//    */
//   login: async ({ email, password }) => {
//     const res = await fetch(`${BASE}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     const data = await res.json();
//     if (!data.error) {
//       localStorage.setItem('token', data.loginResult.token);
//     }
//     return data;
//   },

//   /**
//    * Logout (clear token)
//    */
//   logout: () => {
//     localStorage.removeItem('token');
//   },

//   /**
//    * Get all stories (requires auth)
//    * GET /stories?page=&size=&location=
//    * location: 1 = include location, 0 = ignore location
//    */
//   getStories: async ({ page = 1, size = 20, location = 0 } = {}) => {
//     const token = localStorage.getItem('token') || '';
//     const url = new URL(`${BASE}/stories`);
//     url.searchParams.append('page', page);
//     url.searchParams.append('size', size);
//     url.searchParams.append('location', location);
//     const res = await fetch(url.toString(), {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.json();
//   },

//   /**
//    * Get story detail by ID (requires auth)
//    * GET /stories/:id
//    */
//   getStoryDetail: async (id) => {
//     if (!id) throw new Error('Story ID is required');
//     const token = localStorage.getItem('token') || '';
//     const res = await fetch(`${BASE}/stories/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.json();
//   },

//   /**
//    * Add a new story (requires auth)
//    * POST /stories
//    */
//   addStory: async ({ description, photo, lat, lon }) => {
//     const token = localStorage.getItem('token') || '';
//     const fd = new FormData();
//     fd.append('description', description);
//     fd.append('photo', photo);
//     if (lat !== undefined && lon !== undefined) {
//       fd.append('lat', lat);
//       fd.append('lon', lon);
//     }
//     const res = await fetch(`${BASE}/stories`, {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${token}` },
//       body: fd,
//     });
//     return res.json();
//   },

//   /**
//    * Add a story as guest (no auth)
//    * POST /stories/guest
//    */
//   addStoryGuest: async ({ description, photo, lat, lon }) => {
//     const fd = new FormData();
//     fd.append('description', description);
//     fd.append('photo', photo);
//     if (lat !== undefined && lon !== undefined) {
//       fd.append('lat', lat);
//       fd.append('lon', lon);
//     }
//     const res = await fetch(`${BASE}/stories/guest`, {
//       method: 'POST',
//       body: fd,
//     });
//     return res.json();
//   },

//   /**
//    * Subscribe to push notifications
//    * POST /notifications/subscribe
//    */
//   subscribePush: async ({ endpoint, keys: { p256dh, auth } }) => {
//     const token = localStorage.getItem('token') || '';
//     const res = await fetch(`${BASE}/notifications/subscribe`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ endpoint, keys: { p256dh, auth } }),
//     });
//     return res.json();
//   },

//   /**
//    * Unsubscribe from push notifications
//    * DELETE /notifications/subscribe
//    */
//   unsubscribePush: async ({ endpoint }) => {
//     const token = localStorage.getItem('token') || '';
//     const res = await fetch(`${BASE}/notifications/subscribe`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ endpoint }),
//     });
//     return res.json();
//   },
// };
// src/scripts/utils/api.js
import CONFIG from '../config.js';

const BASE = CONFIG.BASE_URL;

/**
 * Generic request helper
 */
async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, options);
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || `HTTP ${response.status}`);
  }
  return json;
}

export const StoryAPI = {
  // Register new user
  register: (payload) =>
    request('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  // Login user and store token
  login: async (payload) => {
    const data = await request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!data.error) {
      localStorage.setItem('token', data.loginResult.token);
    }
    return data;
  },

  // Fetch all stories
  getStories: (opts = {}) => {
    const { page = 1, size = 20, location = 0 } = opts;
    const token = localStorage.getItem('token') || '';
    const params = new URLSearchParams({ page, size, location });
    return request(`/stories?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Fetch detail of one story
  getStoryDetail: (id) => {
    if (!id) return Promise.reject(new Error('Story ID is required'));
    const token = localStorage.getItem('token') || '';
    return request(`/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Add new story (authenticated)
  addStory: (payload) => {
    const token = localStorage.getItem('token') || '';
    const form = new FormData();
    form.append('description', payload.description);
    form.append('photo', payload.photo);
    if (payload.lat != null && payload.lon != null) {
      form.append('lat', payload.lat);
      form.append('lon', payload.lon);
    }
    return request('/stories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
  },

  // Add new story as guest (no auth)
  addStoryGuest: (payload) => {
    const form = new FormData();
    form.append('description', payload.description);
    form.append('photo', payload.photo);
    if (payload.lat != null && payload.lon != null) {
      form.append('lat', payload.lat);
      form.append('lon', payload.lon);
    }
    return request('/stories/guest', {
      method: 'POST',
      body: form,
    });
  },

  // Push subscription
  subscribePush: (payload) => {
    const token = localStorage.getItem('token') || '';
    return request('/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Unsubscribe
  unsubscribePush: (payload) => {
    const token = localStorage.getItem('token') || '';
    return request('/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  
  // Logout
   logout: () => {
    localStorage.removeItem('token');
  },
};