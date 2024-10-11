export function setBit(bitArray: Uint8Array, index: number, value: number) {
  if (value !== 0 && value !== 1) {
    throw new Error("Value must be 0 or 1");
  }
  if (index >= bitArray.length * 8) {
    bitArray = expand(bitArray, index + 1);
  }

  const byteIndex = index >> 3; //  //8
  const bitIndex = index & 7; //  %8

  if (value === 1) {
    bitArray[byteIndex] |= 1 << bitIndex;
  } else {
    bitArray[byteIndex] &= ~(1 << bitIndex);
  }
  return bitArray;
}

export function getBit(bitArray: Uint8Array, index: number): number {
  if (index >= bitArray.length * 8) {
    bitArray = expand(bitArray, index + 1);
  }

  const byteIndex = index >> 3;
  const bitIndex = index & 7;
  return (bitArray[byteIndex] >> bitIndex) & 1;
}

export function expand(bitArray: Uint8Array, newSize: number): Uint8Array {
  const newByteSize = (newSize + 7) >> 3;
  const newBitArray = new Uint8Array(newByteSize);

  newBitArray.set(bitArray);

  return newBitArray;
}

export function sumBits(bitArray: Uint8Array): number {
  let sum = 0;

  for (let i = 0; i < bitArray.length; i++) {
    let byte = bitArray[i];
    while (byte) {
      sum += byte & 1;
      byte >>= 1;
    }
  }
  return sum;
}

export function orBitArrays(arr1: Uint8Array, arr2: Uint8Array): Uint8Array {
  const length = Math.max(arr1.length, arr2.length);
  const newArray = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    const bit1 = i < arr1.length ? arr1[i] : 0;
    const bit2 = i < arr2.length ? arr2[i] : 0;
    newArray[i] = bit1 | bit2;
  }

  return newArray;
}

export function compareBitArrays(a: Uint8Array, b: Uint8Array): number[] {
  const result: number[] = [];

  const maxLength = Math.max(a.length, b.length);
  if (a.length < maxLength) {
    a = expand(a, maxLength * 8);
  }
  if (b.length < maxLength) {
    b = expand(b, maxLength * 8);
  }

  for (let i = 0; i < maxLength * 8; i++) {
    const bitA = getBit(a, i);
    const bitB = getBit(b, i);

    if (bitB ^ bitA) {
      result.push(i);
    }
  }
  return result;
}

export function fromBase64(base64String: string): Uint8Array {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function toBase64(uint8Array: Uint8Array): string {
  let binary = "";
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}
