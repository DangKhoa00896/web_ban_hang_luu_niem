(function () {
  const USER_STORAGE_KEY = "smile-shop-user";
  const form = document.getElementById("login-form");
  const nameInput = document.getElementById("login-name");
  const emailInput = document.getElementById("login-email");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
  } catch (error) {
    user = null;
  }

  if (user && user.fullName) {
    nameInput.value = user.fullName;
    emailInput.value = user.email || "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (!fullName || !email) return;

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        fullName: fullName,
        email: email,
        loggedInAt: new Date().toISOString()
      })
    );

    alert("Đăng nhập thành công!");
    window.location.href = "trangchu.html";
  });
})();
