import Newsly from "../index.js";
import assert from 'assert'

const obj = new Newsly()

describe("test 1", function () {
    it("should throw 'polymarket_headline is undefined' if polymarket_headline is '' ", async function () {
      return await obj.poly_questions("https://polymarket.com/event/what-will-trump-say-during-netanyahu-event-on-monday?tid=1767037520270")
    });
});


describe("test 2", function () {
    it("should return a array of questions if polymarket_headline is 'https://polymarket.com/event/what-will-trump-say-during-netanyahu-event-on-monday?tid=1767037520270' ", async function () {
      return await obj.poly_questions("https://polymarket.com/event/what-will-trump-say-during-netanyahu-event-on-monday?tid=1767037520270")
    });
});

describe("test 3", function () {
    it("should return a JSON object of google, brave and perplexity if polymarket_headline is 'https://polymarket.com/event/what-will-trump-say-during-netanyahu-event-on-monday?tid=1767037520270' ", async function () {
      return await obj.poly_searches("https://polymarket.com/event/what-will-trump-say-during-netanyahu-event-on-monday?tid=1767037520270")
    });
});

describe("test 4", function () {
    it("should return a JSON object of google, brave and perplexity if polymarket_headline is 'https://polymarket.com/event/what-will-trump-say-during-netanyahu-event-on-monday?tid=1767037520270' ", async function () {
      return await obj.poly_ranking("https://polymarket.com/event/what-will-trump-say-during-netanyahu-event-on-monday?tid=1767037520270")
    });
});
