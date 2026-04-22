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
