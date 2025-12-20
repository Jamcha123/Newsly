import { useState, useEffect, useCallback, useRef } from 'react'
import * as THREE from 'three'
import {motion} from 'framer-motion'
import './App.css'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, linkWithPopup, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import google_logo from './assets/logo1.svg'
import github_logo from './assets/github.svg'

const config = {
  apiKey: "AIzaSyAThpvTF06xHxKTod3MLC8uN0fy_B4Y3LE",
  authDomain: "newsly-2.firebaseapp.com",
  projectId: "newsly-2",
  storageBucket: "newsly-2.firebasestorage.app",
  messagingSenderId: "680724334186",
  appId: "1:680724334186:web:a02c110036f3ef4ce22c13"
}

const app = initializeApp(config)

const appcheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("6LcepS8sAAAAAFKruEPVSFQLZ7aUYDvVGUG0q-vZ"),
  isTokenAutoRefreshEnabled: true
})

const auth = getAuth(app)
auth.useDeviceLanguage()

const items = new Promise((resolve) => {
  onAuthStateChanged(auth, async (user) => {
    if(user == null){
      signInAnonymously(auth).then((value) => {
        resolve(value.user.uid)
      })
    }else{
      resolve(user.uid)
    }
  })
})

await items

const google = new GoogleAuthProvider()

const github = new GithubAuthProvider()
github.addScope("https://github.com/Jamcha123/Newsly")

function AddTHREE(){
  useEffect(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(0, 0, 30)

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
      antialias: true,
      depth: true
    })

    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)

    function AddStars(){
      const vertices = []
      for(let i = 0; i != 5000; i++){
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);

        vertices.push(x, y, z)
      }
      const stargeometry = new THREE.BufferGeometry()
      stargeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

      const starmaterial = new THREE.PointsMaterial({
        color: 0xffffff, 
        side: THREE.DoubleSide, 
        size: 1
      })

      const stars = new THREE.Points(stargeometry, starmaterial)
      stars.name = "stars"
      scene.add(stars)

      renderer.render(scene, camera)
    }
    AddStars()

    function resize(){
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)
    }
    function animate(){
      window.addEventListener("resize", resize)
      camera.rotation.x += 0.0005

      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)
  })
  return(
    <canvas id="bg" className="fixed top-0 left-0 -z-1 "></canvas>
  )
}
export default function App(){
  const [active, setActive] = useState(false)
  return(
    <div className="relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center">
      <AddTHREE></AddTHREE>
      <motion.div initial={{display: "none"}} animate={{display: active? "none" : "flex"}} className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[30em] h-[55vh] m-auto p-0 rounded-2xl bg-slate-950 flex flex-col align-middle justify-center text-center ">
        <div className="relative w-full h-[10vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-2xl text-white font-medium">
            Newsly Login Page
          </h1>
        </div>
        <form action="" method="get" className="relative w-[95%] h-[25vh] m-auto p-0 bg-transparent flex flex-col align-middle">
          <input required type="email" id="email1" placeholder="Enter Your Email" className="relative w-full h-[3em] bg-slate-800 m-auto mt-[2%] mb-0 p-0 text-center text-white text-xl font-extralight " />
          <input required type="password" id="password1" placeholder="Enter Your Password" className="relative w-full h-[3em] bg-slate-800 m-auto mt-[2%] mb-0 p-0 text-center text-white text-xl font-extralight " />
          <motion.input onSubmit={(e) => {e.preventDefault(); signInWithEmailAndPassword(auth, document.getElementById("email1").value, document.getElementById("password1").value).then((value) => window.location.href = "/dashboard.html").catch((err) => alert(err))}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} initial={{scale: 1}} transition={{type: "spring", duration: 1}} type="submit" id='submit1' value="submit" className="relative cursor-pointer w-full h-[3em] border-sky-600 border-2 bg-slate-800 m-auto mt-[2%] mb-0 p-0 text-center text-white text-xl font-medium " />
        </form>
        <div className="relative w-[95%] h-[9vh] m-auto p-0 bg-transparent mt-[1%] mb-0 flex flex-row gap-[2%] align-middle justify-center text-center">
          <div className="relative w-[50%] h-full m-auto p-0 cursor-pointer border-orange-600 border-2 bg-slate-800 flex flex-col align-middle justify-center text-center  ">
            <motion.button onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, github).then((value) => window.location.href = "/dashboard.html").catch((err) => alert(err))}} className="relative cursor-pointer w-full h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
              <img src={github_logo} style={{width: 40 + "%", height: 100 + "%", scale: 0.6}} alt="" />
            </motion.button>
          </div>
          <div className="relative w-[50%] h-full m-auto p-0 cursor-pointer border-red-600 border-2 bg-slate-800 flex flex-col align-middle justify-center text-center  ">
            <motion.button onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, google).then((value) => window.location.href = "/dashboard.html").catch((err) => alert(err))}} className="relative cursor-pointer w-full h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
              <img src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw" style={{width: 40 + "%", height: 100 + "%", scale: 0.6}} alt="" />
            </motion.button>
          </div>
        </div>
        <div className="relative w-full h-[11vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center">
          <motion.button onClick={() => setActive(true)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} initial={{scale: 1}} transition={{type: "spring", duration: 1}} className="relative w-full h-full m-auto p-0 bg-transparent font-light text-white text-2xl underline underline-offset-4 cursor-pointer  ">
            Don't have an account, Register Here
          </motion.button>    
        </div>
      </motion.div>
      <motion.div initial={{display: "none"}} animate={{display: active? "flex" : "none"}}  className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[30em] h-[55vh] m-auto p-0 rounded-2xl bg-slate-950 flex flex-col align-middle justify-center text-center ">
        <div className="relative w-full h-[10vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-2xl text-white font-medium">
            Newsly Registration Page
          </h1>
        </div>
        <form action="" method="get" className="relative w-[95%] h-[25vh] m-auto p-0 bg-transparent flex flex-col align-middle">
          <input required type="email" id="email2" placeholder="Enter A Email" className="relative w-full h-[3em] bg-slate-800 m-auto mt-[2%] mb-0 p-0 text-center text-white text-xl font-extralight " />
          <input required type="password" id="password2" placeholder="Enter A Password" className="relative w-full h-[3em] bg-slate-800 m-auto mt-[2%] mb-0 p-0 text-center text-white text-xl font-extralight " />
          <motion.input onSubmit={(e) => {e.preventDefault(); createUserWithEmailAndPassword(auth, document.getElementById("email2").value, document.getElementById("password2").value).then((value) => window.location.href = "/dashboard.html").catch((err) => alert(err))}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} initial={{scale: 1}} transition={{type: "spring", duration: 1}} type="submit" id='submit2' value="submit" className="relative cursor-pointer w-full h-[3em] border-sky-600 border-2 bg-slate-800 m-auto mt-[2%] mb-0 p-0 text-center text-white text-xl font-medium " />
        </form>
        <div className="relative w-[95%] h-[9vh] m-auto p-0 bg-transparent mt-[1%] mb-0 flex flex-row gap-[2%] align-middle justify-center text-center">
          <div className="relative w-[50%] h-full m-auto p-0 cursor-pointer border-orange-600 border-2 bg-slate-800 flex flex-col align-middle justify-center text-center  ">
            <motion.button onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, github).then((value) => window.location.href = "/dashboard.html").catch((err) => alert(err))}} className="relative cursor-pointer w-full h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
              <img src={github_logo} style={{width: 40 + "%", height: 100 + "%", scale: 0.6}} alt="" />
            </motion.button>
          </div>
          <div className="relative w-[50%] h-full m-auto p-0 cursor-pointer border-red-600 border-2 bg-slate-800 flex flex-col align-middle justify-center text-center  ">
            <motion.button onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, google).then((value) => window.location.href = "/dashboard.html").catch((err) => alert(err))}} className="relative cursor-pointer w-full h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
              <img src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw" style={{width: 40 + "%", height: 100 + "%", scale: 0.6}} alt="" />
            </motion.button>
          </div>
        </div>
        <div className="relative w-full h-[11vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center">
          <motion.button onClick={() => setActive(false)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} initial={{scale: 1}} transition={{type: "spring", duration: 1}} className="relative w-full h-full m-auto p-0 bg-transparent font-light text-white text-2xl underline underline-offset-4 cursor-pointer  ">
            Already have an account, Login Here
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}