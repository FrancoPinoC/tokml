Forked from https://github.com/mapbox/tokml

# tokml

Convert [GeoJSON](http://geojson.org/) to [KML](https://developers.google.com/kml/documentation/).

## Usage

with node/browserify

    npm install --save @maphubs/tokml

otherwise:

    wget https://raw.github.com/maphubs/tokml/master/tokml.js

as a binary:

    npm install -g @maphubs/tokml
    tokml file.geojson > file.kml
    tokml < file.geojson > file.kml
    

## Importing

ESM

```js
import * as tokml from "@maphubs/tokml"
```

CommonJS

```js
var tokml = require('@maphubs/tokml')
```

Browser

You can also load the built `tokml.js` file directly in a browser script tag and access it globally as `tokml()`


## Example

```js
// kml is a string of KML data, geojsonObject is a JavaScript object of
// GeoJSON data
var kml = tokml(geojsonObject);

// grab name and description properties from each object and write them in
// KML
var kmlNameDescription = tokml(geojsonObject, {
  name: "name",
  description: "description",
});

// name and describe the KML document as a whole
var kmlDocumentName = tokml(geojsonObject, {
  documentName: "My List Of Markers",
  documentDescription: "One of the many places you are not I am",
});
```

## API

### `tokml(geojsonObjectOrFolder, [options])`

Given [GeoJSON](http://geojson.org/) data as an object, return KML data as a
string of XML.

`options` is an optional object that takes the following options:

**The property to name/description mapping:** while GeoJSON supports freeform
`properties` on each feature, KML has an expectation of `name` and `description`
properties that are often styled and displayed automatically. These options let
you define a mapping from the GeoJSON style to KML's.

- `name`: the name of the property in each GeoJSON Feature that contains
  the feature's name
- `description`: the name of the property in each GeoJSON Feature that contains
  the feature's description

**Timestamp:** KML can associate features with a moment in time via the `TimeStamp` tag. GeoJSON doesn't
have a comparable field, but a custom property can be mapped

- `timestamp`: the name of the property in each GeoJSON Feature that contains
  a timestamp in XML Schema Time (yyyy-mm-ddThh:mm:sszzzzzz)

**Document name and description**: KML supports `name` and `description` properties
for the full document.

- `documentName`: the name of the full document
- `documentDescription`: the description of the full document

**[simplestyle-spec](https://github.com/mapbox/simplestyle-spec)** support:

- `simplestyle`: set to `true` to convert simplestyle-spec styles into KML styles

**Using folders**: If you want have folders in you KML, you can give a object like this:
```
{
  type: 'Folders',
  folders: [
    {
      type: 'Folder',
      name: '<folder name>',
      description: '<folder description>',
      geojson: <GeoJSON>
    },
    ...
  ]
}
```

**Adding CDATA properties**: You can indicate that some of the properties of your GeoJSON are meant to be put in the KML as CDATA by making the property's value an object of this format: `{ "@type": "html", value: "value that will become CDATA" }` (like what https://github.com/placemark/tokml/ does). This will simply make it so that your value is written as a CDATA section. Note that, in this case, special characters within the value ***are not escaped***, so consider the possibilty and implications of unescaped script tags when using CDATA.

An example of a GeoJSON with CDATA is as follows:
```json
{ "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [100.0, 0.0]
    },
    "properties": {
      "prop0": { "@type": "html", "value": "<h1>test</h1>" },
      "prop1": "Normal string"
    }
  }]
}
```

Which will result in the following KML:
```XML
<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark><ExtendedData><Data name="prop0"><value><![CDATA[<h1>test</h1>]]></value></Data><Data name="prop1"><value>Normal string</value></Data></ExtendedData><Point><coordinates>100,0</coordinates></Point></Placemark></Document></kml>
```

Furthermore, for the purposes of displaying correctly within Google Earth, normal string values which contain both `<` and `>` will also be marked as CDATA sections, except in this case special characters *will* be escaped.

## Development

Requires [node.js](http://nodejs.org/) and [browserify](https://github.com/substack/node-browserify):

To build `tokml.js`:

    make

To run tests:

    yarn install
    yarn run test
