// node version pakFileLoader

export default {getAllFiles: getAllFiles, base64ArrayBuffer: base64ArrayBuffer};
// let fs=require('fs');
// //return a promise if success
// function load_pak_file(url) {
//     return new Promise((resolve,_) => {
//         fs.readFile(url, "", (_,data) => resolve(getAllFiles(data, base64ArrayBuffer)));
//     })
// }
// length:4 | (rawname:32 gbk | fileoffset:4 | filelength:4)*
function getAllFiles(arrayBuffer, useFunction) {
  // console.log("arrtype:",typeof arrayBuffer);
  useFunction = useFunction || (x => x);
  let fileCount = getInt(arrayBuffer.slice(0, 4));
  let base = 4;
  let retObj = {};
  for (let i = 0; i < fileCount; i++) {
    let pFileNames = getFileName(arrayBuffer.slice(base, base + 32));
    let pFileOffsets = getInt(arrayBuffer.slice(base + 32, base + 36));
    let pFileLengths = getInt(arrayBuffer.slice(base + 36, base + 40));
    retObj[pFileNames.replace(/\0.*$/g, '')] = useFunction(arrayBuffer.slice(pFileOffsets, pFileOffsets + pFileLengths));
    base += 40;
  }
  return retObj
}


/**
 *
 * @param slice the first 32 bytes of every file
 */
function getFileName(slice) {
  let nameArray = new Uint8Array(slice);
  let utf8decoder = new TextDecoder('GBK');
  return utf8decoder.decode(nameArray);
}

/**
 * return a promise of Image Count
 * @param slice the first 4 byte
 * @returns {number}
 */
function getInt(slice) {
  // use 4 bytes to read Int number
  return slice[0] + (slice[1] << 8) + (slice[2] << 16) + (slice[3] << 24);
}

// here reference:

// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5

/*
MIT LICENSE

Copyright 2011 Jon Leighton

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function base64ArrayBuffer(arrayBuffer) {
  var base64 = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes = new Uint8Array(arrayBuffer)
  var byteLength = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}
