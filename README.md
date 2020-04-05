# directo

`directo` is a directive-processing framework for text-based storytelling RPGs.

## Building and Testing

`directo` uses `yarn`.

```bash
yarn
```

To run the tests:

```bash
yarn test
```

## Concepts

`directo` is structured as a parser for English imperative sentences. All commands must start with a `verb`. Recognized command structures are:

- `verb`
  - login
  - exit
- `verb object`
  - go north
  - buy sword
  - get lamp
- `verb preposition object`
  - sit on the log
- `verb object preposition subject`
  - give sword to steve
- `verb determiner object`
  - eat the berries _Many of these are likely the same as `verb object`, but quantifiers make a difference here._
- `verb subject determiner object`
  - give steve the sword
  - give steve a mushroom

When using `directo`, commands are declared based on the set of verbs and command structure they accept. Many command implementations will want to handle multiple structures (see the two ways one could give a sword to steve above).

## Usage

Using `directo` is as simple as registering commands and handlers:

```javascript
const { command, processText, Format, CommandResult } = require('directo');

command({
  verb: 'go',
  func: async ({ format, object }) => {
    if (format !== Format.VO) {
      console.log('Go where?');
      return CommandResult.FORMAT_ERROR;
    }

    console.log(`Okay, I went ${object}`);

    return CommandResult.HANDLED;
  }
});

(async (commands) => {
  for (const command of commands) {
    await processText(command);
  }
})([
  'go north',
  'go south',
  'go'
]);
```

Prints:

```none
Okay, I went north
Okay, I went south
Go where?
```

In the above example, one could simplify the callback by specifying the `accept` field, at the cost of custom format error handling:

```javascript
const { command, processText, Format, CommandResult } = require('directo');

command({
  verb: 'go',
  accept: [ Format.VO ],
  func: async ({ object }) => {
    console.log(`Okay, I went ${object}`);

    return CommandResult.HANDLED;
  }
});

(async (commands) => {
  for (const command of commands) {
    const result = await processText(command);
    if (result === CommandResult.FORMAT_ERROR) {
      console.log(`Did not understand '${command}'`);
    }
  }
})([
  'go north',
  'go south',
  'go',
  'go bob the mushroom'
]);
```

Prints

```none
Okay, I went north
Okay, I went south
Did not understand 'go'
Did not understand 'go bob the mushroom'
```

The `verb` may aslo be specified as an array:

```javascript
command({
  verb: ['go', 'move', 'walk'],
  accept: [ Format.VO ],
  func: async ({ format, object }) => {
    console.log(`Okay, I went ${object}`);

    return CommandResult.HANDLED;
  }
});

command({
  verb: 'run',
  func: async() => {
    console.log('Slow it down, buddy!');

    return CommandResult.HANDLED;
  }
});

(async (commands) => {
  for (const command of commands) {
    const result = await processText(command);
    if (result === CommandResult.FORMAT_ERROR) {
      console.log(`Did not understand '${command}'`);
    }
  }
})([
  'go north',
  'move west',
  'walk south',
  'run east'
]);
```

Prints

```none
Okay, I went north
Okay, I went west
Okay, I went south
Slow it down, buddy!
```

## Instanced vs Singleton Directo

The above examples use the top-level `processText` and `command` functions, which operate on an automatically-created singleton `Directo` instance. If you are so inclined, you may also instantiate and manage your own `Directo` instance:

```javascript
const { Directo, Format, CommandResult } = require('directo');

const directo = new Directo();

directo.addCommand({
  verb: 'go',
  func: async ({ format, object }) => {
    if (format !== Format.VO) {
      console.log('Go where?');
      return CommandResult.FORMAT_ERROR;
    }

    console.log(`Okay, I went ${object}`);

    return CommandResult.HANDLED;
  }
});

(async (commands) => {
  for (const command of commands) {
    await directo.processText(command);
  }
})([
  'go north',
  'go south',
  'go'
]);
```

## Process Context

Since commands are defined ahead of time, rather than being in the I/O flow of the consuming application, there is an optional `context` argument in `processTest`. Anything passed in there will also be included as the `context` field of the object passed to command `func`s.

```javascript
const { Directo, Format, CommandResult } = require('directo');

const directo = new Directo();

directo.addCommand({
  verb: 'go',
  accept: [ Format.VO ],
  func: async ({ format, object, context }) => {
    console.log(`${context.name} went ${object}`);

    return CommandResult.HANDLED;
  }
});

const gameContext = {
  name: 'Bob'
};

(async (commands) => {
  for (const command of commands) {
    await directo.processText(command, gameContext);
  }
})([
  'go west',
]);
```

Prints

```none
Bob went west
```

## Quantifying Determiners

Any command format that expects a determiner can also handle quantities. In that case, a `quantity` field will be included in the callback object.

```javascript
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
```

Prints

```none
7 bananas
```
