// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  
  return res.json();
}

export async function createUser(userData: any) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });
  
  if (!res.ok) {
    throw new Error("Failed to create user");
  }
  
  return res.json();
}