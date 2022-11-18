import CryptoJS from 'crypto-js';
import appConfig from '../../Environment/environments';

export const encryptData = (data) => {
    let key = CryptoJS.enc.Utf8.parse(appConfig.api.encryption.Key);
    let iv = {
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(appConfig.api.encryption.IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };

    return encodeURIComponent(CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, iv));
}
