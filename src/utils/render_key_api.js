const md5 = require('md5');

const stringConcatenation = (object) => {
    let result = '';
    for (let [key, value] of object) {
        result += key + value;
    }
    return result;
};

const render_key_api = (request) => {
    if (typeof request === 'object') {
        request = Object.entries(request).sort();
    }
    const md5Data = stringConcatenation(request);
    const secretKey = process.env.SERVICE_SECRET_KEY_BONUS;

    return { key: md5(secretKey + md5Data) };
};

module.exports = {
    render_key_api,
};
