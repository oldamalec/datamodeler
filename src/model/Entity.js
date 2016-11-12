var DBSDM = DBSDM || {};
DBSDM.Model = DBSDM.Model ||{};

/**
 * Entity model class
 */
DBSDM.Model.Entity = (function(){
    var ns = DBSDM;
    var Enum = ns.Enums;

    var EdgeOffset = 10; // TODO

    function Entity(name) {
        this._name = name || "Entity";
        this._attributes = new ns.Model.AttributeList();
        this._relationLegs = [];
        this._transform = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    }

    Entity.prototype.getName = function() {
        return this._name;
    };

    Entity.prototype.setName = function(name) {
        this._name = name;
    };

    Entity.prototype.getAttributeList = function() {
        return this._attributes;
    };

    Entity.prototype.addRelation = function(relationLeg) {
        this._relationLegs.push(relationLeg);
        relationLeg.setEntity(this);
    };

    Entity.prototype.removeRelation = function(relationLeg) {
        var index = null;
        for (var i in this._relationLegs) {
            if (this._relationLegs[i] == relationLeg) {
                index = i;
                break;
            }
        }
        if (index != null) {
            this._relationLegs.splice(index, 1);
            relationLeg.setEntity(null);
        }
    };

    Entity.prototype.setPosition = function(x, y) {
        this._transform.x = (x != null ? x : this._transform.x);
        this._transform.y = (y != null ? y : this._transform.y);
    };

    Entity.prototype.translate = function(dx, dy) {
        this._transform.x += (dx != null ? dx : 0);
        this._transform.y += (dy != null ? dy : 0);
    };

    Entity.prototype.setSize = function(w, h) {
        this._transform.width = (w != null ? w : this._transform.width);
        this._transform.height = (h != null ? h : this._transform.height);
    };

    Entity.prototype.resize = function(dw, dh) {
        this._transform.width += (dw != null ? dw : 0);
        this._transform.height += (dh != null ? dh : 0);
    };

    Entity.prototype.getTransform = function() {
        return this._transform;
    };

    Entity.prototype.getEdges = function() {
        return {
            top: this._transform.y,
            right: this._transform.x + this._transform.width,
            bottom: this._transform.y + this._transform.height,
            left: this._transform.x
        };
    };

    Entity.prototype._getMaxEdgeInterval = function(edge) {
        var edgeStart, edgeEnd;

        var edges = this.getEdges();

        if ((edge & 1) == 0) {  // top, bottom
            edgeStart = edges.left + EdgeOffset;
            edgeEnd = edges.right - EdgeOffset;
        } else {
            edgeStart = edges.top + EdgeOffset;
            edgeEnd = edges.bottom - EdgeOffset;
        }

        // add positions of current relation anchors
        var positions = [edgeStart]; // minimal position of the edge

        for (var i=0; i<this._relationLegs.length; i++) {
            var anchor = this._relationLegs[i].getAnchor();
            if (anchor.edge == edge) {
                positions.push( ((edge & 1) == 0 ? anchor.x : anchor.y) );
            }
        }

        positions.push(edgeEnd); // maximal position of the edge
        positions.sort(function(a, b) {
            return a-b;
        });

        // pick position - find max interval and split it in half = new anchor position
        var index = 1;
        var maxLength = 0;
        for (i=index; i<positions.length; i++) {
            var len = positions[i] - positions[i-1];
            if (len >= maxLength) {
                index = i;
                maxLength = len;
            }
        }

        return [positions[index-1], positions[index], maxLength];
    };

    Entity.prototype.getEdgePosition = function(edge) {
        var edges = this.getEdges();
        var interval = this._getMaxEdgeInterval(edge);
        var newPosition = Math.round((interval[0] + interval[1]) / 2);

        switch (edge) {
            case Enum.Edge.TOP:    return {x: newPosition, y: edges.top}; break;
            case Enum.Edge.RIGHT:  return {x: edges.right, y: newPosition}; break;
            case Enum.Edge.BOTTOM: return {x: newPosition, y: edges.bottom}; break;
            case Enum.Edge.LEFT:   return {x: edges.left, y: newPosition}; break;
        }
    };

    Entity.prototype.toString = function() {
        var str = "";
        str += "Entity " + this._name + "\n";
        str += "----------------------\n";
        str += this._attributes.toString();
        str += "\n";

        str += "----------------------\n";
        for (var i in this._relationLegs) {
            str += this._relationLegs[i].getRelation().toString() + "\n";
        }

        str += "\n";
        return str;
    };

    return Entity;
})();