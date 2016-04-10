'use strict';
const harmony = require('harmonyhubjs-client');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://master:B00195590@ds019980.mlab.com:19980/heroku_cbmx7645';
const ip = '192.168.0.18';

const findTorrents = (db, callback) => {
  const cursor = db.collection('torrents').find();
  console.log('pinggggg');
  cursor.each((err, doc) => {
    if (doc != null) {
      clearInterval(dbPoll);
      harmony(ip).then(harmonyClient => {
        harmonyClient.isOff().then(off => {
          harmonyClient.getActivities().then(activities => {
            activities.some(activity => {
              if (activity.label.toLowerCase() === 'chromecast') {
                const id = activity.id;
                harmonyClient.startActivity(id);
                harmonyClient.end();
                console.log('Turning TV on');

                // wait for the tv/chromecast to turn on
                // before cating the torrent
                setTimeout(() => {
                  const peercast = require('peercast');
                  let engine = peercast(doc.torrent);

                  console.log('starting peercast');
                  engine.on('chromecast-status', status => {
                    console.log('chromecast status: %s', status.playerState);
                  });

                  engine.on('chromecast-playing', file => {
                    console.log('chromcast is playing %s', file.name);
                  });
                }, 30 * 1000);

                return true;
              }
              return false;
            });
          });
        });
      });
    }
  });

  db.collection('torrents').deleteMany({}, callback);
};

const dbPoll = setInterval(() => {
  MongoClient.connect(url, (err, db) => {
    findTorrents(db, () => {
      db.close();
      console.log('closing db connection...');
    });
  });
}, 5 * 1000);