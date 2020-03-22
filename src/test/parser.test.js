const { Format } = require('../enums');
const { classify } = require('../parser');

[
  {
    description: 'rejects empty string',
    input: '',
    expected: {
      classified: false
    }
  },
  {
    description: 'rejects null string',
    input: null,
    expected: {
      classified: false
    }
  },
  {
    description: 'rejects undefined string',
    input: undefined,
    expected: {
      classified: false
    }
  },
  {
    description: 'parses basic V',
    input: 'do',
    expected: {
      classified: true,
      format: Format.V,
      verb: 'do'
    }
  },
  {
    description: 'parses basic VO',
    input: 'go north',
    expected: {
      classified: true,
      format: Format.VO,
      verb: 'go',
      object: 'north'
    }
  },
  {
    description: 'parses basic VPO',
    input: 'put on hat',
    expected: {
      classified: true,
      format: Format.VPO,
      verb: 'put',
      preposition: 'on',
      object: 'hat'
    }
  },
  {
    // We may one day want a VPDO format, but this documents
    // how the parser behaves for now.
    description: 'parses trickier VPO',
    input: 'put on the hat',
    expected: {
      classified: true,
      format: Format.VPO,
      verb: 'put',
      preposition: 'on',
      object: 'the hat'
    }
  },
  {
    description: 'parses basic VOPS',
    input: 'give sword to steve',
    expected: {
      classified: true,
      format: Format.VOPS,
      verb: 'give',
      object: 'sword',
      preposition: 'to',
      subject: 'steve'
    },
  },
  {
    // May eventually want a VDOPS format for quantifiers
    description: 'parses trickier VOPS',
    input: 'give the sword to steve',
    expected: {
      classified: true,
      format: Format.VOPS,
      verb: 'give',
      object: 'the sword',
      preposition: 'to',
      subject: 'steve'
    },
  },
  {
    description: 'parses basic VDO',
    input: 'eat the cake',
    expected: {
      classified: true,
      format: Format.VDO,
      verb: 'eat',
      determiner: 'the',
      object: 'cake',
    },
  },
  {
    description: 'parses basic VSDO',
    input: 'give steve the cookie',
    expected: {
      classified: true,
      format: Format.VSDO,
      verb: 'give',
      subject: 'steve',
      determiner: 'the',
      object: 'cookie',
    },
  },
  {
    description: 'parses trickier VSDO',
    input: 'give fair lady stevie my undying devotion',
    expected: {
      classified: true,
      format: Format.VSDO,
      verb: 'give',
      subject: 'fair lady stevie',
      determiner: 'my',
      object: 'undying devotion',
    },
  }
].forEach(testCase => {
  it(testCase.description, () => {
    expect(classify(testCase.input)).toEqual(testCase.expected);
  });
});
