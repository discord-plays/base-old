const Globber = require("./Globber");
const path = require("path");
const ModHandle = require("./ModHandle");

class ModLoader extends Globber {
  constructor(project, basedir) {
    super(path.join(basedir, "mods"), "*/");
    this.project = project;
    this.mods = [];
  }

  error(err) {
    console.error("Error loading assets");
    console.error(err);
  }

  import(p) {
    this.mods.push(new ModHandle(this.project, p));
  }

  find(name) {
    var z = this.mods.filter((x) => x.name == name);
    if (z.length != 1) return null;
    return z[0];
  }

  get(id) {
    var z = this.mods.filter((x) => x.mod.id == id);
    if (z.length != 1) return null;
    return z[0];
  }

  load() {
    return super.load().then(() => {
      this.mods.forEach((mod) => {
        console.log(`Loading mod: ${mod.name}`);
        mod.load();
      });
    });
  }
}

module.exports = ModLoader;
