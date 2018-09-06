export const toScientific = (s: number): string => {
    let _s = s.toString();
    let __s = _s;
    let e = 0;
    while (__s.slice(-1) === '0') {
        __s = __s.slice(0, -1);
        e++;
    }
    __s = `${__s}e${e}`;
    return __s.length < _s.length ? __s : _s;
};