import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import {motion} from 'framer-motion'
import * as THREE from 'three'
import axios from 'axios'
import {initializeApp} from 'firebase/app'
import {getAuth, GithubAuthProvider, GoogleAuthProvider, linkWithPopup, linkWithRedirect, onAuthStateChanged, signInAnonymously} from 'firebase/auth'
import {} from 'firebase/firestore'
import {} from 'firebase/storage'
import {initializeAppCheck, ReCaptchaEnterpriseProvider} from 'firebase/app-check'
import { GenerativeModel, getAI, getGenerativeModel, GoogleAIBackend, VertexAIBackend } from 'firebase/ai'
import $ from 'jquery'

const config = {
  apiKey: "AIzaSyAThpvTF06xHxKTod3MLC8uN0fy_B4Y3LE",
  authDomain: "newsly-2.firebaseapp.com",
  projectId: "newsly-2",
  storageBucket: "newsly-2.firebasestorage.app",
  messagingSenderId: "680724334186",
  appId: "1:680724334186:web:a02c110036f3ef4ce22c13",
  measurementId: "G-GHP8PK2LNQ"
}

const app = initializeApp(config)

const appcheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("6LcepS8sAAAAAFKruEPVSFQLZ7aUYDvVGUG0q-vZ"), 
  isTokenAutoRefreshEnabled: true
})

const ai = getAI(app, {backend: new GoogleAIBackend()})

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

const github = new GithubAuthProvider()
github.addScope("https://github.com/Jamcha123/Newsly")

const google = new GoogleAuthProvider()

export default function App(){
  const [active, setActive] = useState(true)
  const [hover, setHover] = useState(false)
  useEffect(() => {
    const polymarket = document.getElementById("polymarket")
    const form = document.getElementById("form")
    const headline = document.getElementById("headline")

    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      $("#polymarket").empty()

      let polymarket_headline = ""
      if(headline.value.slice(0, 8) == "https://"){
        polymarket_headline = (((headline.value).split("/"))[4].split("?"))[0]
      }
      const questions = (await axios.get("https://newsly-questions-d2wfhntahq-uc.a.run.app?polymarket_headline=" + polymarket_headline))["data"]
      const searches = (await axios.get("https://newsly-searches-d2wfhntahq-uc.a.run.app?polymarket_headline=" + polymarket_headline))["data"]

      let [ans1, ans2, ans3, ans4] = ["", "", "", ""]
      let index = 1

      const arr1 = questions.map((e) => e["question"])

      searches["google"].map((e) => ans2 += "google: " + e)
      
      searches["brave"].map((e) => ans3 += "brave: " + e)
      
      searches["perplexity"].map((e) => ans4 += "perplexity: " + e)

      questions.forEach(async (e) => {
        const model = getGenerativeModel(ai, {model: document.getElementById("models").value})
        const prompt = "rank this event based on likelihood (10 = certain and 0 = impossible), question: " + e["question"] + "\n(50 word max)\nSearches:\n" + ans2 + "\n" + ans3 + "\n" + ans4
        
        const chatting = await model.generateContent(prompt)
        
        let container = document.createElement("div")
        container.classList.add("items")

        let title = document.createElement("h2")
        title.innerText = e["question"]

        let summary = document.createElement("p")
        summary.innerText = chatting.response.text()

        container.appendChild(title)
        container.appendChild(summary)

        document.getElementById("polymarket").appendChild(container)
      })


      headline.value = ""
    })
  })
  return(
    <div className="relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
      <div className="fixed w-full h-full m-auto p-0 bg-slate-950 top-0 left-0 -z-1 opacity-[0.75] "></div>
      <nav className="fixed top-0 z-99 w-full min-h-[8vh] max-h-[40vh] m-auto p-0 bg-slate-950 flex flex-col align-middle justify-center text-center ">
        <ul className="relative w-full h-[8vh] m-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center  ">
          <div className="relative w-[40%] h-full m-auto p-0 flex flex-row align-middle justify-start text-start">
            <motion.div onClick={active? () => setActive(false) : () => setActive(true)} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} className="relative w-[3em] scale-[0.85] h-full m-auto cursor-pointer ml-[10%] mr-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
              <motion.div initial={{translateX: 0 + "px"}} animate={{translateX: hover? -5 + "px" : 0 + "px"}} transition={{type: "spring", duration: 1}} className="relative rounded-md w-full h-[0.3em] mt-0 mb-[15%] m-auto p-0 bg-white "></motion.div>
              <motion.div initial={{translateX: 0 + "px"}} animate={{translateX: hover? 7 + "px" : 0 + "px"}} transition={{type: "spring", duration: 1}} className="relative rounded-md w-full h-[0.3em] mt-0 mb-0 m-auto p-0 bg-white "></motion.div>
              <motion.div initial={{translateX: 0 + "px"}} animate={{translateX: hover? -5 + "px" : 0 + "px"}} transition={{type: "spring", duration: 1}} className="relative rounded-md w-full h-[0.3em] mt-[15%] mb-0 m-auto p-0 bg-white "></motion.div>
            </motion.div>
          </div>
          <div className="relative w-[60%] h-full m-auto p-0 flex flex-row align-middle justify-center text-center ">
            <motion.button onClick={() => linkWithPopup(auth.currentUser, github).then(value => window.location.reload()).catch((err) => alert(err))} initial={{scale: 0, display: "none"}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative cursor-pointer w-[12em] h-[2.5em] m-auto ml-0 mr-[4%] p-0 bg-linear-60 from-slate-950 via-slate-900 to-slate-800 border-slate-300 border-2 rounded-2xl text-center text-white text-xl ">
              Github Login
            </motion.button>
            <motion.button onClick={() => linkWithPopup(auth.currentUser, google).then(value => window.location.reload()).catch((err) => alert(err))} initial={{scale: 0, display: "none"}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative cursor-pointer w-[12em] h-[2.5em] m-auto ml-[4%] mr-0 p-0 bg-linear-60 from-slate-950 via-slate-900 to-slate-800 border-slate-300 border-2 rounded-2xl text-center text-white text-xl ">
              Google Login
            </motion.button>
          </div>
        </ul>
        <motion.ul initial={{display: "none"}} animate={{display: active? "none" : "flex"}} className="relative w-full h-fit m-auto p-0 bg-transparent hidden flex-col align-middle justify-centere text-center  ">
          <motion.div initial={{translateX: -100 + "%"}} animate={{translateX: active? -100 + "%" : 0 + "%"}} transition={{type: "keyframes", duration: 0.5}} className="relative w-full h-[8vh] m-auto p-0 bg-slate-900 flex flex-row align-middle text-start justify-start ">
            <motion.li initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="flex flex-col align-middle text-center justify-center ml-[5%] text-xl text-white cursor-pointer underline underline-offset-4 "><a href="#analyzer">Newsly Analyzer</a></motion.li>
          </motion.div>
          <motion.div initial={{translateX: 100 + "%"}} animate={{translateX: active? 100 + "%" : 0 + "%"}} transition={{type: "keyframes", duration: 0.5}} className="relative w-full h-[8vh] m-auto p-0 bg-slate-800 hidden flex-row align-middle text-start justify-start">
            <motion.li initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="flex flex-col align-middle text-center justify-center ml-[5%] text-xl text-white cursor-pointer underline underline-offset-4 "><a href="#api">Newsly API</a></motion.li>
          </motion.div>
        </motion.ul>
      </nav>
      <section id="analyzer" className="relative w-full h-screen m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center">
        <div className="relative w-full h-fit m-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center">
          <div className="relative w-full h-[20vh] m-auto mt-[5vh] p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <div className="relative w-full h-[10vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
              <h1 className="text-2xl text-white font-bold mt-[8%] ">Newsly - Analyze Polymarket Events</h1>
            </div>
            <div className="relative w-full h-[10vh] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center">

            </div>
          </div>
          <div id="polymarket" className="relative w-[95%] h-[50vh] md:h-[60vh] m-auto mt-0 p-0 bg-transparent grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 overflow-x-hidden overflow-y-auto ">

          </div>
        </div>
        <div className="relative w-full h-[30vh] md:h-[20vh] rounded-md m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center">
          <form id="form" action="" className="relative w-[90%] h-[60%] m-auto p-0 bg-slate-900 flex flex-col md:flex-row align-middle justify-center text-center ">
            <input type="text" placeholder="Enter A Polymarket Event URL e.g https://polymarket.com/event/<event-name>?tid=id" required id="headline" className="relative w-full md:w-[55%] h-[30%] md:h-full border-slate-400 border-2 border-b-2 md:border-b-2 md:border-r-0 m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center text-xl text-white font-medium " />
            <select name="models" id="models" required className="relative w-full md:w-[20%] h-[30%] md:h-full m-auto p-0 text-xl text-black bg-white border-black border-2 text-center  ">
              <option className="text-xl text-black font-medium" value="">Select A Model</option>
              <option className="text-xl text-black font-medium" value="gemini-3-pro-preview">gemini-3-pro-preview</option>
              <option className="text-xl text-black font-medium" value="gemini-3-flash-preview">gemini-3-flash-preview</option>
              <option className="text-xl text-black font-medium" value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
              <option className="text-xl text-black font-medium" value="gemini-2.5-flash">gemini-2.5-flash</option>
              <option className="text-xl text-black font-medium" value="gemini-2.5-pro">gemini-2.5-pro</option>
            </select>
            <div className="relative w-full md:w-[25%] h-[30%] md:h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
                <motion.button type="submit" initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative w-full h-full m-auto p-0 border-2 border-slate-400 bg-linear-60 from-slate-950 via-slate-900 to-slate-800 flex flex-col align-middle justify-center cursor-pointer text-center text-xl font-medium text-white ">
                  Submit To Predict
                </motion.button>
            </div>
          </form>
        </div>
      </section>
      <section id="api" className="relative w-full h-fit m-auto p-0 bg-transparent hidden flex-col align-middle"  >
        <div className="relative w-full h-[20vh] m-auto mt-[5%] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-2xl text-white font-bold">Newsly API and Packages</h1>
        </div>
        <div className="relative w-full h-[60vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <div className="relative w-full md:w-[90%] xl:w-[50%] h-[40%] m-auto p-0 bg-transparent flex flex-col md:flex-row align-middle justify-center text-center ">
            <div className="relative w-full md:w-[50%] h-fit md:h-full m-auto mb-[2%] md:mb-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
              <h1 className="text-2xl text-white font-semibold flex flex-col align-middle justify-center text-center">Newsly API Keys - Unlimited Calls</h1>
            </div>
            <div className="relative w-full md:w-[50%] h-fit md:h-full m-auto mt-[2%] md:mt-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center">
              <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="text-lg text-white font-medium text-center relative w-[20em] h-[3em] m-auto p-0 bg-linear-45 from-green-950 via-green-900 to-green-800 border-slate-300 border-2 rounded-md cursor-pointer ">
                + Buy An API Key For $1.99, No Refunds
              </motion.button>
            </div>
          </div>
          <div className="relative w-full md:w-[90%] xl:w-[50%] h-[60%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">

          </div>
        </div>
        <div className="relative w-full h-[60vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <div className="relative w-full md:w-[90%] xl:w-[50%] h-[40%] m-auto p-0 bg-transparent flex flex-col md:flex-row align-middle justify-center text-center ">
            <div className="relative w-full md:w-[50%] h-fit md:h-full m-auto mb-[2%] md:mb-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
              <h1 className="text-2xl text-white font-semibold flex flex-col align-middle justify-center text-center">Newsly API Docs</h1>
            </div>
            <div className="relative w-full md:w-[50%] h-fit md:h-full m-auto mt-[2%] md:mt-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center">
              <select name="packages" id="packages" className="relative w-[20em] h-[3em] m-auto p-0 bg-white border-black border-2 text-xl ">
                <option className="text-xl text-black font-medium text-center" value="npm">NPM Package</option>
                <option className="text-xl text-black font-medium text-center" value="rest">Rest API - Python and Nodejs</option>
                <option className="text-xl text-black font-medium text-center" value="curl">cURL Package</option>
              </select>
            </div>
          </div>
          <div className="relative w-full md:w-[90%] xl:w-[50%] h-[60%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">

          </div>
        </div>
      </section>
    </div>
  )
}