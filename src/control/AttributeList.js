var DBSDM = DBSDM || {};
DBSDM.Control = DBSDM.Control ||{};

DBSDM.Control.AttributeList = (function(){
    var ns = DBSDM;

    function AttributeList(model, canvas, entityControl) {
        this._model = model;
        this._canvas = canvas;
        this._entityControl = entityControl;

        this._controls = [];
    }

    AttributeList.prototype.createAttribute = function() {

        // create new Attribute model and add it to list
        var attrModel = new ns.Model.Attribute();
        this._model.add(attrModel);

        // create control for new model
        var control = new ns.Control.Attribute(this, attrModel, this._canvas, this._entityControl, this._model.getSize() - 1);
        this._controls.push(control);

        return control;
    };

    AttributeList.prototype.removeAttribute = function(attrModel, control) {
        this._model.remove(attrModel);

        var index = this._controls.findIndex(function(element, index, array) {
            return element == control;
        });
        this._controls.splice(index, 1);
        this._updatePositions();
    };

    AttributeList.prototype.getPosition = function(attrModel) {
        return this._model.getPosition(attrModel);
    };

    AttributeList.prototype.setPosition = function(attrModel, position) {
        if (position < 0) {
            position = 0;
        } else if (position > this._model.getSize()) {
            position = this._model.getSize() - 1;
        }

        this._model.setPosition(attrModel, position);
        this._updatePositions();
        return position;
    };

    AttributeList.prototype._updatePositions = function() {
        for (var i=0; i<this._controls.length; i++) {
            this._controls[i].reposition();
        }
    };

    AttributeList.prototype.getMinimalSize = function() {
        var size = {
            width: 0,
            height: 0
        };
        for (var i=0; i<this._controls.length; i++) {
            var a = this._controls[i].getMinimalSize();
            size.width = Math.max(size.width, a.width);
            size.height += a.height;
        }
        return size;
    };

    return AttributeList;
})();