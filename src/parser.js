const { Format, Preposition, Determiner, TensNumbers, Digits, BaseNumbers, OrdersOfMagnitude } = require('./enums');

const ALL_PREPOSITIONS = Object.values(Preposition);
const ALL_DETERMINERS = Object.values(Determiner);

function tokenize(text) {
  return text.split(' ').filter(x => x !== '');
}

function classify(text) {
  if (!text) {
    return {
      classified: false
    };
  }

  let tokens = tokenize(text);
  const verb = tokens[0];
  tokens = tokens.slice(1);

  if (tokens.length === 0) {
    return {
      classified: true,
      format: Format.V,
      verb
    };
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (ALL_PREPOSITIONS.includes(token.toUpperCase())) {
      if (i === 0) {
        return {
          classified: true,
          format: Format.VPO,
          verb,
          preposition: token,
          object: tokens.slice(i + 1).join(' ')
        };
      } else {
        return {
          classified: true,
          format: Format.VOPS,
          verb,
          object: tokens.slice(0, i).join(' '),
          preposition: token,
          subject: tokens.slice(i + 1).join(' ')
        };
      }
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (ALL_DETERMINERS.includes(token.toUpperCase())) {
      if (i === 0) {
        return {
          classified: true,
          format: Format.VDO,
          verb,
          determiner: token,
          object: tokens.slice(i + 1).join(' ')
        };
      } else {
        return {
          classified: true,
          format: Format.VSDO,
          verb,
          subject: tokens.slice(0, i).join(' '),
          determiner: token,
          object: tokens.slice(i + 1).join(' ')
        };
      }
    }
  }

  return {
    classified: true,
    format: Format.VO,
    verb,
    object: tokens.join(' ')
  };
}

const NumberParseState = {
  IDLE: 'IDLE', // No current number
  BASE: 'BASE', // Have a base number, awaiting magnitude or end
  MAGNITUDE: 'MAGNITUDE', // Have magnitude, awaiting base, end, or another value
};

function parseTensNumber(upperToken) {
  const parts = upperToken.split('-');
  const tens = parts[0];
  const ones = parts[1];
  let value = TensNumbers[tens];
  if (!value) {
    return undefined;
  }

  if (ones) {
    return Digits[ones] !== undefined ? value + Digits[ones] : undefined;
  }

  return value;
}

function parseSubHundred(upperToken) {
  const maybeBase = BaseNumbers[upperToken];
  if (maybeBase !== undefined) {
    return maybeBase;
  }

  return parseTensNumber(upperToken);
}

function parseMagnitude(upperToken) {
  return OrdersOfMagnitude[upperToken];
}

function normalizeNumbers(tokens) {
  let state = NumberParseState.IDLE;
  let startIndex = undefined;
  let valueStack = [];
  const ranges = [];
  const values = [];
  let accumulator = 0;

  const accumulate = () => {
    accumulator += valueStack.slice(1).reduce((a, x) => a * x, valueStack[0] || 0);
    valueStack = [];
  };

  const reset = (index) => {
    if (startIndex !== undefined) {
      ranges.push({ start: startIndex, count: (index - startIndex) + 1 });
      accumulate();
      values.push(accumulator);
    }
    accumulator = 0;
    startIndex = undefined;
    state = NumberParseState.IDLE;
  };

  for (let i = 0; i < tokens.length; i++) {
    const upperToken = tokens[i].toUpperCase();

    switch (state) {
      case NumberParseState.IDLE: {
        const maybeValue = parseSubHundred(upperToken);
        if (maybeValue !== undefined) {
          valueStack.push(maybeValue);
          startIndex = i;
          state = NumberParseState.BASE;
        } else {
          // If we were in the middle of an number, the last token was the final one.
          reset(i - 1);
        }

        break;
      }
      case NumberParseState.BASE: {
        const maybeMagnitude = parseMagnitude(upperToken);
        if (maybeMagnitude !== undefined) {
          const lastValue = valueStack[valueStack.length - 1];
          const isEnd = lastValue !== undefined && lastValue < 100;
          valueStack.push(maybeMagnitude);
          if (isEnd) {
            accumulate();
          }

          state = isEnd ? NumberParseState.IDLE : NumberParseState.MAGNITUDE;
        } else {
          accumulate();
          reset(i);
          i--; // Stay on this token in case it's a new number
        }
        break;
      }
      case NumberParseState.MAGNITUDE: {
        const maybeMagnitude = parseMagnitude(upperToken);
        if (maybeMagnitude) {
          // No state change here since there could be another magnitude ("hundred thousand", etc.)
          valueStack.push(maybeMagnitude);
          break;
        }

        const maybeValue = parseSubHundred(upperToken);
        if (maybeValue !== undefined) {
          valueStack.push(maybeValue);
          state = NumberParseState.BASE;
          break;
        }

        accumulate();
        reset(i);

        break;
      }
    }
  }

  if (startIndex !== undefined) {
    reset(tokens.length - 1);
  }

  let offset = 0;
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const value = values[i];
    offset += tokens.splice(range.start - offset, range.count, value).length;
  }

  return tokens;
}

module.exports = {
  classify,
  normalizeNumbers
};
