(function(){
  Polymer('open-map', {
    map: null,

    /**
     * The `mapID`, it is the identifier of the map in mapbox, you can create your own map in [Mapbox](http://mapbox.com/editor) or use the default.

     * 

     * @attribute mapID

     * @type string

     * @default gnurub.j3ee3mk2

     */
    mapID: 'gnurub.j3ee3mk2',

    /**
     * If set, enable a button for geolocation.

     * 

     * @attribute geolocationUI

     * @type boolean

     * @default false

     */
    geolocationUI: false,

    /**
     * If set, enable a button for fullsceeen of the map.

     * 

     * @attribute fullscreenUI

     * @type boolean

     * @default false

     */
    fullscreenUI: false,

    /**
     * The map's zoom level.

     * 

     * @attribute zoom

     * @type number

     * @default 10

     */
    zoom: 10,

    /**
     * If set, removes the map's default UI zoom

     * 

     * @attribute disableZoomUI

     * @type boolean

     * @default false

     */
    disableZoomUI: false,

    /**
     * If false, prevent the user from zooming the map interactively.

     * 

     * @attribute zoomable

     * @type boolean

     * @default true

     */
    zoomable: true,

    /**
     * A latitude to center the map on.

     * 

     * @attribute latitude

     * @type number

     * @default 38.867847507701114

    */
    latitude: ﻿float(38.867847507701114),

    /**
     * A longitude to center the map on.
     * 

     * @attribute longitude

     * @type number

     * @default 1.3109779357910156

    */
    longitude: float(1.3109779357910156),

    /**
     * The `maxZoom` is the maximum zoom level of the map.

     * 

     * @attribute maxZoom

     * @type number

     * @default 15

    */
    maxZoom: 16,

    /**
     * The `minZoom` is the minimum zoom level of the map.

     * 

     * @attribute minZoom

     * @type number

     * @default 1

    */
    minZoom: 1,

    observe:{
      latitude: 'updateCenter',
      longitude: 'updateCenter'
    },

    attached: function() {
      this.resize();
    },

    created:function(){
      this.markers = [];
    },

    setCenter:function(){
      this.center = [];
      this.center[0] = this.latitude;
      this.center[1] = this.longitude;
    },

    ready:function(){
      var mapOptions = {
        minZoom:this.minZoom,
        maxZoom:this.maxZoom,
        zoomControl: !this.disableZoomUI,
        scrollWheelZoom: this.zoomable,
        touchZoom: this.zoomable,
        doubleClickZoom: this.zoomable
      };

      this.map = L.mapbox.map( this.$.openMap, this.mapID, mapOptions );
      this.updateCenter();

      /**
       * The `open-map-ready` event is fired when the Open Street Map API has fully loaded.
       * 
       * @event open-map-ready

       */
      this.fire( 'open-map-ready' );
    },

    updateCenter:function(){
      this.setCenter();
      this.map.setView( this.center, this.zoom );
    },

    toggleGeolocator:function () {
      var locate;
      if( this.geolocationUI )
        locate = L.control.locate().addTo( this.map );
      else if( locate )
        locate.removeFrom( this.map );
      
    },

    toggleFullscreen:function () {
      var fullscreen;
      if( this.fullscreenUI )
        fullscreen = L.control.fullscreen().addTo( this.map );
      else if( fullscreen )
        fullscreen.removeFrom( this.map );
    },

    disableZoomUIChanged:function( oldVal, newVal ){
      if( newVal &&  this.map.zoomControl )
        this.map.zoomControl.removeFrom( this.map );
      else
        this.map.zoomControl.addTo( this.map );
    },

    zoomChanged:function(){
      this.map.setZoom( this.zoom );
    },

    geolocationUIChanged:function(){
      this.toggleGeolocator();
    },

    fullscreenUIChanged:function () {
      this.toggleFullscreen();
    },

    resize:function () {
      this.map.on( 'resize', this.updateCenter.bind( this ) );
    }
  });
})();