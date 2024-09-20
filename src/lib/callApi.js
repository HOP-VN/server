const ThrowReturn = require("./ThrowReturn");
let fetch = require("node-fetch");
const { isEmpty } = require("./validate");

async function callApi(api, query = {}, body = {}, method='GET') {
    let params = "";
    params += Object.keys(query)
        .map((key) => {
            return `${key}=${query[key]}`;
        })
        .join("&");

    const response = await fetch(`${api}?${params}`, {
        method: method,
        headers: { "content-type": "application/json" },
        body: !isEmpty(body) ? JSON.stringify(body) : JSON.stringify()
    });
    const { data, error_code, error_msg } = await response.json();
    if (error_code !== 0) throw new ThrowReturn(error_msg);

    return data;
}

module.exports = {
    callApi,
};
