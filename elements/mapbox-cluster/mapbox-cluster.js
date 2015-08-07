(function(){
  'use strict';
  Polymer({
    is: "mapbox-cluster",
    properties: {
      markers: Object,
      map: {
        type: Object,
        observer: '_mapChanged'
      },
      radius: {
        type: Number,
        value: 80
      }
    },
    _mapChanged: function(){
      this.markers = new L.MarkerClusterGroup({maxClusterRadius: this.radius});
      if(this.map){
        this._updatedMarkers();
      }
      this.markers.on('click clusterclick', function (e) {
        this.fire(e.type, e);
      }, this);

    },
    _observeMarkers: function(){
      if (this._observer) {
        return;
      }
      this._observer = new MutationObserver( this._updatedMarkers.bind(this));
      this._observer.observe(this, {
        childList: true
      });
    },
    _updatedMarkers: function(){
      var newMarkers = Array.prototype.slice.call(
       Polymer.dom(this.$.markers).getDistributedNodes());
       console.log(newMarkers)

       this._observeMarkers();
    //
      if (newMarkers.length && this.markers) {
        for (var i = 0, m; m = newMarkers[i]; ++i) {
          m.map = this.map;
          this.markers.addLayer(m.marker);
        }
        this.map.addLayer(this.markers);
      }
    }

  });
})();
