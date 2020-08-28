/** システム定数クラス */
export namespace Const{
    
    /** 画面名 */
    export namespace ScreenName {
        export const S0000 = "Index"
        export const S0001 = "発注明細入力_承認処理"
        export const S0002 = "発注明細入力_詳細入力"
        export const S0003 = "発注明細入力_発注先パターン選択"
        export const S0004 = "発注明細入力_明細入力"
        export const S0005 = "発注仕訳マスタ選択"
        export const S0006 = "発注先マスタ選択"
        export const S0007 = "発注明細入力_分割明細入力"
        export const S0008 = "発注明細入力_分割明細入力明細追加"
    }

    /** リンク */
    export namespace LinKSetting {
        export const L0000 = "<a href='#'>TOP<a> >"
        export const L0001 = "<a href='/OrderDetailApproval'>発注明細入力_明細入力<a> >"
        export const L0002 = "<a href='/OrderDetailInput>'発注明細入力_明細入力<a> >"
        export const L0003 = "<a href='/SupplierPattern>'発注明細入力_発注先パターン選択<a> >"
        export const L0004 = "<a href='/OrderDetailAddInput>'発注明細入力_明細入力<a> >"
        export const L0005 = "<a href='/OrderJournalSelect>'発注仕訳マスタ選択<a> >"
        export const L0006 = "<a href='/OrderSupplierSelect>'発注先マスタ選択<a> >"
        export const L0007 = "<a href='/SplitDetailInput>'発注明細入力_分割明細入力<a> >"
        export const L0008 = "<a href='/AddOrderDetail>'発注明細入力_分割明細入力明細追加<a> >"
    }

    export namespace UrlLinkName {
        export const S0001_Search = "/OrderDetailApproval/Search";
        export const S0002_Search = "/OrderDetailInput/Search";
        // export const L0001 = "<a href='/OrderDetailApproval'>発注明細入力_明細入力<a> >"
        // export const L0002 = "<a href='/OrderDetailInput>'発注明細入力_明細入力<a> >"
        // export const L0003 = "<a href='/SupplierPattern>'発注明細入力_発注先パターン選択<a> >"
        // export const L0004 = "<a href='/OrderDetailAddInput>'発注明細入力_明細入力<a> >"
        // export const L0005 = "<a href='/SupplierPattern>'発注仕訳マスタ選択<a> >"
        // export const L0006 = "<a href='/OrderSupplierSelect>'発注先マスタ選択<a> >"
        // export const L0007 = "<a href='/SplitDetailInput>'発注明細入力_分割明細入力<a> >"
        // export const L0008 = "<a href='/AddOrderDetail>'発注明細入力_分割明細入力明細追加<a> >"
    }

    export namespace UrlSetting{
        export const U0000 = "/";//TOP
        export const U0001 = "/OrderDetailApproval";//発注明細入力_明細入力
        export const U0002 = "/OrderDetailInput";//発注明細入力_明細入力
        export const U0003 = "/SupplierPattern";//発注明細入力_発注先パターン選択
        export const U0004 = "/OrderDetailAddInput>";//発注明細入力_明細入力
        export const U0005 = "/OrderJournalSelect";//発注仕訳マスタ選択
        export const U0006 = "/OrderSupplierSelect";//発注先マスタ選択
        export const U0007 = "/SplitDetailInput"//発注明細入力_分割明細入力
        export const U0008 = "/AddOrderDetail"//発注明細入力_分割明細入力明細追加


    }
}