// Curated image URLs (stable Unsplash IDs — no hotlinking randomness).
// next.config.ts remotePatterns allows images.unsplash.com.

const U = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: U("photo-1454496522488-7a8e488e8606", 1920),
  portrait: [
    U("photo-1500648767791-00dcc994a43e"),
    U("photo-1494790108377-be9c29b29330"),
    U("photo-1507003211169-0a1dd7228f2d"),
    U("photo-1544005313-94ddf0286df2"),
    U("photo-1472099645785-5658abf4ff4e"),
    U("photo-1534528741775-53994a69daeb"),
    U("photo-1506794778202-cad84cf45f1d"),
    U("photo-1519085360753-af0119f7cbe7"),
    U("photo-1573496359142-b8d87734a5a2"),
    U("photo-1595152772835-219674b2a8a6"),
    U("photo-1438761681033-6461ffad8d80"),
    U("photo-1552058544-f2b08422138a"),
    U("photo-1547425260-76bcadfb4f2c"),
    U("photo-1580489944761-15a19d654956"),
    U("photo-1508214751196-bcfd4ca60f91"),
    U("photo-1539571696357-5a69c17a67c6"),
    U("photo-1517841905240-472988babdf9"),
    U("photo-1524504388940-b1c1722653e1"),
    U("photo-1521119989659-a83eee488004"),
  ],
  landscape: [
    U("photo-1506905925346-21bda4d32df4"),
    U("photo-1464822759023-fed622ff2c3b"),
    U("photo-1470071459604-3b5ec3a7fe05"),
    U("photo-1441974231531-c6227db76b6e"),
    U("photo-1433086966358-54859d0ed716"),
    U("photo-1501785888041-af3ef285b470"),
    U("photo-1519681393784-d120267933ba"),
    U("photo-1454496522488-7a8e488e8606"),
    U("photo-1469474968028-56623f02e42e"),
    U("photo-1476514525535-07fb3b4ae5f1"),
    U("photo-1508739773434-c26b3d09e071"),
    U("photo-1483721310020-03333e577078"),
    U("photo-1486870591958-9b9d0d1dda99"),
    U("photo-1489171078254-c3365d6e359f"),
  ],
} as const;

export const TRAIL_WISDOM = [
  "The mountain does not care how many photos you take. The mountain cares that you brought enough water.",
  "Sherpa proverb: slow is smooth, smooth is fast, and altitude is the accountant of ambition.",
  "Every yak has two speeds: grazing and somehow-fast. Trip plans should follow the yak.",
  "The tea at 4,000 m tastes like victory and smells like kerosene. Enjoy both.",
  "A good porter carries your bag. A great porter carries your bag and your doubt.",
  "If the trail forks and one path has prayer flags, the flags are not a shortcut. Probably.",
  "Sleep above, trek below, and never trust a bridge that wobbles exactly like the last one.",
  "The mountain rewards the prepared. The mountain also rewards the person who remembered sunscreen.",
] as const;

export const MOMO_PRICE_PAISA = 5000; // one plate of steaming hot momos: NPR 50
