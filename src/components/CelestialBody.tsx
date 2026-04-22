import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useLoader } from '@react-three/fiber'; // Added useLoader
import { Mesh, Group, ShaderMaterial, Color, AdditiveBlending, TextureLoader } from 'three'; // Added TextureLoader
import type { CelestialBodyData } from '../types';
import auroraVert from '../shaders/auroraVert.glsl?raw';
import auroraFrag from '../shaders/auroraFrag.glsl?raw';

// Imported shader strings
const sunVert = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vNormal = normal;
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const sunFrag = `
uniform float time;
uniform vec3 color;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

float noise(vec3 p) {
    return sin(p.x * 5.0 + time) * cos(p.y * 5.0 + time) * sin(p.z * 5.0 + time);
}

void main() {
    float intensity = 0.5 + 0.5 * noise(vPosition * 0.5 + time * 0.1);
    gl_FragColor = vec4(color * intensity, 1.0);
}
`;

const earthVert = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vNormal = normal;
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const earthFrag = `
uniform vec3 waterColor;
uniform vec3 landColor;
uniform float time;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// Simple pseudo-random number generator
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Basic noise function (Perlin-like, but simpler for demonstration)
float noise(vec2 coord) {
    vec2 p = floor(coord);
    vec2 f = fract(coord);
    f = f * f * (3.0 - 2.0 * f); // Smoothstep

    float n00 = rand(p);
    float n10 = rand(p + vec2(1.0, 0.0));
    float n01 = rand(p + vec2(0.0, 1.0));
    float n11 = rand(p + vec2(1.0, 1.0));

    float x1 = mix(n00, n10, f.x);
    float x2 = mix(n01, n11, f.x);
    return mix(x1, x2, f.y);
}

void main() {
    // Generate a noise value based on UV coordinates
    float strength = noise(vUv * 10.0 + time * 0.1); // Scale UV and add time for animation

    // Simple threshold to distinguish land from water
    vec3 color = mix(waterColor, landColor, step(0.5 + sin(time * 0.05) * 0.1, strength)); // Add some time-based variation

    gl_FragColor = vec4(color, 1.0);
}
`;

const gasGiantVert = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vNormal = normal;
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const gasGiantFrag = `
uniform float time;
uniform vec3 planetColor; // Base color of the gas giant
uniform vec3 bandColor;   // Color for the bands
uniform float bandDensity; // How many bands

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// Classic noise function (from Book of Shaders, adapted)
float N(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float smoothstep_noise(vec2 st) {
    vec2 p = floor(st);
    vec2 f = fract(st);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(N(p), N(p + vec2(1, 0)), f.x),
               mix(N(p + vec2(0, 1)), N(p + vec2(1, 1)), f.x), f.y);
}

void main() {
    // Generate bands based on vPosition.y (latitude)
    float band = sin(vPosition.y * bandDensity + time * 0.5);
    band = smoothstep(0.4, 0.6, band); // Sharpen the bands

    // Add some noise for turbulent appearance
    float turbulence = smoothstep_noise(vUv * 5.0 + time * 0.1);

    vec3 color = mix(planetColor, bandColor, band);
    color = mix(color, color * turbulence, 0.2); // Blend with turbulence
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Helper function to generate a random angle, ensuring it's not called directly in render
const generateRandomAngle = () => Math.random() * Math.PI * 2;

interface CelestialBodyProps {
  body: CelestialBodyData;
}

const CelestialBody = forwardRef<Group | null, CelestialBodyProps>(({ body }, ref) => {
  const groupRef = useRef<Group>(null);
  const sphereMeshRef = useRef<Mesh>(null);
  const ringsMeshRef = useRef<Mesh>(null);
  const angleRef = useRef(generateRandomAngle());

  const sunMaterialRef = useRef<ShaderMaterial>(null);
  const earthMaterialRef = useRef<ShaderMaterial>(null);
  const gasGiantMaterialRef = useRef<ShaderMaterial>(null);
  const auroraMaterialRef = useRef<ShaderMaterial>(null);

  useImperativeHandle(ref, () => groupRef.current!);

  useFrame((state) => {
    if (groupRef.current && sphereMeshRef.current) {
      angleRef.current += body.orbitalSpeed;
      groupRef.current.position.x = body.orbitalRadius * Math.cos(angleRef.current);
      groupRef.current.position.z = body.orbitalRadius * Math.sin(angleRef.current);
      
      sphereMeshRef.current.rotation.y += 0.005;

      if (body.name === 'Saturn' && ringsMeshRef.current) {
        ringsMeshRef.current.rotation.z += 0.005;
      }
    }

    const elapsedTime = state.clock.getElapsedTime();
    if (sunMaterialRef.current) {
      sunMaterialRef.current.uniforms.time.value = elapsedTime;
    }
    if (earthMaterialRef.current) {
      earthMaterialRef.current.uniforms.time.value = elapsedTime;
    }
    if (gasGiantMaterialRef.current) {
      gasGiantMaterialRef.current.uniforms.time.value = elapsedTime;
    }
    if (auroraMaterialRef.current) {
      auroraMaterialRef.current.uniforms.time.value = elapsedTime;
    }
  });

  const isGasGiant = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(body.name);

  const getMaterial = () => {
    if (body.name === 'Sun') {
      return (
        <shaderMaterial
          ref={sunMaterialRef}
          attach="material"
          args={[{
            uniforms: {
              time: { value: 0 },
              color: { value: new Color(body.color) }
            },
            vertexShader: sunVert,
            fragmentShader: sunFrag,
            transparent: false,
            depthWrite: true,
            depthTest: true
          }]}
        />
      );
    } else if (body.name === 'Earth') {
      return (
        <shaderMaterial
          ref={earthMaterialRef}
          attach="material"
          args={[{
            uniforms: {
              waterColor: { value: new Color('#0077be') }, // Earth's water color
              landColor: { value: new Color('#006400') }, // Earth's land color
              time: { value: 0 }
            },
            vertexShader: earthVert,
            fragmentShader: earthFrag,
            transparent: false,
            depthWrite: true,
            depthTest: true
          }]}
        />
      );
    } else if (isGasGiant) {
      let bandDensity = 10.0;
      let bandColor = new Color('#b0a08d'); // Default for Jupiter

      if (body.name === 'Saturn') {
        bandDensity = 8.0;
        bandColor = new Color('#e0d0b0');
      } else if (body.name === 'Uranus') {
        bandDensity = 6.0;
        bandColor = new Color('#a0c0e0');
      } else if (body.name === 'Neptune') {
        bandDensity = 7.0;
        bandColor = new Color('#6080e0');
      }

      return (
        <shaderMaterial
          ref={gasGiantMaterialRef}
          attach="material"
          args={[{
            uniforms: {
              time: { value: 0 },
              planetColor: { value: new Color(body.color) },
              bandColor: { value: bandColor },
              bandDensity: { value: bandDensity }
            },
            vertexShader: gasGiantVert,
            fragmentShader: gasGiantFrag,
            transparent: false,
            depthWrite: true,
            depthTest: true
          }]}
        />
      );
    } else if (body.texture) { // Check if a texture is defined for the body
      const textureMap = useLoader(TextureLoader, body.texture);
      return (
        <meshStandardMaterial map={textureMap} />
      );
    } else {
      return (
        <meshStandardMaterial color={body.color} emissive={body.color} emissiveIntensity={0} />
      );
    }
  };

  return (
    <group ref={groupRef} position={[body.orbitalRadius, 0, 0]}>
      {body.name === 'Sun' && (
        <pointLight intensity={1000} distance={1000} />
      )}
      <mesh ref={sphereMeshRef}>
        <sphereGeometry args={[body.size, 32, 32]} />
        {getMaterial()}
      </mesh>
      {['Jupiter', 'Saturn'].includes(body.name) && (
        <mesh>
          <sphereGeometry args={[body.size * 1.1, 64, 64]} />
          <shaderMaterial
            ref={auroraMaterialRef}
            vertexShader={auroraVert}
            fragmentShader={auroraFrag}
            uniforms={{ time: { value: 0 } }}
            transparent
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
      {body.name === 'Saturn' && (
        <mesh ref={ringsMeshRef} rotation-x={Math.PI / 2}>
          <torusGeometry args={[body.size * 1.5, body.size * 0.4, 2, 100]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
      )}
    </group>
  );
});

export default CelestialBody;