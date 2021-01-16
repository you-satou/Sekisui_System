import { SupplierList } from './odis0050-SupplierList.entity';

/**
 * 戻り値エンティティ
 */
export class SupplierPatternList{
    /** 発注先パターン区分 */
    pkubun: String;
    /** 発注先パターン名 */
    pname: String;
    /** 発注先リスト */
    supplierList: SupplierList[];
    
}