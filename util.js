export const extractCookies = (rawCookieArray) => {
    const resArray = [];
    rawCookieArray.forEach(rawc => {
        const parts = rawc.split(';');
        const kvpair = parts[0].split('=');
        resArray.push({name: kvpair[0], value: kvpair[1]});
    });
    return resArray;
}