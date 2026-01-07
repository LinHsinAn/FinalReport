// Harvest Bite simple member system (client-side demo using localStorage)
// Note: For real sites, do authentication on a server and NEVER store passwords in localStorage.

const USERS_KEY = "hb_users";
const CURRENT_KEY = "hb_currentUser";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY)); }
  catch { return null; }
}
function setCurrentUser(user) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}
function clearCurrentUser() {
  localStorage.removeItem(CURRENT_KEY);
}

function byId(id){ return document.getElementById(id); }

function registerSubmit(e){
  e.preventDefault();
  const name = byId("name").value.trim();
  const email = byId("email").value.trim().toLowerCase();
  const password = byId("password").value;
  const phone = byId("phone").value.trim();
  const address = byId("address").value.trim();

  if(!name || !email || !password){
    alert("請填寫姓名、Email、密碼 \nPlease fill in your name, email, and password.");
    return;
  }

  const users = loadUsers();
  if(users.some(u => u.email === email)){
    alert("這個 Email 已經註冊過囉！\nThis email address has already been registered!");
    return;
  }

  const user = {
    id: (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
    name, email,
    password, // demo only
    phone, address,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);

  // auto login (store safe user only)
  const { password: _p, ...safeUser } = user;
  setCurrentUser(safeUser);

  alert("註冊成功！已自動登入。 \nRegister Successful! You are automatically logged in.");
  window.location.href = "member.html";
}

function loginSubmit(e){
  e.preventDefault();
  const email = byId("email").value.trim().toLowerCase();
  const password = byId("password").value;

  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if(!user){
    alert("Email 或密碼不正確 \nIncorrect email or password");
    return;
  }

  const { password: _p, ...safeUser } = user;
  setCurrentUser(safeUser);
  alert("登入成功！\nLog In Successful!");
  window.location.href = "member.html";
}

function requireLogin(){
  const user = getCurrentUser();
  if(!user){
    window.location.href = "login.html";
    return null;
  }
  return user;
}

function logout(){
  clearCurrentUser();
  window.location.href = "login.html";
}

function renderMember(){
  const user = requireLogin();
  if(!user) return;

  byId("welcomeName").textContent = user.name || "會員";
  byId("displayEmail").textContent = user.email || "";
  byId("displayPhone").textContent = user.phone || "（N/A）";
  byId("displayAddress").textContent = user.address || "（N/A）";
}

function updateProfileSubmit(e){
  e.preventDefault();
  const user = requireLogin();
  if(!user) return;

  const name = byId("editName").value.trim();
  const phone = byId("editPhone").value.trim();
  const address = byId("editAddress").value.trim();

  const users = loadUsers();
  const idx = users.findIndex(u => u.email === user.email);
  if(idx === -1){
    alert("找不到會員資料，請重新登入。\nMember information not found. Please log in again.");
    logout();
    return;
  }

  users[idx].name = name || users[idx].name;
  users[idx].phone = phone;
  users[idx].address = address;
  saveUsers(users);

  const { password: _p, ...safeUser } = users[idx];
  setCurrentUser(safeUser);


  renderMember();
}
