// guard.js
// ใส่ไฟล์นี้ในหน้าที่ต้องล็อก เช่น index / stock / add-stock / product / report

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    const emailBox = document.getElementById("currentUserEmail");
    if (emailBox) emailBox.textContent = user.email;
  }
});

function logout(){
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
