import type { DeepPartial } from '../merge'
import type { SiteConfig } from '../../config/store'

/**
 * 英文覆盖层。
 *
 * 只写「和中文不一样」的部分 —— 没写的自动回落到中文主库。
 * 翻译完新内容后，只要保证 id 和中文一致（p1、hl2、i1…），
 * 顺序怎么排都不影响页面。
 *
 * 带 {xxx} 的是占位符，必须原样保留：
 *   {name} {age} {distance} {n}
 */
export const en: DeepPartial<SiteConfig> = {
  brand: {
    name: 'Nightyle',
    tagline: 'Videos Nearby',
    docTitle: 'Nightyle · The ones still awake, within 3km',
    docDescription:
      'A late-night, same-city feed that only opens after dark. Real moments within three kilometres — no friend requests, swipe and you see them. Anonymous faces, AI voice changer, messages that vanish. 18+ only.',
    copyright: 'All rights reserved',
  },

  buttons: {
    headerCta: 'Free download',
    heroCta: 'Take a look',
    heroSecondary: 'See who is around',
    phoneEndTitle: 'That is the end of the preview',
    phoneEndBody:
      'Download the app to unlock the full feed, plus live updates within 3km of you.',
    phoneEndCta: 'Free download',
    dockCta: 'Download',
    installCta: 'Download for free',
    modalCancel: 'Cancel',
    modalConfirm: 'Got it, start download',
  },

  nav: [
    { id: 'n1', label: 'Videos' },
    { id: 'n2', label: 'Nearby' },
    { id: 'n3', label: 'Chat' },
    { id: 'n4', label: 'Download' },
  ],

  hero: {
    statusPre: 'At',
    statusMid: 'there are still',
    statusCount: '1,284',
    statusPost: 'people near you awake',
    trusted: ['Within 3km · No cross-city', 'Anonymous or voiced-over'],
    note: 'What you tried above is the real interface — just scroll. We have no idea how far you will go.',
    tabs: ['Nearby', 'Following', 'For you'],
    swipeHint: 'Swipe to switch',
    badge18: '18+',
  },

  heroSlides: [
    {
      id: 'h1',
      kicker: '18+ · Right now · Within 3km',
      title: 'Her light is still on, 480 metres away.',
      sub: 'No friend request, no awkward hello. Swipe up and you see what she is wearing tonight.',
    },
    {
      id: 'h2',
      kicker: '18+ · Online only at night',
      title: 'At 1am, someone wants sleep less than you do.',
      sub: 'These people never show up in daytime recommendations. They appear at night — and vanish with it.',
    },
  ],

  highlightsCopy: {
    eyebrow: 'Why install it',
    title: 'You probably came here',
    titleHighlight: 'for one of these',
    titleTail: '.',
    sub: 'These five are the features people actually use — not marketing copy.',
    featured: {
      badge: 'Privacy first',
      points: [
        'Switch your voice to male, female, child, or fully custom',
        'Applies live while recording or on a voice call',
        'Stay off camera and still appear — only the motion shows',
      ],
      meterTitle: 'Voice changer',
      meterStatus: 'Active',
      meterOptions: ['Low', 'Neutral', 'High'],
    },
  },

  highlights: [
    {
      id: 'hl1',
      title: 'Completely free',
      body: 'No cost to download or install. Watching, chatting and posting have no paywall at all.',
    },
    {
      id: 'hl2',
      title: 'Easy on data',
      body: 'Caches nearby clips on Wi-Fi, so you can still scroll a dozen on mobile data outdoors.',
    },
    {
      id: 'hl3',
      title: 'See people nearby',
      body: 'Sorted by real distance. The closest one might be three hundred metres away — swipe and say hi.',
    },
    {
      id: 'hl4',
      title: 'Vanish after reading',
      body: 'Photos and voice notes in private chat are destroyed once viewed. They stay on no one’s phone.',
    },
    {
      id: 'hl5',
      title: 'Built-in AI voice changer',
      body: 'Turn your voice into something no one recognises in one tap — while recording or on a call. Show your face or hide it.',
    },
  ],

  nearbyCopy: {
    eyebrow: 'Sorted by distance, not popularity',
    title: 'Right now, within three kilometres.',
    sub: 'Not what the algorithm picked for you. By distance, nearest first, one after another.',
    liveNote: '4 people online · updating',
    footnote: 'Names and distances are blurred. Exact location only shows inside the app',
    onlineLabel: 'Online',
    recentLabel: 'Just now',
    blurTitle: 'Avatars are blurred',
    blurBody: 'Download the app to see what she looks like',
    blurCta: 'Download to unlock',
  },

  people: [
    {
      id: 'p1',
      name: 'Rahaf',
      now: 'Just out of the shower, hair still wet',
      quote: 'No work tomorrow, so I am not sleepy yet.',
      tags: ['Same block', 'Online'],
    },
    {
      id: 'p2',
      name: 'Lama',
      now: 'On the balcony, smoking with the lights off',
      quote: 'The cat downstairs is meowing again. Coming down to see it?',
      tags: ['Second floor', 'Still up'],
    },
    {
      id: 'p3',
      name: 'Dana',
      now: 'Lying down, only the bedside lamp on',
      quote: 'My voice is low, you might think I am someone else.',
      tags: ['Voice altered', '3 min ago'],
    },
    {
      id: 'p4',
      name: 'Noor',
      now: 'Just back from work, makeup still on',
      quote: 'Long day, but I do not want to sleep. Sit with me a while.',
      tags: ['Same city', 'Online'],
    },
  ],

  howCopy: {
    eyebrow: 'Three minutes to start',
    title: 'Open it, swipe once, say a word.',
    sub: 'No complicated sign-up. Verify your number and you are watching.',
    uploadTitle: 'You can post too',
    uploadBody:
      'Shoot and post. Choose “nearby only” if you like. Thirty seconds to finish — no editing skills needed.',
    uploadLink: 'See how to post',
  },

  steps: [
    {
      id: 's1',
      title: 'See what is nearby',
      body: 'Open it and the feed is live video within 3km, nearer first. No following, no friend requests.',
    },
    {
      id: 's2',
      title: 'Say hi in private',
      body: 'Tap an avatar to message. Text, voice, photos — all fine. Stop whenever you want.',
    },
    {
      id: 's3',
      title: 'Gone once seen',
      body: 'Photos and voice notes are destroyed after viewing. Want to keep one? Screenshot fast.',
    },
  ],

  chatCopy: {
    eyebrow: 'A 01:24 private chat',
    title: 'Some things you can only say before she gets sleepy.',
    sub: 'This is what a real private chat looks like. It vanishes, so screenshot fast.',
    features: [
      {
        title: 'Vanish after reading',
        body: 'Photos and voice notes start a countdown the moment they open — gone in five seconds.',
      },
      {
        title: 'Screenshots get noticed',
        body: 'She knows instantly if you took one. So be quick — and own it.',
      },
    ],
    burnBadge: 'Burn after reading',
    inputPlaceholder: 'Say something…',
    sendLabel: 'Send',
    endNote: 'The rest is not on the web',
  },

  chat: [
    {
      id: 'c1',
      name: 'Rahaf',
      meta: '320 m · yesterday 01:24',
      lines: [
        { id: 'l1', text: 'You are up too?' },
        { id: 'l2', text: 'Saw you were still online' },
        { id: 'l3', text: 'Just showered, my hair is still wet' },
        { id: 'l4', text: 'Send you one?' },
        { id: 'l5', text: 'Go ahead' },
        { id: 'l6', text: 'Photo opened · gone in 5s' },
        { id: 'l7', text: 'Did you see it?' },
        { id: 'l8', text: '…say something' },
      ],
    },
  ],

  installCopy: {
    eyebrow: 'Download and install',
    title: 'Three steps, ',
    titleHighlight: 'under a minute.',
    sub: 'The app is not on any app store, so your phone will warn about “unknown sources”. That is Android blocking every sideload by default — not a sign the file is bad.',
    permissionsTitle: 'Only these three permissions',
    permissions: [
      { name: 'Camera', why: 'Shoot and upload video' },
      { name: 'Microphone', why: 'Recording, voice chat, AI voice' },
      { name: 'Location', why: 'Distance and nearby feed' },
    ],
    permissionsNote:
      'Contacts, SMS and call logs — never requested. Location can be turned off any time in settings.',
    safetyEyebrow: 'Safety',
    apkTitle: 'Package details',
    apkLink: 'Direct link (backup)',
    warningPrefix: 'If your phone blocks “install unknown apps”, open',
    warningStrong: 'Settings → Security → Install unknown apps',
    warningSuffix:
      ', allow it for the browser you are using, then come back and tap download again.',
    faqTitle: 'A few more questions',
    faqHint: 'Tap to see the answer',
    ctaTitle: 'All clear? Give it a try',
    ctaSub: 'Once installed, open it and you will see the clip nearest to you right now.',
    footLegal: 'Terms',
    footPrivacy: 'Privacy',
    footRules: 'Guidelines',
  },

  installSteps: [
    {
      id: 'i1',
      title: 'Tap download and wait for the APK',
      body: 'About 45 MB — roughly ten seconds on Wi-Fi. Do not leave the page while it downloads.',
    },
    {
      id: 'i2',
      title: 'Allow installing from “unknown sources”',
      body: 'The app is not on Google Play, so your phone will warn you. That is normal — tap Allow.',
    },
    {
      id: 'i3',
      title: 'Open the file, done',
      body: 'Open it right after installing and allow camera and location, or nearby content will not appear.',
    },
  ],

  safety: [
    {
      id: 'sf1',
      title: 'Signature checked',
      body: 'Every package is signed and verified at install time. Tampered builds simply will not install.',
    },
    {
      id: 'sf2',
      title: 'No extra permissions',
      body: 'Only camera, microphone and location. Contacts, SMS and call logs are never touched.',
    },
    {
      id: 'sf3',
      title: 'No charges, no auto-renewal',
      body: 'Core features are free. No hidden subscription, and nothing is ever charged to your account.',
    },
  ],

  faqs: [
    {
      id: 'f1',
      q: 'It will not open or it crashes after installing?',
      a: 'Check that you are on Android 8.0 or newer. If an older build is installed, uninstall it first and reinstall; some devices need one restart.',
    },
    {
      id: 'f2',
      q: 'Why the “unknown sources” warning — is it safe?',
      a: 'Because it is not distributed through an app store, Android blocks non-store packages by default. That is standard for any sideloaded app and does not mean the file is bad.',
    },
    {
      id: 'f3',
      q: 'Will it charge me or auto-renew?',
      a: 'No. Download and core features are free. There is no payment entry anywhere on this page and no payment method is linked.',
    },
    {
      id: 'f4',
      q: 'Does it work on iPhone?',
      a: 'Android only for now. The iOS build is still in review, so bookmark this page.',
    },
    {
      id: 'f5',
      q: 'Is my location stored?',
      a: 'Location is used only to compute distance and rank nearby content. Exact coordinates are never shown to other users and never sold.',
    },
  ],

  modalCopy: {
    title: 'Ready to download',
    sub: 'Install safely on your Android phone in three steps',
    signTitle: 'Signature verified',
    signBody:
      'The package is digitally signed and the system verifies it during install. A tampered build will not install.',
    scanTitle: 'Verify it yourself',
    scanBody: 'Scan the downloaded file with any antivirus app — the result is yours to check.',
    unknownTitle: 'Why “unknown sources”?',
    unknownBody:
      'Because this app is not on an app store. Android shows this for every non-store package; it is standard system behaviour, not a problem with the file. Tap Allow to continue.',
    fixesTitle: 'Stuck while installing?',
    fixes: [
      {
        q: 'Download does nothing?',
        a: 'Some browsers block APKs. Open this page again in Chrome or your system browser and tap once more.',
      },
      {
        q: 'Cannot find the icon after installing?',
        a: 'Some launchers put new apps in an “Uncategorised” folder. Pull down on the home screen and search the app name.',
      },
      {
        q: 'It says “package parse error”?',
        a: 'Usually an interrupted download left the file incomplete. Delete it and download again.',
      },
    ],
    legal: 'By continuing you agree to the Terms and Privacy Policy · 18+ only',
  },

  gates: {
    default: {
      title: 'The rest only exists in the app',
      sub: 'Some footage does not belong on the open web. Install it and keep scrolling from here.',
      cta: 'Install and keep watching',
    },
    like: {
      title: 'Let her know you tapped',
      sub: 'She will see who did. But only once she has the app too.',
      cta: 'Download to like this',
    },
    comment: {
      title: 'Comments live inside the app',
      sub: 'There are over 2,800 unfinished sentences under this one.',
      cta: 'Download to read them',
    },
    save: {
      title: 'Save it for later',
      sub: 'You still have time before she deletes it. Saving only works in the app.',
      cta: 'Download to save',
    },
    share: {
      title: 'Send it to the other one awake',
      sub: 'Do not watch alone. Links like this only live for two hours here.',
      cta: 'Download to share',
    },
  },

  footer: {
    about:
      'A short-video community that puts “nearby” first. See what is happening around you — and let them see you.',
    groups: [
      {
        id: 'g1',
        title: 'Learn',
        items: [
          { id: 'g1a', label: 'Highlights' },
          { id: 'g1b', label: 'How it works' },
          { id: 'g1c', label: 'Install' },
        ],
      },
      {
        id: 'g2',
        title: 'Support',
        items: [
          { id: 'g2a', label: 'FAQ' },
          { id: 'g2b', label: 'Feedback' },
          { id: 'g2c', label: 'Report content' },
        ],
      },
    ],
    dockNote: 'Nearby video · Always free',
  },

  videos: [
    {
      id: 'v1',
      name: 'Rahaf',
      caption: '1am on Abdoun street. The breeze is softer than daytime.',
      tags: ['#AmmanAtNight', '#CityLights'],
      music: 'Original · Rahaf',
      postedAt: '12 min ago',
      badge: 'Closest to you',
    },
    {
      id: 'v2',
      name: 'Zaid',
      caption: 'Day 41 at the gym. My body beats the alarm.',
      tags: ['#Streak', '#Training'],
      music: 'Push It · Gym Mix',
      postedAt: '1 hour ago',
      badge: '',
    },
    {
      id: 'v3',
      name: 'Lama',
      caption: 'Rooftop in Jubeiha, a glass of tea and nothing on my mind.',
      tags: ['#QuietNight', '#Rooftop'],
      music: 'Amman Nights · Indie',
      postedAt: '28 min ago',
      badge: '',
    },
    {
      id: 'v4',
      name: 'Dana',
      caption: '7th Circle is empty, and the night hits different.',
      tags: ['#Amman', '#NightDrive'],
      music: 'Neon Drive · Synthwave',
      postedAt: '2 hours ago',
      badge: 'Trending',
    },
  ],

  ui: {
    skipToContent: 'Skip to main content',
    close: 'Close',
    closeDialog: 'Close dialog',

    appIconAlt: '{name} app icon',
    appIconPlaceholder: 'App icon placeholder',
    appNamePlaceholder: 'App name',
    appNamePlaceholderHint: 'Set the app name under “Brand” in the console',
    localeSwitchAria: 'Language: {label}',
    localeMenuAria: 'Choose a language',

    backToTop: 'Back to top',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',

    slideDot: 'Go to slide {n}',

    feedRegionAria: 'Short video preview, swipe up and down',
    previewLabel: 'Real interface preview',
    previewDistance: '{distance} away',
    previewQualityNote: 'Web version is compressed to save data · The app plays the original',
    videoLoading: 'Video is loading',
    videoLoadingHint: 'The web version takes a moment — the app starts instantly',
    videoLoadingSlow: 'Slow connection, still loading…',
    emptyFeedTitle: 'No videos yet',
    emptyFeedBody: 'Open the “Videos” tab in the console and add your first video link',
    videoMissingSrc: 'No video link set',
    videoBrokenTitle: 'This clip failed to load',
    videoBrokenBody:
      'The link may be dead (404), or it is not a direct .mp4 file. Replace it in the Videos tab.',
    unmute: 'Unmute',
    mute: 'Mute',
    likeAria: 'Like — requires the app',
    commentAria: 'Comment — requires the app',
    saveAria: 'Save — requires the app',
    shareAria: 'Share — requires the app',
    ageOnly: '{age} · Adults only',
    officialBadge: 'Official',
    appSummary: 'Nearby video · One-tap upload · Live chat',
    moreComments: 'More comments in the app',
    gateLegal: 'By continuing you accept the Terms · 18+ only',
    commentSamples: [
      { name: 'Rahaf', text: 'This corner is unreal' },
      { name: 'Zaid', text: 'Where is this? I want to go' },
    ],

    cardAria: 'Say hi to {name} — requires the app',
    avatarAlt: '{name}, {age}',
    sayHi: 'Say hi',
    noAvatar: 'No avatar',
    bridgeTitle: 'Picked someone? Just speak up.',
    bridgeBody:
      'Text, voice, photos — send anything. It vanishes once she looks, and you can close it any time.',
    bridgeCta: 'Go chat a little',

    chatInputAria: 'Continue chatting in the app',
    chatContinueCta: 'Keep chatting · Free download',

    metaVersion: 'Version',
    metaSize: 'Size',
    metaSystem: 'System',
  },
}
