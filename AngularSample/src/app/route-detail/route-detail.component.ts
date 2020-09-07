import { Component, OnInit } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: './app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.css']
})
export class RouteDetailComponent implements OnInit {
  data: WkAllItemType;
  errorFlg: boolean = false;
  constructor(
    private wkAllItemTypesService: WkAllItemTypesService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  //マウント時
  ngOnInit() {
    this.init();
  }
  //初期化処理
  init() {
    this.data = new WkAllItemType();
    //id取得
    const id = this.route.snapshot.paramMap.get('id');
    //idを元にデータを取得
    this.wkAllItemTypesService.findById(id)
      .subscribe(responce => {
        //データをセット
        this.data = responce;
      });
  }
  //更新処理
  update() {
    //サービス経由で更新
    this.wkAllItemTypesService.update(this.data).subscribe(
      response => {
        if (response === 1) {
          window.alert("更新処理が完了しました")
          //トップぺージへリダイレクト
          this.router.navigate(['/']);
          //検索URLを初期化
          this.wkAllItemTypesService.setSearchUrl("");
        }
      }
    );
  }
  //トップページへ戻る
  back() {
    this.router.navigate(['/']);
  }
}