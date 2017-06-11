const path = require('path');
require('dotenv-safe').load({
  sample: path.join(__dirname, '../../.env.sample')
});

const logger = require('../lib/logger');

const port = process.env.PORT || 3000;

logger.info('Starting server...');
require('../../server/main').listen(port, () => {
  logger.success(`Server is running at port ${port}`);
});
