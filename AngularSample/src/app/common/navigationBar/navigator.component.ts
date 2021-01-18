import { Router } from '@angular/router';
import { LoginUserEntity } from 'app/ODIS0000/entities/odis0000-loginInfo.entity';
import { CommonService } from 'app/common/common.service';
import { Component, Input, OnInit } from '@angular/core';
import { Const } from '../const';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css'],
})

export class AppNavigator implements OnInit {

  @Input() loginInfo: LoginUserEntity;

  currentTime: any;
  systemDate: Date = new Date();
  
  day: string[] = ["日", "月", "火", "水", "木", "金", "土"];

  constructor(
    private commonService: CommonService,
    private route: Router,
  ) {

  }

  ngOnInit(): void {

    this.currentTime = this.getSystemDate();
  }

  /**
  * ロカールに時刻を取得する
  */
  ngAfterViewInit() {
    setInterval(() => {
      this.systemDate = new Date();
      this.currentTime = this.getSystemDate();
    }, 1000);
  }
  /**
   * システム日付を取得する
   */
  private getSystemDate(): string {
    return `${this.systemDate.toLocaleDateString()}(${this.day[this.systemDate.getDay()]}) ${this.systemDate.toLocaleTimeString().slice(0, -3)}`;
  }

  public logoClick($event) {

  }

  public async logOut($event) {

    const token = sessionStorage.getItem(Const.General.AccessToken);
    sessionStorage.clear();
    sessionStorage.setItem(Const.General.AccessToken, token);
    // ユーザ切り替えリンクに遷移する。
    this.commonService.logOut(Const.UrlLinkName.S0000_LogOut);
    this.route.navigate(['']);
  }

} 