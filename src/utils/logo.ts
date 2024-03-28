import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

export const enc = (x: number) =>
  ((x & 0x08) << 3) | ((x & 0x70) >> 1) | (x & 0x87) | 0x2800;

export const row = (x: number[]) => String.fromCharCode(...Array.from(x, enc));

export const create = (width: number, height: number) =>
  Array.from(Array(height >> 2), () => new Uint8Array(width >> 1));

export const set = (table: number[][], x: number, y: number) =>
  (table[y >> 2][x >> 1] |= 1 << ((y & 3) | ((x & 1) << 2)));

export const render = (table: number[][]) => table.map(row).join("\n");

export const frame = () =>
  new Promise((resolve) => requestAnimationFrame(resolve));

export const bayer = (order: number, x: number, y: number) => {
  let z = 0;

  for (let i = order; i--; x >>= 1, y >>= 1) {
    z = ((((x & 1) ^ (y & 1)) | (z << 1)) << 1) | (y & 1);
  }

  return z;
};

export const lut = (order: number) => {
  const size = 1 << order,
    area = size * size;
  const lut = new Float32Array(area);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      lut[x + y * size] = (bayer(order, x, y) + 0.5) / area;
    }
  }

  return (x: number, y: number) => lut[(x % size) + (y % size) * size];
};

export const bayer4 = lut(4);

export const fbm = (
  freq: number,
  amp: number,
  x: number,
  y: number,
  z: number
) =>
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2) +
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2) +
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2) +
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2) +
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2) +
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2) +
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2) +
  noise3D(x * (freq *= 2), y * freq, z * freq) * (amp /= 2);

const texture = (u: number, v: number, w: number) =>
  (2 * (0.5 + 0.5 * fbm(0.5, 1, u, v, w))) % 1;

export const globe = (
  x: number,
  y: number,
  u: number,
  v: number,
  w: number
) => {
  const d = u * u + v * v;
  if (d > 1) return false;

  const f = 1 / ((1 - d ** 0.5) ** 0.5 + 1);
  const t = texture(1e-1 * w + f * u, f * v, 1e-2 * w);
  return t > bayer4(x, y);
};
