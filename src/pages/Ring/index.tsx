import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ringModel from '@sound/ring.glb'

const Ring = () => {
  const wrapperRef = useRef<any>()

  useEffect(() => {
    // 创建场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87cefa)

    // 创建摄像头
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // 创建光源
    const ambientLight = new THREE.AmbientLight(0x404040, 5) // 环境光
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2) // 定向光
    directionalLight.position.set(1, 1, 1)
    directionalLight.target.position.set(0, 0, 0) // 定向光照向原点
    scene.add(directionalLight)
    scene.add(directionalLight.target)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2) // 定向光
    directionalLight2.position.set(-1, -1, -1)
    directionalLight2.target.position.set(0, 0, 0) // 定向光照向原点
    scene.add(directionalLight2)
    scene.add(directionalLight2.target)

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
            child.material = new THREE.MeshPhysicalMaterial({
              color: child.name === 'Diamond_Princess' ? 0xeffffe : 0x0f52ba,
              metalness: 0.6, // 钻石不是金属
              roughness: 0.01, // 非常光滑的表面
              refractiveIndex: 2.42, // 钻石的折射率（钻石的折射率大约为 2.42）
              reflectivity: 0.9, // 高反射率
              clearcoat: 1, // 清漆层模拟钻石的光泽
              clearcoatRoughness: 0, // 清漆层的粗糙度为 0，使其光滑
              transparent: true, // 启用透明
              opacity: 1, // 完全透明
              transmission: 0.3, // 高透明度
              emissive: child.name === 'Diamond_Princess' ? 0xeffffe : 0x0f52ba,
              emissiveIntensity: 0.1, // 自发光强度
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
        model.position.set(0, 0, -0.25)

        // 设置摄像头位置
        camera.position.z = 5

        // 创建 OrbitControls，允许用户控制模型的旋转、平移和缩放
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true // 启用阻尼
        controls.dampingFactor = 0.25 // 设置阻尼系数
        // controls.screenSpacePanning = false // 禁止平面移动
        controls.maxPolarAngle = Math.PI // 设置相机旋转的最大角度

        controls.panSpeed = 0.5
        controls.rotateSpeed = 0.5
        controls.zoomSpeed = 0.5

        // 渲染场景
        const animate = () => {
          requestAnimationFrame(animate)

          controls.update() // 更新控制器

          renderer.render(scene, camera)
        }

        animate()
      },
      undefined,
      (error) => {
        console.error('模型加载失败:', error)
      }
    )

    wrapperRef.current.appendChild(renderer.domElement)
  }, [])

  return <div ref={wrapperRef} />
}

export default Ring
