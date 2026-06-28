// guard.js
// Firebase Auth + Role Permission
// Roles from Google Sheet Users:
// admin = ทุกหน้า
// staff = index.html, add-stock.html เท่านั้น

const API_URL_FOR_ROLE = "https://script.google.com/macros/s/AKfycbxRMzXHblOqxkswl-ocO6VTnGkxaie4fx9yfqOboeAno5bLKynHdXqaxmqRIk-vHpICHg/exec";

const ROLE_PAGES = {
  admin: ["index.html", "stock.html", "add-stock.html", "product.html", "report.html"],
  staff: ["index.html", "add-stock.html"]
};

let CURRENT_USER_EMAIL = "";
let CURRENT_USER_ROLE = "";

function getCurrentPageName(){
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1) || "index.html";
}

function isPageAllowed(role, page){
  const allowed = ROLE_PAGES[role] || [];
  return allowed.includes(page);
}

async function fetchUserRole(email){
  const url =
    API_URL_FOR_ROLE +
    "?action=getUserRole" +
    "&email=" + encodeURIComponent(email);

  const res = await fetch(url);
  return await res.json();
}

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  CURRENT_USER_EMAIL = user.email || "";

  const emailBox = document.getElementById("currentUserEmail");
  if (emailBox) emailBox.textContent = CURRENT_USER_EMAIL;

  try {
    const result = await fetchUserRole(CURRENT_USER_EMAIL);

    if (!result.success) {
      alert("บัญชีนี้ยังไม่มีสิทธิ์ใช้งานระบบ หรือถูกปิดใช้งาน");
      await auth.signOut();
      window.location.href = "login.html";
      return;
    }

    CURRENT_USER_ROLE = result.role || "staff";

    const roleBox = document.getElementById("currentUserRole");
    if (roleBox) roleBox.textContent = CURRENT_USER_ROLE;

    const page = getCurrentPageName();

    if (!isPageAllowed(CURRENT_USER_ROLE, page)) {
      alert("บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานหน้านี้");
      window.location.href = CURRENT_USER_ROLE === "staff" ? "index.html" : "login.html";
      return;
    }

    document.body.dataset.role = CURRENT_USER_ROLE;
    window.CURRENT_USER_EMAIL = CURRENT_USER_EMAIL;
    window.CURRENT_USER_ROLE = CURRENT_USER_ROLE;

    applyMenuPermission(CURRENT_USER_ROLE);

    if (typeof applyRoleUI === "function") {
      applyRoleUI(CURRENT_USER_ROLE);
    }

  } catch (err) {
    alert("ตรวจสอบสิทธิ์ไม่สำเร็จ: " + err.message);
    await auth.signOut();
    window.location.href = "login.html";
  }
});

function logout(){
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}


function applyMenuPermission(role){
  if(role !== "staff") return;

  const disabledPages = ["stock.html", "product.html", "report.html"];

  document.querySelectorAll(".nav a").forEach(link => {
    const href = link.getAttribute("href");

    if(disabledPages.includes(href)){
      link.style.background = "#e5e7eb";
      link.style.color = "#9ca3af";
      link.style.borderColor = "#d1d5db";
      link.style.pointerEvents = "none";
      link.style.opacity = "0.8";
      link.style.cursor = "not-allowed";
      link.title = "ไม่มีสิทธิ์เข้าใช้งาน";
    }
  });
}
