const Jimp = require("jimp");
const LoadedTexturepack = require("./LoadedTexturepack");

class Texturepack {
  constructor(basedir, texturepath, loadedTexturepackKlass) {
    this.basedir = basedir;
    this.texturepath = texturepath;
    this.loadedTexturepackKlass = loadedTexturepackKlass;
    this.name = texturepath.replace(/^.*?\/([^\/]+)$/, "$1"); // Regex man
  }

  async use() {
    return new this.loadedTexturepackKlass(this.basedir, this.texturepath);
  }
}

module.exports = Texturepack;
