export const environment = {
  production: true,
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
    large: "_282x400",
    xlarge: "_564x800"
  },
  redirect: [
    {
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
  us:['us.fibeigreetings.com', 'fibeigreetings.us'],
  sg:['sg.fibeigreetings.com', 'fibeigreetings.sg'],
  ecardexpiry: 30
};
