const Jimp = require("jimp");
const LoadedTexturepack = require("./LoadedTexturepack");

class Texturepack {
  constructor(basedir, texturepath) {
    this.basedir = basedir;
    this.texturepath = texturepath;
    this.name = texturepath.replace(/^.*?\/([^\/]+)$/, "$1"); // Regex man
  }

  async use() {
    return new LoadedTexturepack(this.basedir, this.texturepath);
  }
}

module.exports = Texturepack;
