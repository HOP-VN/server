let fetch = require("node-fetch");

async function fetchApi(url, method = "POST", body = {}, headers = {}, params = {}) {
    params = new URLSearchParams(params).toString();
    url = `${url}?${params}`;
    console.log("url...........................................", url);
    console.log();

    return await fetch(
        url,
        {
            method: method,
            headers: Object.assign(headers, { "Content-Type": "application/json" }),
            body: JSON.stringify(body)
        }).then(res => res.json()).catch(err => {
        return err;
    });
}

module.exports = {
    fetchApi
};