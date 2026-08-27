'use client';
// ═══════════════════════════════════════════════════════════
//  NEURAL FLOW — curl-noise particle field (RAKHI edition)
//  same engine class as Resonate; palette = rakhi gold/thread red
//  uAudio uniform = field kicks with the score
// ═══════════════════════════════════════════════════════════
import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const VERT = /* glsl */`
uniform float uTime;
uniform vec2 uMouse;
uniform float uAudio;
attribute vec3 aRandom;
varying vec3 vColor;
varying float vAlpha;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
vec3 snoiseVec3(vec3 x){
  float s = snoise(vec3(x));
  float s1 = snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
  float s2 = snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
  return vec3(s, s1, s2);
}
vec3 curlNoise(vec3 p){
  const float e = .1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 p_x0 = snoiseVec3(p - dx); vec3 p_x1 = snoiseVec3(p + dx);
  vec3 p_y0 = snoiseVec3(p - dy); vec3 p_y1 = snoiseVec3(p + dy);
  vec3 p_z0 = snoiseVec3(p - dz); vec3 p_z1 = snoiseVec3(p + dz);
  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
  return normalize(vec3(x, y, z) * (1.0 / (2.0 * e)));
}

void main() {
  vec3 pos = position;
  float t = uTime * (0.15 + uAudio * 0.25);
  vec3 curl = curlNoise(pos * 0.2 + t);
  pos += curl * (aRandom.x * (3.0 + uAudio * 2.5) + 1.0);

  vec3 mousePos = vec3(uMouse.x * 20.0, uMouse.y * 20.0, 0.0);
  float distToMouse = distance(pos.xy, mousePos.xy);
  float mouseInfluence = smoothstep(8.0, 0.0, distToMouse);
  pos += normalize(pos - mousePos) * mouseInfluence * 2.5;

  // rakhi palette: thread red ↔ moon gold
  vec3 colorGold = vec3(0.851, 0.643, 0.255);   // #D9A441
  vec3 colorRed   = vec3(1.0, 0.18, 0.30);      // #FF2E4D
  float mixFactor = smoothstep(-2.0, 2.0, curl.y + aRandom.y);
  vColor = mix(colorGold, colorRed, mixFactor);

  vAlpha = smoothstep(0.0, 1.0, sin(uTime * (aRandom.z * 5.0) + aRandom.x * 10.0)) * 0.85 + 0.35;
  vAlpha *= smoothstep(15.0, 5.0, length(pos.xy));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (30.0 * aRandom.x + 10.0) * (1.0 / -mvPosition.z) * (1.0 + uAudio * 0.9);
  gl_Position = projectionMatrix * mvPosition;
}`;

const FRAG = /* glsl */`
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  if (d > 0.5) discard;
  float strength = smoothstep(0.5, 0.1, d);
  gl_FragColor = vec4(vColor, vAlpha * strength);
}`;

let audioLevel = 0;          // module-level — page sets it via setAudioLevel()
export const introState = { active: false, p: 0 }; // intro film drives camera
export function setAudioLevel(v) { audioLevel = Math.max(0, Math.min(1, v)); }

function Drift() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.05) * 0.9;
    state.camera.position.y = Math.cos(t * 0.04) * 0.55;
    // intro: slow dolly INTO the sky, then settle back
    const targetZ = introState.active ? 11.6 - introState.p * 1.4 : 15;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.018;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// 🌙 the one moon — rises during the intro, blooms forever
function Moon() {
  const ref = useRef(null);
  useFrame((state) => {
    const m = ref.current; if (!m) return;
    const t = state.clock.getElapsedTime();
    const rise = introState.active ? (1 - introState.p) * -2.6 : 0;
    m.position.set(
      3.4 + Math.sin(t * 0.06) * 0.25,
      3.1 + Math.sin(t * 0.09) * 0.15 + rise,
      -2.5
    );
  });
  return (
    <group>
      <mesh ref={ref} position={[3.4, 3.1, -2.5]}>
        <circleGeometry args={[0.8, 48]} />
        <meshBasicMaterial color="#F7F0DF" transparent opacity={0.95} />
      </mesh>
      <mesh position={[3.75, 2.75, -2.52]}>
        <circleGeometry args={[0.8, 48]} />
        <meshBasicMaterial color="#05050A" transparent opacity={1} />
      </mesh>
    </group>
  );
}

function Particles({ count }) {
  const mat = useRef(null);
  const { viewport } = useThree();

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      rand[i * 3] = Math.random();
      rand[i * 3 + 1] = Math.random();
      rand[i * 3 + 2] = Math.random();
    }
    return { positions: pos, randoms: rand };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uAudio: { value: 0 },
  }), []);

  const target = useRef(new THREE.Vector2(0, 0));
  const current = useRef(new THREE.Vector2(0, 0));
  const audioSmooth = useRef(0);

  useEffect(() => {
    const mm = (e) => {
      target.current.x = (e.clientX / innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / innerHeight) * 2 + 1;
      target.current.x *= viewport.width / 2;
      target.current.y *= viewport.height / 2;
    };
    const tm = (e) => { // touch also stirs the field
      if (e.touches?.[0]) mm({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    };
    addEventListener('mousemove', mm, { passive: true });
    addEventListener('touchmove', tm, { passive: true });
    return () => { removeEventListener('mousemove', mm); removeEventListener('touchmove', tm); };
  }, [viewport]);

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.getElapsedTime();
    current.current.lerp(target.current, 0.05);
    mat.current.uniforms.uMouse.value.copy(current.current);
    audioSmooth.current += (audioLevel - audioSmooth.current) * 0.12;
    mat.current.uniforms.uAudio.value = audioSmooth.current;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms}
        transparent depthWrite={false} blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField({ count = 60000 }) {
  const n = typeof window !== 'undefined' && matchMedia('(hover:none)').matches ? Math.min(count, 28000) : count;
  return (
    <div className="particle-host" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <><Drift /><Moon /><Particles count={n} /></>
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.08} luminanceSmoothing={0.6} mipmapBlur radius={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
