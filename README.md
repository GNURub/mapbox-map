&lt;open-map&gt; element &lt;/open-map&gt;
==========================================

Make Open Street Maps using declarative Polymer web components. To get started read the [&lt;open-doc&gt;&lt;/open-doc&gt;] or checkout the [&lt;open-demo&gt;&lt;/open-demo&gt;].


Tech
-----------

`<open-map></open-map>` use:
* [Mapbox] - Awesome library for use Open Maps
* [Polymer] - Awesome framework for web components.
* [FortAwesome] - Icons for markers, you can set it into `icon` attribute or also you can use [maki] icons.
 
Use guide
--------------
##### Install open-map component using [bower].

```bash
$ bower install open-map#master

```

##### Configure Polymer and the new component.

```html
<head>
    <script src="../platform/platform.js"></script>
    <link rel="import" href="../open-map/open-map.html">
    <style>
      html, body {
        margin: 0;
        height: 100%;
      }
      leaflet-map {
        height: 100%;
      }
    </style>
  </head>
  <body unresolved>
    <open-map id="map"
            zoom="15"
            latitude="38.908847"
            longitude="1.433900">
        <open-marker title="School Bus" latitude="38.908847"
            longitude="1.433900"
            icon="{'icon':'bus', 'markerColor':'black'}"
            draggable="true">
        </open-marker>
        <open-marker id="me" title="Me"
            icon="{'icon':'fa-child', 'markerColor':'black'}">
        </open-marker>
    </open-map>
    <script type="text/javascript">
    var me = document.querySelector('#me');
    navigator.geolocation.watchPosition(function(pos){
        me.latitude = pos.coords.latitude;
        me.longitude = pos.coords.longitude;
    });
    </script>
  </body>
```

![Preview][1]

# &lt;open-map&gt;&lt;/open-map&gt;

Attributes
----------

| Attribute       | Type    | Default            |
| --------------- | :-----: | -----------------: |
| `mapID`         | String  | gnurub.j3ee3mk2    |
| `geolocationUI` | Boolean | false              |
| `fullscreenUI`  | Boolean | false              |
| `zoom`          | Number  | 10                 |
| `disableZoomUI` | Boolean | false              |
| `zoomable`      | Boolean | true               |
| `latitude`      | Float   | 38.867847507701114 |
| `longitude`     | Float   | 1.3109779357910156 |
| `maxZoom`       | Number  | 16                 |
| `minZoom`       | Number  | 1                  |

##### Params for Icon
| Param             | Type    | Default   |
| ----------------- | :-----: | --------: |
| `'icon'`          | String  | 'home'    |
| `'iconUrl'`       | URL     |  null     |
| `'iconRetinaUrl'` | URL     |  null     |
| `'iconSize'`      | Array   | [35, 45]  |
| `'iconAnchor'`    | Array   | [17, 42]  |
| `'popupAnchor'`   | Array   | [1, -32]  |
| `'shadowUrl'`     | URL     | null      |
| `shadowRetinaUrl'`| URL     | null      |
| `'shadowSize'`    | Array   | [36, 16]  |
| `'shadowAnchor'`  | Array   | [10, 12]  |
| `'markerColor'`   | String  | 'blue'    |
| `'iconColor'`     | String  | 'white'   |


Methods
--------

| Method          | Function               |
| --------------- | :--------------------: |
| `clear`         | Remove alls markers.   |

Events
------
| Event                | Function                       |
| -------------------- | :----------------------------: |
| `open-map-ready`     | Fired when map is ready        |
| `'open-map-zoomened'`| Fired when zoom change         |

# &lt;open-marker&gt;&lt;/open-marker&gt;

Attributes
----------
| Attribute       | Type    | Default            |
| --------------- | :-----: | -----------------: |
| `latitude`      | Float   | null               |
| `longitude`     | Float   | null               |
| `icon`          | Object  | null               |
| `title`         | String  | null               |

Methods
-------

Events
------
| Event               | Function                       |
| ------------------- | :----------------------------: |
| `dblclick-marker`   | Fired when do doble click      |
| `click-marker`      | Fired when do click.           |
| `move-marker`       | Fired when move.               |
| `dragstart-marker`  | Fired when drag starts.        |
| `dragend-marker`    | Fired when drag ends.          |
| `drag-marker`       | Fired when drag.               |
| `remove-marker`     | Fired when marker is removed.  |
| `popupopen-marker`  | Fired when the popup is open.  |
| `popupclose-marker` | Fired whenthe popup is close.  |

Personalize the map
-------------------
You can personalize the map using the [MapBoxEditor], introduce your map id in the attribute `mapID`.

License
-------
MIT


[&lt;open-demo&gt;&lt;/open-demo&gt;]:https://ruben96.github.io/open-map/components/open-map/demo.html
[&lt;open-doc&gt;&lt;/open-doc&gt;]:https://ruben96.github.io/open-map
[Polymer]:http://www.polymer-project.org/
[FortAwesome]:https://fortawesome.github.io/Font-Awesome/icons/
[MapBoxEditor]:https://www.mapbox.com/editor
[Mapbox]:https://www.mapbox.com/
[maki]:https://www.mapbox.com/maki/
[bower]:http://bower.io/
[1]:http://storage8.static.itmages.com/i/14/0806/h_1407325196_3280150_2cf97ebe34.png
