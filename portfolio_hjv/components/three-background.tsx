"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function FloatingShape({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Gentle rotation
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
    meshRef.current.rotation.y = time * 0.1
    
    // Mouse influence
    if (mouse.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mouse.current.x * viewport.width * 0.1,
        0.02
      )
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mouse.current.y * viewport.height * 0.1,
        0.02
      )
    }
  })

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.2}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  )
}

function FloatingParticles() {
  const count = 50
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
        ],
        scale: Math.random() * 0.02 + 0.01,
        speed: Math.random() * 0.5 + 0.5,
      })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    const dummy = new THREE.Object3D()
    
    particles.forEach((particle, i) => {
      dummy.position.set(
        particle.position[0] + Math.sin(time * particle.speed + i) * 0.5,
        particle.position[1] + Math.cos(time * particle.speed + i) * 0.5,
        particle.position[2]
      )
      dummy.scale.setScalar(particle.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#404040" transparent opacity={0.3} />
    </instancedMesh>
  )
}

function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <FloatingShape mouse={mouse} />
      <FloatingParticles />
    </>
  )
}

export function ThreeBackground({ className = "" }: { className?: string }) {
  const mouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    }
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      onMouseMove={handleMouseMove}
      style={{ zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Scene mouse={mouse} />
        </Canvas>
      </Suspense>
    </div>
  )
}

// Lightweight version for performance
export function ThreeBackgroundLight({ className = "" }: { className?: string }) {
  const mouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    }
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      onMouseMove={handleMouseMove}
      style={{ zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: false, alpha: true }}
          dpr={1}
        >
          <ambientLight intensity={0.3} />
          <FloatingParticles />
        </Canvas>
      </Suspense>
    </div>
  )
}
