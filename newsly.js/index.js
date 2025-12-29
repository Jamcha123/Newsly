import axios from 'axios'

export default class Newsly{
    async poly_questions(polymarket_headline){
        if(polymarket_headline == "" || polymarket_headline == undefined){
            throw new Error("polymarket_headline is undefined")
        }
        let ans = polymarket_headline
        if(polymarket_headline.slice(0, 8) == "https://"){
            ans = ((polymarket_headline.split("//")[1]).split("/"))[2].split("?")[0]
        }
        const webby = (await axios.get("https://newsly-questions-d2wfhntahq-uc.a.run.app/?polymarket_headline=" + ans))["data"]
        return webby
    }
    async poly_searches(polymarket_headline){
        if(polymarket_headline == "" || polymarket_headline == undefined){
            throw new Error("polymarket_headline is undefined")
        }
        let ans = polymarket_headline
        if(polymarket_headline.slice(0, 8) == "https://"){
            ans = ((polymarket_headline.split("//")[1]).split("/"))[2].split("?")[0]
        }
        const webby = (await axios.get("https://newsly-searches-d2wfhntahq-uc.a.run.app?polymarket_headline=" + ans))["data"]
        return webby
    }
    async poly_ranking(polymarket_headline, options = {"apikey": "<your_api_key_that_you_bought>"}){
        if(polymarket_headline == "" || polymarket_headline == undefined){
            throw new Error("polymarket_headline is undefined")
        }
        let ans = polymarket_headline
        if(polymarket_headline.slice(0, 8) == "https://"){
            ans = ((polymarket_headline.split("//")[1]).split("/"))[2].split("?")[0]
        }
        if(options["apikey"] == "<your_api_key_that_you_bought>"){
            throw new Error("you need to enter your API key\nYou can buy one here: https://buy.stripe.com/5kQ3cu3YS31t1G00le6kg05")
        }
        const webby = (await axios.get("https://newsly-ranking-d2wfhntahq-uc.a.run.app?polymarket_headline=" + ans, {headers: {Authorization: options["apikey"]}}))["data"]
        return webby
    }
}
