import harmony from 'harmonyhubjs-client';
import { harmonyConfig } from 'config';

export default function tvPowerOn (cb) {
  const { ip, device } = harmonyConfig;

  harmony(ip).then(harmonyClient => {
    harmonyClient.isOff().then(() => {
      harmonyClient.getActivities().then(activities => {
        activities.some(activity => {
          if (activity.label.toLowerCase() === device) {
            const { id } = activity;
            harmonyClient.startActivity(id);
            harmonyClient.end();
            cb();
            return true;
          }
          return false;
        });
      });
    });
  });
};