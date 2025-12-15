const SUPABASE_URL = "https://citmolazajxwoinaodwy.supabase.co";
const SUPABASE_KEY = "sb_publishable_w-guehqoNgy_13eGOfPWfA_RF6wcOjF";

function saveSession(session) {
  localStorage.setItem("session", JSON.stringify(session));
}

function readSession() {
  const raw = localStorage.getItem("session");
  return raw ? JSON.parse(raw) : null;
}

export const supabaseREST = {
  getSession() {
    return readSession();
  },

  logout() {
    localStorage.removeItem("session");
  },

  async signIn(email, password) {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY
        },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || "Login error");

    saveSession(data);
    return data;
  },

  async signUp(email, password, profileName) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          profile_name: profileName,
          avatar_url: null
        }
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || "Register error");
    return data;
  },

  async getUser() {
    const session = readSession();
    if (!session?.access_token) return null;

    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`
      }
    });

    const data = await res.json();
    if (!res.ok) return null;
    return data;
  },

  async updateUser(metadata) {
    const session = readSession();
    if (!session?.access_token) throw new Error("No session");

    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ data: metadata })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || "Update error");

    // Mantener el session.user actualizado localmente (para HUD, ContinuePage y eso)
    const current = readSession();
    if (current?.user && data?.user_metadata) {
      current.user.user_metadata = data.user_metadata;
      saveSession(current);
    }

    return data;
  },

  async uploadAvatar(file, userId) {
    const session = readSession();
    if (!session?.access_token) throw new Error("No session");

    const path = `${userId}.png`;

    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/avatars/${path}`,
      {
        method: "PUT",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": file.type || "image/png",
          "x-upsert": "true"
        },
        body: file
      }
    );

    if (!res.ok) {
      let msg = "Upload error";
      try {
        const data = await res.json();
        msg = data?.message || data?.error || msg;
      } catch (_) {}
      throw new Error(msg);
    }

    // URL publica (bucket avatars debe ser publico)
    return `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}`;
  }
};
