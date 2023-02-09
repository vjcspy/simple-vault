/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

const CryptoJS = require('crypto-js');

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function encryptContent(content: any, pass: string) {
  let str = content;
  if (typeof str === 'object') {
    str = JSON.stringify({ data: content });
  }
  let p = '';
  try {
    p = CryptoJS.Rabbit.encrypt(str, pass.slice(0, 6)).toString();
    p = CryptoJS.RC4.encrypt(p, pass.slice(0, 4)).toString();
    p = CryptoJS.AES.encrypt(p, pass).toString();
    return p;
  } catch (e) {
    console.error('encrypt error', e);
  }
  return '';
}

export function decryptContent(content: string, pass: string) {
  let p = content;
  try {
    p = CryptoJS.AES.decrypt(p, pass).toString(CryptoJS.enc.Utf8);
    p = CryptoJS.RC4.decrypt(p, pass.slice(0, 4)).toString(CryptoJS.enc.Utf8);
    p = CryptoJS.Rabbit.decrypt(p, pass.slice(0, 6)).toString(
      CryptoJS.enc.Utf8
    );

    const json = JSON.parse(p);

    return json;
  } catch (e) {
    console.error('decrypt error', e);
  }

  return p;
}
