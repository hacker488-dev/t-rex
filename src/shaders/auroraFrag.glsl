uniform float time;
varying vec3 vPosition;

// 2D Random
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    float y = abs(vPosition.y); // Get the distance from the equator
    float pole_focus = smoothstep(0.7, 0.9, y); // Focus the effect on the poles

    // Create a time-varying noise pattern
    float noise_val = noise(vPosition.xz * 2.0 + time * 0.5);

    // Create the aurora "curtain" effect by multiplying by a sine wave along y
    float curtain = sin(vPosition.y * 20.0 + noise_val * 5.0 + time * 2.0);
    curtain = smoothstep(0.8, 1.0, curtain);

    // Mix colors based on noise
    vec3 green = vec3(0.0, 1.0, 0.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);
    vec3 purple = vec3(0.5, 0.0, 1.0);
    
    vec3 color = mix(green, blue, noise(vPosition.xy * 0.5 + time * 0.1));
    color = mix(color, purple, noise(vPosition.yz * 0.5 + time * 0.2));

    // Combine all effects for the final alpha
    float alpha = pole_focus * curtain * noise_val;
    
    gl_FragColor = vec4(color, alpha);
}
