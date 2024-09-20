const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
};

const validateData = (data, req) => {
    let status = true;
    let message = [];


    for (let key in data) {
        let value = data[key];
        let listCondition = value.split("|");
        for (let i = 0; i < listCondition.length; i++) {
            if (listCondition[i] === 'required') {
                if (!(key in req) || isEmpty(req[key])) {
                    status = false;
                    message.push([ key + ' is required!']);
                }
            }
        }
    }
    return {status, message};
};

module.exports = { isEmpty, validateData };
