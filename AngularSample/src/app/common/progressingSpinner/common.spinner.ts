import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'loading-spinner',
  templateUrl: './common.spinner.html',
  styleUrls: ['./common.spinner.css'],
})

export class LoadingSpinner implements OnInit{

  /** ロード中に表示するテキスト */
  @Input() loaderText: string;

  /**テキストのアニメーション設定するかどうか */
  @Input() textAnimation: string = '';


  get animationText(){
    if(this.textAnimation === 'true'){
      return true;
    }
    return false;
  }
  staticText:boolean = !this.animationText;
    
  constructor( ) {}

  ngOnInit() { }

}
