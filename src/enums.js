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
  Preposition,
  Determiner
}
