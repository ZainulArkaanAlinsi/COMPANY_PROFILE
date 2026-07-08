/* ============================================================
   PC.carapiBrowser — browser CarAPI /api/carapi
   Cari trim resmi dan tambahkan ke daftar minat.
   ============================================================ */
window.PC = window.PC || {};

PC.carapiBrowser = (function () {
    var $, el, refs = {};
    var trimCache = [];

    function title(value) {
        return String(value || "").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
    function setStatus(message, kind) {
        if (!refs.status) return;
        refs.status.textContent = message;
        refs.status.className = "cab-status" + (kind ? " cab-status--" + kind : "");
    }
    function createOption(value, label) {
        var opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        return opt;
    }
    function disableFields(state) {
        if (refs.make) refs.make.disabled = state;
        if (refs.model) refs.model.disabled = state;
        if (refs.trim) refs.trim.disabled = state;
        if (refs.refresh) refs.refresh.disabled = state;
    }
    function normalizeId(text) {
        return String(text || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "");
    }
    function makeSiteId(make, model, trim, year) {
        return ["carapi", normalizeId(make), normalizeId(model), normalizeId(trim || "base"), normalizeId(year || "0")].filter(Boolean).join("-");
    }
    function guessCategory(text) {
        var s = String(text || "").toLowerCase();
        if (/electric|ev/.test(s)) return "electric";
        if (/suv|cross|wagon|van|mpv|pickup|truck/.test(s)) return "suv";
        if (/family|minivan|sedan/.test(s)) return "family";
        if (/coupe|roadster|gt|supercar|hypercar|sport/.test(s)) return "sport";
        return "sport";
    }
    function guessPrice(year) {
        var y = parseInt(year, 10) || new Date().getFullYear();
        var base = 1200000000;
        var delta = Math.max(0, 2025 - y);
        return Math.max(250000000, base - delta * 30000000);
    }
    function factoryCar(trimObj, make, model) {
        var trim = trimObj || {};
        var brand = make || trim.make || "Unknown";
        var name = [brand, model || trim.model, trim.trim || trim.name].filter(Boolean).join(" ");
        var year = trim.year || (Array.isArray(trim.years) ? trim.years[0] : null) || new Date().getFullYear();
        var price = trim.price || trim.msrp || guessPrice(year);
        var image = (trim.images && trim.images[0]) || trim.photo || "image/side-view-white-modern-car-outdoors.png";
        var car = {
            id: makeSiteId(brand, model || trim.model, trim.trim || trim.name || "base", year),
            name: name || "CarAPI Unit",
            brand: brand,
            category: guessCategory(trim.body_type || trim.vehicle_type || trim.trim || trim.name),
            price: price,
            year: year,
            image: image,
            badge: trim.trim || "CarAPI",
            featured: false,
            specs: {
                topSpeed: trim.top_speed || trim.topSpeed || 240,
                power: trim.horsepower || trim.hp || 280,
                seats: trim.seats || 5,
                transmission: trim.transmission || trim.gearbox || "Automatic",
            },
        };
        return car;
    }

    function showTrimDetails(make, model, trim) {
        if (!refs.results) return;
        refs.results.innerHTML = "";
        if (!trim) {
            refs.results.appendChild(el("p", { class: "cab-empty" }, ["Pilih trim untuk melihat detail unit."]));
            return;
        }
        var year = trim.year || (Array.isArray(trim.years) ? trim.years[0] : "—");
        var priceLabel = trim.price ? PC.format.rupiah(trim.price) : "Estimasi hubungi dealer";
        var details = [
            { label: "Tahun", value: year },
            { label: "Mesin", value: trim.engine || trim.engine_type || trim.displacement || "—" },
            { label: "Tenaga", value: trim.horsepower ? trim.horsepower + " hp" : trim.hp ? trim.hp + " hp" : "—" },
            { label: "Transmisi", value: trim.transmission || trim.gearbox || "—" },
            { label: "Penggerak", value: trim.drive || trim.drive_type || "—" },
            { label: "Bahan Bakar", value: trim.fuel_type || trim.fuel || "—" },
            { label: "Body", value: trim.body_type || trim.vehicle_type || "—" },
            { label: "Harga", value: priceLabel },
        ];

        var card = el("article", { class: "cab-card" }, [
            el("h3", {}, [title(make) + " " + title(model) + " " + title(trim.trim || trim.name || "")]),
            el("div", { class: "cab-card__meta" }, ["Cek trim resmi dari CarAPI"]),
            el("div", { class: "cab-card__grid" }, details.map(function (item) {
                return el("div", { class: "cab-card__row" }, [
                    el("span", { class: "cab-card__label" }, [item.label]),
                    el("span", { class: "cab-card__value" }, [item.value]),
                ]);
            })),
            el("button", { class: "btn-solid", type: "button", onclick: function () { addToInterest(trim, make, model); } }, ["Tambah ke daftar minat"]),
        ]);

        refs.results.appendChild(card);
    }

    function addToInterest(trim, make, model) {
        var car = factoryCar(trim, make, model);
        if (!PC.getCar(car.id)) {
            PC.cars = PC.cars.concat([car]);
            if (PC.catalog && PC.catalog.refresh) PC.catalog.refresh();
        }
        PC.store.cart.add(car.id);
        PC.ui.toast(car.name + " ditambahkan ke daftar minat", "success");
    }

    function loadModels(make) {
        refs.model.innerHTML = "";
        refs.model.appendChild(createOption("", "Muat model…"));
        refs.model.disabled = true;
        refs.trim.innerHTML = "";
        refs.trim.appendChild(createOption("", "Pilih model dulu"));
        refs.trim.disabled = true;
        setStatus("Memuat model untuk " + title(make) + "…");

        return PC.carapiCarAPI.models({ make: make }).then(function (data) {
            var items = Array.isArray(data) ? data : [];
            if (!items.length) throw new Error("Tidak ada model tersedia.");
            refs.model.innerHTML = "";
            refs.model.appendChild(createOption("", "Pilih model"));
            items.forEach(function (item) {
                var label = item.name || item.model || item;
                if (label != null) refs.model.appendChild(createOption(String(label), title(label)));
            });
            refs.model.disabled = false;
            setStatus("Pilih model untuk memuat trim.");
        }).catch(function (err) {
            setStatus("Gagal memuat model: " + err.message, "error");
            refs.model.disabled = true;
            refs.trim.disabled = true;
        });
    }

    function loadTrims(make, model) {
        refs.trim.innerHTML = "";
        refs.trim.appendChild(createOption("", "Muat trim…"));
        refs.trim.disabled = true;
        setStatus("Memuat trim " + title(model) + "…");

        return PC.carapiCarAPI.trims({ make: make, model: model }).then(function (data) {
            var items = Array.isArray(data) ? data : [];
            if (!items.length) throw new Error("Tidak ada trim tersedia.");
            trimCache = items;
            refs.trim.innerHTML = "";
            refs.trim.appendChild(createOption("", "Pilih trim"));
            items.forEach(function (item, index) {
                var label = item.trim || item.name || title(item.year || "") + " " + title(item.trim || item.name || "");
                refs.trim.appendChild(createOption(String(index), title(label)));
            });
            refs.trim.disabled = false;
            setStatus(items.length + " trim tersedia. Pilih trim untuk melihat detail.");
        }).catch(function (err) {
            setStatus("Gagal memuat trim: " + err.message, "error");
            refs.trim.disabled = true;
        });
    }

    function onMakeChange() {
        var make = refs.make.value;
        if (!make) {
            setStatus("Pilih merek terlebih dahulu.");
            refs.model.innerHTML = "";
            refs.model.appendChild(createOption("", "Pilih merek dulu"));
            refs.trim.innerHTML = "";
            refs.trim.appendChild(createOption("", "Pilih model dulu"));
            refs.model.disabled = true;
            refs.trim.disabled = true;
            return;
        }
        loadModels(make);
    }

    function onModelChange() {
        var make = refs.make.value;
        var model = refs.model.value;
        if (!make || !model) {
            refs.trim.innerHTML = "";
            refs.trim.appendChild(createOption("", "Pilih model dulu"));
            refs.trim.disabled = true;
            return;
        }
        loadTrims(make, model);
    }

    function onTrimChange() {
        var index = parseInt(refs.trim.value, 10);
        var make = refs.make.value;
        var model = refs.model.value;
        if (Number.isNaN(index) || !trimCache[index]) {
            showTrimDetails(make, model, null);
            return;
        }
        showTrimDetails(make, model, trimCache[index]);
    }

    function init() {
        $ = PC.ui.$;
        el = PC.ui.el;
        refs.make = $("#cab-make");
        refs.model = $("#cab-model");
        refs.trim = $("#cab-trim");
        refs.refresh = $("#cab-refresh");
        refs.status = $("#cab-status");
        refs.results = $("#cab-results");
        if (!refs.make || !refs.model || !refs.trim || !refs.refresh || !refs.status || !refs.results) return;

        if (!PC.carapiCarAPI || !PC.carapiCarAPI.available()) {
            setStatus("CarAPI hanya tersedia saat dijalankan lewat server / proxy API.", "warn");
            disableFields(true);
            return;
        }

        refs.make.addEventListener("change", onMakeChange);
        refs.model.addEventListener("change", onModelChange);
        refs.trim.addEventListener("change", onTrimChange);
        refs.refresh.addEventListener("click", function () {
            var make = refs.make.value;
            var model = refs.model.value;
            if (!make || !model) {
                setStatus("Pilih merek dan model sebelum memuat trim.", "warn");
                return;
            }
            loadTrims(make, model);
        });

        refs.make.appendChild(createOption("", "Muat merek…"));
        refs.model.appendChild(createOption("", "Pilih merek dulu"));
        refs.trim.appendChild(createOption("", "Pilih model dulu"));
        disableFields(false);
        loadMakes();
    }

    function loadMakes() {
        setStatus("Memuat daftar merek CarAPI…");
        disableFields(true);
        return PC.carapiCarAPI.makes().then(function (data) {
            var items = Array.isArray(data) ? data : [];
            if (!items.length) throw new Error("Tidak ada merek tersedia.");
            refs.make.innerHTML = "";
            refs.make.appendChild(createOption("", "Pilih merek"));
            items.forEach(function (item) {
                var name = item.name || item.make || item;
                if (name != null) refs.make.appendChild(createOption(String(name), title(name)));
            });
            refs.make.disabled = false;
            refs.model.disabled = true;
            refs.trim.disabled = true;
            refs.refresh.disabled = false;
            setStatus("Pilih merek untuk memuat model.");
            return items;
        }).catch(function (err) {
            var cfg = /belum di-set|not set|unauthor|401|403|500/i.test(err.message || "");
            setStatus(cfg
                ? "CarAPI Lookup sedang dikonfigurasi — fitur aktif setelah kredensial CarAPI dipasang."
                : "Gagal memuat data CarAPI. Coba lagi nanti.", "warn");
            disableFields(true);
        });
    }

    return { init: init };
})();
