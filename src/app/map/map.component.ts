import { Component, OnInit } from "@angular/core";

@Component({
    selector: "map",
    moduleId: module.id,
    templateUrl: "./map.component.html"
})
export class MapComponent implements OnInit {

    public placeholder : string;

    constructor() { }

    ngOnInit(): void {
      this.placeholder = "This is a test";
    }
}
