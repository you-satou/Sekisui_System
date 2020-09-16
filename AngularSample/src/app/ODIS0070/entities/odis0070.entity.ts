/**
   * 発注分割承認者マスタのインターフェース
   */
export interface OrderSplitApprovalMasterTable{
    personalID: string;
    employeeCode: string;
    employeeName: string;
    approval1: string;
    approval2: string;
    deleteFlag: string;
}