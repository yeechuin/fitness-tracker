// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // optional: override/add rules
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'style', 'refactor']],
    'subject-case': [0] // allow any case
  },
};