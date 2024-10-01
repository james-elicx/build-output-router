const { createFunction } = require('./create-entrypoint.cjs');

module.exports = createFunction('/dynamic/[pageId]');
