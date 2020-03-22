const { command, processText, Format, CommandResult } = require('../src');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const grid = [
  [ 'Lush Forest', 'Tropical Beach' ],
  [ 'Chilly Tundra', 'Dry Desert' ],
];

let row = 0;
let col = 0;
let shouldQuit = false;

command({
  verb: 'go',
  accept: [ Format.VO ],
  func: async ({ object }) => {

    switch(object) {
      case 'north':
        row--;
        break;
      case 'south':
        row++;
        break;
      case 'east':
        col++;
        break;
      case 'west':
        col--;
        break;
      default:
        console.log(`Cannot go ${object}`);
        return CommandResult.FORMAT_ERROR;
    }

    if (row < 0) {
      row = 0;
    } else if (row > 1) {
      row = 1;
    }

    if (col < 0) {
      col = 0;
    } else if (col > 1) {
      col = 1;
    }

    console.log(`(${col}, ${row})`);

    return CommandResult.HANDLED;
  }
});

command({
  verb: 'look',
  accept: [ Format.V ],
  func: async () => {
    console.log(grid[row][col]);
    return CommandResult.HANDLED;
  }
});

command({
  verb: 'quit',
  accept: [ Format.V ],
  func: async () => {
    console.log('Goodbye...');
    shouldQuit = true;
    return CommandResult.HANDLED;
  }
});

async function getCommand() {
  return new Promise(resolve => {
    rl.question('> ', cmd => {
      resolve(cmd);
    });
  });
}

async function main() {
  while (!shouldQuit) {
    const command = await getCommand();
    let result = await processText(command);
    if (result === CommandResult.FORMAT_ERROR) {
      console.log('Come again?');
    }
  }
}

main();
