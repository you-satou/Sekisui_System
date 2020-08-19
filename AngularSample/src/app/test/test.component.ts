import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  
  title = "発注仕訳マスタ選択";
  testWidth: Number;
  testShiwakeKodeWidth: Number;
  testShiwakeKeiriWidth: Number;
  testShiwakeNameWidth: Number;

  ngOnInit() {
    this.testWidth = document.getElementById("testTable").clientWidth;

    this.testShiwakeKodeWidth = document.getElementById("testShiwakeKode").clientWidth;

    this.testShiwakeKeiriWidth = document.getElementById("testShiwakeKeiri").clientWidth;

    this.testShiwakeNameWidth = document.getElementById("testShiwakeName").clientWidth;


  }

}
