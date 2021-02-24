const fs = require("fs");
const csv = require("csv");
require("dotenv").config();

// 主催者のアカウントは抽選の対象外にします。
const organizers = []; // 例：['@_katsumi', '@Neri78']

const parser = csv.parse((error, data) => {
  if (error) {
    console.error(error);
    process.exit(-1);
  }

  console.log(`${data.length}件のツイートがありました（リツイートを除く）。`);

  // 主催者を除外
  const users = [];
  data.forEach((user) => {
    if (organizers.indexOf(user[0]) == -1) {
      // 主催者を除く
      users.push(user[0]);
    }
  });

  // 重複ユーザを排除
  const targetUsers = [...new Set(users)];
  console.log(
    `ツイートしたユーザは、${targetUsers.length}名でした。（主催者除く）`
  );

  // 当選者を選ぶ
  const hitNumber = [];
  let count = 0;
  while (count < process.env.LOTTERY_COUNT) {
    const number = getRandomInt(targetUsers.length);
    if (hitNumber.filter((n) => n === number).length === 0) {
      hitNumber.push(number);
      console.log(`${++count}番目の当選者は、${targetUsers[number]}さんです。`);
      // 当選者をファイルに書き出し
      fs.appendFile("users.csv", `${targetUsers[number]}\n`, (err) => {
        if (err) process.exit(-1);
      });
    }
  }
});

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

fs.createReadStream("tweets.csv").pipe(parser);
