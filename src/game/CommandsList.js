const path = require("path");
const Globber = require("./Globber");

class CommandsList extends Globber {
  constructor(basedir) {
    super(path.join(basedir, "commands"), "*.js");
    this.commands = [];
  }

  error(err) {
    console.error("Error loading assets");
    console.error(err);
  }

  import(p) {
    this.commands.push(p);
  }

  getCommandName(p) {
    return p.split("/").splice(-1, 1)[0].replace(/\.js$/, "");
  }

  find(name) {
    var z = this.commands.filter((x) => this.getCommandName(x) === name);
    if (z.length != 1) return null;
    return z[0];
  }
}

module.exports = CommandsList;
