const { command, processText, Format, CommandResult } = require('../src');

command({
  verb: 'add',
  accept: [ Format.VDO ],
  func: async ({ context, quantity }) => {
    context.total += quantity;
  }
});

command({
  verb: 'subtract',
  accept: [ Format.VDO ],
  func: async ({ context, quantity }) => {
    context.total -= quantity;
  }
});

command({
  verb: 'print',
  func: async ({ context }) => {
    console.log(`${context.total} bananas`)
  }
});

const context = { total: 0 };

(async (commands) => {
  for (const command of commands) {
    const result = await processText(command, context);
    if (result === CommandResult.FORMAT_ERROR) {
      console.log(`Did not understand '${c}'`);
    }
  }
})([
  'add 5 bananas',
  'subtract 2 bananas',
  'add 4 bananas',
  'print',
]);
