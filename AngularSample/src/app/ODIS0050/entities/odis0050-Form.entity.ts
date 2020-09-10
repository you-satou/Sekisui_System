import { PatternList } from '../entities/odis0050-PatternList.entity'
import { SupplierPatternList } from'../entities/odis0050-SuppierPattern.entity'
import { SupplierList } from '../entities/odis0050-SupplierList.entity'

export interface ODIS0050SupplierPatternTotalInfo{

    patternData: PatternList[];

    supplierData: SupplierList[];

    supplierPatternData: SupplierPatternList[];

}
