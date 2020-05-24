// NODE PACKAGES
const Redis = require('ioredis');

// LOCAL FUNCTIONS
const logger = require('../utils/logger');
const getWorldometerPage = require('../scrapers/getWorldometers');
const getStates = require('../scrapers/getStates');
const jhuLocations = require('../scrapers/jhuLocations');
const historical = require('../scrapers/historical');

// KEYS
const { config, keys, port } = require('../config');

const redis = new Redis({
	host: "covid-stats.0hhjj2.0001.use1.cache.amazonaws.com",
	port: 6379
});

module.exports = {
	redis,
	port,
	keys,
	config,
	scraper: {
		getWorldometerPage,
		getStates,
		jhuLocations,
		historical,
		executeScraper: async () => {
			await Promise.all([
				getWorldometerPage(keys, redis),
				jhuLocations.jhudataV2(keys, redis),
				historical.historicalV2(keys, redis),
			]);
			logger.info('Finished scraping!');
		},
	}
};
