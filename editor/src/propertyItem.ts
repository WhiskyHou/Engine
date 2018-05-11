import { PropertyMetadata } from "./editor";


export function createPropertyItem(metadata: PropertyMetadata, currentObject: any): PropertyItem {

    let propertyItem: PropertyItem;
    const propertyType = metadata.type;

    if (propertyType == 'input') {
        propertyItem = new TextPropertyItem(metadata, currentObject);
    } else if (propertyType == 'dropdown') {
        propertyItem = new DropdownPropertyItem(metadata, currentObject);
    } else if (propertyType == 'primarykey') {
        propertyItem = new PrimarykeyPropertyItem(metadata, currentObject);
    } else {
        throw 'failed';
    }

    return propertyItem;
}

export abstract class PropertyItem {

    protected view: HTMLElement

    private metadata: PropertyMetadata

    private currentObject: any

    protected from: any

    private onSubmit: Function


    constructor(metadata: PropertyMetadata, currentObject: any) {
        this.metadata = metadata;
        this.currentObject = currentObject;

        const title = document.createElement('span');
        title.innerText = metadata.description;
        const content = this.onCreateView();

        this.view = document.createElement('div');
        this.view.appendChild(title);
        this.view.appendChild(content);
    }

    getView() {
        return this.view;
    }

    abstract onCreateView(): HTMLElement;

    abstract update(currentObject: any): void;
}


class TextPropertyItem extends PropertyItem {

    constructor(metadata: PropertyMetadata, currentObject: any) {
        super(metadata, currentObject);
    }

    onCreateView(): HTMLElement {
        const view = document.createElement('input');


        return view;
    }

    update(currentObject: any): void {
    }
}


class DropdownPropertyItem extends PropertyItem {
    constructor(metadata: PropertyMetadata, currentObject: any) {
        super(metadata, currentObject);
    }

    onCreateView(): HTMLElement {
        const view = document.createElement('select');


        return view;
    }

    update(currentObject: any): void {
    }
}


class PrimarykeyPropertyItem extends PropertyItem {
    constructor(metadata: PropertyMetadata, currentObject: any) {
        super(metadata, currentObject);
    }

    onCreateView(): HTMLElement {
        const view = document.createElement('input');
        view.disabled = true;


        return view;
    }

    update(currentObject: any): void {
    }
}
