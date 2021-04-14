/**
 * Configuration for Mongo Database.
 */
const mongoConfig = {
    // The URL to connect to
    url: `mongodb://localhost:27017/`,

    // The DB name (This and the URL is combined when connecting to the DB)
    dbName: `peter`,

    // Models for DB entries
    models: {}
};

module.exports = mongoConfig;
