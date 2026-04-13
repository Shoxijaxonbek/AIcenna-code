const TOKEN_KEY = 'holomed_token';
const USER_KEY  = 'holomed_user';

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export async function login(username, password) {
  const DEMO = [
    { username:'admin',  password:'admin123',  full_name:'Administrator'  },
    { username:'talaba', password:'talaba123', full_name:'Talaba'         },
    { username:'doktor', password:'doktor123', full_name:'Dr. Abdullayev' },
  ];
  const user = DEMO.find(u => u.username === username && u.password === password);
  if (!user) throw new Error("Login yoki parol noto'g'ri");
  localStorage.setItem(TOKEN_KEY, btoa(username + ':' + Date.now()));
  localStorage.setItem(USER_KEY, JSON.stringify({ username: user.username, full_name: user.full_name }));
  return user;
}
