"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function createPropertyItem(metadata, currentObject) {
    var propertyItem;
    var propertyType = metadata.type;
    if (propertyType == 'input') {
        propertyItem = new TextPropertyItem(metadata, currentObject);
    }
    else if (propertyType == 'dropdown') {
        propertyItem = new DropdownPropertyItem(metadata, currentObject);
    }
    else if (propertyType == 'primarykey') {
        propertyItem = new PrimarykeyPropertyItem(metadata, currentObject);
    }
    else {
        throw 'failed';
    }
    return propertyItem;
}
exports.createPropertyItem = createPropertyItem;
var PropertyItem = /** @class */ (function () {
    function PropertyItem(metadata, currentObject) {
        this.metadata = metadata;
        this.currentObject = currentObject;
        var title = document.createElement('span');
        title.innerText = metadata.description;
        var content = this.onCreateView();
        this.view = document.createElement('div');
        this.view.appendChild(title);
        this.view.appendChild(content);
    }
    PropertyItem.prototype.getView = function () {
        return this.view;
    };
    return PropertyItem;
}());
exports.PropertyItem = PropertyItem;
var TextPropertyItem = /** @class */ (function (_super) {
    __extends(TextPropertyItem, _super);
    function TextPropertyItem(metadata, currentObject) {
        return _super.call(this, metadata, currentObject) || this;
    }
    TextPropertyItem.prototype.onCreateView = function () {
        var view = document.createElement('input');
        return view;
    };
    TextPropertyItem.prototype.update = function (currentObject) {
    };
    return TextPropertyItem;
}(PropertyItem));
var DropdownPropertyItem = /** @class */ (function (_super) {
    __extends(DropdownPropertyItem, _super);
    function DropdownPropertyItem(metadata, currentObject) {
        return _super.call(this, metadata, currentObject) || this;
    }
    DropdownPropertyItem.prototype.onCreateView = function () {
        var view = document.createElement('select');
        return view;
    };
    DropdownPropertyItem.prototype.update = function (currentObject) {
    };
    return DropdownPropertyItem;
}(PropertyItem));
var PrimarykeyPropertyItem = /** @class */ (function (_super) {
    __extends(PrimarykeyPropertyItem, _super);
    function PrimarykeyPropertyItem(metadata, currentObject) {
        return _super.call(this, metadata, currentObject) || this;
    }
    PrimarykeyPropertyItem.prototype.onCreateView = function () {
        var view = document.createElement('input');
        view.disabled = true;
        return view;
    };
    PrimarykeyPropertyItem.prototype.update = function (currentObject) {
    };
    return PrimarykeyPropertyItem;
}(PropertyItem));
