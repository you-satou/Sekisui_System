import { CommonService } from 'app/common/common.service';
import { HttpClient } from '@angular/common/http';

export class ODIS0010Services extends CommonService{


    constructor(
        http: HttpClient,
    ){
        super(http);
    }
}