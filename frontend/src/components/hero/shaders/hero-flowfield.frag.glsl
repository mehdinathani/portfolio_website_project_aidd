precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform float uProgress;
uniform vec2 uResolution;
uniform sampler2D uTextSDF;

varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 x) { return 1.79284291400159 - 0.85373472095314 * x; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
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
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * 7.0 * n_);
  vec4 x_ = floor(j * n_);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * n_ + ns.x;
  vec4 y = y_ * n_ + ns.y;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 curlNoise(vec3 p) {
  float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 curl = vec3(
    snoise(p + dy) - snoise(p - dy) - snoise(p + dz) + snoise(p - dz),
    snoise(p + dz) - snoise(p - dz) - snoise(p + dx) + snoise(p - dx),
    snoise(p + dx) - snoise(p - dx) - snoise(p + dy) + snoise(p - dy)
  );
  return curl / (2.0 * e);
}

// Fractal sum of noise for layered depth.
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Flowing filament intensity: advect the sample point along the curl field a
// few steps and accumulate noise so the field reads as streaks of light, not a
// flat wash.
float flowStreaks(vec2 pos, float t) {
  vec3 p = vec3(pos * 1.6, t * 0.12);
  float streak = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 4; i++) {
    vec3 c = curlNoise(p);
    p.xy += c.xy * 0.12;
    p.z += 0.07;
    float n = fbm(p * 1.5);
    // Sharpen into thin bright filaments.
    streak += amp * pow(abs(n), 2.2);
    amp *= 0.62;
  }
  return streak;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 pos = uv * 2.0 - 1.0;
  pos.x *= aspect;

  float t = uTime;

  // --- Flowing energy field --------------------------------------------------
  float streaks = flowStreaks(pos, t);
  float field = smoothstep(0.05, 0.85, streaks);

  // Slow large-scale drift to keep the whole field breathing.
  float drift = 0.5 + 0.5 * fbm(vec3(pos * 0.6, t * 0.05));

  // --- Mouse interaction: a bright travelling light pulling the field --------
  vec2 mouseNorm = uMouse / uResolution;
  vec2 mousePos = mouseNorm * 2.0 - 1.0;
  mousePos.x *= aspect;
  mousePos.y *= -1.0; // screen-space y is flipped vs. clip space
  float mouseDist = distance(pos, mousePos);
  float bloom = exp(-mouseDist * 2.2);
  float mouseCore = exp(-mouseDist * 8.0);

  // --- SDF text morph (AI -> PRODUCT -> MEHDI) -------------------------------
  float numStates = 3.0;
  float state = uProgress * (numStates - 1.0);
  float stateA = floor(state);
  float stateB = min(stateA + 1.0, numStates - 1.0);
  float blend = smoothstep(0.0, 1.0, fract(state));

  float stateW = 1.0 / numStates;
  vec2 sdfUvA = vec2(uv.x * stateW + stateA * stateW, uv.y);
  vec2 sdfUvB = vec2(uv.x * stateW + stateB * stateW, uv.y);
  float sdfA = texture2D(uTextSDF, sdfUvA).r;
  float sdfB = texture2D(uTextSDF, sdfUvB).r;
  float sdf = mix(sdfA, sdfB, blend);
  float textAlpha = smoothstep(0.46, 0.54, sdf);
  float textEdge = smoothstep(0.40, 0.50, sdf) - smoothstep(0.50, 0.60, sdf);

  // --- Palette: electric-blue -> cyan -> violet ------------------------------
  vec3 deep    = vec3(0.04, 0.07, 0.18); // near-background base
  vec3 blue    = vec3(0.14, 0.42, 0.98); // electric blue (217 91% 60%)
  vec3 cyan     = vec3(0.30, 0.85, 1.00);
  vec3 violet  = vec3(0.55, 0.32, 0.98);

  // Ramp the field colour by intensity, then tint by drift toward violet.
  vec3 col = mix(deep, blue, field);
  col = mix(col, cyan, field * field * 0.9);
  col = mix(col, violet, drift * 0.35);

  // Lift overall presence so the motion is clearly visible (was ~15%).
  col += blue * field * 0.35;

  // Mouse light: warm bloom + bright core.
  col += cyan * bloom * 0.45;
  col += vec3(0.7, 0.9, 1.0) * mouseCore * 0.6;

  // Energised text: bright fill + glowing edge.
  col = mix(col, cyan * 1.4 + violet * 0.3, textAlpha * 0.85);
  col += cyan * textEdge * 1.2;

  // --- Cinematic finishing ---------------------------------------------------
  // Soft radial vignette toward the deep base colour.
  float vignette = smoothstep(1.5, 0.2, length(pos * vec2(0.62, 0.8)));
  col = mix(deep * 0.4, col, vignette);

  // Subtle film grain to kill banding and add texture.
  float grain = fract(sin(dot(uv * uResolution, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.025;

  // Tone map / gentle contrast.
  col = col / (col + vec3(0.7));
  col = pow(col, vec3(0.85));

  // Opaque-ish background so the field is genuinely present, brightest where the
  // flow, the mouse light, or the text energise it.
  float alpha = clamp(0.55 + 0.45 * field + bloom * 0.4 + textAlpha * 0.5, 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
