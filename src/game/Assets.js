const path = require("path");
const Globber = require("./Globber");
const Texturepack = require("./Texturepack");

class Assets extends Globber {
  constructor(basedir) {
    this.basedir = basedir;
    this.packs = [];
    this.import("%%default%%");
  }

  load() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  error(err) {
    console.error("Error loading assets");
    console.error(err);
  }

  import(path) {
    this.packs.push(new Texturepack(this.basedir, path));
  }

  find(name) {
    var z = this.packs.filter((x) => x.name == name);
    if (z.length != 1) return null;
    return z[0];
  }
}

module.exports = Assets;
