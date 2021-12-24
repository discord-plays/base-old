const { MessageEmbed, MessageActionRow, MessageButton, Constants } = require('discord.js');
const StringInput = require('./widgets/StringInput');
const ArrayInput = require('./widgets/ArrayInput');
const BooleanInput = require('./widgets/BooleanInput');
const FloatInput = require('./widgets/FloatInput');
const IntegerInput = require('./widgets/IntegerInput');
const { BUTTON_NUMBERS } = require('./EmojiButtons.js');

const MAX_ACTION_ROW_WIDTH = 5;

class Menu {
  constructor(controller, user) {
    this.widgets = [];
    this.controller = controller;
    this.type = "menu";
    this.user = user;
    this.name = "";
    this.color = 0xff0000;
    this.description = "";
    this.message = null;
  }

  addWidget(widget) {
    this.widgets.push(widget);
    widget.symbol = BUTTON_NUMBERS[(this.widgets.length - 1) % BUTTON_NUMBERS.length].symbol;
    return widget;
  }

  addTextWidget() {
    return this.addWidget(new Textbox(this));
  }

  addArrayInputWidget() {
    return this.addWidget(new ArrayInput(this));
  }

  addBooleanInputWidget() {
    return this.addWidget(new BooleanInput(this));
  }

  addFloatInputWidget() {
    return this.addWidget(new FloatInput(this));
  }

  addIntegerInputWidget() {
    return this.addWidget(new IntegerInput(this));
  }

  addStringInputWidget() {
    return this.addWidget(new StringInput(this));
  }

  generateRichEmbed() {
    const embed = new MessageEmbed()
      .setTitle(this.name)
      .setColor(this.color)

    let w=this.widgets.map(x=>`${x.name}: ${x.getFancyValue()}`);
    embed.setDescription(this.description+'\n\n'+w.join('\n'));
    return embed;
  }

  generateOptionButtons() {
    var o=[];
    for(let i=0;i<this.widgets.length;i++) o.push(
      new MessageButton()
        .setLabel(this.widgets[i].name)
        .setStyle(Constants.MessageButtonStyles.SECONDARY)
        .setEmoji(this.widgets[i].symbol)
        .setCustomId(`${this.name.toLowerCase()}_button-${i}`)
    );
    return o;
  }

  sendTo(textChannel) {
    var $t=this;

    let opts = this.generateOptionButtons();
    if(opts.length > 18) {
      throw new Exception("idk what to do?");
    }

    let rows = [];
    let y = Math.ceil(opts.length / MAX_ACTION_ROW_WIDTH);
    for(let i=0;i<y;i++) {
      rows.push(new MessageActionRow());
    }

    for(let i=0;i<opts.length;i++) {
      rows[Math.floor(i/MAX_ACTION_ROW_WIDTH)].addComponents(opts[i]);
    }

    textChannel.send({embeds:[this.generateRichEmbed()],components:rows}).then(async m=>{
      $t.message = m;
      $t.controller.sent.push({message:m,input:$t,user:$t.user,type:'message-button'});
    });
  }

  changeWidget(widget) {
    if(this.widgets.includes(widget)) {
      if(this.message!=null) widget.sendTo(this.message.channel);
      this.delete();
    }
  }

  showMenu() {
    if(this.message!=null) this.sendTo(this.message.channel);
    this.delete();
  }

  delete(a=false) {
    this.controller.removeTriggersForMessage(this.message);
    if(this.message!=null) this.message.delete().then(()=>{
      if(a) this.message = null;
    }).catch(()=>{});
  }

  destroy() {
    this.delete(true);
    this.controller.destroyMenu(this);
  }

  clickButton(button) {
    for(let i=0; i<this.widgets.length; i++) {
      if(button.customId == `${this.name.toLowerCase()}_button-${i}`) {
        button.deferUpdate();
        this.changeWidget(this.widgets[i]);
        break;
      }
    }
  }

  addReaction(reaction) {
    let options = this.getWidgetOptionSymbols();
    let index = options.indexOf(reaction.emoji.name);
    if(index!=-1) this.changeWidget(this.widgets[index]);
  }

  removeReaction(reaction) {
    /* Maybe nothing needs to happen? */
  }
}

module.exports = Menu;
