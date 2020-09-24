import { ODIS0020OrderShiwake } from './odis0020-OrderDetailList.entity';

/**
 * 親に渡すデータの定義
 */
export class DataEmitter {

    id: number;
    action: string;
    selected: boolean;
  
    data: ODIS0020OrderShiwake;
  
    constructor() { }
  }
  
  /**
   * 
   */
  export class TableStatus {
    rowIndex: number;
    isSelected: boolean = false;
  
    constructor() {
      this.Reset();
    }
  
    Reset() {
      this.rowIndex = null;
      this.isSelected = false;
    }
  }