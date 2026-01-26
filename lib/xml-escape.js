/* istanbul ignore file */
// originally from https://github.com/miketheprogrammer/xml-escape

var escape = (module.exports = function escape(string, ignore, noCDATA = false) {
  var pattern

  if (string === null || string === undefined) return

  ignore = (ignore || '').replace(/[^&"<>\']/g, '')
  pattern = '([&"<>\'])'.replace(new RegExp('[' + ignore + ']', 'g'), '')

  if (!noCDATA && typeof string === 'string' && (string.includes('>') || string.includes('<'))) {
    // This is necessary so that Google Earth can correctly display the text. Otherwise, if it finds "&lt;*&gt;"" in text, it will *still*
    // try to turn them into HTML tags, for some reason (probably some bug that happens when it tries to put the values in the HTML tables
    // it uses to display data).
    const escapedVal = string.replace(new RegExp(pattern, 'g'), (str, item) => cDataEscapeMap[item]);
    return `<![CDATA[${escapedVal}]]>`
  } else {
    return string.replace(new RegExp(pattern, 'g'), (str, item) => escape.map[item]);
  }
})

var map = (escape.map = {
  '>': '&gt;',
  '<': '&lt;',
  "'": '&apos;',
  '"': '&quot;',
  '&': '&amp;'
})

// According to this https://kml4earth.appspot.com/kmlErrata.html, you're supposed to use stuff like &#60 instead of &lt; when escaping
// inside a CDATA... Google Earth seems to do fine regardles (and QGIS badly regardless), but I'd rather we do things correctly.
const cDataEscapeMap = {
  '>': '&#x3E;',
  '<': '&#x3C;',
  "'": '&#x2032;',
  '"': '&#x22;',
  '&': '&#x26;'
}
