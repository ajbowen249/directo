const { Format } = require('../enums');
const { classify, tryParseNumber } = require('../parser');

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
      quantity: 1
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
      quantity: 1
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
      quantity: 1
    },
  },
  {
    description: 'picks up on articles as quantifying determiners',
    input: 'give fred a hug',
    expected: {
      classified: true,
      format: Format.VSDO,
      verb: 'give',
      subject: 'fred',
      determiner: 'a',
      quantity: 1,
      object: 'hug',
    },
  },
  {
    description: 'picks up on numbers as quantifying determiners',
    input: 'give fred seventy-five hugs',
    expected: {
      classified: true,
      format: Format.VSDO,
      verb: 'give',
      subject: 'fred',
      determiner: 'seventy-five',
      quantity: 75,
      object: 'hugs',
    },
  },
  {
    description: 'picks up on numerals as quantifying determiners',
    input: 'give fred 10,975.2 hugs',
    expected: {
      classified: true,
      format: Format.VSDO,
      verb: 'give',
      subject: 'fred',
      determiner: '10,975.2',
      quantity: 10975.2,
      object: 'hugs',
    },
  }
].forEach(testCase => {
  it(testCase.description, () => {
    expect(classify(testCase.input)).toEqual(testCase.expected);
  });
});

[
  {
    input: '1',
    expected: 1
  },
  {
    input: 'two',
    expected: 2
  },
  {
    input: 'three',
    expected: 3
  },
  {
    input: 'fifty-five',
    expected: 55
  },
  {
    input: 'ninety-four',
    expected: 94
  },
  {
    input: '1,237,564.25',
    expected: 1237564.25
  },
  {
    input: 'flarbendugal',
    expected: undefined
  }
].forEach(testCase => {
  it('parses numbers or returns undefined', () => {
    expect(tryParseNumber(testCase.input)).toEqual(testCase.expected);
  });
});
