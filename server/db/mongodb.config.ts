import * as mongoose from 'mongoose';

/**
 * Connects to mongodb with the given options
 * @param {mongoose.ConnectionOptions} connectionOptions
 * @param {string} mongoURI
 */
const configMongoDB = (mongoURI: string, connectionOptions: mongoose.ConnectionOptions) => {
  mongoose.connect(mongoURI, connectionOptions).then(
    () => {
      // eslint-disable-next-line no-console
      console.log('connected to MongoDB');
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  );
};

export default configMongoDB;
