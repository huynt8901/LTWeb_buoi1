import { parse } from 'url';

const getPath = (req) => {
    return req.url;
}

const getParamsURL = (req) => {
    let urlData = parse(req.url, true);
    return JSON.stringify(urlData.query);
}

export default { getPath, getParamsURL };
