&lt;mapbox-map&gt; element &lt;/mapbox-map&gt;
==========================================

Make Open Street Maps using declarative Polymer web components. To get started read the [&lt;mapbox-doc&gt;&lt;/mapbox-doc&gt;] or checkout the [&lt;mapbox-demo&gt;&lt;/mapbox-demo&gt;].


Tech
-----------

`<mapbox-map></mapbox-map>` use:
* [Mapbox] - Awesome library for use Open Maps
* [Polymer] - Awesome framework for web components.
* [maki] - Native icons for mapbox. `<mapbox-marker symbol="restaurant"></mapbox-marker>`

Use guide
--------------
<!-- ##### Install mapbox-map component using [bower].

```bash
$ bower install mapbox-map

``` -->

```bash
$ git clone git@github.com:GNURub/mapbox-map.git
$ cd mapbox-map
$ bower install
```

##### Configure Polymer and the new component.

```html
  <head>
    <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
	  <link rel="import" href="bower_components/map-box/map-box.html">
	  <style>
    	html, body {
    		margin: 0;
    		height: 100%;
    	}
    	mapbox-map {
    		height: 100%;
    	}
	  </style>
  </head>
  <body unresolved>
    <mapbox-map id="map"
      zoom="15"
      layer="roadtrippers.ijjip7cb"
      latitude="38.908847"
      longitude="1.433900">
      <mapbox-marker
      label="School Bus"
      latitude="38.909847"
      longitude="1.435900"
      symbol="bus"
      watch-position
      color="#ff0000"
      draggable>
      </mapbox-marker>
      <mapbox-marker
      id="me"
      label="Me"
      symbol="pitch"
      color="#000000"
      >
      </mapbox-marker>
    </mapbox-map>
  </body>
```

![Preview][1]

# &lt;mapbox-map&gt;&lt;/mapbox-map&gt;

Attributes
----------

| Attribute        				   | Type    | Default            |
| -------------------------- | :-----: | -----------------: |
| `access-token*`   				 | String  | null               |
| `layer*`          				 | String  | mapbox.streets     |
| `no-wrap`         				 | Boolean | false              |
| `geolocation-ui`  				 | Boolean | false              |
| `fullscreen-ui`   				 | Boolean | false              |
| `zoom`            				 | Number  | 10                 |
| `disable-zoom-ui`					 | Boolean | false              |
| `zoomable`        				 | Boolean | true               |
| `latitude`                 | Float   | 38.867847507701114 |
| `longitude`                | Float   | 1.3109779357910156 |
| `max-zoom`                 | Number  | 16                 |
| `min-zoom`                 | Number  | 1                  |
| `max-bounds`    				   | Array   | [ ]                |
| `load-feature`  				   | String  | null               |
| `dragging`      				   | Boolean | true               |
| `touch-zoom`         			 | Boolean | true               |
| `scroll-wheel-zoom`        | Boolean | true               |
| `double-click-zoom`        | Boolean | true               |
| `tap`                      | Boolean | true               |
| `tap-tolerance`            | Number  | 15                 |
| `world-copy-jump`          | Boolean | false              |
| `close-popup-on-click`     | Boolean | true               |
| `bounce-at-zoom-limits`    | Boolean | true               |
| `keyboard`                 | Boolean | true               |
| `keyboard-pan-offset`      | Number  | 80                 |
| `keyboard-zoom-offset`     | Number  | 1                  |
| `inertia`                  | Boolean | true               |
| `inertia-deceleration`     | Number  | 3000               |
| `inertia-max-speed`        | Number  | 1500               |
| `box-zoom`                 | Boolean | true               |
| `attribution-control`      | Boolean | false              |
| `zoom-animation-threshold` | Number  | 4                  |
| `fit-to-markers`           | Boolean | false              |
| `label-geocoder`           | String  | "mapbox.places"    |
| `autocomplete-geocoder`    | Boolean | false              |
(Some features are not implemented yet)

Methods
--------

| Method          | Function               |
| --------------- | :--------------------: |
| `clear`         | Remove all features.   |
| `toGeoJSON`     | Get all features.      |
| `canvasTiles`   | Draw on the map.       |
| `setFilter`     | Set a feature filter.  |

Events
------
| Event                | Function                       |
| -------------------- | :----------------------------: |
| `mapbox-map-ready`     | Fired when map is ready      |
[Events mapbox]

<!-- # &lt;mapbox-marker&gt;&lt;/mapbox-marker&gt;

Attributes
----------
| Attribute       | Type    | Default            |
| --------------- | :-----: | -----------------: |
| `latitude`      | Float   | 0                  |
| `longitude`     | Float   | 0                  |
| `symbol`        | String  | null               |
| `color`         | String  | null               |
| `size`          | String  | null               |
| `label`         | String  | null               |


##### Params for Icon
| Param             | Type    | Default   |
| ----------------- | :-----: | --------: |
| `icon`            | String  |  null     |
| `iconUrl`         | URL     |  null     |
| `iconRetinaUrl`   | URL     |  null     |
| `iconSize`        | Array   | [35, 45]  |
| `iconAnchor`      | Array   | [17, 42]  |
| `popupAnchor`     | Array   | [1, -32]  |
| `shadowUrl`       | URL     | null      |
| `shadowRetinaUrl` | URL     | null      |
| `shadowSize`      | Array   | [36, 16]  |
| `shadowAnchor`    | Array   | [10, 12]  |
| `markerColor`     | String  | '#ff0000' |


Methods
-------

Events
------
| Even                |   Function                                           	|
| ------------------- | :----------------------------:												|
| `dblclick-marker`   | Fired when double clicked     										    |
| `click-marker`      | Fired when clicked.          												  |
| `move-marker`       | Fired when the marker is moved via latitude/longitude |
| `dragstart-marker`  | Fired when drag starts.        												|
| `dragend-marker`    | Fired when drag ends.          												|
| `drag-marker`       | Fired when dragged.            												|
| `remove-marker`     | Fired when marker is removed.  												|
| `popupmapbox-marker`  | Fired when the popup is mapboxed.												|
| `popupclose-marker` | Fired when the popup is closed.												|

# &lt;mapbox-icon&gt;&lt;/mapbox-icon&gt;

# &lt;mapbox-cluseter&gt;&lt;/mapbox-cluseter&gt;

# &lt;mapbox-circle&gt;&lt;/mapbox-circle&gt;

# &lt;mapbox-polyline&gt;&lt;/mapbox-polyline&gt;

# &lt;mapbox-polygon&gt;&lt;/mapbox-polygon&gt;

# &lt;mapbox-layers&gt;&lt;/mapbox-layers&gt;

# &lt;mapbox-layer&gt;&lt;/mapbox-layer&gt;

# &lt;mapbox-grid&gt;&lt;/mapbox-grid&gt; -->

<!-- # &lt;mapbox-search&gt;&lt;/mapbox-search&gt;

Properties
----------
| Property        | Type    | Funtion                            |
| --------------- | :-----: | ---------------------------------: |
| `result`        | Object  | Returns an object with the results |

Attributes
----------
| Attribute       | Type    | Function                           |
| --------------- | :-----: | ---------------------------------: |
| `query`         | Array   | Array that contains the querys     |
| `accessToken`   | String  | String whit the access token       |

Events
------
| Even                    |   Function                               |
| ----------------------- | :-------------------------------------:	 |
| `mapbox-search-results`   | Fired it when the result is available.   | -->

Personalize the map
-------------------
You can personalize the map using the [MapBoxEditor] or [MapBoxStudio], introduce your map id in the attribute `layer`.


License
-------
MIT


[&lt;mapbox-demo&gt;&lt;/mapbox-demo&gt;]:https://ruben96.github.io/mapbox-map/components/mapbox-map/demo.html
[&lt;mapbox-doc&gt;&lt;/mapbox-doc&gt;]:https://ruben96.github.io/mapbox-map
[Polymer]:http://www.polymer-project.org/
[MapBoxEditor]:https://www.mapbox.com/editor
[MapBoxStudio]:https://www.mapbox.com/mapbox-studio/
[Mapbox]:https://www.mapbox.com/
[Events mapbox]:https://www.mapbox.com/mapbox.js/api/v2.2.1/l-map-class/#map-events
[maki]:https://www.mapbox.com/maki/
[bower]:http://bower.io/
[1]:http://i.imgur.com/riDWm8w.jpg
