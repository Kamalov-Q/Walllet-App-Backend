import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error sending GET request:", e));
});

export default job;

//EXAMPLES && EXPLANAITION
// *14 * * * * - Every 14 minutes
// * * * * * - Every hour
//* * * * * - Every minute
//* * * * * * - Every second
//* 0 0 * * * - Every day at midnight
//* * * * * * * - Every millisecond
//* * * * * * * * - Every microsecond
