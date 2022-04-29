// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  paypalCurrency: 'PHP',
  paypalClientId: 'AQW1wB3h__RDiIOYHpk_1QLpcrPT5sH0GBWemRc3ycpVohV-dqzNwWtSDuvsaUcVH3Ipam9zwYlNy_nB',
  firebase: {
    projectId: 'fifi-greetings',
    appId: '1:592228815811:web:ae07898d9c86884e7d2376',
    storageBucket: 'fifi-greetings.appspot.com',
    apiKey: 'AIzaSyAXyVSWDyzk34XbS2ozI8Rs55oekR7Ox6A',
    authDomain: 'fifi-greetings.firebaseapp.com',
    messagingSenderId: '592228815811',
    measurementId: "G-BN0LKLNJY2"
  },
  imageSize: {
    small: "_74x100",
    medium: "_278x220",
    large: "_282x400"
  },
  redirect:[
    {
      host: "localhost",
      // host: "fibeimothersday.com",
      main: "/mother",
      logo: "/assets/images/logo_fibiemothersday.png",
      event: "mothers day"
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
