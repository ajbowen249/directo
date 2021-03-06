/**
 * Structure of an imperative sentence.
 */
const Format = {
  /** Verb-only command */
  V: 'V',
  /** Verb followed by an object */
  VO: 'VO',
  /** verb, preposition, object */
  VPO: 'VPO',
  /** verb, object, preposition, subject */
  VOPS: 'VOPS',
  /** verb, determiner, object */
  VDO: 'VDO',
  /** verb, subject, determiner, object */
  VSDO: 'VSDO'
};

/**
 * The outcome of processTexting a block of text.
 */
const CommandResult = {
  /** The command exists, but was not properly formatted. */
  FORMAT_ERROR: 'FORMAT_ERROR',
  /** The command was successfully handled. */
  HANDLED: 'HANDLED',
  /** Found nothing to do with the provided text. */
  UNHANDLED: 'UNHANDLED',
};

/**
 * An english preposition
 */
const Preposition = {
  ABOVE: 'ABOVE',
  ACROSS: 'ACROSS',
  AFTER: 'AFTER',
  AT: 'AT',
  AROUND: 'AROUND',
  BEFORE: 'BEFORE',
  BEHIND: 'BEHIND',
  BELOW: 'BELOW',
  BESIDE: 'BESIDE',
  BETWEEN: 'BETWEEN',
  BY: 'BY',
  DOWN: 'DOWN',
  DURING: 'DURING',
  FOR: 'FOR',
  FROM: 'FROM',
  IN: 'IN',
  INSIDE: 'INSIDE',
  ONTO: 'ONTO',
  OF: 'OF',
  OFF: 'OFF',
  ON: 'ON',
  OUT: 'OUT',
  THROUGH: 'THROUGH',
  TO: 'TO',
  UNDER: 'UNDER',
  UP: 'UP',
  WITH: 'WITH'
};

/**
 * An english determiner
 * Note: Does not include quantifiers
 */
const Determiner = {
  THE: 'THE',
  THIS: 'THIS',
  THAT: 'THAT',
  THESE: 'THESE',
  THOSE: 'THOSE',
  MY: 'MY',
  HIS: 'HIS',
  HER: 'HER',
  ITS: 'ITS',
  OUR: 'OUR',
  THEIR: 'THEIR',
  ANOTHER: 'ANOTHER'
};

const NonNumericSingulars = {
  A: 1,
  AN: 1
}

const Digits = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
};

const BaseNumbers = {
  ...NonNumericSingulars,
  ...Digits,
  TEN: 10,
  ELEVEN: 11,
  TWELVE: 12,
  THIRTEEN: 13,
  FOURTEEN: 14,
  FIFTEEN: 15,
  SIXTEEN: 16,
  SEVENTEEN: 17,
  EIGHTEEN: 18,
  NINETEEN: 19
};

const TensNumbers = {
  TWENTY: 20,
  THIRTY: 30,
  FORTY: 40,
  FIFTY: 50,
  SIXTY: 60,
  SEVENTY: 70,
  EIGHTY: 80,
  NINETY: 90
};

module.exports = {
  Format,
  CommandResult,
  Preposition,
  Determiner,
  BaseNumbers,
  Digits,
  TensNumbers
}
