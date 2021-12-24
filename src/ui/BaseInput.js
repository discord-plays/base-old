const { MessageEmbed, MessageActionRow, MessageButton, Constants } = require('discord.js');
const { BUTTON_MENU } = require('./EmojiButtons');

const MAX_ACTION_ROW_WIDTH = 5;

class BaseInput {
  constructor(menu) {
    this.controller = menu.controller;
    this.menu = menu;
    this.name = '';
    this.symbol = '';
    this.type = '';
    this.message = null;
    this.value = null;
    this.callback = null;
    this.options = [];
  }

  getFancyValue() {
    /* Can be overridden to output a better value for this widget */
    return this.value;
  }

  setCallback(callback) {
    this.callback = callback;
  }

  triggerCallback() {
    if(this.callback!=null) this.callback(this.value);
  }

  generateRichEmbed() {
    const embed = new MessageEmbed()
      .setTitle(`${this.menu.name} -> ${this.name}`)
      .setColor(this.color)

    embed.setDescription(this.description);
    this.editEmbed(embed);

    return embed;
  }

  editEmbed() {
    /* Can be overridden to edit the embed before sending called from `generateRichEmbed()` */
  }

  generateOptionButtons() {
    var o=[];
    for(let i=0;i<this.options.length;i++) o.push(
      new MessageButton()
        .setLabel(this.options[i].name)
        .setStyle(Constants.MessageButtonStyles.SECONDARY)
        .setEmoji(this.options[i].symbol)
        .setCustomId(`${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_button-${i}`)
    );
    return o;
  }

  sendTo(textChannel) {
    var $t=this;

    let opts = this.generateOptionButtons();
    if(opts.length > 18) {
      throw new Exception("idk what to do?");
    }

    opts.splice(0,0,new MessageButton().setLabel("Back").setStyle(Constants.MessageButtonStyles.PRIMARY).setEmoji(BUTTON_MENU.symbol).setCustomId(`${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_home`));

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
      $t.menu.message = m;
      $t.controller.addTrigger(m,$t,$t.menu.user,'message-button');
    });
  }

  destroy() {
    this.message.delete().then(()=>{}).catch(()=>{});
    this.controller.destroyMenu(this);
  }

  clickButton(button) {
    if(button.customId == `${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_home`) {
      button.deferUpdate();
      this.menu.showMenu();
    } else {
      console.log(`Base input received click button. Maybe this is an error? (button id: ${button.customId})`);
    }
  }
}

module.exports = BaseInput;
