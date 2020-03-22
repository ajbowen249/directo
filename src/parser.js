const { Format, Preposition, Determiner } = require('./enums');

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

module.exports = {
  classify
};
