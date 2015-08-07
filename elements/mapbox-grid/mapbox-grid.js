(function(){
  'use strict';
  Polymer({
    is: "mapbox-grid",
    properties: {
      feature: Object,
      featureCtrl: Object,
      map: {
        type: Object,
        observer: '_mapChanged'
      },
      layer: {
        type:String
      },
      control: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_controlChanged'
      }

    },
    _mapChanged: function(){
      var canUpdate = this.map && this.layer;
      if(canUpdate){
        this.feature = L.mapbox.gridLayer(this.layer);
        this.feature.addTo(this.map);
      }
      this.feature.on('click mouseover mousemove mouseout', function(e) {
          this.fire(e.type, e);
      }, this);
    },

    _controlChanged: function(){
      var canUpdate = this.map && this.layer && this.control;
      if(canUpdate){
        this.featureCtrl = L.mapbox.gridControl(this.feature).addTo(this.map);
      }
    },

    removeLayer: function() {
      this.map.removeLayer(this.feature);
      this.remove();
    },
    
    detached: function(){
      this.removeLayer();
    }
  });
})()
