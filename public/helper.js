/**
 * Parse a list of CLI arguments searching for a target argument.
 * @param {string} target  The target argument we're searching for.
 * @return {string|undefined} The target argument's value, or undefined.
 */
module.exports.parseCliArg = function(target) {
  let regex = new RegExp('--' + target);
  let value;
  process.argv.filter(a => {
    if (regex.test(a)) {
      let split = a.split('=');
      if (split.length > 1) {
        value = split[1];
      }
    }
  });
  return value;
};
