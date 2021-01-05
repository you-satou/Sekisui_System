import { Subject } from 'rxjs';
import { OnInit } from '@angular/core';
import { LoginUserInterface } from './login-info.entity';
import { CommonService } from 'app/common/common.service';

export abstract class LoginInfoRequestService implements OnInit{

    loginInfo: LoginUserInterface;

    // ログイン情報を観察対象
    private userInfo = new Subject<any>();

    // ログイン情報を
    public userInfo$ = this.userInfo.asObservable();

    private readonly USER_INFO_REQUEST = '/Login';


    constructor(
        private baseService: CommonService
    ){
        
        // TODO: Get user's infomation data.
        this.baseService.getLoginInformation(this.USER_INFO_REQUEST)
        .then(
            (res) =>{
                this.userInfo.next(res);       
            }
        )
    }
    ngOnInit(): void {
        
    }




}