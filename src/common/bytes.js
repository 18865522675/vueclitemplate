class Bytes {
  fromString(s) {
    let idx = 0, len = s.length, bytes = [];

    while (idx < len) {
      let c = s.charCodeAt(idx++), buf = [];

      if (c <= 0x7f) {
        // 0XXX XXXX 1 byte
        buf[0] = c;
        buf.length = 1;
      } else if (c <= 0x7ff) {
        // 110X XXXX 2 bytes
        buf[0] = (0xc0 | (c >> 6));
        buf[1] = (0x80 | (c & 0x3f));
        buf.length = 2;
      } else if (c <= 0xffff) {
        // 1110 XXXX 3 bytes
        buf[0] = (0xe0 | (c >> 12));
        buf[1] = (0x80 | ((c >> 6) & 0x3f));
        buf[2] = (0x80 | (c & 0x3f));
        buf.length = 3;
      }
      [].push.apply(bytes, buf);
    }
    return bytes;
  }

  toString(bytes) {
    let buf = [], idx = 0, len = bytes.length;

    while (idx < len) {
      let c = bytes[idx++];

      if ((c & 0x80) == 0) {
        // 0XXX XXXX 1 byte (0x00 ~ 0x7f)
        buf.push(c);
      } else if ((c & 0xe0) == 0xc0) {
        // 110X XXXX 2 bytes (0xc2 ~ 0xdf)
        let d = bytes[idx++];
        buf.push(((c & 0x1f) << 6) | (d & 0x3f));
      } else if ((c & 0xf0) == 0xe0) {
        // 1110 XXXX 3 bytes (0xe0 ~ 0xe1, 0xee ~ 0xef)
        let d = bytes[idx++];
        let e = bytes[idx++];
        buf.push(((c & 0x0f) << 12) | ((d & 0x3f) << 6) | (e & 0x3f));
      } else if ((c & 0xf8) == 0xf0) {
        // 1111 0XXX 4 bytes (0xf0 ~ 0xf4)
        let d = bytes[idx++];
        let e = bytes[idx++];
        let f = bytes[idx++];
        buf.push(((c & 0x0f) << 18) | ((d & 0x3f) << 12) | ((e & 0x3f) << 6) | (f & 0x3f));
      }
    }

    return String.fromCharCode.apply(null, buf);
  }

  stringToBytes(str) {
    if (!str) return;
    str = str.toString();
    let ch, st, re = [], cnt = str.length;
    for (let i = 0; i < cnt; i++) {
      ch = str.charCodeAt(i), st = [];
      do {
        st.push(ch & 0xFF), (ch = ch >> 8);
      }
      while (ch);
      re = re.concat(st.reverse());
    }
    return re;
  };

  byteToString(arr) {
    if (typeof arr === 'string') {
      return arr;
    }

    let str = "",
      _arr = arr;
    for (let i = 0; i < _arr.length; i++) {
      const one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        const bytesLength = v[0].length;
        let store = _arr[i].toString(2).slice(7 - bytesLength);
        for (let st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  };

  longToBytes(long) {
    const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let index = 0, length = byteArray.length; index < length; ++index) {
      let byte = long & 0xff;
      byteArray[index] = byte;
      long = (long - byte) / 256;
    }
    return byteArray;
  };

  bytesToLong(byteArray) {
    let value = 0;
    for (let i = byteArray.length - 1; i >= 0; --i) {
      value = (value * 256) + byteArray[i];
    }

    return value;
  };
}
export default new Bytes();
