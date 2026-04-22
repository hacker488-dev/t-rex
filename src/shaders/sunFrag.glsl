uniform float time;
uniform vec3 color; // Base color, e.g., yellow

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// Classic Perlin Noise (from The Book of Shaders, adapted)
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy; 
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_  = 0.142857142857; 
  vec4 j = p - 49.0 * floor(p * n_ );  
  vec4 x_ = floor(j * n_ );
  vec4 y_ = floor(j - 7.0 * x_ );    
  vec4 h = 1.0 - abs(x_ - n_) - abs(y_ - n_);
  vec4 b0 = vec4( x_.xy, y_.xy );
  vec4 b1 = vec4( x_.zw, y_.zw );
  vec4 s0 = floor(b0*2.0)*2.0 + 0.5;
  vec4 s1 = floor(b1*2.0)*2.0 + 0.5;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xyz, h.x);
  vec3 p1 = vec3(a1.xyz, h.y);
  vec3 p2 = vec3(a0.xzw, h.z);
  vec3 p3 = vec3(a1.xzw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

// Fractal Brownian Motion (FBM)
float fbm(vec3 coord) {
    float value = 0.0;
    float amplitude = 1.0; // Increased amplitude
    float frequency = 1.0;
    for (int i = 0; i < 5; ++i) { // Increased octaves
        value += amplitude * snoise(coord * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    // Offset vPosition to create a moving pattern
    vec3 animatedPosition = vPosition + vec3(0.0, 0.0, time * 1.0); // Faster animation

    // Get FBM noise
    float noiseValue = fbm(animatedPosition * 2.0 + time * 0.5); // More aggressive scaling and animation
    noiseValue = noiseValue * 0.5 + 0.5; // Normalize to 0-1

    // Sharpen the noise for more defined "flames"
    noiseValue = pow(noiseValue, 3.0); // More pronounced "flames"

    // Pulsing core effect
    float pulse = 0.5 + 0.5 * sin(time * 3.0); // Faster pulse

    // Combine noise and pulse for intensity
    float intensity = pulse * (0.8 + noiseValue * 1.5); // More intense base and noise contribution
    
    // Simulate glow by making edges brighter, more subtle than before
    float rim = pow(1.0 - dot(normalize(vPosition), normalize(vNormal)), 1.5); // Adjusted power for stronger rim
    intensity += rim * 0.6; // Stronger rim effect

    // Blend colors for a fiery look - more vibrant
    vec3 baseColor = color; // Yellow/Orange
    vec3 hotColor = vec3(1.0, 0.0, 0.0); // Pure Red
    vec3 coreColor = vec3(1.0, 0.8, 0.0); // Bright Orange/Yellow

    vec3 finalColor = mix(baseColor, hotColor, noiseValue * 1.5); // More blending towards hot
    finalColor = mix(finalColor, coreColor, pow(noiseValue, 2.0)); // Stronger core color contribution

    gl_FragColor = vec4(finalColor * intensity * 1.2, 1.0); // Overall brighter
}