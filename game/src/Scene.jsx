import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ROOM = 16 // 16 x 16 squares = 80 ft
export const ENEMY = { x: 0, z: -4 }
const WALK = 5, RIDE = 10 // units per second (walk speed visual only)
const HALF = ROOM / 2 - 0.5

function Floor({ g }) {
  const setDest = (e) => {
    e.stopPropagation()
    g.dest.current = { x: e.point.x, z: e.point.z }
  }
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow
        onPointerMove={(e) => { g.mouse.current = { x: e.point.x, z: e.point.z } }}
        onContextMenu={setDest} onClick={setDest}>
        <planeGeometry args={[ROOM, ROOM]} />
        <meshStandardMaterial color="#2a2f38" />
      </mesh>
      <gridHelper args={[ROOM, ROOM, '#4a5160', '#3a404c']} position-y={0.01} />
      {[[0, -ROOM / 2, ROOM, 0.3], [0, ROOM / 2, ROOM, 0.3], [-ROOM / 2, 0, 0.3, ROOM], [ROOM / 2, 0, 0.3, ROOM]].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.4, z]} castShadow>
          <boxGeometry args={[w + 0.3, 0.8, d + 0.3]} />
          <meshStandardMaterial color="#545b68" />
        </mesh>
      ))}
    </group>
  )
}

function Player({ g }) {
  const ref = useRef()
  const v = useMemo(() => new THREE.Vector2(), [])
  useFrame((_, dt) => {
    const p = g.player.current
    const k = g.keys.current
    const speed = g.mounted.current ? RIDE : WALK
    v.set((k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0), (k.ArrowDown ? 1 : 0) - (k.ArrowUp ? 1 : 0))
    if (v.lengthSq() > 0) {
      g.dest.current = null
    } else if (g.dest.current) {
      v.set(g.dest.current.x - p.x, g.dest.current.z - p.z)
      if (v.length() < 0.05) { g.dest.current = null; v.set(0, 0) }
    }
    if (v.lengthSq() > 0) {
      const step = Math.min(speed * dt, g.dest.current ? v.length() : Infinity)
      v.normalize().multiplyScalar(step)
      const nx = THREE.MathUtils.clamp(p.x + v.x, -HALF, HALF)
      const nz = THREE.MathUtils.clamp(p.z + v.y, -HALF, HALF)
      g.moved.current += Math.hypot(nx - p.x, nz - p.z) * 5 // feet
      // keep out of the enemy's square
      const ex = nx - ENEMY.x, ez = nz - ENEMY.z, d = Math.hypot(ex, ez)
      const fx = d < 1 ? ENEMY.x + (ex / (d || 1)) * 1 : nx
      const fz = d < 1 ? ENEMY.z + (ez / (d || 1)) * 1 : nz
      g.moved.current -= (Math.hypot(nx - p.x, nz - p.z) - Math.hypot(fx - p.x, fz - p.z)) * 5
      p.x = fx; p.z = fz
      p.face = Math.atan2(v.x, v.y)
    }
    const mounted = g.mounted.current
    ref.current.position.set(p.x, mounted ? 1.55 : 0.7, p.z)
    ref.current.rotation.y = p.face
    if (mounted) { g.steed.current.x = p.x; g.steed.current.z = p.z; g.steed.current.face = p.face }
  })
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.8, 1.4, 0.8]} />
      <meshStandardMaterial color="#c9d6ea" metalness={0.4} roughness={0.4} />
    </mesh>
  )
}

function Steed({ g }) {
  const ref = useRef()
  useFrame(() => {
    const s = g.steed.current
    ref.current.visible = s.summoned
    ref.current.position.set(s.x, 0.5, s.z)
    ref.current.rotation.y = s.face
  })
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.9, 1.0, 1.9]} />
      <meshStandardMaterial color="#8a63d2" transparent opacity={0.85} />
    </mesh>
  )
}

function Enemy() {
  return (
    <mesh position={[ENEMY.x, 0.85, ENEMY.z]} castShadow>
      <boxGeometry args={[0.9, 1.7, 0.9]} />
      <meshStandardMaterial color="#b8323a" />
    </mesh>
  )
}

function FollowRing({ g, radius, color, opacity = 0.9 }) {
  const ref = useRef()
  useFrame(() => { const p = g.player.current; ref.current.position.set(p.x, 0.03, p.z) })
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[radius - 0.05, radius, 96]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

function DestMarker({ g }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const d = g.dest.current
    ref.current.visible = !!d
    if (d) { ref.current.position.set(d.x, 0.03, d.z); ref.current.scale.setScalar(1 + 0.15 * Math.sin(clock.elapsedTime * 10)) }
  })
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.2, 0.3, 32]} />
      <meshBasicMaterial color="#6dff8f" />
    </mesh>
  )
}

function pos(g, e) {
  if (e.at === 'enemy') return ENEMY
  if (e.at === 'player') return g.player.current
  if (e.at === 'steed') return g.steed.current
  if (e.at === 'origin') return e.origin
  return ENEMY
}

function Effect({ g, e }) {
  const ref = useRef()
  const born = useMemo(() => performance.now(), [])
  useFrame(({ clock }) => {
    const o = ref.current
    if (!o) return
    const age = (performance.now() - born) / 1000
    const p = pos(g, e)
    const pl = g.player.current
    o.visible = age * 1000 >= (e.delay || 0)
    if (e.kind === 'beam') {
      const dx = ENEMY.x - pl.x, dz = ENEMY.z - pl.z
      const len = Math.hypot(dx, dz)
      o.position.set((pl.x + ENEMY.x) / 2, 0.9, (pl.z + ENEMY.z) / 2)
      o.rotation.set(0, Math.atan2(dx, dz), 0)
      o.scale.set(1, 1, len)
    } else if (e.kind === 'swing') {
      const a = Math.atan2(ENEMY.x - pl.x, ENEMY.z - pl.z)
      o.position.set(pl.x, 0.8, pl.z)
      o.rotation.set(0, a + (e.flip ? 0.6 : -0.6), 0)
    } else if (e.kind === 'burst') {
      o.position.set(p.x, 0.8, p.z)
      o.scale.setScalar(0.3 + age * 2.5)
    } else if (e.kind === 'marker') {
      o.position.set(ENEMY.x, 2.3 + 0.15 * Math.sin(clock.elapsedTime * 3), ENEMY.z)
      o.rotation.y = clock.elapsedTime
    } else if (e.kind === 'dome') {
      o.position.set(pl.x, 0, pl.z)
    } else {
      o.position.set(p.x, e.kind === 'ring' ? 0.04 : 0, p.z)
    }
  })
  const mat = (op = 0.55) => <meshBasicMaterial color={e.color || '#fff'} transparent opacity={op} side={THREE.DoubleSide} depthWrite={false} />
  switch (e.kind) {
    case 'ring':
      return (
        <mesh ref={ref} rotation-x={-Math.PI / 2}>
          {e.fill ? <circleGeometry args={[e.radius, 64]} /> : <ringGeometry args={[e.radius - 0.08, e.radius, 128]} />}
          {mat(e.fill ? 0.35 : 0.9)}
        </mesh>
      )
    case 'beam':
      return (<mesh ref={ref}><boxGeometry args={[0.08, 0.08, 1]} />{mat(0.9)}</mesh>)
    case 'swing':
      return (
        <group ref={ref}>
          <mesh rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.6, 1.3, 24, 1, -Math.PI / 2 - 0.7, 1.4]} />
            <meshBasicMaterial color="#e8eef8" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )
    case 'burst':
      return (<mesh ref={ref}><sphereGeometry args={[0.5, 24, 16]} />{mat(0.4)}</mesh>)
    case 'pillar':
      return (<group ref={ref}><mesh position-y={2}><cylinderGeometry args={[0.6, 0.6, 4, 24, 1, true]} />{mat(0.45)}</mesh></group>)
    case 'marker':
      return (<mesh ref={ref} rotation-x={Math.PI}><coneGeometry args={[0.3, 0.6, 4]} />{mat(0.95)}</mesh>)
    case 'cage':
      return (<group ref={ref}><mesh position-y={1}><boxGeometry args={[1.4, 2, 1.4]} /><meshBasicMaterial color={e.color} wireframe /></mesh></group>)
    case 'dome':
      return (<group ref={ref}><mesh><sphereGeometry args={[1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />{mat(0.25)}</mesh></group>)
    default:
      return null
  }
}

export default function Scene({ g, effects, previewFt }) {
  return (
    <Canvas shadows camera={{ position: [0, 19, 12], fov: 45 }}
      onContextMenu={(e) => e.preventDefault()}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0.5)}>
      <color attach="background" args={['#14171c']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 14, 6]} intensity={1.2} castShadow />
      <Floor g={g} />
      <Enemy />
      <Steed g={g} />
      <Player g={g} />
      <DestMarker g={g} />
      <FollowRing g={g} radius={2} color="#ffd54a" opacity={0.55} />
      {previewFt > 0 && <FollowRing g={g} radius={previewFt / 5} color="#ffffff" opacity={0.5} />}
      {effects.map((e) => <Effect key={e.id} g={g} e={e} />)}
    </Canvas>
  )
}
