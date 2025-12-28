import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import axios from 'axios'
import dotenv from 'dotenv'
import { randomBytes } from 'crypto'
import { OpenAI } from 'openai/client.js'
import {Perplexity} from '@perplexity-ai/perplexity_ai'

admin.initializeApp()
dotenv.config()

const openai = new OpenAI({apiKey: process.env.OPENAI})
const perplexity = new Perplexity({apiKey: process.env.PERPLEX})

export const newsly_questions = functions.https.onRequest({cors: true}, async (req, res) => {
    const {polymarket_headline} = req.query
    
    let ans = ""
    for(let i = 0; i != polymarket_headline.length; i++){
        if(polymarket_headline[i] == " "){
            ans += "-"
            continue
        }
        ans += polymarket_headline[i].toLowerCase()
    }

    const link = "https://gamma-api.polymarket.com/events/slug/" + ans
    const {title, description, markets} = (await axios.get(link))["data"]

    const quests = markets.map((e) => ["title: " + title, "description: " + description, "question: " + e["question"], "id: " + e["id"], "volume: " + e["volume"]])
    return res.status(200).send(quests)
})

export const newsly_searches = functions.https.onRequest({cors: true}, async (req, res) => {
    const {polymarket_headline} = req.query

    const brave_link = "https://api.search.brave.com/res/v1/news/search?q=" + polymarket_headline + "&count=10"
    const brave_ans = (await axios.get(brave_link, {headers: {"Accept": "application/json", "Accept-Encoding": "gzip", "X-Subscription-Token": process.env.BRAVE}}))["data"]["results"].map((e) => e["title"] + " - " + e["description"] + " - " + e["age"] + " [" + e["url"] + "]\n")

    const google_link = "https://www.googleapis.com/customsearch/v1?key=" + process.env.GOOGLE + "&cx=a5e40ffbb166b4c38&q=" + polymarket_headline 
    const google_ans = (await axios.get(google_link))["data"]["items"].map((e) => e["title"] + " - " + e["snippet"] + " [" + e["link"] + "]\n")

    const perplex_news = perplexity.search.create({
        query: polymarket_headline, 
        max_results: 10,
        max_tokens: 1024 
    })
    const perplex_ans = (await perplex_news).results.map((e) => e.title + " - " + e.snippet + " [" + e.url + "]\n")

    return res.status(200).send(["google searches: " + google_ans, "brave searches: " + brave_ans, "perplexity searches: " + perplex_ans])
})

export const unlimited_key = functions.https.onRequest({cors: true}, async (req, res) => {
    const {key} = req.query
    const token = Buffer.concat([Buffer.from(key), Buffer.from(randomBytes(32).toString("hex"))], 2)

    const storing = (await admin.firestore().collection("paid_npm").doc("usage").get()).get("keys")
    storing.push(token)

    await admin.firestore().collection("paid_npm").doc("usage").set({"keys": storing})

    return res.status(200).send("Your Newsly Unlimited Key: " + token + "\n\nDo Not Lose It!!!")
})


export const newsly_ranking = functions.https.onRequest({cors: true, timeoutSeconds: 3600}, async (req, res) => {
    const {polymarket_headline} = req.query
    const {authorization} = req.headers

    if(authorization == undefined || typeof(authorization) == undefined || authorization == null){
        return res.status(200).send(authorization + " is empty\nYou need an API key to use the unlimited polymarket ranking API\nYou can buy an unlimited Newsly key here:  <a href='https://buy.stripe.com/5kQ3cu3YS31t1G00le6kg05'>https://buy.stripe.com/5kQ3cu3YS31t1G00le6kg05</a>")
    }

    let active = false
    const keys = (await admin.firestore().collection("paid_npm").doc("usage").get()).get("keys")
    keys.forEach((e) => {
        if(e == authorization){
            active = true
        }
    })

    if(active === false){
        return res.status(200).send(authorization + " is the wrong key\nplease enter the right key\n you can also buy a key here ($1.99): <a href='https://buy.stripe.com/5kQ3cu3YS31t1G00le6kg05'>https://buy.stripe.com/5kQ3cu3YS31t1G00le6kg05</a>")
    }

    let ans = ""
    for(let i = 0; i != polymarket_headline.length; i++){
        if(polymarket_headline[i] == " "){
            ans += "-"
            continue
        }
        ans += polymarket_headline[i].toLowerCase()
    }

    const questions = (await axios.get("http://localhost:5000/newsly-2/us-central1/newsly_questions?polymarket_headline=" + ans))["data"]

    if(questions == "Request failed with status code 404"){
        return res.status(200).send(polymarket_headline + " is not a event from polymarket, please enter a different headline from polymarket")
    }
    let quests = ""
    for(let i = 0; i != questions.length; i++){
        quests += i.toString() + ". " + questions[i][2] + "\n\n"
    }

    const searches = (await axios.get("http://localhost:5000/newsly-2/us-central1/newsly_searches?polymarket_headline=" + ans))["data"]

    const response = openai.chat.completions.create({
        model: "gpt-5",
        reasoning_effort: "medium", 
        messages: [
            {
                role: "system", 
                content: "you are a analyzer that ranks polymarket event questions from most to least likely (0 = never, 10 = guaranted).\n google searches: " + searches[0] + "\nbrave searches: " + searches[1] + "\nperplexity searches: " + searches[2] 
            },
            {
                role: "user", 
                content: "rank these questions (50 words per question):\n" + quests
            }
        ]
    })
    return res.status(200).send((await response).choices[0].message["content"])
})

