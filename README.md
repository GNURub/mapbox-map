&lt;open-map&gt; element &lt;/open-map&gt;
==========================================

Make Open Street Maps using declarative Polymer web components. To get started read the [&lt;open-doc&gt;&lt;/open-doc&gt;] or checkout the [&lt;open-demo&gt;&lt;/open-demo&gt;].


Tech
-----------

`<open-map></open-map>` use:
* [Polymer] - awesome framework for web components.
* [FortAwesome] - Icons for markers, you can set it into `icon` attribute..
 
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
    <open-map longitude="77.2" latitude="28.4" mapID="examples.map-i875kd35">
      <open-marker icon="{'icon': 'fa-twitter', 'markerColor':'red'}"></open-marker>
    </open-map>
    <script>
        var map = document.querySelector('open-map');
        var me = document.querySelectorAll('open-marker')[0];
        map.addEventListener('open-map-ready', funtion(){
            navigator.geolocation.getCurrentPosition(function(pos){
              me.latitude = pos.coords.latitude;
              me.longitude = pos.coords.longitude;
            });
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
| Event           | Function                       |
| --------------- | :----------------------------: |
| `open-map-ready`| Fire the event map is Ready.   |


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
| `dblclick-marker`   | Fire the event map is Ready.   |
| `click-marker`      | Fire the event map is Ready.   |
| `move-marker`       | Fire the event map is Ready.   |
| `dragstart-marker`  | Fire the event map is Ready.   |
| `dragend-marker`    | Fire the event map is Ready.   |
| `drag-marker`       | Fire the event map is Ready.   |
| `remove-marker`     | Fire the event map is Ready.   |
| `popupopen-marker`  | Fire the event map is Ready.   |
| `popupclose-marker` | Fire the event map is Ready.   |

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
[bower]:http://bower.io/
[1]:http://storage8.static.itmages.com/i/14/0806/h_1407325196_3280150_2cf97ebe34.png
