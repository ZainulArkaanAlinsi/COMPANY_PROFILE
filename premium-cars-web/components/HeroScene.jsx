"use client";

// Lapisan 3D hero — siluet mobil low-poly berputar pelan di dalam aliran udara
// bergaya terowongan angin. Dirender penuh dengan WebGL (three.js).
//
// Keputusan yang menentukan bentuk komponen ini:
//   - Dimuat lewat dynamic import di sisi pemanggil, jadi three.js tidak ikut
//     bundle awal dan tidak menahan render pertama.
//   - Berhenti total saat tab tidak terlihat, saat elemen keluar viewport, dan
//     saat pengguna memilih "reduce motion". Hero yang memutar GPU di latar
//     belakang adalah cara tercepat menghabiskan baterai ponsel.
//   - Kalau WebGL tidak tersedia, komponen mengembalikan null dan hero tetap
//     tampil utuh tanpa lapisan ini.

import { useEffect, useRef } from "react";

const PROFILE = [
  // Profil samping mobil, satuan sembarang, digambar searah jarum jam dari
  // hidung: kap, kaca depan, atap, kaca belakang, buritan, lalu sill dengan
  // dua lengkung spakbor. Lengkungnya sengaja dalam (naik sampai y≈0,06) —
  // versi dangkal membuat roda menggantung di luar bodi seperti jangkungan.
  [-2.45, -0.30], [-2.52, 0.02], [-2.28, 0.22], [-1.72, 0.32],
  [-1.10, 0.36], [-0.58, 0.74], [0.14, 0.88], [0.80, 0.82],
  [1.30, 0.44], [1.96, 0.34], [2.44, 0.22], [2.52, -0.06],
  [2.44, -0.32],
  // spakbor belakang
  [1.74, -0.32], [1.66, -0.06], [1.44, 0.06], [1.06, 0.06],
  [0.84, -0.06], [0.76, -0.32],
  // sill tengah
  [-0.78, -0.32],
  // spakbor depan
  [-0.86, -0.06], [-1.08, 0.06], [-1.46, 0.06], [-1.68, -0.06],
  [-1.76, -0.32],
];

export default function HeroScene({ className = "" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    // three.js hanya diambil kalau lapisan ini benar-benar akan dipakai.
    import("three")
      .then((THREE) => {
        if (disposed) return;

        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          return; // Tanpa WebGL: hero tetap utuh, hanya tanpa lapisan 3D.
        }

        const w = () => host.clientWidth || 1;
        const h = () => host.clientHeight || 1;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w(), h());
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, w() / h(), 0.1, 100);
        camera.position.set(0, 0.7, 9.4);
        camera.lookAt(0, 0.05, 0);

        const AMBER = new THREE.Color(0xc8873f);
        const LINE = new THREE.Color(0x7d7266);

        // ── Bodi: profil 2D di-ekstrusi jadi bentuk 3D, lalu digambar sebagai
        //    rangka tepi. Wireframe penuh terlihat kacau; edges hanya
        //    menggambar batas geometri sehingga siluetnya tetap terbaca.
        const shape = new THREE.Shape();
        PROFILE.forEach(([x, y], i) =>
          i ? shape.lineTo(x, y) : shape.moveTo(x, y)
        );
        shape.closePath();

        const body = new THREE.ExtrudeGeometry(shape, {
          depth: 1.85,
          bevelEnabled: true,
          bevelThickness: 0.16,
          bevelSize: 0.16,
          bevelSegments: 3,
          curveSegments: 8,
        });
        body.translate(0, 0, -0.925);

        const car = new THREE.Group();
        car.add(
          new THREE.LineSegments(
            new THREE.EdgesGeometry(body, 18),
            new THREE.LineBasicMaterial({
              color: AMBER,
              transparent: true,
              opacity: 0.55,
            })
          )
        );
        // Permukaan gelap semi-transparan supaya rangka belakang tidak tembus
        // dan bentuknya terbaca sebagai benda padat.
        car.add(
          new THREE.Mesh(
            body,
            new THREE.MeshBasicMaterial({
              color: 0x14100c,
              transparent: true,
              opacity: 0.88,
            })
          )
        );

        // ── Roda. TorusGeometry sudah tegak di bidang XY dengan normal ke
        //    sumbu Z — arah yang tepat untuk roda mobil dilihat dari samping.
        //    Memutarnya lagi justru membuatnya menyamping dan terbaca sebagai
        //    oval melayang, bukan roda.
        const TYRE_R = 0.42;
        const rim = new THREE.TorusGeometry(TYRE_R, 0.05, 8, 30);
        const rimMat = new THREE.LineBasicMaterial({
          color: LINE,
          transparent: true,
          opacity: 0.62,
        });
        const rimWire = new THREE.EdgesGeometry(rim, 24);

        // Jari-jari: garis lurus dari pusat ke pelek.
        const spokePts = [];
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          spokePts.push(0, 0, 0, Math.cos(a) * TYRE_R, Math.sin(a) * TYRE_R, 0);
        }
        const spokeGeo = new THREE.BufferGeometry();
        spokeGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(spokePts), 3)
        );

        const wheels = [];
        for (const [x, z] of [
          [-1.27, 0.95], [-1.27, -0.95], [1.25, 0.95], [1.25, -0.95],
        ]) {
          const wheel = new THREE.Group();
          wheel.add(new THREE.LineSegments(rimWire, rimMat));
          wheel.add(new THREE.LineSegments(spokeGeo, rimMat));
          wheel.position.set(x, -0.16, z);
          car.add(wheel);
          wheels.push(wheel);
        }

        car.rotation.y = -0.5;
        car.scale.setScalar(1.15);
        car.position.y = 0.14;
        scene.add(car);

        // ── Aliran udara: garis-garis pendek yang meluncur melewati bodi.
        //    Sumbu X dipakai sebagai arah aliran; posisi Y/Z acak tapi
        //    dijauhkan dari sumbu tengah agar tidak menembus mobil.
        const N = 190;
        const pos = new Float32Array(N * 6);
        const speed = new Float32Array(N);
        const rand = (a, b) => a + Math.random() * (b - a);

        for (let i = 0; i < N; i++) {
          const y = rand(-1.6, 2.2);
          const z = rand(-4.2, 3.2);
          const x = rand(-11, 11);
          const len = rand(0.5, 1.9);
          pos.set([x, y, z, x + len, y, z], i * 6);
          speed[i] = rand(0.035, 0.115);
        }

        const flowGeo = new THREE.BufferGeometry();
        flowGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const flow = new THREE.LineSegments(
          flowGeo,
          new THREE.LineBasicMaterial({
            color: LINE,
            transparent: true,
            opacity: 0.3,
          })
        );
        scene.add(flow);

        // ── Interaksi & siklus hidup
        let px = 0, py = 0, tx = 0, ty = 0;
        const onPointer = (e) => {
          tx = (e.clientX / window.innerWidth - 0.5) * 2;
          ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

        let onScreen = true;
        const io = new IntersectionObserver(
          ([e]) => { onScreen = e.isIntersecting; },
          { threshold: 0 }
        );
        io.observe(host);

        const ro = new ResizeObserver(() => {
          renderer.setSize(w(), h());
          camera.aspect = w() / h();
          camera.updateProjectionMatrix();
        });
        ro.observe(host);

        let raf = 0;
        let t = 0;

        const frame = () => {
          raf = requestAnimationFrame(frame);
          if (document.hidden || !onScreen) return;

          if (!reduced) {
            t += 0.006;
            const a = flowGeo.attributes.position.array;
            for (let i = 0; i < N; i++) {
              const o = i * 6;
              a[o] += speed[i];
              a[o + 3] += speed[i];
              if (a[o] > 11) {
                const shift = a[o + 3] - a[o];
                a[o] = -11;
                a[o + 3] = -11 + shift;
              }
            }
            flowGeo.attributes.position.needsUpdate = true;

            px += (tx - px) * 0.045;
            py += (ty - py) * 0.045;
            car.rotation.y = -0.5 + Math.sin(t) * 0.28 + px * 0.22;
            car.rotation.x = -0.04 + py * 0.06;
            car.position.y = 0.14 + Math.sin(t * 1.7) * 0.045;
            for (const wheel of wheels) wheel.rotation.z -= 0.06;
          }

          renderer.render(scene, camera);
        };
        frame();

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          ro.disconnect();
          window.removeEventListener("pointermove", onPointer);
          scene.traverse((o) => {
            o.geometry?.dispose?.();
            o.material?.dispose?.();
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className={className} />;
}
