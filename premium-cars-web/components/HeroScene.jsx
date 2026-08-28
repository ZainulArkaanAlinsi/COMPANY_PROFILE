"use client";

// Lapisan atmosfer 3D di belakang hero — permukaan logam cair yang mengalir
// pelan, dengan pantulan lingkungan nyata.
//
// Versi sebelumnya mencoba memodelkan MOBIL secara prosedural. Itu keputusan
// yang salah dan sudah dibuang: geometri yang dibangun tangan selalu diadu
// dengan mobil sungguhan yang pembaca hafal bentuknya, dan selalu kalah —
// hasilnya terbaca sebagai mainan, bukan desain.
//
// Bentuk abstrak tidak punya pembanding itu. Yang dinilai mata hanyalah mutu
// permukaan dan cahayanya, dan di situ WebGL memang unggul: metalness penuh,
// roughness rendah, environment map studio. Mobilnya sendiri hadir sebagai
// FOTO NYATA di atas lapisan ini — cara yang dipakai hampir semua situs
// pabrikan premium.

import { useEffect, useRef } from "react";

export default function HeroScene({ className = "" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ])
      .then(([THREE, { RoomEnvironment }]) => {
        if (disposed) return;

        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        } catch {
          return; // Tanpa WebGL, hero tetap utuh tanpa lapisan ini.
        }

        const w = () => host.clientWidth || 1;
        const h = () => host.clientHeight || 1;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w(), h());
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;

        const camera = new THREE.PerspectiveCamera(42, w() / h(), 0.1, 100);
        camera.position.set(0, 1.15, 4.4);
        camera.lookAt(0, 0.1, 0);

        // ── Permukaan logam cair.
        //    Displacement dijalankan di GPU lewat onBeforeCompile, bukan di CPU:
        //    ini menjaga seluruh perhitungan PBR bawaan MeshStandardMaterial
        //    (termasuk pantulan environment) sambil tetap 60 fps pada 240×140
        //    segmen — menghitung ulang 34 ribu titik per frame di JavaScript
        //    akan membekukan thread utama.
        const geo = new THREE.PlaneGeometry(26, 15, 240, 140);
        geo.rotateX(-Math.PI / 2);

        const mat = new THREE.MeshStandardMaterial({
          color: 0x14110f,
          metalness: 1.0,
          roughness: 0.14,
        });

        const uTime = { value: 0 };
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = uTime;
          shader.vertexShader = shader.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
               uniform float uTime;
               // Tiga gelombang dengan periode tidak kelipatan satu sama lain,
               // supaya polanya tidak pernah terlihat berulang.
               float wave(vec3 p) {
                 return sin(p.x * 0.42 + uTime * 0.55) * 0.42
                      + sin(p.z * 0.63 - uTime * 0.38) * 0.30
                      + sin((p.x + p.z) * 0.27 + uTime * 0.24) * 0.34;
               }`
            )
            .replace(
              "#include <beginnormal_vertex>",
              `#include <beginnormal_vertex>
               // Normal dihitung dari beda maju pada fungsi gelombang yang
               // sama. Tanpa ini permukaan bergelombang tapi cahayanya rata,
               // dan logamnya tampak seperti kain.
               float e = 0.12;
               float hC = wave(position);
               float hX = wave(position + vec3(e, 0.0, 0.0));
               float hZ = wave(position + vec3(0.0, 0.0, e));
               objectNormal = normalize(vec3(-(hX - hC) / e, 1.0, -(hZ - hC) / e));`
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
               transformed.y += wave(position);`
            );
        };

        const surface = new THREE.Mesh(geo, mat);
        surface.position.y = -0.95;
        scene.add(surface);

        // ── Cahaya. Key hangat dari kanan-atas, rim cognac dari kiri-belakang.
        scene.add(new THREE.HemisphereLight(0xf3efe9, 0x0e0d0c, 0.35));
        const key = new THREE.DirectionalLight(0xfff1df, 2.1);
        key.position.set(5, 5, 3);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xd89e72, 3.4);
        rim.position.set(-6, 2, -3);
        scene.add(rim);

        // Dua sumber titik yang mengambang pelan — memberi kilau bergerak di
        // permukaan sehingga logamnya terbaca cair, bukan diam.
        const glowA = new THREE.PointLight(0xc58557, 26, 16, 2);
        const glowB = new THREE.PointLight(0x8fb4d8, 14, 14, 2);
        scene.add(glowA, glowB);

        // ── Siklus hidup
        let onScreen = true;
        const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 });
        io.observe(host);

        const ro = new ResizeObserver(() => {
          renderer.setSize(w(), h());
          camera.aspect = w() / h();
          camera.updateProjectionMatrix();
        });
        ro.observe(host);

        let px = 0, py = 0, tx = 0, ty = 0;
        const onPointer = (e) => {
          tx = (e.clientX / window.innerWidth - 0.5) * 2;
          ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

        let raf = 0;
        const frame = () => {
          raf = requestAnimationFrame(frame);
          if (document.hidden || !onScreen) return;

          if (!reduced) {
            uTime.value += 0.0075;
            px += (tx - px) * 0.03;
            py += (ty - py) * 0.03;
            const t = uTime.value;
            glowA.position.set(Math.sin(t * 0.4) * 5, 1.5 + Math.sin(t * 0.7) * 0.5, Math.cos(t * 0.32) * 3);
            glowB.position.set(Math.cos(t * 0.27) * 6, 1.1, Math.sin(t * 0.45) * 4 - 2);
            camera.position.x = px * 0.5;
            camera.position.y = 1.15 - py * 0.22;
            camera.lookAt(0, 0.1, 0);
          }
          renderer.render(scene, camera);
        };
        frame();

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          ro.disconnect();
          window.removeEventListener("pointermove", onPointer);
          geo.dispose();
          mat.dispose();
          pmrem.dispose();
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
