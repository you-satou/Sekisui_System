import { ClassField } from '@angular/compiler';

export class OrderDetail{

    contractNum: string;
    propertyName: string;
    planOrderAmout:string;
    approvalRequestAmount:string;
    performanceOrderAmount:string;
    receivedAmount:string;
    progessRate:string;
    createdDetail:string;
    approval_1:string;
    approval_2:string;

}

export class OrderSearchInputment{
    contractNumFrom:string;
    contractNumTo:string;
    propertyName:string;
    startFromName:boolean;
    includeProName: boolean;
    detailCreated:boolean;
    detailNone:boolean;
    approval_1:boolean;
    approval_2:boolean;
    resultASC:boolean;
    
}

