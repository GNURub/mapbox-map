(function(){
  'use strict';
  Polymer({
    is: 'mapbox-circle',
    properties: {
      map: {
        type: Object,
        observer: '_mapChanged'
      },

      /**
      * The circle's longitude coordinate.
      */
      longitude: {
        type: Number,
        value: null,
        reflectToAttribute: true
      },



      /**
      * The circle's latitude coordinate.
      */
      latitude: {
        type: Number,
        value: null,
        reflectToAttribute: true
      },

      /**
      * The circle's radius.
      */

      radius: {
        type: Number,
        value: null,
        reflectToAttribute: true,
        observer: '_radiusChanged'
      },

      opts: Object
    },

    observers: [
      '_updatePosition(latitude, longitude)'
    ],

    _mapChanged: function(){
      if(this.map && this.radius && this.latitude && this.longitude)
        this._renderCircle();
    },

    _renderCircle: function(){
      this.circle = L.circle([Number(this.latitude),
                              Number(this.longitude)],
                              Number(this.radius), this.opts)
                              .addTo(this.map);

      this.circle.on('click dblclick mousedown mouseover mouseout contextmenu add remove popupopen popupclose', function(e) {
        this.fire(e.type, e);
      }, this);
    },

    _updatePosition: function (latitude, longitude){
      var canUpdate = this.map &&
          this.latitude &&
          this.longitude &&
          this.circle;
      if (canUpdate) {
        this.circle.setLatLng(L.latLng( this.latitude, this.longitude) );
      }
    },
    _radiusChanged: function(){
      if (this.circle && !!this.radius) {
        this.circle.setRadius(this.radius);
      }
    },
    removeLayer: function(keep){
      this.map.removeLayer(this.circle);
      this.remove();
    },

    detached: function(){
      this.removeLayer();
    }


  });
})()
