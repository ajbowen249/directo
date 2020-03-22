const { command, processText, Format, CommandResult } = require('../src');

command({
  verb: 'go',
  accept: [ Format.VO ],
  func: async ({ object }) => {
    console.log(`Okay, I went ${object}`);

    return CommandResult.HANDLED;
  }
});

(async (commands) => {
  for (const c of commands) {
    const result = await processText(c);
    if (result === CommandResult.FORMAT_ERROR) {
      console.log(`Did not understand '${c}'`);
    }
  }
})([
  'go north',
  'go south',
  'go',
  'go bob the mushroom'
]);
