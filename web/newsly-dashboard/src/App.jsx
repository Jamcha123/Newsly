import { useState, useRef, useEffect } from 'react'
import './App.css'
import * as THREE from 'three'
import {motion} from 'framer-motion'
import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth, onAuthStateChanged, signInAnonymously, signOut} from 'firebase/auth'
import {initializeAppCheck, ReCaptchaEnterpriseProvider} from 'firebase/app-check'
import {getStorage} from 'firebase/storage'

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

const db = getFirestore(app)

const storage = getStorage(app)

export default function App(){
    const [hover, setHover] = useState(false)
    const [active, setActive] = useState(false)
    
    const AddToken = async () => {
        
    } 

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user.isAnonymous === false){
                document.getElementById("login").style.display = "none"
                document.getElementById("logout").style.display = "flex"
            }else{
                document.getElementById("login").style.display = "flex"
                document.getElementById("logout").style.display = "none"
            }
        })
    })
    return(
        <div className="relative w-full h-screen m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
            <nav className="fixed top-0 w-full z-99 min-h-[8vh] max-h-[50vh] rounded-md m-auto mt-0 mb-0 p-0 bg-slate-950 flex flex-col align-middle justify-center text-center ">
                <div className="relative w-full h-[8vh] m-auto p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
                    <ul className="relative w-[50%] h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-start text-start ">
                        <motion.div onClick={active? () => setActive(false) : () => setActive(true)} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} className="relative w-[2.5em] cursor-pointer h-full m-auto mr-0 ml-[5%] p-0 bg-transparent flex lg:hidden flex-col align-middle justify-center text-center ">
                            <motion.div initial={{translateX: 0 + "%"}} animate={{translateX: hover? 10 + "%" : 0 + "%"}} className="relative w-full h-[0.2em] rounded-md m-auto p-0 mt-0 mb-[9%] bg-white  "></motion.div>
                            <motion.div initial={{translateX: 0 + "%"}} animate={{translateX: hover? -10 + "%" : 0 + "%"}} className="relative w-full h-[0.2em] rounded-md m-auto p-0 mt-[7%] mb-[7%] bg-white  "></motion.div>
                            <motion.div initial={{translateX: 0 + "%"}} animate={{translateX: hover? 10 + "%" : 0 + "%"}} className="relative w-full h-[0.2em] rounded-md m-auto p-0 mt-[9%] mb-0 bg-white  "></motion.div>
                        </motion.div>
                        <h1 className="hidden lg:flex ml-[5%] align-middle justify-center flex-col text-center text-white font-medium text-2xl ">
                            Newsly - Analyze News 
                        </h1>
                    </ul>
                    <ul className="relative w-[50%] h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-end text-end ">
                        <div className="relative cursor-pointer w-[7em] h-full m-auto ml-0 mr-[2%] p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                            <motion.button whileHover={{scale: 0.9}} whileTap={{scale: 1.1}} initial={{scale: 1}} transition={{type: "spring", duration: 1}} className="relative w-full cursor-pointer h-[75%] m-auto p-0 rounded-md bg-slate-800 flex flex-col align-middle justify-center text-center text-2xl text-white font-light ">
                                Home
                            </motion.button>
                        </div>
                        <div className="relative cursor-pointer w-[15em] h-full m-auto ml-[2%] mr-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                            <motion.button id="login" onClick={() => window.location.href = "/login.html"} whileHover={{scale: 0.9}} whileTap={{scale: 1.1}} initial={{scale: 1}} transition={{type: "spring", duration: 1}} className="relative w-full cursor-pointer h-[75%] m-auto p-0 rounded-md bg-slate-800 flex flex-col align-middle justify-center text-center text-2xl text-white font-light ">
                                <a href="/login.html">Login Now</a>
                            </motion.button>
                            <motion.button id="logout" onClick={() => signOut(auth).then((value) => alert(value)).catch((err) => alert(err))} whileHover={{scale: 0.9}} whileTap={{scale: 1.1}} initial={{scale: 1}} transition={{type: "spring", duration: 1}} className="relative w-full cursor-pointer h-[75%] m-auto p-0 rounded-md bg-slate-800 flex flex-col align-middle justify-center text-center text-2xl text-white font-light ">
                                Logout
                            </motion.button>
                        </div>
                    </ul>
                </div>
                <motion.div initial={{display: "none"}} animate={{display: active? "flex" : "none"}} className="relative w-full h-[48vh] m-auto p-0 bg-slate-950 flex flex-col align-middle justify-center text-center ">
                    <div className="relative w-full h-[6vh] m-auto p-0 bg-transparent hover:bg-slate-800 cursor-pointer flex flex-row align-middle justify-start text-start ">
                        <li className="text-xl text-white font-medium list-none ml-[2%] flex flex-col align-middle justify-center text-center "><a href="#free">1. Newsly Free API</a></li>
                    </div>
                    <div className="relative w-full h-[6vh] m-auto p-0 bg-transparent hover:bg-slate-800 cursor-pointer flex flex-row align-middle justify-start text-start ">
                        <li className="text-xl text-white font-medium list-none ml-[2%] flex flex-col align-middle justify-center text-center "><a href="#basic">2. Newsly Basic API</a></li>
                    </div>
                    <div className="relative w-full h-[6vh] m-auto p-0 bg-transparent hover:bg-slate-800 cursor-pointer flex flex-row align-middle justify-start text-start ">
                        <li className="text-xl text-white font-medium list-none ml-[2%] flex flex-col align-middle justify-center text-center "><a href="#pro">3. Newsly Pro API</a></li>
                    </div>
                    <div className="relative w-full h-[6vh] m-auto p-0 bg-transparent hover:bg-slate-800 cursor-pointer flex flex-row align-middle justify-start text-start ">
                        <li className="text-xl text-white font-medium list-none ml-[2%] flex flex-col align-middle justify-center text-center "><a href="#usage">4. API Usage</a></li>
                    </div>
                    <div className="relative w-full h-[6vh] m-auto p-0 bg-transparent hover:bg-slate-800 cursor-pointer flex flex-row align-middle justify-start text-start ">
                        <li className="text-xl text-white font-medium list-none ml-[2%] flex flex-col align-middle justify-center text-center "><a href="#billing">5. API Billing</a></li>
                    </div>
                    <div className="relative w-full h-[6vh] m-auto p-0 bg-transparent hover:bg-slate-800 cursor-pointer flex flex-row align-middle justify-start text-start ">
                        <li className="text-xl text-white font-medium list-none ml-[2%] flex flex-col align-middle justify-center text-center "><a href="#keys">6. API Keys</a></li>
                    </div>
                    <div className="relative w-full h-[6vh] m-auto p-0 bg-transparent hover:bg-slate-800 cursor-pointer flex flex-row align-middle justify-start text-start ">
                        <li className="text-xl text-white font-medium list-none ml-[2%] flex flex-col align-middle justify-center text-center "><a href="#tester">7. API Tester</a></li>
                    </div>
                </motion.div>
            </nav>
            <div className="relative w-full h-screen m-auto p-0 bg-slate-900 flex flex-row align-middle justify-center text-center gap-3 ">
                <div className="fixed left-0 w-[20%] h-screen m-auto mt-[10vh] ml-[1%] p-0 bg-slate-900 hidden lg:flex flex-col align-middle ">
                    <div className="relative w-[90%] h-[30vh] m-auto mt-[10%] mb-0 p-0 flex flex-col align-middle ">
                        <li className="text-white text-xl font-semibold list-none bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center">Newsly APIs</li>
                        <li className="text-white text-xl font-light list-none mt-[10%] hover:bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center "><a href="#free">Newsly Free API</a></li>
                        <li className="text-white text-xl font-light list-none mt-[10%] hover:bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center "><a href="#basic">Newsly Basic API</a></li>
                        <li className="text-white text-xl font-light list-none mt-[10%] hover:bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center "><a href="#pro">Newsly Pro API</a></li>
                    </div>
                    <div className="relative w-[90%] h-[35vh] m-auto mt-[10%] mb-0 p-0 flex flex-col align-middle ">
                        <li className="text-white text-xl font-semibold list-none bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center">Newsly Dashboard</li>
                        <li className="text-white text-xl font-light list-none mt-[10%] hover:bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center "><a href="#usage">API Usage</a></li>
                        <li className="text-white text-xl font-light list-none mt-[10%] hover:bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center "><a href="#keys">API Key</a></li>
                        <li className="text-white text-xl font-light list-none mt-[10%] hover:bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center "><a href="#billing">API Billing</a></li>
                        <li className="text-white text-xl font-light list-none mt-[10%] hover:bg-slate-800 h-[5vh] flex flex-col align-middle justify-center text-center "><a href="#tester">Newsly API Tester</a></li>
                    </div>
                </div>
                <div className="relative w-full lg:w-[80%] lg:ml-[20%] rounded-md h-fit m-auto p-0 bg-slate-900 flex flex-col align-middle   ">
                    <section id="keys" className="relative w-full h-screen m-auto p-0 bg-transparent flex flex-col align-middle ">
                        <div className="relative w-[75%] h-[10vh] m-auto mt-[10vh] mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="text-2xl text-white font-semibold ">Newsly API Keys </h1>
                        </div>
                        <div className="relative w-[75%] h-[10vh] m-auto p-0 bg-slate-800 overflow-y-auto overflow-x-hidden flex flex-row align-middle justify-center text-center ">
                            <div id="token" className="relative w-[90%] h-full m-auto p-0 flex flex-col align-middle justify-center text-center bg-transparent ">

                            </div>
                            <div className="relative w-[10%] h-full m-auto p-0 flex flex-col align-middle justify-center text-center bg-transparent ">

                            </div>
                        </div>
                    </section>
                    <section id="usage" className="relative w-full h-screen m-auto p-0 bg-transparent flex flex-col align-middle ">
                        <div className="relative w-[75%] h-[10vh] m-auto mt-[10vh] mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="text-2xl text-white font-semibold ">Newsly API Usage </h1>
                        </div>
                    </section>
                    <section id="billing" className="relative w-full h-screen m-auto p-0 bg-transparent flex flex-col align-middle ">
                        <div className="relative w-[75%] h-[10vh] m-auto mt-[10vh] mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="text-2xl text-white font-semibold ">Newsly API Billing </h1>
                        </div>
                    </section>
                    <section id="tester" className="relative w-full h-screen m-auto p-0 bg-transparent flex flex-col align-middle ">
                        <div className="relative w-[75%] h-[10vh] m-auto mt-[10vh] mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="text-2xl text-white font-semibold ">Newsly API Tester </h1>
                        </div>
                    </section>
                    <section id='free' className="relative w-full h-screen min-h-screen m-auto p-0 bg-transparent mt-0 mb-0 flex flex-col align-middle gap-5 ">
                        <div className="relative w-[90%] h-[10vh] m-auto mt-[8vh] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                            <h1 className="text-2xl text-white font-bold">Newsly Free API</h1>
                        </div>
                        <div className="relative w-[90%] h-[8vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-row align-middle justify-center text-center ">
                            <div className="relative w-[90%] h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                                <p className="text-2xl text-white font-medium">GET / <a className="text-violet-400" href="https://free-api-axaeefmbvq-uc.a.run.app?headline=news">https://free-api-axaeefmbvq-uc.a.run.app</a></p>
                            </div>
                            <div className="relative w-[10%] h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                                
                            </div>
                        </div>
                        <div className="relative w-[90%] h-[7vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="font-medium text-white text-2xl">Request Queries</h1>
                        </div>
                        <table className="relative w-[90%] h-[15vh] mt-0 mb-0 m-auto p-0 bg-slate-800 ">
                            <thead className="h-[50%] ">
                                <tr className="bg-gray-950">
                                    <td className="text-xl text-white border-2 border-black">Request Name</td>
                                    <td className="text-xl text-white border-2 border-black">Request Header</td>
                                    <td className="text-xl text-white border-2 border-black">Request Description</td>
                                </tr>  
                            </thead>
                            <tbody className="h-[50%] ">
                                <tr>
                                    <td className="text-xl text-white border-black border-2">headline</td>
                                    <td className="text-xl text-white border-black border-2">Query</td>
                                    <td className="text-xl text-white border-black border-2">enter a news headline as ?headline=news</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="relative w-[90%] h-[7vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="font-medium text-white text-2xl">Response Objects</h1>
                        </div>
                        <table className="relative w-[90%] h-[40vh] mt-0 mb-0 m-auto p-0 bg-slate-800 ">
                            <thead className="h-[20%]">
                                <tr className="bg-gray-950">
                                    <td className="text-xl text-white border-2 border-black">Object Name</td>
                                    <td className="text-xl text-white border-2 border-black">Object Description</td>
                                </tr>  
                            </thead>
                            <tbody className="h-[80%] ">
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">headline</td>
                                    <td className="text-xl text-white border-2 border-black">headline - JSON Object of your headline</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">date</td>
                                    <td className="text-xl text-white border-2 border-black">date - JSON Object of the Date when you called it</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">type</td>
                                    <td className="text-xl text-white border-2 border-black">type - what api type you used: free, basic or pro</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">summary</td>
                                    <td className="text-xl text-white border-2 border-black">summary - the summary of the news headline searches</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section id='basic' className="relative w-full h-screen min-h-screen m-auto p-0 bg-transparent mt-0 mb-0 flex flex-col align-middle gap-5 ">
                        <div className="relative w-full h-[10vh] m-auto mt-[8vh] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                            <h1 className="text-2xl text-white font-bold">Newsly Basic API</h1>
                        </div>
                        <div className="relative w-[90%] h-[8vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-row align-middle justify-center text-center ">
                            <div className="relative w-[90%] h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                                <p className="text-2xl text-white font-medium">GET / <a className="text-violet-400" href="https://basic-api-axaeefmbvq-uc.a.run.app?headline=news">https://basic-api-axaeefmbvq-uc.a.run.app</a></p>
                            </div>
                            <div className="relative w-[10%] h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                                
                            </div>
                        </div>
                        <div className="relative w-[90%] h-[7vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="font-medium text-white text-2xl">Request Queries</h1>
                        </div>
                        <table className="relative w-[90%] h-[20vh] mt-0 mb-0 m-auto p-0 bg-slate-800 ">
                            <thead className="h-[35%] ">
                                <tr className="bg-gray-950">
                                    <td className="text-xl text-white border-2 border-black">Request Name</td>
                                    <td className="text-xl text-white border-2 border-black">Request Header</td>
                                    <td className="text-xl text-white border-2 border-black">Request Description</td>
                                </tr>  
                            </thead>
                            <tbody className="h-[65%] ">
                                <tr>
                                    <td className="text-xl text-white border-black border-2">headline</td>
                                    <td className="text-xl text-white border-black border-2">Query</td>
                                    <td className="text-xl text-white border-black border-2">enter a news headline as ?headline=news</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-black border-2">Authorization</td>
                                    <td className="text-xl text-white border-black border-2">Authorization header</td>
                                    <td className="text-xl text-white border-black border-2">Enter Your API key in the Authorization header</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="relative w-[90%] h-[7vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="font-medium text-white text-2xl">Response Objects</h1>
                        </div>
                        <table className="relative w-[90%] h-[40vh] mt-0 mb-0 m-auto p-0 bg-slate-800 ">
                            <thead className="h-[20%]">
                                <tr className="bg-gray-950">
                                    <td className="text-xl text-white border-2 border-black">Object Name</td>
                                    <td className="text-xl text-white border-2 border-black">Object Description</td>
                                </tr>  
                            </thead>
                            <tbody className="h-[80%] ">
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">headline</td>
                                    <td className="text-xl text-white border-2 border-black">headline - JSON Object of your headline</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">date</td>
                                    <td className="text-xl text-white border-2 border-black">date - JSON Object of the Date when you called it</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">type</td>
                                    <td className="text-xl text-white border-2 border-black">type - what api type you used: free, basic or pro</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">people</td>
                                    <td className="text-xl text-white border-2 border-black">people - the list of people mentioned in the news searches</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section id='pro' className="relative w-full h-[120vh] p-0 bg-transparent mt-0 mb-0 flex flex-col align-middle gap-5 ">
                        <div className="relative w-full h-[10vh] m-auto mt-[8vh] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                            <h1 className="text-2xl text-white font-bold">Newsly Pro API</h1>
                        </div>
                        <div className="relative w-[90%] h-[8vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-row align-middle justify-center text-center ">
                            <div className="relative w-[90%] h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                                <p className="text-2xl text-white font-medium">GET / <a className="text-violet-400" href="https://pros-api-axaeefmbvq-uc.a.run.app?headline=news&outcomes=event1,event2">https://pros-api-axaeefmbvq-uc.a.run.app</a></p>
                            </div>
                            <div className="relative w-[10%] h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                                
                            </div>
                        </div>
                        <div className="relative w-[90%] h-[7vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="font-medium text-white text-2xl">Request Queries</h1>
                        </div>
                        <table className="relative w-[90%] h-[25vh] mt-0 mb-0 m-auto p-0 bg-slate-800 ">
                            <thead>
                                <tr className="bg-gray-950">
                                    <td className="text-xl h-[7vh] text-white border-2 border-black">Request Name</td>
                                    <td className="text-xl h-[7vh] text-white border-2 border-black">Request Header</td>
                                    <td className="text-xl h-[7vh] text-white border-2 border-black">Request Description</td>
                                </tr>  
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">headline</td>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">Query</td>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">enter a news headline as ?headline=news</td>
                                </tr>
                                <tr>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">outcomes</td>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">Query</td>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">enter a list of outcomes e.g ?outcomes=event1,event2,event3 </td>
                                </tr>
                                <tr>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">Authorization</td>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">Authorization header</td>
                                    <td className="text-xl h-[5vh] text-white border-black border-2">Enter Your API key in the Authorization header</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="relative w-[90%] h-[7vh] m-auto mt-0 mb-0 p-0 bg-slate-800 flex flex-col align-middle justify-center text-center ">
                            <h1 className="font-medium text-white text-2xl">Response Objects</h1>
                        </div>
                        <table className="relative w-[90%] h-[40vh] mt-0 mb-0 m-auto p-0 bg-slate-800 ">
                            <thead className="h-[20%]">
                                <tr className="bg-gray-950">
                                    <td className="text-xl text-white border-2 border-black">Object Name</td>
                                    <td className="text-xl text-white border-2 border-black">Object Description</td>
                                </tr>  
                            </thead>
                            <tbody className="h-[80%] ">
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">headline</td>
                                    <td className="text-xl text-white border-2 border-black">headline - JSON Object of your headline</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">date</td>
                                    <td className="text-xl text-white border-2 border-black">date - JSON Object of the Date when you called it</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">type</td>
                                    <td className="text-xl text-white border-2 border-black">type - what api type you used: free, basic or pro</td>
                                </tr>
                                <tr>
                                    <td className="text-xl text-white border-2 border-black">likelihood</td>
                                    <td className="text-xl text-white border-2 border-black">likelihood - the likelihood ranking of your outcomes</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </div>
    )
}