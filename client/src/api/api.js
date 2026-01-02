// const API_BASE = process.env.REACT_APP_API_BASE;
const API_BASE = "http://localhost:5000/api";


function getToken() {
  return localStorage.getItem('token');
}

export async function getPosts() {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function createPost(title, content, tags = []) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, content, tags })
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function reactToPost(postId, emoji) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE}/posts/${postId}/react`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ emoji })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to react');
  }
  return res.json();
}

export async function addComment(postId, text) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to comment');
  }
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error('Login failed');

  const data = await res.json();
  localStorage.setItem('token', data.token);
  if (data.user?._id) {
    localStorage.setItem('userId', data.user._id);
    localStorage.setItem('username', data.user.username || '');
  }
  return data;
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}  

export async function getMyProfile() {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }

  return res.json();
}


export async function getPublicProfile(id) {
  const res = await fetch(`${API_BASE}/users/public/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch public profile');
  }
  
  return res.json();
}

export async function updateProfile(data) {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const res = await fetch(`${API_BASE}/users/me`, {
    method:'PUT',
    headers:{ 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update profile');
  }
  
  return res.json();
}


// Keep your other functions: registerUser, getMyProfile, etc.