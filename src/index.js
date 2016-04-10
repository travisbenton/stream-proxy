import { MongoClient } from 'mongodb';
import { tvPowerOn } from './helpers/harmonyHub';
import { databaseConfig } from './helpers/config';

const getTorrentHash = (db, cb) => {
  const cursor = db.collection('torrents').find();
  cursor.each((err, doc) => {
    if (doc != null) {
      clearInterval(dbPoll);

      // wait 30 seconds for the tv/chromecast
      // to turn on before casting the torrent
      tvPowerOn(setTimeout(() => {
        const peercast = require('peercast');
        peercast(doc.torrent);
      }, 30 * 1000));
    }
  });

  // we got what we need so clear out database... kinda hacky
  db.collection('torrents').deleteMany({}, cb);
};

const dbPoll = setInterval(() => {
  const { url } = databaseConfig;
  MongoClient.connect(url, (err, db) => {
    getTorrentHash(db, () => {
      db.close();
      console.log('closing db connection...');
    });
  });
}, 5 * 1000);