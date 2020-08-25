export interface OrderDetail {

    contractNum: string;
    propertyName: string;
    planOrderAmount: string;
    approvalRequestAmount: string;
    performanceOrderAmount: string;
    receivedAmount: string;
    progressRate: string;
    createdDetail: string;
    approval_1: string;
    approval_2: string;

}

export class OrderSearchInputment {

    contractNumFrom: string;
    contractNumTo: string;
    propertyName: string;
    startFromName: boolean;
    includeProName: boolean;
    detailCreated: boolean;
    detailNone: boolean;
    approval_1: boolean;
    approval_2: boolean;

    constructor() {}
}

