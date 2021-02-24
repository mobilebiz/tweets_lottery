const Twitter = require("twitter-lite");
const fs = require("fs");
require("dotenv").config();

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const stream = client
  .stream("statuses/filter", { track: `#${process.env.HASH_TAG}` })
  .on("start", () => {
    console.log("start");
  })
  .on("data", (tweet) => {
    console.log(`${tweet.user.screen_name} > ${tweet.text}`);
    if (!tweet.text.match(/^RT /)) {
      // リツイートは除く
      fs.appendFile("tweets.csv", `"@${tweet.user.screen_name}"\n`, (err) => {
        if (err) process.exit(-1);
      });
    }
  })
  .on("error", (err) => {
    console.error(`ERROR: ${err}`);
  })
  .on("end", () => {
    console.log("end");
    process.exit(1);
  });
