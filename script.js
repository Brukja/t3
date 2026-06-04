function tampilkanGreeting() {
  var el = document.getElementById("greetingText");
  if (!el) return;
  var jam = new Date().getHours();
  var sapa = jam < 11 ? "🌤️ Selamat Pagi"
           : jam < 15 ? "☀️ Selamat Siang"
           : jam < 19 ? "🌆 Selamat Sore"
           : "🌙 Selamat Malam";
  var nama = sessionStorage.getItem("namaUser") || "Pengguna";
  el.innerHTML = sapa + ", <strong>" + nama + "!</strong>";
}

function tampilkanJam() {
  var el = document.getElementById("jamSekarang");
  if (!el) return;
  var now = new Date();
  el.textContent = now.toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
}

function cekSession() {
  var halaman = window.location.pathname.split("/").pop();
  var halProteksi = ["dashboard.html","stok.html","tracking.html"];
  if (halProteksi.includes(halaman)) {
    if (!sessionStorage.getItem("loginUser")) {
      alert("Sesi habis! Silakan login kembali.");
      window.location.href = "index.html";
    }
  }
}

function logout() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    sessionStorage.clear();
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  cekSession();
  tampilkanGreeting();
  tampilkanJam();
  setInterval(tampilkanJam, 1000);

  var namaEl = document.getElementById("namaUserNav");
  if (namaEl) namaEl.textContent = sessionStorage.getItem("namaUser") || "-";

  var avatarEl = document.getElementById("avatarNav");
  if (avatarEl) {
    var nama = sessionStorage.getItem("namaUser") || "?";
    avatarEl.textContent = nama.charAt(0).toUpperCase();
  }

  var roleEl = document.getElementById("roleUserNav");
  if (roleEl) roleEl.textContent = sessionStorage.getItem("roleUser") || "-";
});