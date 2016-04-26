export function objectToQueryString(obj) {
  if (!obj instanceof Object) {
    return '';
  }

  return Object
    .keys(obj)
    .reduce((a, k) => {
      a.push(`${k}=${encodeURIComponent(obj[k])}`);
      return a;
    }, [])
    .join('&')
  ;
}
