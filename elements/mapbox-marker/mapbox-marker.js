(function() {
  'use strict';

  function setPos(pos){
    this.latitude  = pos.coords.latitude;
    this.longitude = pos.coords.longitude;
    this._updatePosition();
  }

  Polymer({
    is: 'mapbox-marker',
    properties:{
      marker: Object,

      label: {
        type: String,
        value: null,
        notify: true,
        reflectToAttribute: true,
        observer: '_titleChanged'
      },

      map: {
        type: Object,
        observer: '_mapChanged'
      },

      draggable: {
        type: Boolean,
        value: false,
        notify: true
      },

      getPosition: {
        type: Boolean,
        value: false,
        observer: '_getPositionChanged'
      },

      watchPosition: {
        type: Boolean,
        value: false,
        observer: '_watchPositionChanged'
      },

      /**
      * The marker's longitude coordinate.
      */
      longitude: {
        type: Number,
        value: null,
        reflectToAttribute: true
      },



      /**
      * The marker's latitude coordinate.
      */
      latitude: {
        type: Number,
        value: null,
        reflectToAttribute: true
      },


      color: {
        type: String,
        value: ''
      },
      size: {
        type: String,
        value: ''
      },
      symbol: {
        type: String,
        value: ''
      },
      iconUrl: {
        type: String,
        value: ''
      },
      iconRetinaUrl: {
        type: String,
        value: ''
      },
      iconSize: {
        type: Array,
        value: []
      },
      iconAnchor: {
        type: Array,
        value: []
      },
      popupAnchor: {
        type: Array,
        value: []
      },
      shadowUrl: {
        type: String,
        value: ''
      },
      shadowRetinaUrl: {
        type: String,
        value: ''
      },
      shadowSize: {
        type: Array,
        value: []
      },
      shadowAnchor: {
        type: Array,
        value: []
      }
    },

    observers: [
      '_updatePosition(latitude, longitude)',
      '_iconChanged(color, size, symbol)'
    ],

    _updatePosition:function(){
      var canUpdate = ( this.map &&
        this.marker &&
        this.latitude &&
        this.longitude );
      if( canUpdate ){
        this.marker.setLatLng( [ parseFloat(this.latitude), parseFloat(this.longitude) ] );
      }else if( !this.marker ){
        this._mapReady();
      }
    },


    _mapChanged: function() {
      // Marker will be rebuilt, so disconnect existing one from old map and listeners.
      if (this.marker) {
        //  this.marker.addTo();
        // google.maps.event.clearInstanceListeners(this.marker);
      }
      if (this.map) {
        this._mapReady();
      }
    },

    _mapReady: function () {
      var canUpdate = ( this.map &&
        this.latitude &&
        this.longitude );

        if( canUpdate ) {
          if( this.marker ) {
            this.map.removeLayer(this.marker);
          }
          var newCenter = new L.latLng(this.latitude, this.longitude);

          this.marker = L.marker(newCenter, {
            draggable: !!this.draggable,
            icon: this._createIcon()
          });


          this.marker.addTo(this.map);
          this._titleChanged();
          this._getPositionChanged();
          this._watchPositionChanged();

          // this.marker = L.marker( [ this.latitude, this.longitude ], {
          //   draggable: !!this.getAttribute("draggable"),
          //   title: this.label,
          //   alt: this.label,
          //   icon: this._createIcon()
          // } ).addTo( this.map );

          /**
          * Fired when user clicks (or tabs) the marker.
          *
          * @event click-marker

          */
          this.marker.on( 'click', this._sendEvent.bind( this ))

          /**
          * Fired when user dobleclicks (or doble-tabs) the marker
          *
          * @event dblclick-marker

          */
          .on( 'dblclick', this._sendEvent.bind( this ))

          /**
          * Fired when the marker is moved via latitude/longitude.
          *
          * @event move-marker

          */
          .on( 'move', this._sendEvent.bind( this ))

          /**
          * Fired when user starts dragging the marker.
          *
          * @event dragstart-marker

          */
          .on( 'dragstart', this._sendEvent.bind( this ))

          /**
          * Fired reapetedly while the user drags the marker.
          *
          * @event drag-marker

          */
          .on( 'drag', this._sendEvent.bind( this ))

          /**
          * Fired when user stops dragging the marker.
          *
          * @event dragend-marker

          */
          .on( 'dragend', this._sendEvent.bind( this ))

          /**
          * Fired when the marker is added from the map.
          *
          * @event add-marker

          */
          .on( 'add', this._sendEvent.bind( this ))

          /**
          * Fired when the marker is removed from the map.
          *
          * @event remove-marker

          */
          .on( 'remove', this._sendEvent.bind( this ))

          /**
          * Fired when popup bound to the marker is open.
          *
          * @event popupopen-marker

          */
          .on( 'popupopen', this._sendEvent.bind( this ))

          /**
          * Fired when popup bound to the marker is close.
          *
          * @event popupclose-marker

          */
          .on( 'popupclose', this._sendEvent.bind( this ));

        }
      },

      _sendEvent: function (e){
        this.fire(e.type + '-marker', { data: e } );
      },

      _iconChanged: function (color, size, symbol) {
        if( this.map && !!this.marker ) {
          this.marker.setIcon(this._createIcon());}
      },

      _createIcon:function  () {

        return L.mapbox.marker.icon( {
          'marker-size': this.size,
          'marker-symbol': this.symbol,
          'marker-color': this.color
        } );

      },
      _titleChanged: function(){
        if(!!this.label && this.marker){
          this.marker.bindLabel(this.label);
        }
      },
      _getPositionChanged: function(){
        if(this.getPosition && ('geolocation' in navigator)){
          navigator.geolocation.getCurrentPosition(setPos.bind(this));
        }
      },
      _watchPositionChanged: function(){
        if(!this.getPosition && this.watchPosition && ('geolocation' in navigator)){
          navigator.geolocation.watchPosition(setPos.bind(this));
        }
      },
      removeLayer: function() {
        this.map.removeLayer(this.marker);
        this.remove();
      }
  });
})();
