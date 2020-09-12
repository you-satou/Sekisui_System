import { PatternList } from '../entities/odis0050-PatternList.entity'
import { SupplierPatternList } from'../entities/odis0050-SuppierPattern.entity'
import { SupplierList } from '../entities/odis0050-SupplierList.entity'
/**
 * 発注明細入力_発注先パターン選択フォーム
 */
export interface ODIS0050SupplierPatternTotalInfo{

    /** パターン名エンティティ */
    patternData: PatternList[];
    /** 仕訳コードエンティティ */
    supplierData: SupplierList[];
    /** 戻り値エンティティ */
    supplierPatternData: SupplierPatternList[];

}
