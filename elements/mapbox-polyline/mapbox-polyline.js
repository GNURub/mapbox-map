(function(){
  'use strict';
  Polymer({
    is: "mapbox-polyline",
    behaviors: [MapBox.MapBoxContentPoint,
                MapBox.MapBoxPath],
    properties: {
      feature: Object,
      map: {
        type: Object,
        observer: '_mapChanged'
      },
      _mapChanged: function(){
        if ( this.map ) {
          this.feature = L.polyline( [],   this.pathOpts );
          this.feature.addTo( this.map );
          this.updateMapBoxPoint();

          this.feature.on('click dblclick mousedown mouseover mouseout contextmenu add remove popupopen popupclose', function(e) {
  					this.fire(e.type, e);
  				}, this);
        }
      }
    },
    /**
     * Description
     * @method removeLayer
     * @return 
     */
    removeLayer: function() {
      this.map.removeLayer(this.feature);
      this.remove();
    },
    /**
     * Description
     * @method detached
     * @return 
     */
    detached: function(){
      this.removeLayer();
    }
  });
})();
