/**
 * The Prime number to multiply by in the algorithm for each bit size.
 */
const FNV_PRIMES: { [index: number]: bigint } = {
  32: 16777619n,
  64: 1099511628211n,
  128: 309485009821345068724781371n,
  256: 374144419156711147060143317175368453031918731002211n,
  512: 35835915874844867368919076489095108449946327955754392558399825615420669938882575126094039892345713852759n,
  1024: 5016456510113118655434598811035278955030765345404790744303017523831112055108147451509157692220295382716162651878526895249385292291816524375083746691371804094271873160484737966720260389217684476157468082573n
};

/**
 * Initial hash values to use for each bit size.
 */
const FNV_OFFSETS: { [index: number]: bigint } = {
  32: 2166136261n,
  64: 14695981039346656037n,
  128: 144066263297769815596495629667062367629n,
  256: 100029257958052580907070968620625704837092796014241193945225284501741471925557n,
  512: 9659303129496669498009435400716310466090418745672637896108374329434462657994582932197716438449813051892206539805784495328239340083876191928701583869517785n,
  1024: 14197795064947621068722070641403218320880622795441933960878474914617582723252296732303717722150864096521202355549365628174669108571814760471015076148029755969804077320157692458563003215304957150157403644460363550505412711285966361610267868082893823963790439336411086884584107735010676915n
};

type BitSize = 32 | 64 | 128 | 256 | 512 | 1024;

/**
 * Interface for functions implementing FNV algorithms.
 */
interface Algorithm {
  (input: string, bits: BitSize): bigint;
}

/**
 * Converts UTF-8 strings to {@link Uint8Array}
 */
const encoder: TextEncoder = new TextEncoder();

/**
 * FNV-0 32-bit specific hash algorithm. Left here for historical purposes.
 *
 * @param {string} input The UTF-8 string to hash.
 * @returns {number} Hash as a 32-bit number.
 *
 * @deprecated Left in for historical purposes. Use FNV-1a instead.
 */
function fnv032(input: string): number {
  let hash = 0;
  const uint8array: Uint8Array = encoder.encode(input);

  for (let i = 0, c = uint8array.length; i < c; i++) {
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash ^= uint8array[i];
  }

  return hash >>> 0;
}

/**
 * FNV-0 hash algorithm. Left here for historical purposes.
 *
 * @param {string} input The UTF-8 string to hash.
 * @param {BitSize} bits Bit size to use for the hash.
 * @returns {bigint} Hash as a {@link bigint}.
 *
 * @deprecated Left in for historical purposes. Use FNV-1a instead.
 */
const fnv0: Algorithm = (input: string, bits = 32) => {
  const fnvPrime: bigint = FNV_PRIMES[bits];
  let hash = 0n;
  const uint8array: Uint8Array = encoder.encode(input);

  for (let i = 0, c = uint8array.length; i < c; i++) {
    hash = BigInt.asUintN(bits, hash * fnvPrime);
    hash ^= BigInt(uint8array[i]);
  }

  return hash;
};

/**
 * FNV-1 32-bit specific hash algorithm.
 *
 * @param {string} input The UTF-8 string to hash.
 * @returns {number} Hash as a 32-bit number.
 */
function fnv132(input: string): number {
  let hash = 2166136261;
  const uint8array: Uint8Array = encoder.encode(input);

  for (let i = 0, c = uint8array.length; i < c; i++) {
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash ^= uint8array[i];
  }

  return hash >>> 0;
}

/**
 * FNV-1 hash algorithm.
 *
 * @param {string} input The UTF-8 string to hash.
 * @param {BitSize} bits Bit size to use for the hash.
 * @returns {bigint} Hash as a {@link bigint}.
 */
const fnv1: Algorithm = (input: string, bits = 32) => {
  const fnvPrime: bigint = FNV_PRIMES[bits];
  let hash: bigint = FNV_OFFSETS[bits];
  const uint8array: Uint8Array = encoder.encode(input);

  for (let i = 0; i < uint8array.length; i++) {
    hash = BigInt.asUintN(bits, hash * fnvPrime);
    hash ^= BigInt(uint8array[i]);
  }

  return hash;
};

/**
 * FNV-1a 32-bit specific hash algorithm.
 *
 * @param {number} input The UTF-8 string to hash.
 * @returns {number} Hash as a 32-bit number.
 */
function fnv1a32(input: string): number {
  let hash = 2166136261;
  const uint8array: Uint8Array = encoder.encode(input);

  for (let i = 0, c = uint8array.length; i < c; i++) {
    hash ^= uint8array[i];
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return hash >>> 0;
}

/**
 * FNV-1a hash algorithm.
 *
 * @param {string} input The UTF-8 string to hash.
 * @param {BitSize} bits Bit size to use for the hash.
 * @returns {bigint} Hash as a {@link bigint}.
 */
const fnv1a: Algorithm = (input: string, bits = 32) => {
  const fnvPrime: bigint = FNV_PRIMES[bits];
  let hash: bigint = FNV_OFFSETS[bits];
  const uint8array: Uint8Array = encoder.encode(input);

  for (let i = 0; i < uint8array.length; i++) {
    hash ^= BigInt(uint8array[i]);
    hash = BigInt.asUintN(bits, hash * fnvPrime);
  }

  return hash;
};

enum AlgorithmType {
  fnv0 = "fnv0",
  fnv1 = "fnv1",
  fnv1a = "fnv1a"
}

type AlgorithmTypeStrings = keyof typeof AlgorithmType;

const ALGORITHMS: { [index: string]: Algorithm } = {
  fnv0: fnv0,
  fnv1: fnv1,
  fnv1a: fnv1a
};

/**
 * The default FNV library hashing function.
 *
 * @param {string} input The UTF-8 string to hash.
 * @param {AlgorithmTypeStrings} algo The name of the FNV algorithm to use. (fnv0, fnv1, fnv1a)
 * @param {BitSize} bits Bit size to use for the hash.
 * @returns {bigint} Hash as a {@link bigint}.
 */
function fnv(input: string, algo: AlgorithmTypeStrings, bits: BitSize = 32): bigint {
  return ALGORITHMS[AlgorithmType[algo]](input, bits);
}

export { fnv0, fnv032, fnv1, fnv132, fnv1a, fnv1a32, fnv };
export default fnv;
