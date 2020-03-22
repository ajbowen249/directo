const { Format, CommandResult } = require('./enums');
const { Directo } = require('./directo');

let instance;

function maybeInit() {
  if (!instance) {
    instance = new Directo();
  }
}

function command(cmd) {
  maybeInit();
  instance.addCommand(cmd);
}

async function processText(input, context) {
  maybeInit();
  return await instance.processText(input, context);
}

module.exports = {
  Directo,
  Format,
  CommandResult,
  command,
  processText
};
