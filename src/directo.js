const Joi = require('joi');
const { Format, CommandResult } = require('./enums');
const { classify } = require('./parser');

const commandSchema = Joi.object({
  verb: Joi.alternatives([Joi.string(), Joi.array().items(Joi.string())]).required(),
  accept: Joi.array().items(Joi.string().valid(Object.values(Format))).min(1).optional(),
  func: Joi.func().required()
});

class Directo {
  constructor() {
    this.commands = {};
  }

  /**
   * Adds a new command to the command set.
   * Throws if the command is invalid or has a conflicting verb.
   */
  addCommand(command) {
    const { error } = Joi.validate(command, commandSchema);
    if (error) {
      throw error;
    }

    // Normalize to array for single item
    if (typeof(command.verb) === 'string') {
      command.verb = [ command.verb ];
    }

    if (Object.keys(this.commands).some(v => command.verb.includes(v))) {
      throw new Error(`Duplicate verb ${command.verb}`);
    }

    for (const verb of command.verb) {
      this.commands[verb.toLowerCase()] = command;
    }
  }

  /**
   * Asynchronously processes the input string and returns the result.
   */
  async processText(input, context) {
    const parseResult = classify(input);
    if (!parseResult.classified) {
      return CommandResult.FORMAT_ERROR;
    }

    const command = this.commands[parseResult.verb.toLowerCase()];
    if (!command) {
      return CommandResult.UNHANDLED;
    }

    if (command.accept && !command.accept.includes(parseResult.format)) {
      return CommandResult.FORMAT_ERROR;
    }

    parseResult.context = context;

    return await command.func(parseResult);
  }
}

module.exports = {
  Directo
};
