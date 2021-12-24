const BaseInput = require("../BaseInput");
const { BUTTON_O } = require("../EmojiButtons");

class ArrayInput extends BaseInput {
  constructor(menu,name) {
    super(menu);
    this.name = name;
    this.description = "Pick a value by reacting with the required symbol";
    this.type = 'ArrayInput';
    this.options = [];
  }

  getFancyValue() {
    let opt = this.options[this.value];
    if(opt) return opt.symbol;
    else return null;
  }

  editEmbed(embed) {
    let o=[this.description];
    for(let i=0;i<this.options.length;i++) o.push(`(${this.options[i].symbol}) ${this.value==i?'**':''}${this.options[i].name}${this.value==i?'** '+BUTTON_O.name:''}`);
    embed.setDescription(o.join('\n'));
  }

  addOption(name,symbol) {
    this.options.push({name,symbol});
  }

  clickButton(button) {
    for(let i=0; i<this.options.length; i++) {
      if(button.customId == `${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_button-${i}`) {
        button.deferUpdate();
        this.value = i;
        this.menu.changeWidget(this);
        this.triggerCallback();
        return;
      }
    }
    super.clickButton(button);
  }
}

module.exports = ArrayInput;
