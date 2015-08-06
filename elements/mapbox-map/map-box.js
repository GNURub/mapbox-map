(function() {
  'use strict';
  Polymer({
    is: 'mapbox-map',

    // Attributes
    properties: {

     /**
           * A Maps API for Business Client ID. To obtain a Maps API for Business Client ID, see developers.google.com/maps/documentation/business/.
           * If set, a Client ID will take precedence over an API Key.
           */
      accessToken: {
        type: String,
        value: 'pk.eyJ1IjoiZ251cnViIiwiYSI6InRZRVNjWDQifQ.'+
                  'Db2dDEClQ3ybQe_egT87lg',
        notify: true
      },

      /**
       * A Maps API object.
       */
      map: {
        type: Object,
        notify: true,
        value: null
      },
      /**
       * A latitude to center the map on.
       */
      latitude: {
        type: Number,
        value: 38.867847507701114,
        notify: true,
        reflectToAttribute: true,
        observer: '_updateCenter'
      },

      /**
       * A longitude to center the map on.
       */
      longitude: {
       type: Number,
       value: 38.867847507701114,
       notify: true,
       reflectToAttribute: true,
       observer: '_updateCenter'
      },

      /**
       * A zoom level to set the map to.
       */

      zoom: {
        type: Number,
        value: 10,
        reflectToAttribute: true,
        notify: true,
        observer: '_zoomChanged'
      },

      minZoom: {
        type: Number,
        value: 1,
        readOnly: true
      },

      maxZoom: {
        type: Number,
        value: 16,
        readOnly: true
      },

      /**
       * The `dragging` attribute sets whether  when he tries to pan outside the view.
       *
       * @attribute dragging
       * @type bool
       */
      dragging: {
           type: Boolean,
           value: true
      },

      /**
       * The `touch-zoom` attribute sets whether the map can be zoomed by touch-dragging with two fingers.
       *
       * @attribute touch-zoom
       * @type bool
       */
      touchZoom: {
           type: Boolean,
           value: true
      },

      /**
       * The `scrollWheelZoom` attribute sets the whether the map can be zoomed by using the mouse wheel. If passed 'center', it will zoom to the center of the view regardless of where the mouse was.
       *
       * @attribute scroll-wheel-zoom
       * @type bool
       */
      scrollWheelZoom: {
           type: Boolean,
           value: true
      },

      /**
       * The `double-click-zoom` attribute sets the whether the map can be zoomed in by double clicking on it and zoomed out by double clicking while holding shift. If passed 'center', double-click zoom will zoom to the center of the view regardless of where the mouse was.
       *
       * @attribute double-click-zoom
       * @type bool
       */
      doubleClickZoom: {
           type: Boolean,
           value: true
      },

            /**
       * The `tap` attribute enables mobile hacks for supporting instant taps (fixing 200ms click delay on iOS/Android) and touch holds (fired as contextmenu events).
       *
       * @attribute tap
       * @type bool
       */
      tap: {
           type: Boolean,
           value: true
      },

      /**
       * The `tap-tolerance` attribute sets the max number of pixels a user can shift his finger during touch for it to be considered a valid tap.
       *
       * @attribute tap-tolerance
       * @type number
       */
      tapTolerance: {
           type: Number,
           value: 15
      },

      /**
       * The `track-resize` attribute sets whether the map automatically handles browser window resize to update itself.
       *
       * @attribute track-resize
       * @type bool
       */
      trackResize: {
           type: Boolean,
           value: true
      },

      /**
       * The `world-copy-jump` attribute sets whether the map tracks when you pan to another "copy" of the world and seamlessly jumps to the original one so that all overlays like markers and vector layers are still visible.
       *
       * @attribute world-copy-jump
       * @type bool
       */
      worldCopyJump: {
           type: Boolean,
           value: false
      },

      /**
       * The `close-popup-on-click` attribute sets whether popups are closed when user clicks the map.
       *
       * @attribute close-popup-on-click
       * @type bool
       */
      closePopupOnClick: {
           type: Boolean,
           value: true
      },

      /**
       * The `bounce-at-zoom-limits` attribute sets whether the map to zoom beyond min/max zoom and then bounce back when pinch-zooming.
       *
       * @attribute bounce-at-zoom-limits
       * @type bool
       */
      bounceAtZoomLimits: {
           type: Boolean,
           value: true
      },

      /**
       * The `keyboard` attribute sets whether the map is focusable and allows users to navigate the map with keyboard arrows and +/- keys.
       *
       * @attribute keyboard
       * @type bool
       */
      keyboard: {
           type: Boolean,
           value: true
      },

      /**
       * The `keyboard-pan-offset` attribute sets the amount of pixels to pan when pressing an arrow key.
       *
       * @attribute keyboard-pan-offset
       * @type number
       */
      keyboardPanOffset: {
           type: Number,
           value: 80
      },

      /**
       * The `keyboard-zoom-offset` attribute sets the number of zoom levels to change when pressing + or - key.
       *
       * @attribute keyboard-zoom-offset
       * @type number
       */
      keyboardZoomOffset: {
           type: Number,
           value: 1
      },

      /**
       * The `inertia` attribute sets whether panning of the map will have an inertia effect where the map builds momentum while dragging and continues moving in the same direction for some time. Feels especially nice on touch devices.
       *
       * @attribute inertia
       * @type
       */
      inertia: {
           type: Boolean,
           value: true
      },

      /**
       * The `inertia-deceleration` attribute sets the rate with which the inertial movement slows down, in pixels/second2.
       *
       * @attribute inertia-deceleration
       * @type number
       */
      inertiaDeceleration: 3000,

      /**
       * The `inertia-max-speed` attribute sets the max speed of the inertial movement, in pixels/second.
       *
       * @attribute inertia-max-speed
       * @type number
       */
      inertiaMaxSpeed: {
           type: Number,
           value: 1500
      },


      /**
       * The `box-zoom` attribute sets the whether the map can be zoomed to a rectangular area specified by dragging the mouse while pressing shift.
       *
       * @attribute box-zoom
       * @type bool
       */
      boxZoom: {
           type: Boolean,
           value: true
      },

      /**
       * The `attribution-control` attribute sets whether the attribution control is added to the map by default.
       *
       * @attribute attribution-control
       * @type bool
       */
      attributionControl: {
           type: Boolean,
           value: false
      },

      /**
       * The `zoom-animation-threshold` attribute sets the maximum number of zoom level differences that still use animation
       *
       * @attribute zoom-animation-threshold
       * @type number
       */
      zoomAnimationThreshold: {
           type: Number,
           value: 4
      },

      /**
        * If set, the map is zoomed such that all elements in it are visible
        *
        * @attribute fit-to-markers
        * @type boolean
        * @default false
        */
      fitToMarkers: {
        type: Boolean,
        value: false
      },

      mapId: {
        type: String,
        value: 'mapbox.streets',
        notify: true
      },

      disableZoomUi: {
        type: Boolean,
        value: false,
        notify: true
      },

      zoomable: {
        type: Boolean,
        value: false,
        notify: true
      },

      geolocationUi: {
        type: Boolean,
        value: false,
        notify: true
      },

      fullscreenUi: {
        type: Boolean,
        value: false,
        notify: true,
        observe: '_fullscreenUiChanged'
      },

      geocoderUi: {
        type: Boolean,
        value: true,
        notify: true,
        observe: '_geolocationUiChanged'
      },

      maxBounds: {
        type: Array,
        value: []
      },

      center: {
        type: Array,
        value: []
      }
    },

    behaviors: [
     Polymer.IronResizableBehavior
    ],
    listeners: {
      'iron-resize': 'resize'
    },

    observers: [
      '_debounceUpdateCenter(latitude, longitude)'

    ],



    // Methods

    created: function() {
      this.layers = [];
    },
    attached: function() {
         this._initMapbox();
    },

    detached: function() {
     if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
     }
    },


    _initMapbox: function(){
     if (this.map) {
       return; // already initialized
     }
     if (!(window.L && window.L.mapbox)) {
       return; // api not loaded
     }
     if (!this.isAttached) {
       return; // not attached
     }
      L.mapbox.accessToken = this.accessToken;
      var mapOptions = {
        tap: this.tap,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        boxZoom: this.boxZoom,
        inertia: this.inertia,
        dragging: this.dragging,
        keyboard: this.keyboard,
        touchZoom: this.zoomable,
        trackResize: this.trackResize,
        doubleClickZoom: this.zoomable,
        scrollWheelZoom: this.zoomable,
        tapTolerance: this.tapTolerance,
        zoomControl: !this.disableZoomUi,
        worldCopyJump: this.worldCopyJump,
        inertiaMaxSpeed: this.inertiaMaxSpeed,
        closePopupOnClick: this.closePopupOnClick,
        keyboardPanOffset: this.keyboardPanOffset,
        bounceAtZoomLimits: this.bounceAtZoomLimits,
        keyboardZoomOffset: this.keyboardZoomOffset,
        attributionControl: this.attributionControl,
        inertiaDeceleration: this.inertiaDeceleration,
        zoomAnimationThreshold: this.zoomAnimationThreshold
      };
      var map = L.mapbox.map( this.$.mapBox, this.mapId, mapOptions );
      this.map = map;
      var newCenter = new L.latLng(this.latitude, this.longitude);
      this.map.setView(newCenter, this.zoom);
      this._updateCenter();
      this._updateLayers();
      this._geolocationUiChanged();
      this._fullscreenUiChanged();




      map.on('click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu focus blur preclick load unload viewreset movestart move moveend dragstart drag dragend zoomstart zoomend zoomlevelschange resize autopanstart layeradd layerremove baselayerchange overlayadd overlayremove locationfound locationerror popupopen popupclose', function(e) {
        this.fire(e.type, e);
      }, this);

      map.on('moveend', function(e) {
        this._ignoreViewChange = true;
        this.longitude = map.getCenter().lng;
        this.latitude = map.getCenter().lat;
        this._ignoreViewChange = false;
      }, this);
      map.on('zoomend', function(e) {
        this.zoom = map.getZoom();
      }, this);


      // var defaultLayerRequired = true;
      // for (var i = 0; i < this.children.length; i++) {
      //   var e = this.children[i];
      //   if (e.isLayer && e.isLayer()) {
      //     defaultLayerRequired = false;
      //   }
      // }
      // if (defaultLayerRequired) {
      //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      //     maxZoom: 18
      //   }).addTo(this.map);
      // }
      // this.registerMapOnChildren();
      // this._mutationObserver = new MutationObserver(this.registerMapOnChildren.bind(this));
      // this._mutationObserver.observe(this, {childList: true});





      // this.map.on('zoomlevelschange', function (e) {
      //       this.fire( 'open-map-zoomened', {data: e});
      //   }.bind( this ) );

      this.fire( 'open-map-ready' );

    },

    _observeLayers: function(){
     if (this._mutationObserver) {
       return;
     }
     this._mutationObserver = new MutationObserver( this._updateLayers.bind(this));
     this._mutationObserver.observe(this, {
       childList: true
     });
    },

    _updateLayers: function() {
       var newLayers = Array.prototype.slice.call(
        Polymer.dom(this.$.layers).getDistributedNodes());


       // if (newLayers.length === this.layers.length) {
       //  var added = newLayers.filter(function(m) {
       //    return this.layers && this.layers.indexOf(m) === -1;
       //  }.bind(this));
       //  console.log(added);
       //
       //  if (added.length === 0) {
       //    // set up observer first time around
       //    if (!this._mutationObserver) {
       //      this._observeLayers();
       //    }
       //    return;
       //  }
        this._observeLayers();


        this.layers = newLayers;

       if (this.layers.length && this.map) {
         for (var i = 0, m; m = this.layers[i]; ++i) {
           m.map = this.map;
         }
       }
     // }
    },

    /**
     * Delete the layers.
     *
     * @method clear
     */
    clear: function() {
      for( var i = 0, m; m = this.layers[i]; i++ ) {
        m.removeLayer();
        m.map = null;
      }
    },

    resize: function () {
      if(this.map)
        this.map.on( 'resize', this._updateCenter.bind( this ) );
    },

    _debounceUpdateCenter: function() {
      this.debounce('updateCenter', this._updateCenter);
    },

    // registerMapOnChildren: function() {
    //   for (var i = 0; i < this.children.length; i++) {
    //     this.children[i].container = this.map;
    //   }
    // },

    _updateCenter: function(){
      this.cancelDebouncer('updateCenter');
      if (this.map && this.latitude !== undefined && this.longitude !== undefined) {
       var lati = Number(this.latitude);
        if (isNaN(lati)) {
          throw new TypeError('latitude must be a number');
        }
        var longi = Number(this.longitude);
        if (isNaN(longi)) {
          throw new TypeError('longitude must be a number');
        }

        var newCenter = new L.latLng(lati, longi);
        var oldCenter = this.map.getCenter();
        if (!oldCenter) {
          // If the map does not have a center, set it right away.
          this.map.setView(newCenter, this.zoom);
        } else {
          if (!oldCenter.equals(newCenter)) {
            // this.map.panTo(newCenter);
            // this.map.setView(newCenter, this.zoom);
          }else{
            this.map.setView(newCenter, this.zoom);
          }
        }

      }

    },

    _zoomChanged: function() {
     if( this.map ){
      this.map.setZoom( Number( this.zoom ) );
      this.fire( 'mapbox-e-zoomened', { data: this.zoom } );
     }
    },


    disableZoomUiChanged: function( oldVal, newVal ){
     if (!this.map) {
       return;
     }
     if( newVal ){
       this.map.zoomControl.removeFrom( this.map );
     }else{
       this.map.zoomControl.addTo( this.map );
     }
    },




    _toggleGeolocator: function () {
      var locate;
      if( this.geolocationUi ){
        locate = L.control.locate().addTo( this.map );
      }else if( locate ){
        locate.removeFrom( this.map );
      }
    },

    _geolocationUiChanged: function() {
      this._toggleGeolocator();
    },

    _toggleFullscreen: function () {
      var fullscreen;
      if( this.fullscreenUi ){
        fullscreen = L.control.fullscreen().addTo( this.map );
      }else if( fullscreen ){
        fullscreen.removeFrom( this.map );
      }
    },


    _fullscreenUiChanged: function () {
      this._toggleFullscreen();
    },

    geocoderUiChanged: function () {
      this._toggleGeocoder();
    },


    _toggleGeocoder: function () {
        var geocoder;
        if( this.geocoderUi ){
          geocoder = this.map
            .addControl(L.mapbox.geocoderControl('mapbox.places-v1', {
              autocomplete: true
            }));
        }else if( geocoder ){
          this.map.removeControl( geocoder );
        }
      },

    maxBoundsChanged: function(oldVal, newVal){
      this.map.setMaxBounds(newVal);
      this.map.fitBounds(newVal);
    }

  });
})();
