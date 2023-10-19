export const environment = {
  production: true,
  paypalCurrency: 'PHP',
  paypalClientId: 'AQW1wB3h__RDiIOYHpk_1QLpcrPT5sH0GBWemRc3ycpVohV-dqzNwWtSDuvsaUcVH3Ipam9zwYlNy_nB',
  stripe: {
    enable: true,
    publishKey: "pk_live_51O0OjMJ9Lk6Ni3t7gFC52OLkrXRVtzJnXnxNoIS9A9cld4N1yceb9HQaENZ5V5XZfr0l6RWU8EzqvOzoRyfj31Nk00ZInUVWbD",
    secretKey: "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"
  },
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
  fontstyles: [
    'Open Sans',
    'Dancing Script',
    'Pacifico',
    'Satisfy',
    'Cookie',
    'Great Vibes',
    'Lora',
    'Lobster',
    'Playball',
    'Courgette',
    'Smooch',
    'Zen Loop'
  ],
  fontcolors: [
    { name: "Black", hex: '#000000' },
    { name: "Red", hex: '#800000' },
    { name: "Blue", hex: '#3A9BDC' },
    { name: "White", hex: '#F8F8FF' },
    { name: "Yellow", hex: '#FDD128' },
    { name: "Violet", hex: '#6B2D98' },
    { name: "Brown", hex: '#B87333' },
    { name: "Green", hex: '#228B22' }
  ],
  priority: [
    { event: '7TrEt1o2415ST4CU7sy7', card: '4Y629bmwcSB6oFFB0s4U' },
    { event: 'SvyQh2evMD1uynJuTTmy', card: 'OB2vvCqQeRLVfInCafwv' },
    { event: '6WApjHneFW5YfQqIfwOK', card: '0eSVyVxMubdGhYJmKLPR' },
    { event: 'rI1NlE173U4xC44FQP2r', card: 'sc8LgcCEfBxlYY7u2Xqz' },
    { event: '8jYjtXXZoMrWoutZ56Zs', card: '5FkGnUnSv4AG9Eu2XvWG' },
    { event: '0QhZNSO2SCxXZ0PrKDPJ', card: 'yZdY0OSLpFF2gCaKeoqH' },
    { event: 'lYiDdkVvcLv4WZJaneNp', card: 'GIuNhtkf1yKXvF1AZrHy' },
    { event: 'MSiojG3mnfhUjmABtOpi', card: 'HnwCoB491CylLBYCcuUe' },
    { event: '0tM308NlH3Zysz2JLrNy', card: 'mGLYGWgqOXeqmUOUG2lH' },
    { event: 'XXGdSQyCyMgjx0Hakb2m', card: 'iIYYSV5K1yDB8j25rzWj' },
    { event: '5ziBKS6yER984w3QdBKh', card: 'iiCZW8SZMctd9lChn31C' },
    { event: 'vFPqiP4gbWhBhrvB5HAK', card: '8o0MNFrcD5cZO4VpS2LZ' },
    { event: 'GpEFFlZ7Xd1HosppgxzY', card: 'qdqLxViHHEUqjwLFTCl0' },
    { event: 'HktKZClaI25NCnQIjAXC', card: 'pn0FAMTzBbopPfW6iwJy' },
    { event: 'B7yrB7WiX6Dc2lOrefI0', card: 'oHRU9yVQU7Nmktn1zmaz' },
    { event: 'SwwNxVeFrP1ZHxc76tRo', card: 'ekDkG2S1pQlGBdXOe1cp' },
    { event: '9D9YwaPvdZ4Z2BXVQaLp', card: 'IAVSEyQStbToLL7FKT7V' },
    { event: 'dGiyJX4go7yPhCJNJN4P', card: '4PDLMRKROJkfmmSFxUyP' },
    { event: 'DUHk8xz6Sa7lJA9pbEQ3', card: 'pnlpPhBHxr04NO6SgRVw' },
    { event: 'aRQdu4FYb4rASkDhbQmZ', card: 'EnoWksUZYlR0qUkxtdjU' },

    { event: '47qhCYFX0OOR71ENWYDw', card: 'w0dRyUWHGXK5KCopEHGb' },
    { event: '6z7FwXhnt618XQpljB05', card: '80iKqbBLeBbMPZZHvX0G' },
    { event: '7c94a58hO6xFnWucMOqs', card: 'ooYCLTmcHg8PzxyjgMrb' },
    { event: '8IeqvJXofLhogVkJB9Xv', card: 'gV2uldWjk6lvqICNDd40' },
    { event: 'D9fyADaHkepvLgSWB5wq', card: 'bH2VD96VWBHQi2lcbUI7' },
    { event: 'TFmv3mJDSgtZ6Eah9WIL', card: '5tqOp5JJsULoyGhRTpk1' },
    { event: 'Y5OaiBXB5fXRDsUIJdJv', card: 'oyvpmlE7mEpkSb8IX1GA' },
    { event: 'acovCiVbPH987uZ2Snvi', card: 'xJ8MbiE2J8GMXvy7ktkR' },
    { event: 'dpPByqR6ut6gGgGGqIUr', card: '1xpBhFLbwqfdVWhaauqt' },
    { event: 'n2WyxfcRJ7eaERZmrBRN', card: 'YW4ZOlJN2OMGd6TTFE1q' },
    { event: 'nktZNIK2MOEEMhWtqovK', card: '8ll3Q0gsyhvXVJ3NVGXQ' },
    { event: 'zFjI8UkNyrqhkQe8cUif', card: 'ijzCYZ0eE80GhtDtTAfi' }
  ]
};
