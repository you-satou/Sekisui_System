import { ODIS0080InitParam } from './odis0080.form.entity';
import { ODIS0080GrossProfitBean } from './odis0080.GrossProfit.entity';
import { ODIS0080OrderInfoBean } from './odis0080.OrderInfo.entity';

export class ODIS0080Session {

    initParam : ODIS0080InitParam;

    orderInfoData: ODIS0080OrderInfoBean;

	grossProfitListData: ODIS0080GrossProfitBean[];


}