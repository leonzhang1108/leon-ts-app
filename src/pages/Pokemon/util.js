import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

export default ({ el, height, width, setCount }) => {
  let raf
  const streakimg =
    'https://img.alicdn.com/imgextra/i1/O1CN01XXy6zu1jcBuwuQIUr_!!6000000004568-49-tps-506-525.webp'
  const streakimg2 =
    'https://img.alicdn.com/imgextra/i3/O1CN01xfo8Sv20AZV4svTjf_!!6000000006809-49-tps-216-216.webp'
  const perlin =
    'https://img.alicdn.com/imgextra/i2/O1CN01fLhvWd1XgyfX7r2VO_!!6000000002954-49-tps-512-512.webp'
  const straightnoise =
    'https://img.alicdn.com/imgextra/i1/O1CN017b6yjO22H6Nf2V8hU_!!6000000007094-49-tps-600-600.webp'
  const water =
    'https://img.alicdn.com/imgextra/i2/O1CN01K9cVZ21pWalot4vzn_!!6000000005368-49-tps-512-512.webp'
  const pokeball = './3d-models/ball3.glb'
  const pokelogo = './3d-models/log2.glb'

  const borderBack =
    'https://img.alicdn.com/imgextra/i1/O1CN01mtgFii1M45GGZRFLh_!!6000000001380-2-tps-1884-2727.png'
  const rampimg =
    'https://img.alicdn.com/imgextra/i2/O1CN01XKxFPC1eAe18lvdnW_!!6000000003831-49-tps-2036-67.webp'
  const rampimg2 =
    'https://img.alicdn.com/imgextra/i4/O1CN015zMtdA1djceFEuPrM_!!6000000003772-49-tps-893-22.webp'
  const demo =
    'https://img.alicdn.com/imgextra/i4/O1CN01wlj9g323MsztwMu4i_!!6000000007242-2-tps-2512-3632.png'
  const color3 =
    'https://img.alicdn.com/imgextra/i4/O1CN01W72Of81SfzjikKQTZ_!!6000000002275-49-tps-417-626.webp'

  let scene, sceneRTT, camera, cameraRTT, renderer, controls, rocksmat

  var params = {
    exposure: 2.8,
    bloomStrength: 0.75,
    // bloomStrength: 0.68,
    color0: [245, 78, 660],
    bloomThreshold: 0.1,
    bloomRadius: 0.2,
  }

  const vert = `
  varying vec2 vUv;
    
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `

  const vertPos = `
  varying vec2 vUv;
  varying vec3 camPos;
  
  void main() {
    vUv = uv;
    camPos = cameraPosition;
    vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `

  const frag = `
  varying vec2 vUv;
  uniform sampler2D perlinnoise;
  uniform sampler2D sparknoise;
  uniform sampler2D straightnoise;
  uniform sampler2D streaknoise;
  uniform sampler2D waternoise;
  uniform float time;
  uniform vec3 color0;
  
  vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
    //https://twitter.com/Cyanilux/status/1123950519133908995/photo/1
    vec2 delta = UV - Center;
    float radius = length(delta) * 2. * RadialScale;
    float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
    return vec2(radius, angle);
  }
  
  float setOpacity(float r, float g, float b, float tonethreshold) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if(tone<tonethreshold) {
      alpha = 0.0;
    }
    return alpha;
  }
  
  vec3 rgbColor(float r, float g, float b){
    return vec3(r/255.,g/255.,b/255.);
  }
  
  void main(){
  
    // set polar coords
    vec2 center = vec2(0.5);
    vec2 cor = UnityPolarCoordinates(mod(vec2(vUv.x,vUv.y),1.), center, 1., 1.);
  
    // set textures
    vec2 newUv = vec2(cor.x + time, cor.y + cor.x/1.3)*2.;
    vec3 noisetex = texture2D(streaknoise,mod(newUv,1.)).rgb;    
    vec3 noisetex2 = texture2D(sparknoise,mod(newUv,1.)).rgb;   
  
    vec3 color = rgbColor(color0.r,color0.g,color0.b);
  
    gl_FragColor = vec4(vec3(color),noisetex.r);
    gl_FragColor *= vec4(smoothstep(0.45,1.,1. - distance(vUv,vec2(0.5))));
  
  }
  
  `

  const frag2 = `
  varying vec2 vUv;
  uniform sampler2D perlinnoise;
  uniform sampler2D sparknoise;
  uniform sampler2D straightnoise;
  uniform sampler2D streaknoise;
  uniform sampler2D waternoise;
  uniform vec3 color0;
  
  uniform float time;
  
  vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
    //https://twitter.com/Cyanilux/status/1123950519133908995/photo/1
    vec2 delta = UV - Center;
    float radius = length(delta) * 2. * RadialScale;
    float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
    return vec2(radius, angle);
  }
  
  float setOpacity(float r, float g, float b, float tonethreshold) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if(tone<tonethreshold) {
      alpha = 0.0;
    }
    return alpha;
  }
  
  vec3 rgbColor(float r, float g, float b){
    return vec3(r/255.,g/255.,b/255.);
  }
  
  void main(){
  
    // set polar coords
    vec2 center = vec2(0.5);
    vec2 cor = UnityPolarCoordinates(mod(vec2(vUv.x,vUv.y),1.), center, 1., 1.);
  
    // set textures
    vec2 newUv = vec2(cor.x + time/2., cor.y + cor.x)*3.;
    vec3 noisetex = texture2D(straightnoise,mod(newUv,1.)).rgb;    
    vec3 noisetex2 = texture2D(streaknoise,mod(newUv,1.)).rgb;   
    
    vec3 color = rgbColor(color0.r,color0.g,color0.b);
  
    gl_FragColor = vec4(noisetex.r)*0.7 + vec4(noisetex2.r)*0.3;
    gl_FragColor *= smoothstep(0.15,1.,1. - distance(vUv,vec2(0.5)));
  }
  
  `

  const frag3 = `
  varying vec2 vUv;
  uniform sampler2D perlinnoise;
  uniform sampler2D sparknoise;
  uniform sampler2D straightnoise;
  uniform sampler2D streaknoise;
  uniform sampler2D waternoise;
  uniform float time;
  
  vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
    //https://twitter.com/Cyanilux/status/1123950519133908995/photo/1
    vec2 delta = UV - Center;
    float radius = length(delta) * 2. * RadialScale;
    float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
    return vec2(radius, angle);
  }
  
  float setOpacity(float r, float g, float b, float tonethreshold) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if(tone<tonethreshold) {
      alpha = 0.0;
    }
    return alpha;
  }
  
  vec3 rgb(float r,float g,float b){
    return vec3(r/255.,g/255.,b/255.);
  }
  
  void main(){
  
    // set polar coords
    vec2 center = vec2(0.5);
    vec2 cor = UnityPolarCoordinates(mod(vec2(vUv.x,vUv.y),1.), center, 1., 1.);
  
    // set textures
    vec2 newUv = vec2(cor.x + time/5., cor.y + cor.x*0.5)*3.;
    vec3 noisetex = texture2D(waternoise,mod(newUv,1.)).rgb;    
    vec3 noisetex2 = texture2D(sparknoise,mod(newUv,1.)).rgb;   
    
    // set textures tones
    float tone0 =  smoothstep(0.,0.6,noisetex.r);
  
    gl_FragColor = vec4(rgb(42.,72.,133.),tone0);
  }
  
  `

  const fraggroups = `
  varying vec2 vUv;
  uniform sampler2D perlinnoise;
  uniform sampler2D sparknoise;
  uniform sampler2D straightnoise;
  uniform sampler2D streaknoise;
  uniform sampler2D waternoise;
  uniform float time;
  
  vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
    //https://twitter.com/Cyanilux/status/1123950519133908995/photo/1
    vec2 delta = UV - Center;
    float radius = length(delta) * 2. * RadialScale;
    float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
    return vec2(radius, angle);
  }
  
  float setOpacity(float r, float g, float b, float tonethreshold) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if(tone<tonethreshold) {
      alpha = 0.0;
    }
    return alpha;
  }
  
  
  void main(){
  
    // set polar coords
    vec2 center = vec2(0.5);
    vec2 cor = UnityPolarCoordinates(mod(vec2(vUv.x,vUv.y),1.), center, 1., 1.);
  
    // set textures
    vec2 newUv = vec2(cor.x + time, cor.y + cor.x/1.3)*3.;
    vec3 noisetex = texture2D(streaknoise,mod(newUv,1.)).rgb;    
    vec3 noisetex2 = texture2D(sparknoise,mod(newUv,1.)).rgb;   
  
    gl_FragColor = vec4(noisetex.r + 0.1);
    gl_FragColor *= vec4(smoothstep(0.4,1.,1. - distance(vUv,vec2(0.5))));
  }
  `

  const fireVert = `
  varying vec2 vUv;
  uniform sampler2D perlinnoise;
  uniform float time;
  
  void main() {
    vUv = uv;
    vec4 noisetex = texture2D(perlinnoise,mod(vec2(vUv.x*1. + vUv.y*4. + time*0.1,vUv.y*4. - time*1.),1.));   
    vec3 newpos = vec3(position);
    newpos.z = position.z + 1.3*noisetex.r*position.x/.15;
    newpos.x = position.x + 1.*noisetex.g*position.z/.15;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos , 1.0);
  }
  `

  const fireFrag = `
  varying vec2 vUv;
  uniform sampler2D perlinnoise;
  uniform sampler2D straightnoise;
  uniform float time;
  
  vec3 rgb(float r,float g,float b){
    return vec3(r/255.,g/255.,b/255.);
  }
  
  void main(){
    vec4 sparktex = texture2D(straightnoise,mod(vec2(vUv.x*1.,vUv.y*4. - time),1.));   
    vec4 noisetex = texture2D(perlinnoise,mod(vec2(vUv.x*1. +vUv.y*4. ,vUv.y*4. - time),1.));  
    vec3 primcolor = rgb(246., 255., 0.); 
    vec3 basecolor = rgb(222.,56.,0.);
    vec3 sparkcolor = rgb(255.,22.,22.);
  
    float tone0 =  1. - smoothstep(0.2,0.7,noisetex.r);
    float tone1 =  1. - smoothstep(0.1,1.3,noisetex.r);
  
    gl_FragColor = vec4(basecolor, .6);
  
    if(noisetex.r>=tone0){
      gl_FragColor = vec4(vec3(primcolor)*0.45, 1.);
    }
    if(noisetex.r>=tone1){
      gl_FragColor = vec4(vec3(sparkcolor),1.);
    }
  }
  `

  const backfrag = `
  varying vec2 vUv;
  uniform sampler2D perlinnoise;
  uniform sampler2D ramp;
  uniform sampler2D straightnoise;
  uniform float time;
  varying vec3 camPos;
  
  void main(){
    vec4 noisetexoriginal = texture2D(perlinnoise,mod(vec2(vUv.x,vUv.y)*5.,1.));   
    vec4 noisetex1 = texture2D(perlinnoise,mod(vec2(vUv.x + time/20., vUv.y - time/40.)*5.,1.));   
    vec4 noisetex2 = texture2D(perlinnoise,mod(vec2(vUv.x, vUv.y + time/30.)*5.,1.));   
    vec4 animnoise = vec4(noisetex1/9. + noisetex2/9.);
  
    vec4 noisetexoriginaluv = texture2D(perlinnoise,mod(vec2(vUv.x + animnoise.r,vUv.y + animnoise.g)*5.,1.));   
  
    gl_FragColor = noisetexoriginaluv;
    gl_FragColor *= animnoise*2.;
  
  
    float tone = pow(dot(normalize(camPos), normalize(animnoise.rgb)), 1.);
  
    vec4 col = texture2D(ramp,mod(vec2(mod(gl_FragColor.r,1.),0.),1.))/2.23;   
    gl_FragColor = col;
    
  
  }
  `

  const vertPoint = `
      uniform vec2 mouse;
      uniform float time;
      varying vec2 vCoordinates;
      attribute vec3 aCoordinates;
      attribute float aDirection;
      attribute float aPress;
      uniform float height;
      varying vec2 vUv;
  
      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }
      
      const float F3 =  0.3333333;
      const float G3 =  0.1666667;
      float snoise(vec3 p) {
      
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
         
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
           
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
         
        vec4 w, d;
         
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
         
        w = max(0.6 - w, 0.0);
         
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
         
        w *= w;
        w *= w;
        d *= w;
         
        return dot(d, vec4(52.0));
      }
      
      
  
      vec3 snoiseVec3( vec3 x ){
  
        float s  = snoise(vec3( x ));
        float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
        float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
        vec3 c = vec3( s , s1 , s2 );
        return c;
  
      }
  
  
      vec3 curlNoise( vec3 p ){
        
        const float e = .1;
        vec3 dx = vec3( e   , 0.0 , 0.0 );
        vec3 dy = vec3( 0.0 , e   , 0.0 );
        vec3 dz = vec3( 0.0 , 0.0 , e   );
  
        vec3 p_x0 = snoiseVec3( p - dx );
        vec3 p_x1 = snoiseVec3( p + dx );
        vec3 p_y0 = snoiseVec3( p - dy );
        vec3 p_y1 = snoiseVec3( p + dy );
        vec3 p_z0 = snoiseVec3( p - dz );
        vec3 p_z1 = snoiseVec3( p + dz );
  
        float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
        float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
        float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
  
        const float divisor = 1.0 / ( 2.0 * e );
        return normalize( vec3( x , y , z ) * divisor );
  
      }
  
  
      float map2(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
      }
  
  
      void main() {
          vUv=uv;
          vec3 stable = position;
          vec3 stable2 = position;
          float dist = distance(stable.xy,vec2(0.,mouse.y));
          float area = 1. - smoothstep(0.,300.,dist);
          vec3 cn = curlNoise(position+0.0001*time)*100.*1.;
          stable.x -= 50.*sin(0.01*time*aPress)*1.*aDirection - cn.x;
          // stable.x = position.x + cn.x*aDirection;
          stable.y += 60.*sin(0.001*time*aPress)*1.*aDirection + cn.y;
          // stable.z += 100.*cos(0.01*time*aPress)*1.*aDirection + cn.z;
  
          vec3 cn2 = curlNoise(position+0.0001*time)*20.*1.;
          stable2.z = position.z + cn2.z  ;
          // stable2.x = position.x + mod(cn2/10.,1.).x ;
          stable2.y = position.y + 20.*aDirection*sin(0.001*time + stable2.y*20.) + cn2.y/10.   ;
  
          vec4 mvPosition = modelViewMatrix * vec4( vec3(stable2), 1.0 );
          /// still need to fix this
          float xr = map2(height, 150., 1201.,20.,60.);
          gl_PointSize = xr * (1. / -mvPosition.z);
          vCoordinates = aCoordinates.xy;
          gl_Position = projectionMatrix * mvPosition;
      }
  `

  const fragPoint = `
     varying vec2 vUv;
  
      vec3 rgb(float r,float g,float b){
        return vec3(r/255.,g/255.,b/255.);
      }
  
      void main() {
        vec3 sparkcolor = rgb(255., 224., 0.);
        vec2 uv2 = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
      
  
        gl_FragColor = vec4(sparkcolor,1.)*(distance(vec2(0.5),uv2));
        gl_FragColor = vec4(sparkcolor,vec4(1. - smoothstep(0.0,.30,distance(vec2(0.5),uv2))))/1.3;
  
      }
  `

  const rttHeight = height * 2
  const rttWidth = (rttHeight * 2) / 3

  function init() {
    createScene()
    postProc()
    sceneLights()
    light()
    models()
    mesh()
    meshGroups()
    cardBack()
    cardFront()
    addPoints()
    onPositionChange()
    animate()
  }

  function createScene() {
    scene = new THREE.Scene()
    sceneRTT = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0.0, 0.0, -2.5)

    cameraRTT = new THREE.PerspectiveCamera(
      75,
      rttWidth / rttHeight,
      0.08,
      1000
    )
    cameraRTT.position.set(0, 0, 1.5)

    renderer = new THREE.WebGLRenderer({ antialias: true, autoSize: true })
    renderer.setPixelRatio(2)
    renderer.setSize(width, height)
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.interpolateneMapping = THREE.ACESFilmicToneMapping
    renderer.outputEncoding = THREE.sRGBEncoding
    sceneRTT.background = new THREE.Color(0x111930)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.addEventListener('change', onPositionChange)

    el.appendChild(renderer.domElement)
  }

  const uniforms = {
    perlinnoise: {
      type: 't',
      value: new THREE.TextureLoader().load(perlin),
    },
    sparknoise: {
      type: 't',
      value: new THREE.TextureLoader().load(water),
    },
    straightnoise: {
      type: 't',
      value: new THREE.TextureLoader().load(straightnoise),
    },
    waternoise: {
      type: 't',
      value: new THREE.TextureLoader().load(water),
    },
    streaknoise: {
      type: 't',
      value: new THREE.TextureLoader().load(streakimg),
    },
    color0: {
      value: new THREE.Vector3(255, 255, 255),
    },
    time: {
      type: 'f',
      value: 0.0,
    },
  }
  let bloomPass, bloomComposer, blurComposer, backcard, frontcard
  function postProc() {
    var renderScene = new RenderPass(sceneRTT, cameraRTT)

    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(rttWidth, rttHeight),
      1.5,
      0.4,
      0.85
    )

    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius
    bloomPass.threshold = params.bloomThreshold

    bloomComposer = new EffectComposer(renderer)
    bloomComposer.renderToScreen = false
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass)
  }

  function sceneLights() {
    const color = 0xffffff
    const intensity = 0.02
    const ambLight = new THREE.AmbientLight(color, intensity)
    scene.add(ambLight)

    dir3Light = new THREE.DirectionalLight(0x363636, 0.007)
    dir3Light.position.set(0, 0, -100)
    scene.add(dir3Light)
  }

  let ambLight, dir1Light, dir2Light, dir3Light, hemiLight
  function light() {
    const color = 0xffffff
    const intensity = 1
    ambLight = new THREE.AmbientLight(color, intensity)
    sceneRTT.add(ambLight)

    dir1Light = new THREE.DirectionalLight(0xffffff, 0.5)
    dir1Light.position.set(4, 2, 2).normalize()
    sceneRTT.add(dir1Light)

    dir2Light = new THREE.DirectionalLight(0xebd834, 0)
    dir2Light.position.set(-4, 2.3, -1).normalize()
    sceneRTT.add(dir2Light)

    hemiLight = new THREE.HemisphereLight(0x000000, 0xffffff, 0.94)
    sceneRTT.add(hemiLight)
  }

  const newMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  })

  const newMaterial2 = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag2,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  })

  const newMaterial3 = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag3,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  })

  const newMaterial4 = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
      streaknoise: {
        type: 't',
        value: new THREE.TextureLoader().load(streakimg2),
      },
      color0: {
        value: new THREE.Vector3(0, 83, 244),
      },
    },
    vertexShader: vert,
    fragmentShader: frag,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  })

  const newMaterial5 = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
    },
    vertexShader: fireVert,
    fragmentShader: fireFrag,
    // side: THREE.DoubleSide,
    transparent: true,
    // depthWrite: false,
  })

  const newMaterial6 = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
      ramp: {
        type: 't',
        value: new THREE.TextureLoader().load(rampimg2),
      },
    },
    vertexShader: vertPos,
    fragmentShader: backfrag,
    side: THREE.BackSide,
    // transparent: true,
    // depthWrite: false,
  })

  const ballGroup = new THREE.Group()
  const ballGroup2 = new THREE.Group()
  let parentGroupBack = new THREE.Group()
  let parentGroupFront = new THREE.Group()

  function models() {
    const gloader = new GLTFLoader()
    gloader.load(pokeball, function (result) {
      result.scene.scale.set(0.27, 0.28, 0.28)
      result.scene.rotation.set(-Math.PI / 8, 0, 0)
      result.scene.position.set(-0.01, -0.02, -0.15)
      ballGroup.add(result.scene)
      ballGroup2.add(ballGroup.clone())
      setCount(count => count + 1)
    })

    gloader.load(pokelogo, (gltf) => {
      let obj = new THREE.Object3D()
      obj.add(gltf.scene)
      obj.position.set(-0.13, 0.3, -0.3)
      obj.scale.set(0.23, 0.23, 0.23)
      parentGroupBack.add(obj)

      let obj2 = new THREE.Object3D()
      obj2.add(obj.clone())
      obj2.rotation.set(0, 0, Math.PI)
      parentGroupBack.add(obj2)

      let obj3 = new THREE.Object3D()
      obj3.add(obj2.clone())
      obj3.rotation.set(0, Math.PI, 0)
      parentGroupFront.add(obj3)

      let obj4 = new THREE.Object3D()
      obj4.add(obj3.clone())
      obj4.rotation.set(0, 0, Math.PI)
      parentGroupFront.add(obj4)

      setCount(count => count + 1)
    })
  }
  function mesh() {
    const geometry = new THREE.SphereBufferGeometry(
      1,
      30,
      30,
      Math.PI / 2,
      Math.PI
    )
    const fullgeometry = new THREE.SphereBufferGeometry(1, 30, 30)

    const mesh3 = new THREE.Mesh(fullgeometry, newMaterial3)
    mesh3.scale.set(1.1, 2.3, 1.3)
    mesh3.position.set(0, 0, -0.1)
    mesh3.rotation.set(0, Math.PI / 2, 0)
    parentGroupBack.add(mesh3)

    const mesh4 = new THREE.Mesh(fullgeometry, newMaterial4)
    mesh4.scale.set(1.8, 3.3, 1.3)
    mesh4.position.set(0, 0, -0.4)
    mesh4.rotation.set(0, Math.PI / 2, 0)
    parentGroupBack.add(mesh4)

    const mesh2 = new THREE.Mesh(geometry, newMaterial2)
    mesh2.scale.set(0.9, 1.2, 1.41)
    mesh2.position.set(0, 0, 0.1)
    mesh2.rotation.set(0, Math.PI / 2, 0)
    parentGroupBack.add(mesh2)

    const mesh = new THREE.Mesh(geometry, newMaterial)
    mesh.scale.set(1.463, 2.7, 1.1)
    mesh.position.set(0, 0, 0.2)
    mesh.rotation.set(0, Math.PI / 2, 0)
    parentGroupBack.add(mesh)
  }

  function meshGroups() {
    const geometry = new THREE.SphereBufferGeometry(
      0.4,
      30,
      30,
      Math.PI / 2,
      Math.PI
    )
    const newMaterialGroup = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: fraggroups,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, newMaterialGroup)
    const mesh2 = new THREE.Mesh(geometry, newMaterialGroup)
    mesh.scale.set(1.6, 1.1, 1.3)
    mesh.position.set(-0.16, 0.21, -0.14)
    mesh.rotation.set(-Math.PI / 1.8, Math.PI / 3, 0)
    mesh2.scale.set(1.6, 1.1, 1.3)
    mesh2.position.set(-0.16, 0.21, -0.14)
    mesh2.rotation.set(-Math.PI / 1.8, Math.PI / 3, 0)
    ballGroup.add(mesh)
    ballGroup.scale.set(1.84, 1.84, 1.84)
    ballGroup.rotation.set(Math.PI / 16, -Math.PI / 16, 0)
    parentGroupBack.add(ballGroup)

    ballGroup2.add(mesh)
    ballGroup2.scale.set(1, 1, 1)
    ballGroup2.rotation.set(Math.PI / 16, -Math.PI / 16 + Math.PI, 0)
    parentGroupFront.add(ballGroup2)

    sceneRTT.add(parentGroupBack)
    sceneRTT.add(parentGroupFront)
  }

  let newfrontmaterial, newbackmaterial

  function cardBack() {
    const geometry = new THREE.PlaneBufferGeometry(2, 3)
    const rough = new THREE.TextureLoader().load(straightnoise)
    const uniforms = {
      renderBackTex: {
        type: 't',
        value: bloomComposer.readBuffer.texture,
      },
      btemplate: {
        type: 't',
        value: new THREE.TextureLoader().load(borderBack),
      },
      demoimg: {
        type: 't',
        value: new THREE.TextureLoader().load(demo),
      },
      screenWidth: {
        value: width,
      },
      resolution: {
        value: new THREE.Vector2(rttWidth, rttHeight),
      },
      backtexture: {
        type: 't',
        value: new THREE.TextureLoader().load(color3),
      },
      colorramp: {
        type: 't',
        value: new THREE.TextureLoader().load(rampimg),
      },
    }
    newbackmaterial = new THREE.MeshStandardMaterial({
      color: 0xfffffff,
      metalness: 1,
      roughness: 0.7,
      roughnessMap: rough,
      transparent: true,
    })
    newbackmaterial.onBeforeCompile = (shader) => {
      shaderCtx2 = shader
      shader.uniforms = {
        ...shader.uniforms,
        ...uniforms,
      }

      shader.vertexShader = `
        varying vec2 vUv2;
        varying vec3 camPos;
      ${shader.vertexShader}
      `

      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        #include <project_vertex>
        vUv2 = uv;
        camPos = cameraPosition;
        vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);`
      )

      shader.fragmentShader = `
      
        varying vec2 vUv2;
        varying vec3 camPos;
        uniform sampler2D renderBackTex;
        uniform sampler2D btemplate;
        uniform vec4 resolution;
        uniform float screenWidth;
        uniform sampler2D frontimg;
        uniform sampler2D backtexture;
        uniform sampler2D colorramp;
        uniform sampler2D demoimg;
  
        vec3 rgb(float r,float g,float b){
          return vec3(r/255.,g/255.,b/255.);
        }
        
      ${shader.fragmentShader}
    `

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
  
        vec4 originalG = gl_FragColor;
        vec2 uv = gl_FragCoord.xy/resolution.xy ;
        float centerXAxis = screenWidth/resolution.x;
        vec4 backTemplete = texture2D(btemplate,mod(vUv2,1.));    
        vec4 target = texture2D(renderBackTex,vec2(uv.x - centerXAxis + 0.5,uv.y));    
  
        vec4 frontimgtex = texture2D(btemplate,mod(vUv2,1.));   
        vec3 backtexturetex = texture2D(backtexture,mod(vUv2,1.)).rgb;   
        float tone = pow(dot(normalize(camPos), normalize(backtexturetex.rgb)), 1.);
        vec4 colortex = texture2D( colorramp, vec2(tone,0.));
  
        gl_FragColor = vec4(frontimgtex);
        vec4 col = vec4(0.);
        col = vec4(vec3(colortex),1.);
        col += vec4(sin((tone + vUv2.x + vUv2.y/10.)*10.))/8.;
        col += vec4(0.3);
  
        vec4 shine = vUv.y*smoothstep(0.1,0.101,vec4(0.48)*sin((-normalize(camPos).x + vUv.x*2. - vUv.y*.7)/3.))/10.;
        vec4 finaltex = vec4(frontimgtex);
        if(frontimgtex.r<=0.99 && frontimgtex.g<=0.99 && frontimgtex.b<=0.99){
          finaltex = vec4(1.);
        }
        gl_FragColor = frontimgtex;
  
        if(gl_FragColor.g==1. && (gl_FragColor.r <= 0.055 && gl_FragColor.r >= 0.05 )){
          gl_FragColor = vec4(0.);
        }
  
        if(gl_FragColor.r == 0.0 && gl_FragColor.g >= 0.00){
          // gl_FragColor = (vec4(target) + originalG/5.)*gl_FragColor.a;
          gl_FragColor = (vec4(target))*gl_FragColor.a;
          // gl_FragColor += shine;
  
        } else {
          gl_FragColor =  col - vec4(vec3( 1.4 - col.r),1.) + 0.2 + originalG;
          gl_FragColor.b = 0.8;
          gl_FragColor.g *= 0.45;
          gl_FragColor.r *= 0.38;
          gl_FragColor += shine/5.;
        }
  
      `
      )
    }
    backcard = new THREE.Mesh(geometry, newbackmaterial)
    scene.add(backcard)
  }

  let shaderCtx, shaderCtx2, shaderRockCtx

  function cardFront() {
    const uniforms = {
      renderBackTex: {
        type: 't',
        value: bloomComposer.readBuffer.texture,
      },
      btemplate: {
        type: 't',
        value: new THREE.TextureLoader().load(borderBack),
      },
      demoimg: {
        type: 't',
        value: new THREE.TextureLoader().load(demo),
      },
      screenWidth: {
        value: width,
      },
      resolution: {
        value: new THREE.Vector2(rttWidth, rttHeight),
      },
      backtexture: {
        type: 't',
        value: new THREE.TextureLoader().load(color3),
      },
      colorramp: {
        type: 't',
        value: new THREE.TextureLoader().load(rampimg),
      },
    }
    const geometry = new THREE.PlaneBufferGeometry(2, 3)
    const rough = new THREE.TextureLoader().load(straightnoise)
    newfrontmaterial = new THREE.MeshStandardMaterial({
      color: 0xfffffff,
      metalness: 1,
      roughness: 0.7,
      roughnessMap: rough,
      transparent: true,
    })
    newfrontmaterial.onBeforeCompile = (shader) => {
      shaderCtx2 = shader
      shader.uniforms = {
        ...shader.uniforms,
        ...uniforms,
      }

      shader.vertexShader = `
        varying vec2 vUv2;
        varying vec3 camPos;
      ${shader.vertexShader}
      `

      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        #include <project_vertex>
        vUv2 = uv;
        camPos = cameraPosition;
        vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);`
      )

      shader.fragmentShader = `
      
        varying vec2 vUv2;
        varying vec3 camPos;
        uniform sampler2D renderBackTex;
        uniform sampler2D btemplate;
        uniform vec4 resolution;
        uniform float screenWidth;
        uniform sampler2D frontimg;
        uniform sampler2D backtexture;
        uniform sampler2D colorramp;
        uniform sampler2D demoimg;
  
        vec3 rgb(float r,float g,float b){
          return vec3(r/255.,g/255.,b/255.);
        }
        
      ${shader.fragmentShader}
    `

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
  
        vec4 originalG = gl_FragColor;
        vec2 uv = gl_FragCoord.xy/resolution.xy ;
        float centerXAxis = screenWidth/resolution.x;
        vec4 backTemplete = texture2D(btemplate,mod(vUv2,1.));    
        vec4 target = texture2D(renderBackTex,vec2(uv.x - centerXAxis + 0.5,uv.y));    
  
        vec4 frontimgtex = texture2D(btemplate,mod(vUv2,1.));   
        vec3 backtexturetex = texture2D(backtexture,mod(vUv2,1.)).rgb;   
        float tone = pow(dot(normalize(camPos), normalize(backtexturetex.rgb)), 1.);
        vec4 colortex = texture2D( colorramp, vec2(tone,0.));
  
        gl_FragColor = vec4(frontimgtex);
        vec4 col = vec4(0.);
        col = vec4(vec3(colortex),1.);
        col += vec4(sin((tone + vUv2.x + vUv2.y/10.)*10.))/8.;
        col += vec4(0.3);
  
        vec4 shine = vUv.y*smoothstep(0.1,0.101,vec4(0.48)*sin((-normalize(camPos).x + vUv.x*2. - vUv.y*.7)/3.))/10.;
        vec4 finaltex = vec4(frontimgtex);
        if(frontimgtex.r<=0.99 && frontimgtex.g<=0.99 && frontimgtex.b<=0.99){
          finaltex = vec4(1.);
        }
        gl_FragColor = frontimgtex;
  
        if(gl_FragColor.g==1. && (gl_FragColor.r <= 0.055 && gl_FragColor.r >= 0.05 )){
          gl_FragColor = vec4(0.);
        }
  
        if(gl_FragColor.r == 0.0 && gl_FragColor.g >= 0.00){
          // gl_FragColor = (vec4(target) + originalG/5.)*gl_FragColor.a;
          gl_FragColor = (vec4(target))*gl_FragColor.a;
          // gl_FragColor += shine;
  
        } else {
          gl_FragColor =  col - vec4(vec3( 1.4 - col.r),1.) + 0.2 + originalG;
          gl_FragColor.b = 0.8;
          gl_FragColor.g *= 0.45;
          gl_FragColor.r *= 0.38;
          gl_FragColor += shine/5.;
        }
  
      `
      )
    }
    newfrontmaterial.anisotropy = 0
    newfrontmaterial.magFilter = THREE.NearestFilter
    newfrontmaterial.minFilter = THREE.NearestFilter

    frontcard = new THREE.Mesh(geometry, newfrontmaterial)
    frontcard.rotation.set(0, Math.PI, 0)
    scene.add(frontcard)
  }
  let shadermat,
    positions,
    coordinates,
    direction,
    press,
    point = { x: 0, y: 0 }
  function addPoints() {
    const s = 18
    const number = s * s

    const geometry = new THREE.BufferGeometry()
    positions = new THREE.BufferAttribute(new Float32Array(number * 3), 3)
    coordinates = new THREE.BufferAttribute(new Float32Array(number * 3), 3)
    direction = new THREE.BufferAttribute(new Float32Array(number), 1)
    press = new THREE.BufferAttribute(new Float32Array(number), 1)

    let index = 0
    for (let i = 0; i < s; i++) {
      let posx = i - s * 0.5
      for (let j = 0; j < s; j++) {
        let posy = j - s * 0.5
        positions.setXYZ(index, posx * 1, posy * 1, 0)
        coordinates.setXYZ(index, i, j, 0)
        direction.setX(index, Math.random())
        press.setX(index, rand(0.4, 1))
        index++
      }
    }

    geometry.setAttribute('position', positions)
    geometry.setAttribute('aCoordinates', coordinates)
    geometry.setAttribute('aDirection', direction)
    geometry.setAttribute('aPress', press)

    shadermat = new THREE.ShaderMaterial({
      vertexShader: vertPoint,
      fragmentShader: fragPoint,
      uniforms: {
        time: {
          type: 'f',
          value: null,
        },
        height: {
          value: height,
        },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    const pointmesh = new THREE.Points(geometry, shadermat)
    pointmesh.scale.set(0.14, 0.14, 0.14)
    pointmesh.rotation.set(0, Math.PI / 2, 0)
    pointmesh.position.set(0, 0, -1)
    parentGroupFront.add(pointmesh)
    sceneRTT.add(parentGroupFront)
  }

  function rand(a, b) {
    return a + (b - a) * Math.random()
  }

  let oldY = null
  function updateDraw(delta) {
    if (oldY !== -camera.rotation._y) {
      var matrix = new THREE.Matrix4()
      var matrix2 = new THREE.Matrix4()
      oldY = -camera.rotation._y
      matrix.makeRotationY(camera.rotation._y)
      matrix2.makeRotationX(camera.rotation._x)

      cameraRTT.position.set(0, 0, 2)
      cameraRTT.position.applyMatrix4(matrix)
      cameraRTT.position.applyMatrix4(matrix2)
      cameraRTT.lookAt(parentGroupBack.position)
      cameraRTT.updateMatrixWorld()
    }
    var vector = new THREE.Vector3(0, 0, 0)
    var angleValue = camera.getWorldDirection(vector)
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius

    const angle = THREE.Math.radToDeg(Math.atan2(angleValue.x, angleValue.z))
    if (angle >= 90 || angle <= -90) {
      // animate stuff inside parentGroupBack
      bloomPass.strength = 0.75
      newMaterial.uniforms.time.value = -delta / (1000 * 2)
      newMaterial2.uniforms.time.value = -delta / (1000 * 2)
      newMaterial3.uniforms.time.value = -delta / (1000 * 2)
      ballGroup.position.set(0, 0.05 * Math.sin(-delta / 800), -0.4)
    } else {
      bloomPass.strength = 0.75
      bloomPass.radius = 0
      if (shaderCtx && shaderCtx.uniforms) {
        shaderCtx.uniforms.time.value = -delta / (50 * 2)
      }

      if (shaderRockCtx && shaderRockCtx.uniforms) {
        shaderRockCtx.uniforms.time.value = -delta / (50 * 2)
      }

      newMaterial5.uniforms.time.value = -delta / (1000 * 2)
      shadermat.uniforms.time.value = delta
      ballGroup2.position.set(0.1, 0.05 * Math.sin(-delta / 800), 0.4)
    }
  }

  function animate(delta) {
    raf = requestAnimationFrame(animate)
    updateDraw(delta)
    controls.update()

    renderer.clear()
    bloomComposer.render()
    renderer.render(scene, camera)
  }
  let prevAngle = ''
  function onPositionChange(o) {
    var vector = new THREE.Vector3(0, 0, 0)
    var angleValue = camera.getWorldDirection(vector)

    const angle = THREE.Math.radToDeg(Math.atan2(angleValue.x, angleValue.z))
    if (angle >= 90 || angle <= -90) {
      if (prevAngle !== 'back') {
        handleResize()
        prevAngle = 'back'
        ambLight.intensity = 1
        dir1Light.intensity = 0.4
        dir2Light.intensity = 0
        dir3Light.position.set(0, 0, 1)
        sceneRTT.add(parentGroupBack)
        sceneRTT.remove(parentGroupFront)
        sceneRTT.remove(hemiLight)
        scene.add(backcard)
        scene.remove(frontcard)
      }
    } else if (angle < 90 || angle > -90) {
      if (prevAngle !== 'front') {
        handleResize()
        prevAngle = 'front'
        ambLight.intensity = 0.75
        // dir1Light.intensity = 0.5;
        dir2Light.intensity = 0.1
        dir3Light.position.set(0, 0, -1)
        sceneRTT.remove(parentGroupBack)
        sceneRTT.add(parentGroupFront)
        sceneRTT.add(hemiLight)
        scene.add(frontcard)
        scene.remove(backcard)
      }
    }
  }

  function handleResize() {
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    if (shaderCtx) {
      shaderCtx.uniforms.resolution.value = new THREE.Vector2(
        (height * 2 * 2) / 3,
        height * 2
      )
      shaderCtx.uniforms.screenWidth.value = width
    }
    if (shaderCtx2) {
      shaderCtx2.uniforms.resolution.value = new THREE.Vector2(
        (height * 2 * 2) / 3,
        height * 2
      )
      shaderCtx2.uniforms.screenWidth.value = width
    }
  }

  init()

  return () => {
    raf && cancelAnimationFrame(raf)
  }
}
