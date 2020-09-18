/**
 * 戻り値エンティティ
 */
export class SupplierPatternList{
    /** 発注先パターン区分 */
    pKubun: String;
    /** 発注先パターン名 */
    pName: String;
    /** 発注先リスト */
    supplierList: SupplierPatternList[];
    
}