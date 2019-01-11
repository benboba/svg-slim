export const toScientific = (s: number): string => {
    const sStr = s.toString();
    let _s = sStr;
    let e = 0;
    while (_s.slice(-1) === '0') {
        _s = _s.slice(0, -1);
        e++;
    }
    _s = `${_s}e${e}`;
    return _s.length < sStr.length ? _s : sStr;
};
