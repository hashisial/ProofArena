import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const nodes = [
  { color: "#A78BFA", position: [-2.4, 1.35, 0.3], scale: [1.15, 0.7, 0.16] },
  { color: "#6D28D9", position: [2.2, 1.15, -0.2], scale: [1.05, 0.62, 0.14] },
  { color: "#7C3AED", position: [-1.75, -1.45, -0.1], scale: [0.95, 0.62, 0.14] },
  { color: "#EDE9FE", position: [2.25, -1.25, 0.25], scale: [0.9, 0.58, 0.14] },
  { color: "#C4B5FD", position: [0, 2.1, -0.35], scale: [0.72, 0.5, 0.12] },
];

function Ecosystem() {
  const groupRef = useRef(null);
  const lineGeometry = useMemo(() => {
    const points = nodes.flatMap((node) => [
      new THREE.Vector3(...node.position),
      new THREE.Vector3(0, 0, 0),
    ]);

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x +=
      (state.pointer.y * 0.09 - groupRef.current.rotation.x) * 0.035;
    groupRef.current.rotation.z +=
      (-state.pointer.x * 0.04 - groupRef.current.rotation.z) * 0.035;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#A78BFA" opacity={0.45} transparent />
      </lineSegments>

      <group>
        <mesh>
          <octahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial
            color="#A78BFA"
            emissive="#7C3AED"
            emissiveIntensity={0.7}
            metalness={0.35}
            roughness={0.28}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.018, 8, 96]} />
          <meshBasicMaterial color="#C4B5FD" transparent opacity={0.62} />
        </mesh>
      </group>

      {nodes.map((node, index) => (
        <group key={node.color} position={node.position}>
          <mesh scale={node.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={index === 3 ? 0.18 : 0.34}
              metalness={0.24}
              roughness={0.32}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function ProofEcosystemScene() {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 44, position: [0, 0, 7.8] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      tabIndex={-1}
    >
      <ambientLight intensity={0.58} />
      <directionalLight color="#EDE9FE" intensity={2.2} position={[2, 3, 5]} />
      <pointLight color="#A78BFA" intensity={18} position={[-3, 1, 3]} />
      <pointLight color="#6D28D9" intensity={10} position={[3, -2, 2]} />
      <Ecosystem />
    </Canvas>
  );
}
