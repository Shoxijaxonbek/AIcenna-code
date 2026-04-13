import React, { Suspense, useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// TARGET_SIZE = 1.1 * 1.2 (20% kattaroq)
const TARGET_SIZE = 1.975;


// ─── Yoritish ─────────────────────────────────────────────────────────────────
function Lights() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5,  8,  6]} intensity={2.0} />
      <directionalLight position={[-4,-3,  4]} intensity={0.8} color="#aabbff" />
      <directionalLight position={[0,  3, -5]} intensity={0.5} />
      <pointLight       position={[0,  0,  6]} intensity={0.5} color="#00d4ff" />
    </>
  );
}

// ─── Aylanish + zoom ──────────────────────────────────────────────────────────
function SceneGroup({ rotation, scale, children }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += (rotation.x - ref.current.rotation.x) * 0.12;
    ref.current.rotation.y += (rotation.y - ref.current.rotation.y) * 0.12;
    const s = ref.current.scale.x;
    ref.current.scale.setScalar(s + (scale - s) * 0.12);
  });
  return <group ref={ref}>{children}</group>;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 1.2;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.7) * 0.4;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.45, 0.13, 80, 16]} />
      <meshStandardMaterial color="#00d4ff" wireframe emissive="#00d4ff" emissiveIntensity={0.4} />
    </mesh>
  );
}

// ─── GLB Scene ────────────────────────────────────────────────────────────────
// Centering useMemo ichida bir marta — model o'zgarganda ham ishlaydi
function GLBScene({ modelCfg, explodeOpen, highlightPart, selectedMeshKey,
                    onPartHover, onPartClick, pinchPoint,
                    scalpelTrail, scalpelClipPlane, onScalpelHit }) {
  const { scene }              = useGLTF(modelCfg.file);
  const { camera, raycaster, gl } = useThree();
  const origPos                = useRef([]);
  const origCenter             = useRef(new THREE.Vector3());

  const { obj, meshes, scl } = useMemo(() => {
    const c  = scene.clone(true);
    const ms = [];

    // Material klonlash + rang
    c.traverse(node => {
      if (!node.isMesh) return;
      node.material = Array.isArray(node.material)
        ? node.material.map(m => m.clone())
        : node.material.clone();
      const col = modelCfg.meshColors?.[ms.length];
      if (col != null) {
        const mat = Array.isArray(node.material) ? node.material[0] : node.material;
        mat?.color?.setHex(col);
      }
      ms.push(node);
    });

    // ── TO'G'RI centering: useMemo ichida, matrixlar yangilangandan keyin ──
    // c.updateMatrixWorld endi barcha nodes ni to'g'ri hisoblaydi
    c.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(c);

    let scaleFactor = 1;
    if (!box.isEmpty()) {
      const center = new THREE.Vector3();
      const size   = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z, 0.001);
      scaleFactor = TARGET_SIZE / maxDim;

      // Scene root ni markazga keltirish — barcha bolalar shu bilan siljiydi
      // Bu usul matrixlarga bog'liq emas, to'g'ridan-to'g'ri ishlaydi
      c.position.sub(center);
      c.updateMatrixWorld(true);
    }

    return { obj: c, meshes: ms, scl: scaleFactor };
  }, [scene, modelCfg.id]); // eslint-disable-line

  // Explode uchun world bbox pozitsiyalarini saqlash
  const capturedRef = useRef(false);

  useEffect(() => {
    capturedRef.current = false;
    origPos.current = meshes.map(m => ({ local: m.position.clone(), world: null }));
    origCenter.current = new THREE.Vector3(0, 0, 0);
  }, [meshes]);

  // Highlight
  useEffect(() => {
    meshes.forEach((mesh, i) => {
      const active = `mesh_${i}` === highlightPart || `mesh_${i}` === selectedMeshKey;
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (!mat) return;
      if (!mat.emissive) mat.emissive = new THREE.Color(0);
      mat.emissive.setHex(active ? 0x00aaff : 0x000000);
      mat.emissiveIntensity = active ? 0.6 : 0;
    });
  }, [highlightPart, selectedMeshKey, meshes]);

  // Explode animatsiyasi
  useFrame(() => {
    const origs = origPos.current;
    if (!origs.length) return;

    // Birinchi frameda world pozitsiyalarni yig'amiz
    if (!capturedRef.current) {
      capturedRef.current = true;
      meshes.forEach((mesh, i) => {
        const box = new THREE.Box3().setFromObject(mesh);
        const wp  = new THREE.Vector3();
        box.isEmpty() ? mesh.getWorldPosition(wp) : box.getCenter(wp);
        if (origs[i]) origs[i].world = wp.clone();
      });
      return;
    }

    meshes.forEach((mesh, i) => {
      const d = origs[i];
      if (!d) return;

      // Qaytish
      if (!explodeOpen) {
        mesh.position.lerp(d.local, 0.12);
        return;
      }

      if (!d.world) return;

      // World pozitsiyadan yo'nalish — faqat X va Y (Z ni teskari qilamiz)
      // Chunki kamera z=5 da, model z=0 — world z pozitiv = kamera tomon
      const wp = d.world;
      const len = new THREE.Vector2(wp.x, wp.y).length();
      const dir = len > 0.01
        ? new THREE.Vector3(wp.x, wp.y, -wp.z).normalize()
        : new THREE.Vector3(
            Math.cos((i / meshes.length) * Math.PI * 2),
            Math.sin((i / meshes.length) * Math.PI * 2) * 0.5,
            0
          ).normalize();

      const totalLen = wp.length();
      const spread = Math.max(totalLen * 2.0, 0.4) / (scl || 1);
      mesh.position.lerp(d.local.clone().addScaledVector(dir, spread), 0.08);
    });
  });


  // ── Scalpel raycast — trail bo'ylab kesishgan meshlarni topish ────────────
  useEffect(() => {
    if (!scalpelTrail || scalpelTrail.length < 3) return;
    const hitSet = new Set();
    // Har 4 nuqtadan raycast (performance uchun)
    for (let i = 0; i < scalpelTrail.length; i += 4) {
      const pt  = scalpelTrail[i];
      const ndc = new THREE.Vector2(pt.x * 2 - 1, -(pt.y * 2 - 1));
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(meshes, true);
      hits.forEach(h => {
        let obj = h.object;
        while (obj && !meshes.includes(obj)) obj = obj.parent;
        if (!obj && meshes.length === 1) obj = meshes[0];
        if (obj) hitSet.add(meshes.indexOf(obj));
      });
    }
    if (hitSet.size > 0) onScalpelHit?.(Array.from(hitSet));
  }, [scalpelTrail]); // eslint-disable-line

  // ── Clipping plane — scalpeldan kesim tekisligi qo'llash ─────────────────
  useEffect(() => {
    if (!scalpelClipPlane) {
      // Kesimni o'chirish
      meshes.forEach(mesh => {
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        if (mat) { mat.clippingPlanes = []; mat.needsUpdate = true; }
      });
      gl.localClippingEnabled = false;
      return;
    }
    // Kesimni qo'llash — har bir meshga clipping plane
    gl.localClippingEnabled = true;
    meshes.forEach(mesh => {
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (mat) {
        mat.clippingPlanes = [scalpelClipPlane];
        mat.clipShadows    = true;
        mat.side           = THREE.DoubleSide; // ichki yuzani ko'rish uchun
        mat.needsUpdate    = true;
      }
    });
    return () => {
      // cleanup: komponent unmount bo'lganda kesimni o'chirish
      meshes.forEach(mesh => {
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        if (mat) { mat.clippingPlanes = []; mat.needsUpdate = true; }
      });
    };
  }, [scalpelClipPlane, meshes]); // eslint-disable-line

  // Pinch → raycast tanlash
  useEffect(() => {
    if (!pinchPoint || !meshes.length) return;
    const ndc = new THREE.Vector2(pinchPoint.normX * 2 - 1, -(pinchPoint.normY * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(meshes, true);
    if (!hits.length) return;
    let hit = hits[0].object;
    while (hit && !meshes.includes(hit)) hit = hit.parent;
    // 1 ta mesh bo'lsa — fallback
    if (!hit && meshes.length === 1) hit = meshes[0];
    if (!hit) return;
    const idx = meshes.indexOf(hit);
    if (idx >= 0) doClick(idx, meshes[idx]);
  }, [pinchPoint?.id]); // eslint-disable-line

  function doClick(idx, meshObj) {
    const geo = meshObj.geometry;
    const rawData = {
      positions: geo.attributes.position ? Array.from(geo.attributes.position.array) : [],
      normals:   geo.attributes.normal   ? Array.from(geo.attributes.normal.array)   : null,
      indices:   geo.index               ? Array.from(geo.index.array)               : null,
      color:     modelCfg.meshColors?.[idx] ?? 0x4488cc,
      meshIndex: idx,
    };

    // 1-ustuvorlik: meshNames[idx]
    if (modelCfg.meshNames?.[idx]) {
      onPartClick?.(`mesh_${idx}`, modelCfg.meshNames[idx].name, rawData);
      return;
    }

    // 2-ustuvorlik: mesh.name → parts key bilan moslashtirish
    // (brain.glb da meshlar "frontal", "parietal" kabi nomlar bilan saqlangan bo'lishi mumkin)
    const meshRawName = (meshObj.name || '').toLowerCase();
    const parts = modelCfg.parts || {};
    const matchedKey = Object.keys(parts).find(k =>
      meshRawName.includes(k.toLowerCase()) || k.toLowerCase().includes(meshRawName)
    );
    if (matchedKey) {
      onPartClick?.(matchedKey, parts[matchedKey].label, rawData);
      return;
    }

    // 3-ustuvorlik: mesh indeksi bo'yicha parts qiymatlaridan birini olish
    const partValues = Object.entries(parts);
    if (partValues[idx]) {
      const [pKey, pVal] = partValues[idx];
      onPartClick?.(pKey, pVal.label, rawData);
      return;
    }

    // Fallback
    onPartClick?.(`mesh_${idx}`, `Qism ${idx + 1}`, rawData);
  }

  const initRot = modelCfg.initialRotation ?? [0, 0, 0];

  // scl — JSX da scale sifatida beriladi (group transformi), birorta useFrame kerak emas
  return (
    <group scale={scl}>
      <group rotation={initRot}>
        <primitive
          object={obj}
          onPointerOver={e => {
            e.stopPropagation();
            let idx = meshes.indexOf(e.object);
            if (idx < 0) {
              let p = e.object.parent;
              while (p && idx < 0) { idx = meshes.indexOf(p); p = p.parent; }
            }
            if (idx < 0 && meshes.length === 1) idx = 0;
            if (idx < 0) return;
            onPartHover?.(`mesh_${idx}`, modelCfg.meshNames?.[idx]?.name ?? `Qism ${idx + 1}`);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onPartHover?.(null, null);
            document.body.style.cursor = 'default';
          }}
          onClick={e => {
            e.stopPropagation();
            // e.object ni to'g'ridan-to'g'ri tekshir
            let idx = meshes.indexOf(e.object);
            // Topilmasa — parent chain bo'yicha qidirish
            if (idx < 0) {
              let p = e.object.parent;
              while (p && idx < 0) { idx = meshes.indexOf(p); p = p.parent; }
            }
            // Hali ham topilmasa va 1 ta mesh bo'lsa — uni tanlash
            if (idx < 0 && meshes.length === 1) idx = 0;
            if (idx >= 0) doClick(idx, meshes[idx]);
          }}
        />
      </group>
    </group>
  );
}


// ─── Scalpel Trail — 3D da model bilan birga aylanadi ────────────────────────

// ─── Procedural Miya ──────────────────────────────────────────────────────────
const BRAIN_GEO = {
  frontal:    { pos: [0,    0.28,  0.52],  sc: [0.58, 0.46, 0.46] },
  parietal:   { pos: [0,    0.52, -0.08],  sc: [0.50, 0.38, 0.40] },
  temporal_l: { pos: [-0.54, 0,    0.10],  sc: [0.28, 0.28, 0.44] },
  temporal_r: { pos: [ 0.54, 0,    0.10],  sc: [0.28, 0.28, 0.44] },
  occipital:  { pos: [0,    0.08, -0.62],  sc: [0.44, 0.38, 0.36] },
  cerebellum: { pos: [0,   -0.52, -0.42],  sc: [0.46, 0.30, 0.40] },
  brainstem:  { pos: [0,   -0.80,  0],     sc: [0.13, 0.38, 0.13], cyl: true },
};

function BrainPart({ partKey, cfg, partDef, isHL, isSel, onHover, onClick }) {
  const meshRef = useRef();
  const color   = partDef?.color ?? 0x888888;
  const active  = isHL || isSel;
  const geo = useMemo(() =>
    cfg.cyl
      ? new THREE.CylinderGeometry(0.5, 0.65, 1, 14)
      : new THREE.SphereGeometry(0.5, 22, 18),
  [cfg.cyl]);
  useFrame(() => {
    if (!meshRef.current?.material) return;
    const t = active ? 0.55 : 0;
    meshRef.current.material.emissiveIntensity +=
      (t - meshRef.current.material.emissiveIntensity) * 0.12;
  });
  return (
    <mesh ref={meshRef} position={cfg.pos} scale={cfg.sc} geometry={geo}
      onPointerOver={e => { e.stopPropagation(); onHover?.(partKey, partDef?.label ?? partKey); document.body.style.cursor='pointer'; }}
      onPointerOut={() => { onHover?.(null,null); document.body.style.cursor='default'; }}
      onClick={e => { e.stopPropagation(); onClick?.(partKey, partDef?.label ?? partKey, null); }}
    >
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.08}
        emissive={new THREE.Color(color)} emissiveIntensity={0} />
    </mesh>
  );
}

function ProceduralBrain({ modelCfg, highlightPart, selectedMeshKey, onPartHover, onPartClick }) {
  return (
    <group>
      {Object.entries(BRAIN_GEO).map(([key, cfg]) => (
        <BrainPart key={key} partKey={key} cfg={cfg}
          partDef={modelCfg.parts?.[key]}
          isHL={highlightPart===key} isSel={selectedMeshKey===key}
          onHover={onPartHover} onClick={onPartClick}
        />
      ))}
    </group>
  );
}

// ─── Asosiy eksport ───────────────────────────────────────────────────────────
export default function ModelScene({
  modelCfg, rotation, scale,
  highlightPart, onPartHover, onPartClick,
  explodeOpen, selectedMeshKey, pinchPoint,
  scalpelTrail, scalpelClipPlane, onScalpelHit,
}) {
  // Sichqoncha drag
  const [mouseRot,   setMouseRot]   = useState({ x:0, y:0 });
  const [wheelScale, setWheelScale] = useState(1.0);
  const drag = useRef(null);

  // Model o'zgarganda reset
  useEffect(() => {
    setMouseRot({ x:0, y:0 });
    setWheelScale(1.0);
  }, [modelCfg.id]);

  const onMouseDown = useCallback(e => {
    if (e.button !== 0) return;
    drag.current = { x:e.clientX, y:e.clientY, rot:{...mouseRot} };
  }, [mouseRot]);

  const onMouseMove = useCallback(e => {
    if (!drag.current) return;
    const dx = (e.clientX - drag.current.x) * 0.006;
    const dy = (e.clientY - drag.current.y) * 0.005;
    setMouseRot({ y:drag.current.rot.y+dx, x:drag.current.rot.x+dy });
  }, []);

  const onMouseUp = useCallback(() => { drag.current=null; }, []);

  // Sichqoncha g'ildiragi — zoom
  // Native listener ishlatamiz (React onWheel passive=true muammosini hal qilish uchun)
  const containerRef = useRef(null);
  const wheelScaleRef = useRef(wheelScale);
  useEffect(() => { wheelScaleRef.current = wheelScale; }, [wheelScale]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = e => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.09;
      setWheelScale(s => Math.min(8.0, Math.max(0.1, s * factor)));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const effectiveRot = {
    x: rotation.x + mouseRot.x,
    y: rotation.y + mouseRot.y,
  };
  // App.jsx scale (hand gesture) * sichqoncha wheel scale
  const effectiveScale = scale * wheelScale;

  return (
    <div ref={containerRef} style={{ width:'100%', height:'100%' }}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}    onMouseLeave={onMouseUp}
    >
      <Canvas
        camera={{ position:[0,0,5], fov:38, near:0.01, far:2000 }}
        gl={{ antialias:true, alpha:true, localClippingEnabled:true }}
        style={{ background:'transparent', width:'100%', height:'100%' }}
        dpr={[1,2]}
      >
        <Lights />
        <SceneGroup rotation={effectiveRot} scale={effectiveScale}>
          <Suspense fallback={<Spinner />}>
            {modelCfg.isProcedural ? (
              <ProceduralBrain
                modelCfg={modelCfg}
                highlightPart={highlightPart}
                selectedMeshKey={selectedMeshKey}
                onPartHover={onPartHover}
                onPartClick={onPartClick}
              />
            ) : modelCfg.file ? (
              <GLBScene
                key={modelCfg.id}
                modelCfg={modelCfg}
                explodeOpen={explodeOpen}
                highlightPart={highlightPart}
                selectedMeshKey={selectedMeshKey}
                onPartHover={onPartHover}
                onPartClick={onPartClick}
                pinchPoint={pinchPoint}
                scalpelTrail={scalpelTrail}
                scalpelClipPlane={scalpelClipPlane}
                onScalpelHit={onScalpelHit}
              />
            ) : (
              <Spinner />
            )}
          </Suspense>
        </SceneGroup>
      </Canvas>
    </div>
  );
}