export const generateHexColorWithSeed: (seed: number) => string = (seed) => {
  const xmur3 = (str: string) => {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  };

  const mulberry32 = (a: number) => {
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const seedStr = seed.toString();
  const rand = mulberry32(xmur3(seedStr)());

  const getRandomComponent = () =>
    Math.floor(rand() * 256)
      .toString(16)
      .padStart(2, "0");

  const r = getRandomComponent();
  const g = getRandomComponent();
  const b = getRandomComponent();

  return `#${r}${g}${b}`.toUpperCase();
};
