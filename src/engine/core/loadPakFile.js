// def load_pak_file(pakfilename):
// pakfile = open(pakpath, 'rb')
// # read the voice file list
// filecount = struct.unpack('I', pakfile.read(4))[0]
// fileindex = {}
// i = 0
// while i < filecount:
// rawname = remove_null_end(pakfile.read(32))
// try:
// filename = rawname.decode('gbk')
// except:
//     filename = rawname
// fileoffset = struct.unpack('I', pakfile.read(4))[0]
// filelength = struct.unpack('I', pakfile.read(4))[0]
// fileindex[filename] = (fileoffset, filelength)
// i += 1
// return pakfile, fileindex
import './jquery.js';

export default {loadPakFile: load_pak_file, loadPicture: loadPicture};

let blobToBase64 = function (blob, callback) {
    var reader = new FileReader();
    reader.onload = function () {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        callback(base64);
    };
    reader.readAsDataURL(blob);
};

function loadPicture(blob, fileObj, name, callback) {
    let arr = fileObj[name];
    let offset = arr[0];
    let length = arr[1];
    blobToBase64(blob.slice(offset, offset + length), callback)
}

function load_pak_file(url, callback) {
    console.log(url);
    $(function () {
        $.ajax({
            type: "GET",
            url: url,
            xhr: function () {
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                return xhr;
            },
            success: function (data) {
                getAllFiles(data).then(v => callback(data, v));
            }
        });
    });
}

//
// test
// let url = "./data/MO1/bg/bg.pak";
// load_pak_file(url, function (data, fileObj) {
//     console.log(fileObj);
//     loadPicture(data, fileObj, "BG002A_H", funcA)
// });
// let funcA = function (base64) {
//     $('#ItemPreview').attr('src', `data:image/png;base64,${base64}`);
// };
//#end test
// length:4 | (rawname:32 gbk | fileoffset:4 | filelength:4)*
function getAllFiles(blob) {
    return getInt(blob.slice(0, 4)).then(fileCount => {
        let base = 4;
        let pFileNames = [];
        let pFileOffsets = [];
        let pFileLengths = [];
        for (let i = 0; i < fileCount; i++) {
            pFileNames.push(getFileName(blob.slice(base, base + 32)));
            pFileOffsets.push(getInt(blob.slice(base + 32, base + 36))); //22084
            pFileLengths.push(getInt(blob.slice(base + 36, base + 40))); //16612
            base += 40;
        }
        return Promise.all(pFileNames.concat(pFileOffsets).concat(pFileLengths)).then(values => {
            let fileObj = {};
            for (let i = 0; i < fileCount; i++) {
                fileObj[values[i].replace(/\0.*$/g, '')] = [values[fileCount + i], values[2 * fileCount + i]];
            }
            return fileObj;
        });
    });
}

/**
 *
 * @param slice the first 32 bytes of every file
 */
function getFileName(slice) {
    return slice.arrayBuffer().then(v => {
        let nameArray = new Uint8Array(v);
        let utf8decoder = new TextDecoder('GBK');
        return utf8decoder.decode(nameArray);
    });
}

/**
 * return a promise of Image Count
 * @param slice the first 4 byte
 * @returns {Promise<number | never>}
 */
function getInt(slice) {
    return slice.arrayBuffer().then(v => {
        // use 4 bytes to read Int number
        let view4B = new Int32Array(v);
        let intNumber = view4B[0];
        // console.log('readInt: ', intNumber);
        return intNumber;
    })
}

// let utf8decoder = new TextDecoder('GBK');
// let bytes = new Uint8Array([65, 89, 48, 49, 65, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
// console.log("aaaa:", utf8decoder.decode(bytes));


