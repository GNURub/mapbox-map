(function(){
  'use strict';
  Polymer({
    is: "mapbox-cluster",
    properties: {
      markers: Object,
      map: {
        type: Object,
        observer: '_mapChanged'
      }
    },
    _mapChanged: function(){
      this.markers = new L.MarkerClusterGroup();
      if(this.map){
        this._updatedMarkers();
      }

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
          console.log(m.marker)
          //  this.markers.addLayer(m.marker);
        }
    //     this.map.addLayer(this.markers);
      }
    }

  });
})();
