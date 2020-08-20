export interface OrderDetailShiwake{
    journalCode:string,
    accountCode:string,
    journalName:string,
    orderSuplierCode:string,
    orderSuplierName:string,
    orderPlanAmount:string,

}

export interface OrderDetailSplit{
    orderPlanAmount:string,
    requestDate:string,
    requester:string,
    approvalDate_lv1:string,
    approvalPerson_lv1:string,
    approvalDate_lv2:string,
    approvalPerson_lv2:string,
    orderDate:string,
    orderAmount:string,
    recievedDate:string,
    recievedAmount:string,
    paymentDate:string,
    paymentAmount:string,
    
}