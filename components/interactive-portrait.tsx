"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

type CompileShader = {
  uniforms: Record<string, any>
  vertexShader: string
  fragmentShader: string
}

export default function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const gu = {
      time: { value: 0 },
      dTime: { value: 0 },
      aspect: { value: width / height },
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1f1a)

    const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    class Blob {
      renderer: THREE.WebGLRenderer
      fbTexture: { value: THREE.FramebufferTexture }
      rtOutput: THREE.WebGLRenderTarget
      uniforms: {
        pointer: { value: THREE.Vector2 }
        pointerDown: { value: number }
        pointerRadius: { value: number }
        pointerDuration: { value: number }
      }
      rtScene: THREE.Mesh
      rtCamera: THREE.Camera

      constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer
        this.fbTexture = { value: new THREE.FramebufferTexture(width, height) }
        this.rtOutput = new THREE.WebGLRenderTarget(width, height)
        this.uniforms = {
          pointer: { value: new THREE.Vector2().setScalar(10) },
          pointerDown: { value: 1 },
          pointerRadius: { value: 0.35 },
          pointerDuration: { value: 2.5 },
        }

        const handlePointer = (clientX: number, clientY: number) => {
          const rect = container.getBoundingClientRect()
          this.uniforms.pointer.value.x = ((clientX - rect.left) / width) * 2 - 1
          this.uniforms.pointer.value.y = -((clientY - rect.top) / height) * 2 + 1
        }

        const handleMouseMove = (event: MouseEvent) => {
          handlePointer(event.clientX, event.clientY)
        }

        const handleTouchMove = (event: TouchEvent) => {
          if (event.touches.length > 0) {
            handlePointer(event.touches[0].clientX, event.touches[0].clientY)
          }
        }

        const handleLeave = () => {
          this.uniforms.pointer.value.setScalar(10)
        }

        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mouseleave", handleLeave)
        container.addEventListener("touchmove", handleTouchMove, { passive: true })
        container.addEventListener("touchend", handleLeave)

        const rtMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
        rtMaterial.onBeforeCompile = (shader: CompileShader) => {
          shader.uniforms.dTime = gu.dTime
          shader.uniforms.aspect = gu.aspect
          shader.uniforms.pointer = this.uniforms.pointer
          shader.uniforms.pointerDown = this.uniforms.pointerDown
          shader.uniforms.pointerRadius = this.uniforms.pointerRadius
          shader.uniforms.pointerDuration = this.uniforms.pointerDuration
          shader.uniforms.fbTexture = this.fbTexture
          shader.uniforms.time = gu.time
          shader.fragmentShader = `
                uniform float dTime, aspect, pointerDown, pointerRadius, pointerDuration, time;
                uniform vec2 pointer;
                uniform sampler2D fbTexture;
                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
                float noise(vec2 p) {
                  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
                  float a = hash(i); float b = hash(i + vec2(1.,0.)); float c = hash(i + vec2(0.,1.)); float d = hash(i + vec2(1.,1.));
                  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
                }
                ${shader.fragmentShader}
              `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
                float rVal = texture2D(fbTexture, vUv).r;
                rVal -= clamp(dTime / pointerDuration, 0., 0.05);
                rVal = clamp(rVal, 0., 1.);
                float f = 0.;
                if (pointerDown > 0.5) {
                  vec2 uv = (vUv - 0.5) * 2. * vec2(aspect, 1.);
                  vec2 mouse = pointer * vec2(aspect, 1.);
                  vec2 toMouse = uv - mouse;
                  float angle = atan(toMouse.y, toMouse.x);
                  float dist = length(toMouse);
                  float noiseVal = noise(vec2(angle*3. + time*0.5, dist*5.));
                  float noiseVal2 = noise(vec2(angle*5. - time*0.3, dist*3. + time));
                  float radiusVariation = 0.7 + noiseVal*0.5 + noiseVal2*0.3;
                  float organicRadius = pointerRadius * radiusVariation;
                  f = 1. - smoothstep(organicRadius*0.05, organicRadius*1.2, dist);
                  f *= 0.8 + noiseVal*0.2;
                }
                rVal += f * 0.25;
                rVal = clamp(rVal, 0., 1.);
                diffuseColor.rgb = vec3(rVal);
                `,
          )
        }
        rtMaterial.defines = { USE_UV: "" }
        this.rtScene = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), rtMaterial)
        this.rtCamera = new THREE.Camera()
      }

      render() {
        this.renderer.setRenderTarget(this.rtOutput)
        this.renderer.render(this.rtScene, this.rtCamera)
        this.renderer.copyFramebufferToTexture(this.fbTexture.value)
        this.renderer.setRenderTarget(null)
      }
    }

    const blob = new Blob(renderer)

    // Create video element and texture
    const video = document.createElement('video')
    video.src = 'https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424190/NItya_Emcee_KWaa_idtfui.mp4'
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    
    video.addEventListener('loadeddata', () => {
      setIsVideoLoaded(true)
      video.play().catch(e => console.log('Video autoplay failed:', e))
    })

    videoRef.current = video

    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.colorSpace = THREE.SRGBColorSpace
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter

    const textureLoader = new THREE.TextureLoader()

    // Function to calculate full-width cover dimensions
    const calculateCoverDimensions = (contentAspect: number, containerWidth: number, containerHeight: number) => {
      const containerAspect = containerWidth / containerHeight
      let planeWidth, planeHeight

      if (contentAspect > containerAspect) {
        // Content is wider - fit to height
        planeHeight = containerHeight
        planeWidth = containerHeight * contentAspect
      } else {
        // Content is taller - fit to width
        planeWidth = containerWidth
        planeHeight = containerWidth / contentAspect
      }

      return { planeWidth, planeHeight }
    }

    let overlayDimensions = calculateCoverDimensions(1, width, height)
    let overlayMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null

    const overlayTexture = textureLoader.load(
      "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767451499/compressed_021A4155_xlkgur.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace

        const img = texture.image as HTMLImageElement | undefined
        if (!img?.width || !img?.height) return

        const currentWidth = container.clientWidth
        const currentHeight = container.clientHeight
        const imgAspect = img.width / img.height
        overlayDimensions = calculateCoverDimensions(imgAspect, currentWidth, currentHeight)

        if (overlayMesh) {
          overlayMesh.geometry.dispose()
          overlayMesh.geometry = new THREE.PlaneGeometry(overlayDimensions.planeWidth, overlayDimensions.planeHeight)
        }
      },
    )

    // Create video mesh with proper sizing
    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: false })
    let videoDimensions = calculateCoverDimensions(16/9, width, height) // Default 16:9 aspect
    const videoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(videoDimensions.planeWidth, videoDimensions.planeHeight),
      videoMaterial
    )
    scene.add(videoMesh)
    videoMesh.position.z = 0.0

    // Update video dimensions when video loads
    video.addEventListener('loadedmetadata', () => {
      const videoAspect = video.videoWidth / video.videoHeight
      videoDimensions = calculateCoverDimensions(videoAspect, width, height)
      videoMesh.geometry.dispose()
      videoMesh.geometry = new THREE.PlaneGeometry(videoDimensions.planeWidth, videoDimensions.planeHeight)
    })

    // Background plane with animated texture
    const bgPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1f1a, transparent: true })
    bgPlaneMaterial.defines = { USE_UV: "" }

    bgPlaneMaterial.onBeforeCompile = (shader: CompileShader) => {
      shader.uniforms.texBlob = { value: blob.rtOutput.texture }
      shader.uniforms.time = gu.time

      let vertexShader = shader.vertexShader
      vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvPosProj = gl_Position;",
      )
      shader.vertexShader = vertexShader

      shader.fragmentShader = `
        uniform sampler2D texBlob; 
        uniform float time; 
        varying vec4 vPosProj;

        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);float a=hash(i);float b=hash(i+vec2(1.,0.));float c=hash(i+vec2(0.,1.));float d=hash(i+vec2(1.,1.));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
        
        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++) {
                value += amplitude * noise(p);
                p *= 2.1;
                amplitude *= 0.3;
            }
            return value;
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;

        vec3 colorBg = vec3(1.0);
        vec3 colorSoftShape = vec3(0.92);
        vec3 colorLine = vec3(0.8);

        vec2 uv = vUv * 3.5;
        vec2 distortionField = vUv * 2.0;
        float distortion = fbm(distortionField + time * 0.2);
        float distortionStrength = 0.7;
        vec2 warpedUv = uv + (distortion - 0.5) * distortionStrength;
        
        float n = fbm(warpedUv);
        float softShapeMix = smoothstep(0.1, 0.9, sin(n * 3.0));
        vec3 baseColor = mix(colorBg, colorSoftShape, softShapeMix);
        float linePattern = fract(n * 15.0);
        float lineMix = 1.0 - smoothstep(0.49, 0.51, linePattern);
        vec3 finalColor = mix(baseColor, colorLine, lineMix);

        diffuseColor.rgb = finalColor;
        #include <clipping_planes_fragment>
        `,
      )
    }

    const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), bgPlaneMaterial)
    scene.add(bgPlane)
    bgPlane.position.z = 0.05

    // Overlay image with mask
    const overlayMaterial = new THREE.MeshBasicMaterial({ map: overlayTexture, transparent: true, alphaTest: 0.0 })

    overlayMaterial.onBeforeCompile = (shader: CompileShader) => {
      shader.uniforms.texBlob = { value: blob.rtOutput.texture }
      let vertexShader = shader.vertexShader
      vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvPosProj = gl_Position;",
      )
      shader.vertexShader = vertexShader
      shader.fragmentShader = `
        uniform sampler2D texBlob; varying vec4 vPosProj;
        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;
        #include <clipping_planes_fragment>
        `,
      )
    }

    overlayMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(overlayDimensions.planeWidth, overlayDimensions.planeHeight),
      overlayMaterial
    )
    scene.add(overlayMesh)
    overlayMesh.position.z = 0.1

    const clock = new THREE.Clock()
    let t = 0

    const animate = () => {
      const dt = clock.getDelta()
      t += dt
      gu.time.value = t
      gu.dTime.value = dt
      blob.render()
      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      
      camera.left = newWidth / -2
      camera.right = newWidth / 2
      camera.top = newHeight / 2
      camera.bottom = newHeight / -2
      camera.updateProjectionMatrix()
      
      renderer.setSize(newWidth, newHeight)
      gu.aspect.value = newWidth / newHeight

      // Update video mesh dimensions
      if (video.videoWidth && video.videoHeight) {
        const videoAspect = video.videoWidth / video.videoHeight
        videoDimensions = calculateCoverDimensions(videoAspect, newWidth, newHeight)
        videoMesh.geometry.dispose()
        videoMesh.geometry = new THREE.PlaneGeometry(videoDimensions.planeWidth, videoDimensions.planeHeight)
      }

      // Update overlay mesh dimensions
      const overlayImg = overlayTexture.image as HTMLImageElement | undefined
      if (overlayMesh && overlayImg?.width && overlayImg?.height) {
        const imgAspect = overlayImg.width / overlayImg.height
        overlayDimensions = calculateCoverDimensions(imgAspect, newWidth, newHeight)
        overlayMesh.geometry.dispose()
        overlayMesh.geometry = new THREE.PlaneGeometry(overlayDimensions.planeWidth, overlayDimensions.planeHeight)
      }

      // Update background plane
      bgPlane.geometry.dispose()
      bgPlane.geometry = new THREE.PlaneGeometry(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener('resize', checkMobile)
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
      }
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
      videoTexture.dispose()
      overlayTexture.dispose()
      blob.rtOutput.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a1f1a]">
      {/* Three.js Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ touchAction: isMobile ? "pan-y" : "none" }}
      />

      {/* Loading Indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1f1a] z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Loading experience...</p>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <p className="text-white/40 text-xs md:text-sm font-light">
          Interactive Portrait Experience
        </p>
      </div>

     
    </div>
  )
}