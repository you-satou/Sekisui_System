import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonService } from './common/common.service';
import { Const } from './common/const';
import { LoginUserEntity } from './ODIS0000/entities/odis0000-loginInfo.entity';

@Injectable({
    providedIn: 'root',
  })

export class LoginInfoRequestService implements OnInit {

    private loginUserInfo = new Subject<LoginUserEntity>();

    public userInfoSubscriber$ = this.loginUserInfo.asObservable();

    private _loginInfo: LoginUserEntity;

    constructor(
        private commonService: CommonService,
    ) { }

    ngOnInit(): void {
        this.sendRequestUserInfo();
    }

    /** サーバーからログイン情報を取得 */
    private async sendRequestUserInfo() {
        const res = await this.commonService.fetchAuthorization(Const.UrlLinkName.S0000_FetchUserInfo);

        if (res.result === Const.ConnectResult.R0001) {
            this._loginInfo = res.applicationData;
            this.loginUserInfo.next(this._loginInfo);
        }

        console.log(res);
        
    }

    public fetchLoginInfo(){
        this.sendRequestUserInfo();
    }

}