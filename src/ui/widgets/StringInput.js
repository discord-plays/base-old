const { MessageActionRow, MessageButton, Constants } = require('discord.js');
const BaseInput = require("../BaseInput");
const { BUTTON_PENCIL } = require("../EmojiButtons");

class StringInput extends BaseInput {
  constructor(menu,name) {
    super(menu);
    this.name = name;
    this.description = "";
    this.type = 'StringInput';
    this.options = [];
    this.acceptingInput = null;
    this.value = "";
  }

  editEmbed(embed) {
    let o=[this.description,`Press the edit button to input a new value`,`(${BUTTON_PENCIL.name}) ${this.value}`];
    embed.setDescription(o.join('\n'));
  }

  sendInput(text) {
    this.value = text;
    if(this.acceptingInput!=null) this.acceptingInput.delete().then(()=>{}).catch(()=>{});
    this.menu.changeWidget(this);
    this.triggerCallback();
  }

  generateOptionButtons() {
    return [new MessageButton()
      .setLabel("Edit")
      .setStyle(Constants.MessageButtonStyles.SUCCESS)
      .setEmoji("📝")
      .setCustomId(`${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_pencil`)
    ];
  }

  clickButton(button) {
    let $t = this;
    if(button.customId == `${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_pencil`) {
      button.deferUpdate();
      $t.controller.sent.push({message:$t.message,input:$t,user:$t.menu.user,type:'string'});

      let undoButton = new MessageButton()
        .setLabel("Cancel")
        .setStyle(Constants.MessageButtonStyles.DANGER)
        .setEmoji("❎")
        .setCustomId(`${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_pencil_cancel`);
      $t.message.channel.send({content:'Input your text after the tone (***beep***):',components:[new MessageActionRow().addComponents(undoButton)]}).then(x=>{
        this.acceptingInput=x;
        $t.controller.addTrigger(x,$t,$t.menu.user,'message-button');
      }).catch(()=>{});
      return;
    } else if(button.customId == `${this.menu.name.toLowerCase()}_${this.name.toLowerCase()}_pencil_cancel`) {
      button.deferUpdate();
      if(this.acceptingInput!=null)this.acceptingInput.delete().then(()=>{}).catch(()=>{});
      this.menu.changeWidget(this);
      return;
    }
    super.clickButton(button);
  }
}

module.exports = StringInput;
