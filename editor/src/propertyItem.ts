import { PropertyMetadata } from "./editor"
import * as fs from 'fs'


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

    protected title: HTMLElement

    protected view: HTMLElement

    protected metadata: PropertyMetadata

    protected currentObject: any

    protected from: any

    private onSubmit: (from: any, to: any) => void


    constructor(metadata: PropertyMetadata, currentObject: any) {
        this.metadata = metadata;
        this.currentObject = currentObject;

        this.title = document.createElement('span');
        this.title.innerText = metadata.description;

        this.view = this.createView();
    }

    setOnSubmitFunction(onSubmit: (from: any, to: any) => void) {
        this.onSubmit = onSubmit;
    }

    submit(to: any) {
        if (to != this.from) {
            this.onSubmit(this.from, to);
            this.from = to;
        }
    }

    getView() {
        const container = document.createElement('div');
        container.appendChild(this.title);
        container.appendChild(this.view);
        this.initValue();
        return container;
    }

    initValue() {
        const propertyKey = this.metadata.key;
        const value = this.currentObject[propertyKey];
        this.updateView(value);
        this.from = value;
    }

    update(currentObject: any) {
        this.currentObject = currentObject;
        this.initValue();
    }

    abstract createView(): HTMLElement;

    abstract updateView(value: any): void;
}


class TextPropertyItem extends PropertyItem {

    constructor(metadata: PropertyMetadata, currentObject: any) {
        super(metadata, currentObject);
    }

    createView(): HTMLElement {
        const view = document.createElement('input');
        view.onblur = () => {
            const to = view.value;
            this.submit(to);
        }

        return view;
    }

    updateView(value: any): void {
        (this.view as HTMLInputElement).value = value;
    }
}


class DropdownPropertyItem extends PropertyItem {
    constructor(metadata: PropertyMetadata, currentObject: any) {
        super(metadata, currentObject);
    }

    createView(): HTMLElement {
        const view = document.createElement('select');
        const optionMetadata = this.metadata.options;
        if (optionMetadata) {
            const file = fs.readFileSync(optionMetadata.filepath, 'utf-8');
            const jsonData = JSON.parse(file);
            const items = jsonData[optionMetadata.prefix];
            for (let item of items) {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item.name;
                view.appendChild(option);
            }
        }

        view.onchange = () => {
            const to = view.value;
            this.submit(to);
        }

        return view;
    }

    updateView(value: any): void {
        (this.view as HTMLSelectElement).value = value;
    }
}


class PrimarykeyPropertyItem extends PropertyItem {
    constructor(metadata: PropertyMetadata, currentObject: any) {
        super(metadata, currentObject);
    }

    createView(): HTMLElement {
        const view = document.createElement('input');
        view.disabled = true;

        return view;
    }

    updateView(value: any): void {
        (this.view as HTMLInputElement).value = value;
    }
}
