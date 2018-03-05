let bills = {
    IDLE = 0,
    QUEUED = 9,
    PAID = 1
}

const enumsBills = Object.freeze(bills);

let status = {
    OK = 200,
    ACCEPTED = 202,
    BADREQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOTFOUND = 404,
    INTERNALSERVERERROR = 500,
    NOTIMPLEMENTED = 501,
    BADGATEWAY = 502,
    SERVICEUNAVAILABLE = 503
}

const enumsHttpStatus = Object.freeze(status);

export {enumsBills, enumsHttpStatus}