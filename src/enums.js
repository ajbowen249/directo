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

module.exports = {
  Format,
  CommandResult,
  Preposition,
  Determiner
}
