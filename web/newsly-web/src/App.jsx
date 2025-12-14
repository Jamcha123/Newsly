import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import {motion} from 'framer-motion'
import * as THREE from 'three'
import cross from './assets/cross.svg'
import check from './assets/check.svg'
import {initializeApp} from 'firebase/app'
import {initializeAppCheck, ReCaptchaEnterpriseProvider} from 'firebase/app-check'
import {getAuth, onAuthStateChanged, signInAnonymously} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {getStorage, getBytes, getDownloadURL, ref, uploadBytes, uploadString} from 'firebase/storage'

const config = {
  apiKey: "AIzaSyDuRpuHYKct4pbKihEsz3az5Iwr-YbiVII",
  authDomain: "newsly-e41a5.firebaseapp.com",
  projectId: "newsly-e41a5",
  storageBucket: "newsly-e41a5.firebasestorage.app",
  messagingSenderId: "397222684882",
  appId: "1:397222684882:web:ab322659c221280e4ba50b",
  measurementId: "G-FKX4KHM44V"
}

const app = initializeApp(config)

const appcheck = initializeAppCheck(app, {provider: new ReCaptchaEnterpriseProvider("6LfmGCssAAAAAK0dgCl15mhmM7aBuvgY1mNlNyDp")})

const auth = getAuth(app)
auth.useDeviceLanguage()

onAuthStateChanged(auth, (user) => {
  if(user == null){
    signInAnonymously(auth).then((value) => {
      console.log("anonymous user logged in")
    })
  }
})

const db = getFirestore(app)

const storage = getStorage(app)

function AddNavbar(){
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)

  window.addEventListener("resize", () => setActive(false))
  return(
    <nav className="fixed top-0 w-full min-h-[7vh] max-h-fit z-99 m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
      <ul className="relative w-full h-[7vh] p-0 bg-gray-900 lg:hidden flex flex-row align-middle justify-center text-center ">
        <div className="relative w-[25%] h-full m-auto p-0 flex flex-col align-middle justify-center text-center ">
          <div onClick={active? () => setActive(false) : () => setActive(true)} onMouseOut={() => setHover(false)} onMouseOver={() => setHover(true)} className="relative w-[4vh] h-full cursor-pointer hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <motion.div initial={{translateX: 0 + "%", rotateZ: 0 + "deg"}} animate={{translateX: hover? 15 + "%": 0 + "%", rotateZ: hover? 0 + "deg" : 0 + "deg" }} transition={{type: "keyframes", duration: 0.1}} className="relative duration-300 transition-all w-full h-[0.5vh] scale-y-[0.9] shadow-sm rounded-xl mb-0 mt-[12%] m-auto p-0 bg-white "></motion.div>
            <motion.div initial={{translateX: 0 + "%", rotateZ: 0 + "deg"}} animate={{translateX: hover? -5 + "%": 0 + "%", rotateZ: hover? 0 + "deg" : 0 + "deg" }} transition={{type: "keyframes", duration: 0.1}} className="relative duration-300 transition-all w-full h-[0.5vh] scale-y-[0.9] shadow-sm rounded-xl mb-0 mt-[12%] m-auto p-0 bg-white "></motion.div>
            <motion.div initial={{translateX: 0 + "%", rotateZ: 0 + "deg"}} animate={{translateX: hover? 15 + "%": 0 + "%", rotateZ: hover? 0 + "deg" : 0 + "deg" }} transition={{type: "keyframes", duration: 0.1}} className="relative duration-300 transition-all w-full h-[0.5vh] scale-y-[0.9] shadow-sm rounded-xl mb-0 mt-[12%] m-auto p-0 bg-white "></motion.div>
          </div>
        </div>
        <div className="relative w-[75%] h-full m-auto p-0 flex flex-row align-middle justify-end text-end ">
          <h1 className="text-xl text-white flex flex-col align-middle justify-center text-center mr-[5%] ">Newsly - Analyze News</h1>
        </div>
      </ul>
      <motion.ul initial={{scaleX: 0}} animate={{scaleX: active? 1 : 0, display: active? "flex" : "none"}} transition={{type: "spring", duration: 1}} className="relative w-full h-[28vh] p-0 bg-transparent lg:hidden flex flex-col align-middle justify-center text-center ">
        <motion.div initial={{translateX: -100 + "%"}} animate={{translateX: active? 0 + "%" : -100 + "%"}} transition={{type: "spring", duration: 2}} className="relative w-full h-[25%] m-auto p-0 bg-gray-800 lg:hidden flex flex-row align-middle justify-start text-start  ">
          <li className="text-xl font-extralight text-white hover:text-violet-300 ml-[9%] flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#homepage">Homepage</a></li>
        </motion.div>
        <motion.div initial={{translateX: -100 + "%"}} animate={{translateX: active? 0 + "%" : -100 + "%"}} transition={{type: "spring", duration: 1}} className="relative w-full h-[25%] m-auto p-0 bg-gray-900 lg:hidden flex flex-row align-middle justify-start text-start  ">
          <li className="text-xl font-extralight text-white hover:text-violet-300 ml-[9%] flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#about">About Newsly</a></li>
        </motion.div>
        <motion.div initial={{translateX: -100 + "%"}} animate={{translateX: active? 0 + "%" : -100 + "%"}} transition={{type: "spring", duration: 2}} className="relative w-full h-[25%] m-auto p-0 bg-gray-800 lg:hidden flex flex-row align-middle justify-start text-start  ">
          <li className="text-xl font-extralight text-white hover:text-violet-300 ml-[9%] flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#pricing">Newsly API pricing</a></li>
        </motion.div>
        <motion.div initial={{translateX: -100 + "%"}} animate={{translateX: active? 0 + "%" : -100 + "%"}} transition={{type: "spring", duration: 1}} className="relative w-full h-[25%] m-auto p-0 bg-gray-900 lg:hidden flex flex-row align-middle justify-start text-start  ">
          <li className="text-xl font-extralight text-white hover:text-violet-300 ml-[9%] flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#contact">Contact Info</a></li>
        </motion.div>
      </motion.ul>
      <ul className="relative w-full h-[7vh] m-auto p-0 bg-gray-900 hidden lg:flex flex-row align-middle justify-center text-center ">
        <div className="relative w-[75%] h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-evenly text-start ">
          <li className="text-xl font-medium text-white hover:text-violet-300 m-auto flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#homepage">Homepage</a></li>
          <li className="text-xl font-medium text-white hover:text-violet-300 m-auto flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#about">About Newsly</a></li>
          <li className="text-xl font-medium text-white hover:text-violet-300 m-auto flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#pricing">Newsly API pricing</a></li>
          <li className="text-xl font-medium text-white hover:text-violet-300 m-auto flex flex-col text-center justify-center align-middle underline-offset-2 underline cursor-pointer "><a href="#contact">Contact Info</a></li>
        </div>
        <div className="relative w-[25%] h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-evenly text-end ">
          <h1 className="text-xl text-white flex flex-col align-middle justify-center text-center mr-[5%] ">Newsly - Analyze News</h1>
        </div>
      </ul>
    </nav>
  )
}

function AddBackground(){
  return(
    <div className="fixed top-0 left-0 w-full h-screen m-auto p-0 -z-2 bg-transparent flex flex-row align-middle justify-center text-center ">
      <div className="relative w-[50%] md:w-[15%] h-full m-auto p-0 bg-transparent border-r border-r-white opacity-[0.25] flex flex-col align-middle ">
        <div className="item3 relative w-full h-[7vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item3 relative w-full h-[7vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
      </div>
      <div className="relative w-[15%] h-full m-auto p-0 bg-transparent border-r border-r-white opacity-[0.25] hidden md:flex flex-col align-middle ">
        <div className="item1 relative w-full h-[18vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item2 relative w-full h-[9vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item1 relative w-full h-[18vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item2 relative w-full h-[9vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
      </div>
      <div className="relative w-[15%] h-full m-auto p-0 bg-transparent border-r border-r-white opacity-[0.25] hidden md:flex flex-col align-middle ">
        <div className="item3 relative w-full h-[7vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item3 relative w-full h-[7vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
      </div>
      <div className="relative w-[15%] h-full hidden m-auto p-0 bg-transparent border-r border-r-white opacity-[0.25] md:flex flex-col align-middle ">
        <div className="item1 relative w-full h-[9vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item2 relative w-full h-[18vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item1 relative w-full h-[9vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item2 relative w-full h-[18vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
      </div>
      <div className="relative w-[15%] h-full m-auto p-0 bg-transparent border-r border-r-white opacity-[0.25] hidden md:flex flex-col align-middle ">
        <div className="item3 relative w-full h-[7vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item3 relative w-full h-[7vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
      </div>
        <div className="relative w-[15%] h-full hidden m-auto p-0 bg-transparent border-r border-r-white opacity-[0.25] md:flex flex-col align-middle ">
        <div className="item1 relative w-full h-[9vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item2 relative w-full h-[18vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item1 relative w-full h-[9vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item2 relative w-full h-[18vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
      </div>
      <div className="relative w-[50%] md:w-[15%] h-full m-auto p-0 bg-transparent border-r border-r-white opacity-[0.25] flex flex-col align-middle ">
        <div className="item3 relative w-full h-[7vh]  m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item3 relative w-full h-[7vh]  m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
        <div className="item4 relative w-full h-[14vh] m-auto mt-0 mb-0 bg-transparent border border-l-transparent border-t-transparent border-r-transparent border-white "></div>
      </div>
    </div>
  )
} 

export default function App(){
  useEffect(() => {
    const form = document.getElementById("contact_page")
    const ticket = document.getElementById("ticket_name")
    const message = document.getElementById("message")

    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const storageRef = ref(storage, ticket.value)
      uploadString(storageRef, message.value).then((value) => {
        alert("message sent.\nI will review it and fix your issue as soon as possible.")
      }).catch((err) => {
        alert(err)
      })

    })
  })
  return(
    <div className="relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
      <AddNavbar></AddNavbar>
      <AddBackground></AddBackground>
      <div className="relative w-full h-fit m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
        <section id="homepage" className="relative w-full h-screen m-auto p-0 flex flex-col align-middle">
          <div className="relative w-[50%] h-fit m-auto mt-[10%] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <h1 className="text-4xl text-white">
              Newsly
            </h1>
            <div className="relative w-full h-fit mt-[10%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
              <h1 className="text-4xl font-extrabold text-white mt-[0%] ">
                Analyze News For Reporters, Researchers, <br />
                Marketeers, Hobbyists, Builders Or For Fun
              </h1>
              <p className="text-2xl font-medium text-gray-300 mt-[5%]">
                Rank possible outcomes based on Likelihood <br />
                Tech, Politics, Economics, Gaming, AI and More News Topics <br />
              </p>
            </div>
          </div>
          <div className="relative w-[50%] h-fit m-auto mt-[5%] mb-0 p-0 bg-transparent flex flex-row justify-center text-center align-middle ">
            <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative font-normal w-[10em] h-[3em] m-auto ml-0 mr-[1%] mb-0 mt-0 p-0 bg-slate-800 border-2 border-white rounded-full cursor-pointer text-xl text-white " >
              Newsly APIs
            </motion.button>
            <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative font-normal w-[10em] h-[3em] m-auto ml-[1%] mr-0 mb-0 p-0 bg-black border-2 border-white rounded-full cursor-pointer text-xl text-white " >
              Newsly Login 
            </motion.button>
          </div>
        </section>
        <section id="about" className="relative w-full h-[80vh] m-auto p-0 flex flex-col align-middle ">
          <h1 className="text-4xl text-white mt-[2%] font-bold ">About Newsly</h1>
          <table className="relative w-[75%] h-[40%] m-auto mb-0 mt-[4%] p-0  ">
            <tbody className="relative w-full h-full m-auto p-0 bg-transparent ">
              <tr className="relative w-full h-[20%] m-auto p-0 bg-transparent ">
                <td className="text-2xl text-white font-medium">
                  Newsly Options
                </td>
              </tr>
              <tr className="relative w-full h-[20%] m-auto p-0 bg-transparent ">
                <td className="text-2xl text-white font-extralight ">
                  Short News Summaries (100 words or less) 
                </td>
              </tr>
              <tr className="relative w-full h-[20%] m-auto p-0 bg-transparent ">
                <td className="text-2xl text-white font-extralight "> 
                  Long News Summaries (100 words or more)
                </td>
              </tr>
              <tr className="relative w-full h-[20%] m-auto p-0 bg-transparent ">
                <td className="text-2xl text-white font-extralight ">
                  Ranking Inputed Outcomes Based On Likelihood
                </td>
              </tr>
              <tr className="relative w-full h-[20%] m-auto p-0 bg-transparent ">
                <td className="text-2xl text-white font-extralight ">
                  Lists People Mentioned In The News
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-2xl text-gray-300 mt-[5%] font-bold ">
            Disclaimer: <br />
            Newsly CANNOT predict events with certainty. <br />
            Newsly takes NO responsibility for any activities such as betting, gambling or related. <br />
          </p>
        </section>
        <section id="pricing" className="relative w-full lg:w-[90%] min-h-screen max-h-[250vh] m-auto p-0 flex flex-col align-middle gap-2.5 ">
          <div className="relative w-[50%] h-[30vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <h1 className="text-4xl text-white font-extrabold ">Newsly API Pricing</h1>
          </div>
          <section className="relative w-full min-h-[60vh] gap-8 max-h-[240vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col lg:flex-row align-middle justify-center text-center">
            <div className="relative w-[75%] lg:w-[33%] md:w-[50%] min-h-[60vh] m-auto p-0 bg-linear-60 from-slate-950 via-slate-900 to-slate-800 from rounded-md border-2 border-orange-400 flex flex-col align-middle ">
              <div className="relative w-full h-[10vh] m-auto p-0 mt-0 mb-0 flex flex-col align-middle justify-center text-center  ">
                <h2 className="text-2xl text-white font-medium ">Newsly Free API - Free</h2>
              </div>
              <table className="relative w-[90%] h-[40vh] m-auto p-0 bg-transparent">
                <tbody className="relative w-full h-full m-auto p-0 bg-transparent ">
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent ">
                    <td>
                      <img src={check} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="text-xl font-light text-white">
                      Short News Summaries (less than 100 words)
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={cross} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white">
                      Long News Summaries (more than 100 words)
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={cross} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white ">
                      List Every Person Mentioned In The News
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={cross} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white ">
                      Rank Most Likely Inputed Outcomes
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="relative w-full h-[10vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative w-[16em] h-[3em] m-auto p-0 bg-slate-950 text-xl text-slate-200 font-light cursor-pointer rounded-md border-2 border-orange-300 ">
                  <a href="">
                    Go To The Newsly Free API 
                  </a>
                </motion.button>
              </div>
            </div>
            <div className="relative w-[75%] md:w-[50%] lg:w-[33%] min-h-[60vh] m-auto p-0 bg-linear-60 from-slate-950 via-slate-900 to-slate-800 rounded-md border-2 border-amber-400 flex flex-col align-middle ">
              <div className="relative w-full h-[10vh] m-auto p-0 mt-0 mb-0 flex flex-col align-middle justify-center text-center  ">
                <h2 className="text-2xl text-white font-light ">Newsly Basic API - $0.10/requests</h2>
              </div>
              <table className="relative w-[90%] h-[40vh] m-auto p-0 bg-transparent">
                <tbody className="relative w-full h-full m-auto p-0 bg-transparent ">
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent ">
                    <td>
                      <img src={check} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="text-xl font-light text-white">
                      Short News Summaries (less than 100 words)
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={check} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white">
                      Long News Summaries (more than 100 words)
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={cross} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white ">
                      List People mentioned in the News
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={cross} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white ">
                      Rank Most Likely Inputed Outcomes
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="relative w-full h-[10vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative w-[16em] h-[3em] m-auto p-0 bg-slate-950 text-xl text-slate-200 font-light cursor-pointer rounded-md border-2 border-amber-300 ">
                  <a href="">
                    Go To The Newsly Basic API 
                  </a>
                </motion.button> 
              </div>
            </div>
            <div className="relative w-[75%] md:w-[50%] lg:w-[33%] min-h-[60vh] m-auto p-0 bg-linear-60 from-slate-950 via-slate-900 to-slate-800 rounded-md border-2 border-fuchsia-400 flex flex-col align-middle ">
              <div className="relative w-full h-[10vh] m-auto p-0 mt-0 mb-0 flex flex-col align-middle justify-center text-center  ">
                <h2 className="text-2xl text-white font-light ">Newsly Pro API - $0.20/request</h2>
              </div>
              <table className="relative w-[90%] h-[40vh] m-auto p-0 bg-transparent">
                <tbody  className="relative w-full h-full m-auto p-0 bg-transparent ">
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent ">
                    <td>
                      <img src={check} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="text-xl font-light text-white">
                      Short News Summaries (less than 100 words)
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={check} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white">
                      Long News Summaries (more than 100 words)
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={check} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white ">
                      List People Mentioned In The News
                    </td>
                  </tr>
                  <tr className="relative w-full h-[25%] m-auto p-0 bg-transparent">
                    <td>
                      <img src={check} style={{scale: 1.5}} alt="" />
                    </td>
                    <td className="font-light text-xl text-white ">
                      Rank Most Likely Inputed Outcomes
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="relative w-full h-[10vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative w-[16em] h-[3em] m-auto p-0 bg-slate-950 text-xl text-slate-200 font-light cursor-pointer rounded-md border-2 border-fuchsia-300 ">
                  <a href="">
                    Go To The Newsly Pro API 
                  </a>
                </motion.button> 
              </div>
            </div>
          </section>
        </section>
        <section id="contact" className="relative w-full h-screen m-auto mt-[5%] p-0 flex flex-col align-middle justify-center text-center ">
          <div className="relative w-[75%] lg:w-[50%] h-[20%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <h1 className="text-4xl text-white font-bold">
              Contact Me
            </h1>
            <p className="text-2xl text-white font-medium mt-[3%] ">
              My Email: <a className="underline underline-offset-2 text-violet-300" href="mailto:jameschambers732@gmail.com">jameschambers732@gmail.com</a>
            </p>
          </div>
          <form action="" id="contact_page" method="post" className="relative w-[75%] lg:w-[50%] h-[70%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center gap-10 ">
            <input type="text" id="ticket_name" required placeholder="Enter Your Tickets Name" className="relative w-full h-[15%] m-auto p-0 bg-slate-950 border-blue-400 border-2 font-medium text-2xl text-center text-white rounded-2xl  " />
            <textarea required className="relative w-full h-[70%] rounded-2xl cursor-text m-auto p-0 border-2 border-sky-400 bg-slate-950 text-center text-2xl text-white font-medium " placeholder="Enter Your Message Here For Problems You find" name="message" id="message">

            </textarea>
            <motion.input initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} type="submit" value="Submit Your Message" className="relative w-full h-[15%] m-auto p-0 bg-slate-950 text-xl text-center rounded-2xl border-teal-400 border-2 cursor-pointer text-white font-medium " />
          </form>
        </section>
      </div>
    </div>
  )
}