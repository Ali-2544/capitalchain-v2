'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';
import { useLiveData } from '@/lib/useLiveData';

// Normalized payout pill: the globe needs { flag, name, amt }. The API returns
// { flag, country, amount } and the fallback below already uses { flag, name, amt }.
type GP = { id?: number; flag: string; name: string; amt: string };
interface RawPayout {
  id?: number;
  flag: string;
  name?: string;
  country?: string;
  amt?: string;
  amount?: string;
}
const toGP = (r: RawPayout): GP => ({
  id: r.id,
  flag: r.flag,
  name: r.name ?? r.country ?? '',
  amt: r.amt ?? r.amount ?? '',
});

const R = 140;
const N = 1400;

// Payout pills anchored to globe nodes — revolve with the globe.
// TODO: replace with the real live payout feed (country + amount).
const PAYOUTS = [
  { flag: '🇵🇰', name: 'Pakistan', amt: '$867K' },
  { flag: '🇳🇵', name: 'Nepal', amt: '$1.3K' },
  { flag: '🇧🇩', name: 'Bangladesh', amt: '$7.4K' },
  { flag: '🇮🇳', name: 'India', amt: '$210K' },
  { flag: '🇱🇦', name: 'Laos', amt: '$38.4K' },
  { flag: '🇭🇰', name: 'Hong Kong', amt: '$1.5K' },
  { flag: '🇻🇳', name: 'Vietnam', amt: '$254K' },
  { flag: '🇹🇭', name: 'Thailand', amt: '$8K' },
  { flag: '🇵🇭', name: 'Philippines', amt: '$94.5K' },
  { flag: '🇲🇾', name: 'Malaysia', amt: '$159K' },
  { flag: '🇸🇬', name: 'Singapore', amt: '$72K' },
  { flag: '🇮🇩', name: 'Indonesia', amt: '$146K' },
  { flag: '🇦🇪', name: 'UAE', amt: '$420K' },
  { flag: '🇬🇧', name: 'UK', amt: '$188K' },
  { flag: '🇩🇪', name: 'Germany', amt: '$96K' },
  { flag: '🇧🇷', name: 'Brazil', amt: '$54K' },
  { flag: '🇿🇦', name: 'South Africa', amt: '$31K' },
  { flag: '🇯🇵', name: 'Japan', amt: '$77K' },
  { flag: '🇺🇸', name: 'USA', amt: '$512K' },
  { flag: '🇨🇦', name: 'Canada', amt: '$134K' },
  { flag: '🇲🇽', name: 'Mexico', amt: '$41K' },
  { flag: '🇦🇷', name: 'Argentina', amt: '$27K' },
  { flag: '🇫🇷', name: 'France', amt: '$112K' },
  { flag: '🇪🇸', name: 'Spain', amt: '$58K' },
  { flag: '🇮🇹', name: 'Italy', amt: '$49K' },
  { flag: '🇹🇷', name: 'Turkey', amt: '$63K' },
  { flag: '🇪🇬', name: 'Egypt', amt: '$19K' },
  { flag: '🇳🇬', name: 'Nigeria', amt: '$44K' },
  { flag: '🇰🇪', name: 'Kenya', amt: '$12K' },
  { flag: '🇸🇦', name: 'Saudi Arabia', amt: '$305K' },
  { flag: '🇰🇷', name: 'South Korea', amt: '$88K' },
  { flag: '🇦🇺', name: 'Australia', amt: '$97K' },
  { flag: '🇵🇱', name: 'Poland', amt: '$22K' },
  { flag: '🇲🇦', name: 'Morocco', amt: '$9K' },
];

// Reusable temporaries to avoid per-frame allocations.
const _v = new THREE.Vector3();
const _n = new THREE.Vector3();
const _c = new THREE.Vector3();

/** Round, soft radial sprite texture (teal) used for points, halo and travelers. */
function makeSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const cx = c.getContext('2d')!;
  const g = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(160,255,248,1)');
  g.addColorStop(0.4, 'rgba(40,230,214,.9)');
  g.addColorStop(1, 'rgba(40,230,214,0)');
  cx.fillStyle = g;
  cx.beginPath();
  cx.arc(32, 32, 32, 0, Math.PI * 2);
  cx.fill();
  return new THREE.CanvasTexture(c);
}

interface Traveler {
  cu: THREE.QuadraticBezierCurve3;
  d: THREE.Sprite;
  t: number;
  sp: number;
}

type LabelRefs = React.RefObject<(HTMLAnchorElement | null)[]>;

function GlobeScene({ labelRefs, payouts }: { labelRefs: LabelRefs; payouts: GP[] }) {
  const { isLight } = useTheme();

  // Build the entire scene graph once, imperatively — mirrors the mockup exactly.
  const built = useMemo(() => {
    const tex = makeSpriteTexture();
    const group = new THREE.Group();

    // Fibonacci sphere of ~1400 additive-blended teal points.
    const arr: number[] = [];
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.sin(phi) * Math.cos(th);
      const y = Math.sin(phi) * Math.sin(th);
      const z = Math.cos(phi);
      arr.push(x * R, y * R, z * R);
      pts.push(new THREE.Vector3(x * R, y * R, z * R));
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    const ptsMat = new THREE.PointsMaterial({
      size: 3.6,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0x1fe6e6,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(pg, ptsMat));

    // Faint wireframe sphere.
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0f6b66,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 36, 36), wireMat));

    // Soft halo sprite (lives at scene root, behind the group).
    const haloMat = new THREE.SpriteMaterial({
      map: tex,
      color: 0x1fe6e6,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(R * 5, R * 5, 1);

    // ~13 quadratic-bezier arcs, each with a green traveling sprite.
    const trav: Traveler[] = [];
    const lineMats: THREE.LineBasicMaterial[] = [];
    const travMats: THREE.SpriteMaterial[] = [];
    const seed = [
      0.13, 0.71, 0.29, 0.94, 0.42, 0.07, 0.58, 0.83, 0.21, 0.66, 0.38, 0.49, 0.9, 0.04, 0.77,
      0.33, 0.61, 0.18, 0.86, 0.52, 0.27, 0.73, 0.45, 0.09, 0.68, 0.55,
    ];
    let si = 0;
    const rnd = () => seed[si++ % seed.length];
    function arc(a: number, b: number) {
      const s = pts[a].clone();
      const e = pts[b].clone();
      const m = s.clone().add(e).multiplyScalar(0.5);
      m.normalize().multiplyScalar(R + s.distanceTo(e) * 0.45);
      const cu = new THREE.QuadraticBezierCurve3(s, m, e);
      const lm = new THREE.LineBasicMaterial({ color: 0x1fe6e6, transparent: true, opacity: 0.22 });
      lineMats.push(lm);
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cu.getPoints(46)), lm));
      const dm = new THREE.SpriteMaterial({
        map: tex,
        color: 0x66f0f0,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      travMats.push(dm);
      const d = new THREE.Sprite(dm);
      d.scale.set(13, 13, 1);
      group.add(d);
      trav.push({ cu, d, t: rnd(), sp: 0.0007 + rnd() * 0.001 });
    }
    for (let i = 0; i < 13; i++) arc((rnd() * N) | 0, (rnd() * N) | 0);

    return { group, halo, pts, ptsMat, wireMat, haloMat, lineMats, travMats, trav };
  }, []);

  // Label anchors: spread evenly along the spiral so each pill hovers over a real
  // node and revolves with the globe. Recomputed when the payout count changes.
  const anchors = useMemo(
    () =>
      payouts.map((_, k) => {
        const idx = Math.floor(((k + 0.5) / Math.max(1, payouts.length)) * N) % N;
        return built.pts[idx].clone().multiplyScalar(1.06);
      }),
    [payouts.length, built],
  );

  // Re-tint materials whenever the theme changes (mirrors setGlobeTheme).
  useEffect(() => {
    const { ptsMat, wireMat, haloMat, lineMats, travMats } = built;
    if (isLight) {
      ptsMat.color.setHex(0x05aec0);
      ptsMat.blending = THREE.NormalBlending;
      ptsMat.opacity = 0.55;
      ptsMat.needsUpdate = true;
      wireMat.color.setHex(0x9fd6d0);
      wireMat.opacity = 0.18;
      haloMat.opacity = 0.12;
      lineMats.forEach((m) => {
        m.color.setHex(0x05aec0);
        m.opacity = 0.3;
      });
      travMats.forEach((m) => {
        m.color.setHex(0x05aec0);
        m.blending = THREE.NormalBlending;
        m.needsUpdate = true;
      });
    } else {
      ptsMat.color.setHex(0x1fe6e6);
      ptsMat.blending = THREE.AdditiveBlending;
      ptsMat.opacity = 0.8;
      ptsMat.needsUpdate = true;
      wireMat.color.setHex(0x0f6b66);
      wireMat.opacity = 0.1;
      haloMat.opacity = 0.45;
      lineMats.forEach((m) => {
        m.color.setHex(0x1fe6e6);
        m.opacity = 0.22;
      });
      travMats.forEach((m) => {
        m.color.setHex(0x66f0f0);
        m.blending = THREE.AdditiveBlending;
        m.needsUpdate = true;
      });
    }
  }, [isLight, built]);

  // Pointer parallax + scroll tilt state, and responsive placement.
  const motion = useRef({ mx: 0, my: 0, tx: 0, ty: 0, sy: 0 });
  useEffect(() => {
    const { group, halo } = built;
    const place = () => {
      const r = window.innerWidth > 1040 ? 165 : 0;
      group.position.x = r;
      halo.position.set(r, 0, -60);
      group.scale.setScalar(window.innerWidth < 700 ? 0.66 : window.innerWidth < 1040 ? 0.82 : 1);
    };
    place();
    const onMove = (e: MouseEvent) => {
      motion.current.tx = e.clientX / window.innerWidth - 0.5;
      motion.current.ty = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => {
      motion.current.sy = window.scrollY;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', place);
    };
  }, [built]);

  useFrame((state) => {
    const { group, trav } = built;
    const m = motion.current;
    group.rotation.y += 0.0012;
    m.mx += (m.tx - m.mx) * 0.05;
    m.my += (m.ty - m.my) * 0.05;
    group.rotation.x = -0.16 + m.my * 0.32 + m.sy * 0.00012;
    group.rotation.z = m.mx * 0.05;
    trav.forEach((t) => {
      t.t += t.sp;
      if (t.t > 1) t.t = 0;
      t.d.position.copy(t.cu.getPoint(t.t));
    });

    // Project each label anchor to screen pixels so the pills revolve with the
    // globe; fade out the ones rotating to the far (back) hemisphere.
    const els = labelRefs.current;
    if (els) {
      group.updateMatrixWorld();
      const { camera, size } = state;
      const center = group.position; // sphere centre in world space
      for (let i = 0; i < anchors.length; i++) {
        const el = els[i];
        if (!el) continue;
        _v.copy(anchors[i]).applyMatrix4(group.matrixWorld); // world position
        _n.copy(_v).sub(center).normalize(); // outward surface normal
        _c.copy(camera.position).sub(_v).normalize(); // toward the camera
        const facing = _n.dot(_c); // >0 => front hemisphere
        const opacity = THREE.MathUtils.clamp((facing + 0.05) / 0.3, 0, 1);
        if (opacity <= 0.001) {
          el.style.opacity = '0';
          continue;
        }
        _v.project(camera);
        const x = (_v.x * 0.5 + 0.5) * size.width;
        const y = (-_v.y * 0.5 + 0.5) * size.height;
        el.style.transform = `translate(-50%,-50%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
        el.style.opacity = opacity.toFixed(3);
      }
    }
  });

  return (
    <>
      <primitive object={built.group} />
      <primitive object={built.halo} />
    </>
  );
}

export default function GlobeBackground() {
  const labelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // Live payouts from the DB (polled); falls back to the built-in list until loaded.
  const raw = useLiveData<RawPayout>('/api/payouts', PAYOUTS);
  const payouts = useMemo(() => raw.map(toGP), [raw]);
  return (
    <>
      <Canvas
        id="globe"
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ fov: 42, near: 1, far: 2000, position: [0, 0, 420] }}
        // Override R3F's default inline `position: relative` so the canvas stays
        // fixed behind all content. `#globe` stylesheet still drives opacity/transition.
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <GlobeScene labelRefs={labelRefs} payouts={payouts} />
      </Canvas>
      {/* Revolving payout pills — positioned each frame from the 3D anchors above. */}
      <div className="globe-labels" aria-hidden="true">
        {payouts.map((p, i) => (
          <a
            key={`${p.name}-${i}`}
            className={`glabel${p.id ? ' clickable' : ''}`}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            href={p.id ? `/certificate/${p.id}` : undefined}
            target={p.id ? '_blank' : undefined}
            rel="noreferrer"
            // Decorative globe layer is aria-hidden — keep its links out of the tab order.
            tabIndex={-1}
          >
            <span className="gdot" />
            <span className="gflag">{p.flag}</span>
            <span className="gname">{p.name}</span>
            <span className="gamt">{p.amt}</span>
          </a>
        ))}
      </div>
    </>
  );
}
