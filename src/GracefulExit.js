module.exports = function () {
  function gracefullyExit() {
    console.log("Gracefully shutting down");
    bot.shutdown();

    console.log("Entry point finished, goodbye!!");
    process.exit();
  }

  // I guess stackoverflow is the best?
  // https://stackoverflow.com/a/14861513/10719432
  if (process.platform === "win32") {
    var rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("SIGINT", function () {
      process.emit("SIGINT");
    });
  }

  process.on("SIGINT", function () {
    console.log("\nDetected SIGINT...");
    gracefullyExit();
  });

  process.on("SIGTERM", function () {
    console.log("\nDetected SIGTERM...");
    gracefullyExit();
  });
};
