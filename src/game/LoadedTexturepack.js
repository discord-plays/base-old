const Jimp = require("jimp");
const path = require("path");
const xor = require("../utils/xor");

class LoadedTexturepack {
  constructor(basedir, texturepath) {
    this.basedir = basedir;
    this.texturepath = texturepath == "%%default%%" ? "mods/$$/assets" : texturepath;
    this.cached = {};
    this.palette = { width: 16, height: 3 };
  }

  /**
   * Get a texture by its asset id
   * @param {integer} index
   * @returns Jimp image
   */
  async getTexture(a) {
    if (this.cached.hasOwnProperty(a)) return this.cached[a];
    let b = path.join(this.basedir, this.texturepath.replace("$$", a.split("/")[0]), `${a}.png`);
    try {
      this.cached[a] = await Jimp.read(b);
    } catch (err) {
      this.cached[a] = await this.getDebugPinkBlack();
    }
    return this.cached[a];
  }

  /**
   * 0 starts at the end of the first row so shift by one less than the width to turn (-this.palette.width) to 0 for the top left corner
   * @param {integer} index
   * @returns Jimp image
   */
  async getPaletteColor(index) {
    var size = this.palette.width * this.palette.height;
    var lower = Math.abs(Math.floor(index / size));
    return await this.indexIntoPalette((index + (this.palette.width - 1) + lower * size) % size);
  }

  /**
   * Get the color in the palette at the specified index
   * @param {integer} index
   * @returns Jimp image
   */
  async indexIntoPalette(index) {
    var pos = [index % this.palette.width, Math.floor(index / this.palette.width)];
    let tex = await this.getTexture("discordplays.base/palette");
    return tex.clone().crop(pos[0], pos[1], 1, 1);
  }

  /**
   * Get pink and black debug cell
   * @returns Jimp image
   */
  async getDebugPinkBlack() {
    return await this.getTexture("discordplays.base/debug/debug");
  }

  /**
   * Get pink and white debug cell
   * @returns Jimp image
   */
  async getDebugPinkWhite() {
    return await this.getTexture("discordplays.base/debug/debug2");
  }
}

module.exports = LoadedTexturepack;
