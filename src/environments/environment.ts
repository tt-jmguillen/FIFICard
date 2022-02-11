// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'fificard-staging',
    appId: '1:536378676158:web:758439956a634973215fef',
    databaseURL: 'https://fificard-staging-default-rtdb.firebaseio.com',
    storageBucket: 'fificard-staging.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyD-M5TcXBiZel7mlv8sK9J6qdAdACQIiZE',
    authDomain: 'fificard-staging.firebaseapp.com',
    messagingSenderId: '536378676158',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
