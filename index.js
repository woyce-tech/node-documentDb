/* eslint-disable no-console */
const { MongoClient } = require('mongodb');
const aws = require('aws-sdk');
const path = require('path');

aws.config.update({ region: 'us-east-1' });

// eslint-disable-next-line
const { config } = require('/tmp/config');
const { docDB } = config;

const {
  username, password, host, port,
} = docDB;
let cachedDb = null;
const uri = `mongodb://${username}:${password}@${host}:${port}/logger?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

exports.connectToDatabase = async () => {
  try {
    // console.log('connectToDatabase');
    if (cachedDb) {
      // console.log('cachedDB');
      return Promise.resolve(cachedDb);
    }
    const db = await MongoClient.connect(
      uri,
      {
        useNewUrlParser: true,
        tlsCAFile: path.join(`${__dirname}/rds-combined-ca-bundle.pem`),
      },
    );
    // console.log('db');
    cachedDb = db;
    return cachedDb;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('connectToDatabase', error.message);
    return {
      status: false,
    };
  }
};

exports.calldocDB = async (sendData) => {
  try {
    // connect to MongoDB with certificate
    const client = await this.connectToDatabase();
    // Specify the database and collection to be used
    const db = client.db('hws');
    const col = db.collection('patient');

    // insert a new document to MongoDB
    const doc = await col.insertOne(sendData);
    console.log(doc);
    return {
      statusCode: 200,
      body: JSON.stringify(doc),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('callDocDB', error.message);
    return {
      status: false,
    };
  }
};

this.connectToDatabase();
