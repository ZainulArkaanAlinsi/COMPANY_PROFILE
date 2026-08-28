/* ============================================================
   PC.forms — validasi kontak & newsletter. Lihat SDD.md §5.5 & §8
   ============================================================ */
window.PC = window.PC || {};

PC.forms = (function () {
  var $ = PC.ui.$, $$ = PC.ui.$$, el = PC.ui.el;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function container(input) {
    return input.closest(".input-box, .input_group, .field") || input.parentNode;
  }
  function clearError(input) {
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    var c = container(input);
    var old = c.querySelector(".field-error");
    if (old) old.remove();
  }
  function setError(input, msg) {
    clearError(input);
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    container(input).appendChild(el("small", { class: "field-error" }, [msg]));
  }
  function check(input, rule, msg) {
    if (!rule) { setError(input, msg); return false; }
    clearError(input);
    return true;
  }
  function notEmpty(v) { return v && v.trim().length > 0; }

  /* Pesan error dibersihkan begitu pengguna mengetik lagi. Listener dipasang
     SEKALI per input — versi sebelumnya menambah listener baru pada tiap
     percobaan submit sehingga menumpuk selama pengguna belum mengetik. */
  function bindClearOnInput(input) {
    if (input.dataset.pcClearBound) return;
    input.dataset.pcClearBound = "1";
    input.addEventListener("input", function () { clearError(input); });
  }

  /** validasi sekumpulan field; fokus error pertama; return bool */
  function run(fields) {
    var ok = true, firstBad = null;
    fields.forEach(function (f) {
      if (!f.input) return;
      var v = f.input.value == null ? "" : String(f.input.value);
      var pass = true;
      if (f.type === "email") pass = EMAIL.test(v.trim());
      else if (f.type === "tel") pass = /\d{8,}/.test(v.replace(/\D/g, ""));
      else pass = notEmpty(v);
      if (!check(f.input, pass, f.msg)) { ok = false; firstBad = firstBad || f.input; }
      bindClearOnInput(f.input);
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  /* ---------------- Newsletter (Home) ---------------- */
  function initNewsletter() {
    var form = $(".news_container form");
    if (!form) return;
    var email = form.querySelector("input");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = run([{ input: email, type: "email", msg: "Email tidak valid." }]);
      if (!ok) return;
      PC.ui.toast("Terima kasih! Anda berlangganan info terbaru.", "success");
      form.reset();
    });
  }

  /* ---------------- Kontak: Katalog (.submit-form) ---------------- */
  function initContactPenjualan() {
    var form = $(".submit-form form");
    if (!form) return;
    var name = form.querySelector('input[type="text"]');
    var email = form.querySelector('input[type="email"]');
    var phone = form.querySelector('input[type="tel"]');
    var msg = form.querySelector("textarea");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = run([
        { input: name, type: "text", msg: "Nama wajib diisi." },
        { input: email, type: "email", msg: "Email tidak valid." },
        { input: phone, type: "tel", msg: "Nomor telepon minimal 8 digit." },
        { input: msg, type: "text", msg: "Pesan wajib diisi." },
      ]);
      if (!ok) return;
      PC.ui.toast("Pesan terkirim. Tim kami akan menghubungi Anda.", "success");
      form.reset();
    });
  }

  /* ---------------- Kontak: About (.Contact_form) ---------------- */
  function initContactAbout() {
    var form = $(".Contact_form");
    if (!form) return;
    var inputs = $$(".Contact_input", form);
    var name = inputs[0], email = inputs[1], msg = inputs[2];
    var btn = form.querySelector(".Contact_button");
    function submit(e) {
      if (e) e.preventDefault();
      var ok = run([
        { input: name, type: "text", msg: "Nama wajib diisi." },
        { input: email, type: "email", msg: "Email tidak valid." },
        { input: msg, type: "text", msg: "Pesan wajib diisi." },
      ]);
      if (!ok) return;
      PC.ui.toast("Pesan terkirim. Terima kasih!", "success");
      form.reset();
    }
    /* Tombolnya bertipe submit, jadi listener "submit" pada form sudah
       menangkap klik maupun Enter. Menambah listener click di tombol hanya
       menduplikasi jalur yang sama. */
    form.addEventListener("submit", submit);
    if (btn && btn.type !== "submit") btn.addEventListener("click", submit);
  }

  return {
    initNewsletter: initNewsletter,
    initContactPenjualan: initContactPenjualan,
    initContactAbout: initContactAbout,
  };
})();
