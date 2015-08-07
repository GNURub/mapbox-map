(function(){
  'use strict';
  Polymer({
    is: "mapbox-layers",
    feature: Object,
    layers: {
      type:Object,
      value: {}
    },
    map: {
      type: Object,
      observer: '_mapChanged'
    },
    _mapChanged: function(){
      this.feature = L.control.layers();
      this.feature.on('baselayerchange overlayadd overlayremove', function(){
        this.fire(e.type, e);
      }, this);
      if(this.map){
        this._updateLayers();
      }
    },

    _observeLayers: function(){
      if (this._observer) {
        return;
      }
      this._observer = new MutationObserver( this._updateLayers.bind(this));
      this._observer.observe(this, {
        childList: true
      });
    },

    _updateLayers: function(){
       var newLayers = Array.prototype.slice.call(
       Polymer.dom(this.$.layers).getDistributedNodes());

       this._observeLayers();

       var label, feature, name;
       for(var i = 0, layer; layer = newLayer[i]; ++i){
         label = layer.getAttribute('label');
         if(label != null){
           feature = L.mapbox.tileLayer(label);
           name    = layer.getAttribute('name') || label;
           if(layer.getAttribute('overlay')){
            this.feature.addOverlay( feature, name);
           }else{
             this.feature.addBaseLayer( feature, name);
           }
         }else{
           throw new TypeError("get the label and name attributes!!");
         }
       }
    }

  });
})();
