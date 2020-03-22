const { Format, CommandResult } = require('../enums');
const { Directo } = require('../directo');

function badCommand(command) {
  return () => {
    expect(() => {
      const d = new Directo();
      d.addCommand(command);
    }).toThrow();
  }
}

function goodCommand(command) {
  return () => {
    const d = new Directo();
    d.addCommand(command);
  }
}

it('rejects missing verb',     badCommand({ }));
it('rejects malformed verb',   badCommand({ verb: 1 }));
it('rejects missing func',     badCommand({ verb: 'it' }));
it('rejects malformed func',   badCommand({ verb: [ 'it' ], func: 1 }));
it('rejects malformed accept', badCommand({ verb: 'it', accept: 2, func() { } }));
it('rejects uknown accept',    badCommand({ verb: 'it', accept: [ 'uuuh, what' ], func() { } }));
it('accepts empty accept',     badCommand({ verb: ['go', 'walk' ], accept: [], func() { } }));

it('accepts single verb',      goodCommand({ verb: 'it', func() { } }));
it('accepts many verbs',       goodCommand({ verb: ['go', 'walk' ], func() { } }));
it('accepts valid format',     goodCommand({ verb: ['go', 'walk' ], accept: [ Format.V ], func() { } }));
it('accepts multiple formats', goodCommand({ verb: ['go', 'walk' ], accept: [ Format.V, Format.VO ], func() { } }));

it('rejets commands with duplicate verbs', () => {
  const d = new Directo();
  d.addCommand({ verb: ['it', 'go'], func() { } });

  expect(() => {
    d.addCommand({ verb: 'go', func() { } });
  }).toThrow();
});

it('handles basic text processing', async () => {
  const d = new Directo();
  let calledEat = false;
  let calledWalk = false;

  d.addCommand({
    verb: 'eat',
    async func() { calledEat = true; }
  });

  d.addCommand({
    verb: 'walk',
    async func() { calledWalk = true; }
  });

  await d.processText('eat something');
  expect(calledEat).toBe(true);
  expect(calledWalk).toBe(false);
});

it('respects accept', async () => {
  const d = new Directo();
  let eatCount = 0;

  d.addCommand({
    verb: 'eat',
    accept: [ Format.VO ],
    async func() { eatCount++; }
  });

  await d.processText('eat something');
  await d.processText('eat something else');
  const result = await d.processText('eat the food');

  expect(eatCount).toBe(2);
  expect(result).toBe(CommandResult.FORMAT_ERROR);
});

it('returns error for unrecognized verb', async () => {
  const d = new Directo();
  const result = await d.processText('get lamp');
  expect(result).toBe(CommandResult.UNHANDLED);
});

it('passes along context when processing', async () => {
  const d = new Directo();
  let calledFunc = false;
  let testContext = { name: 'bob', age: 12 };

  d.addCommand({
    verb: 'go',
    async func({ context }) {
      calledFunc = true;
      expect(context).toEqual(testContext);
    }
  });

  await d.processText('go', testContext);
  expect(calledFunc).toBe(true);
});
