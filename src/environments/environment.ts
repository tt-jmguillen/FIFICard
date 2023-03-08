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
    /*apiKey: "AIzaSyD-M5TcXBiZel7mlv8sK9J6qdAdACQIiZE",
    authDomain: "fificard-staging.firebaseapp.com",
    databaseURL: "https://fificard-staging-default-rtdb.firebaseio.com",
    projectId: "fificard-staging",
    storageBucket: "fificard-staging.appspot.com",
    messagingSenderId: "536378676158",
    appId: "1:536378676158:web:758439956a634973215fef"*/
  },
  imageSize: {
    small: "_74x100",
    medium: "_278x220",
    large: "_282x400",
    xlarge: "_564x800"
  },
  redirect: [
    {
      // host: "localhost",
      host: "fibeimothersday.com",
      main: "/mother",
      logo: "/assets/images/logo_fibiemothersday.png",
      event: "mothers day"
    }
  ],
  imagetitles: [
    'Front',
    'Inside',
    'Outside',
    'Side by Side',
    'Back',
    'Envelope',
    'Sign & Send',
    'Stickers',
    'Other'
  ],
  us: ['us.fibeigreetings.com', 'fibeigreetings.us'],
  sg: ['sg.fibeigreetings.com', 'fibeigreetings.sg'],
  ecardexpiry: 30,
  accounts: {
    facebook: {
      ph: "https://www.facebook.com/fibeigreetings",
      sg: "https://www.facebook.com/fibeigreetings",
      us: "https://www.facebook.com/fibeigreetings"
    },
    instagram: {
      ph: "https://www.instagram.com/fibeigreetings_",
      sg: "https://www.instagram.com/fibeigreetings_",
      us: "https://www.instagram.com/fibeigreetings_usa"
    },
    twitter: {
      ph: "https://twitter.com/fibeigreetings",
      sg: "https://twitter.com/fibeigreetings",
      us: "https://twitter.com/FiBeiUsaG"
    },
    tiktok: {
      ph: "https://www.tiktok.com/@fibeigreetings",
      sg: "https://www.tiktok.com/@fibeigreetings",
      us: "https://www.tiktok.com/@fibei.greetings.usa"
    },
    youtube: {
      ph: "https://www.youtube.com/channel/UCaxLPWhwZxDCxRX3ztHvPBQ",
      sg: "https://www.youtube.com/channel/UCaxLPWhwZxDCxRX3ztHvPBQ",
      us: "https://www.youtube.com/channel/UCauzeUZQ8Ikrlyy18uU9DHQ"
    },
    pinterest: {
      ph: "https://www.pinterest.ph/FibeiGreetings/_saved",
      sg: "https://www.pinterest.ph/FibeiGreetings/_saved",
      us: "https://www.pinterest.ph/FiBeiGreetingsUSA/"
    }
  },
  fontcolors: [
    { name: "Black", hex: '#000000' },
    { name: "Red", hex: '#800000' },
    { name: "Blue", hex: '#3A9BDC' },
    { name: "White", hex: '#F8F8FF' },
    { name: "Yellow", hex: '#FDD128' },
    { name: "Violet", hex: '#6B2D98' },
    { name: "Brown", hex: '#B87333' },
    { name: "Greem", hex: '#228B22' }
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
