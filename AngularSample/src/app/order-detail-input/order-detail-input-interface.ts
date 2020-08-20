export interface OrderDetailShiwake{
    journalCode: string;
    accountCode: string;
    journalName: string;
    orderSuplierCode: string;
    orderSuplierName: string;
    orderPlanAmount: string;

}

export interface OrderDetailSplit{
    orderPlanAmount: string;
    requestDate: string;
    requester: string;
    approvalDate_lv1: string;
    approvalPerson_lv1: string;
    approvalDate_lv2: string;
    approvalPerson_lv2: string;
    orderDate: string;
    orderAmount: string;
    recievedDate: string;
    recievedAmount: string;
    paymentDate: string;
    paymentAmount: string;
    
}

export class OrderDetailInput{
    contractNum: string;
    officeCode: string;
    officeName: string;
    salesStaffCode: string;
    salesStaffName: string;
    architectCode: string;
    architectName: string;
    constructionKata: string;
    constructionHira: string;
    contractorCode: string;
    contractorName: string;
    // 予定年月日
    planContractDate: string;
    planDODate: string;
    planStartDate: string;
    planArrivalDate: string;
    planWoodWorkDate: string;
    planInspectionDate: string;
    planCompletionInspection: string;
    planHandingOver: string;

    //実績年月日
    perforContractDate: string;
    perforDODate: string;
    perforStartDate: string;
    perforArrivalDate: string;
    perforWoodWorkDate: string;
    perforInspectionDate: string;
    perforCompletionInspection: string;
    perforHandingOver: string;

    constructor() {}

}

export interface OrderTABLE1{
    contractNum: string;
    officeCode: string;
    officeName: string;
    salesStaffCode: string;
    salesStaffName: string;
    architectCode: string;
    architectName: string;
    constructionKata: string;
    constructionHira: string;
    contractorCode: string;
    contractorName: string;
    // 予定年月日
    planContractDate: string;
    planDODate: string;
    planStartDate: string;
    planArrivalDate: string;
    planWoodWorkDate: string;
    planInspectionDate: string;
    planCompletionInspection: string;
    planHandingOver: string;

    //実績年月日
    perforContractDate: string;
    perforDODate: string;
    perforStartDate: string;
    perforArrivalDate: string;
    perforWoodWorkDate: string;
    perforInspectionDate: string;
    perforCompletionInspection: string;
    perforHandingOver: string;

}

export interface OrderTABLE2{
    contractNum: string;
    officeCode: string;
    officeName: string;
    salesStaffCode: string;
    salesStaffName: string;
    architectCode: string;
    architectName: string;
    constructionKata: string;
    constructionHira: string;
    contractorCode: string;
    contractorName: string;
    // 予定年月日
    planContractDate: string;
    planDODate: string;
    planStartDate: string;
    planArrivalDate: string;
    planWoodWorkDate: string;
    planInspectionDate: string;
    planCompletionInspection: string;
    planHandingOver: string;

    //実績年月日
    perforContractDate: string;
    perforDODate: string;
    perforStartDate: string;
    perforArrivalDate: string;
    perforWoodWorkDate: string;
    perforInspectionDate: string;
    perforCompletionInspection: string;
    perforHandingOver: string;

}
