import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ringModel from '@sound/princess.glb'

const Ring = ({
  setLoading,
  setError,
}: {
  setLoading: (value: boolean) => void
  setError: (value: string) => void
}) => {
  const wrapperRef = useRef<any>()

  useEffect(() => {
    // 创建场景
    const scene = new THREE.Scene()

    // 创建Canvas来绘制渐变
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const width = wrapperRef.current.offsetWidth
    const height = wrapperRef.current.offsetHeight

    // 设置Canvas的宽度和高度
    canvas.width = width
    canvas.height = height

    // 创建从左到右的渐变（红色到蓝色）
    const gradient = ctx?.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    )

    gradient?.addColorStop(0, '#d0f6ff')
    gradient?.addColorStop(1, '#ffffff')

    // 填充渐变
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 将Canvas转换为纹理
    const texture = new THREE.CanvasTexture(canvas)

    // 设置为背景纹理
    scene.background = texture

    // scene.background = new THREE.Color(0xd0f6ff)

    // 创建摄像头
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    document.body.appendChild(renderer.domElement)

    // 创建光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 4) // 环境光
    scene.add(ambientLight)

    const spotlightPosition = [
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
      { x: 3, y: -3, z: -3 },
      { x: -3, y: -3, z: -3 },
      { x: 0, y: 3, z: 0 },
      { x: 0, y: -3, z: 0 },
    ]

    spotlightPosition.forEach((p) => {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8) // 定向光
      directionalLight.position.set(p.x, p.y, p.z)
      directionalLight.target.position.set(0, 0, 0) // 定向光照向原点
      scene.add(directionalLight)
      scene.add(directionalLight.target)
    })

    // 创建加载器
    const loader = new GLTFLoader()

    // 加载 .glb 文件
    loader.load(
      ringModel,
      (gltf) => {
        // 将加载的模型添加到场景中
        const model = gltf.scene
        // 遍历模型中的所有物体并应用金属光泽效果
        model.traverse((child) => {
          if (child.isMesh && child.name.includes('Diamond')) {
            const isPrincess = child.name === 'PrincessCutDiamond_Plane'
            child.material = new THREE.MeshPhysicalMaterial({
              color: isPrincess ? 0xeafafd : 0x0f52ba,
              metalness: 0.4, // 钻石不是金属
              roughness: isPrincess ? 0 : 0.4, // 非常光滑
              refractiveIndex: 2.42, // 钻石的折射率（钻石的折射率大约为 2.42）
              reflectivity: 0.9, // 高反射率
              clearcoat: 0, // 清漆层模拟钻石的光泽
              clearcoatRoughness: 0, // 清漆层的粗糙度为 0，使其光滑
              clearcoatNormalScale: 1,
              transparent: true, // 启用透明
              opacity: 0.95,
              transmission: isPrincess ? 0.97 : 1, // 高透明度
              emissive: isPrincess ? 0xeafafd : 0x0f52ba,
              emissiveIntensity: isPrincess ? 0.3 : 0.6, // 自发光强度
              thickness: 0.03,
            })
          } else {
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              metalness: 1, // 设置为金属
              roughness: 0.6, // 粗糙度（较低以获得光滑的金属表面）
              reflectivity: 1, // 反射强度
            })
          }
        })
        scene.add(model)
        // 设定模型缩放
        model.scale.set(0.15, 0.15, 0.15)
        model.position.set(0, -0.5, -0.25)
        // 设置摄像头位置
        camera.position.z = 6
        // 创建 OrbitControls，允许用户控制模型的旋转、平移和缩放
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true // 启用阻尼
        controls.dampingFactor = 0.25 // 设置阻尼系数
        // controls.screenSpacePanning = false // 禁止平面移动
        controls.maxPolarAngle = Math.PI // 设置相机旋转的最大角度
        controls.panSpeed = 0.5
        controls.rotateSpeed = 0.5
        controls.zoomSpeed = 0.5
        model.rotation.x += Math.PI / 4

        let animationFrameId
        // 渲染场景
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate)
          controls.update() // 更新控制器
          model.rotation.y += 0.01
          renderer.render(scene, camera)
        }
        animate()
        setLoading(false)

        return () => {
          cancelAnimationFrame(animationFrameId) // 清除动画
        }
      },
      undefined,
      (error) => {
        console.error('模型加载失败:', error)
        setError('模型加载失败')
        setLoading(false)
      }
    )

    wrapperRef.current.appendChild(renderer.domElement)
  }, [])

  return <div style={{ height: '100%' }} ref={wrapperRef} />
}

export default Ring
