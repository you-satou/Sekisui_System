import { ODIS0010Form } from './odis0010-Form.entity';
import { ODIS0010OrderDetail } from './odis0010.entity';


export class ODIS0010Session{
    
    /**明細一覧のソート順とページナンバー*/
    currentPage: number;
    
    /**入力された検索値 */
    inputForm : ODIS0010Form;
    
    /**明細一覧データ */
    resultData: ODIS0010OrderDetail[];

    constructor(){}

}
export class TableStatus{
  
    /**ページナンバー */
    pgIndex: number;

    /**ソートされた一覧データ */
    sortedData: ODIS0010OrderDetail[];
  
    constructor(){ }

}