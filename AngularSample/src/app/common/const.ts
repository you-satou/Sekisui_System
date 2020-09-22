/** システム定数クラス */
export namespace Const{
    
    /** 画面名 */
    export namespace ScreenName {
        export const S0000 = 'Index'
        export const S0001 = '発注明細入力_承認処理'
        export const S0002 = '発注明細入力_詳細入力'
        export const S0003 = '発注明細入力_発注先パターン選択'
        export const S0004 = '発注仕訳マスタ選択'
        export const S0005 = '発注先マスタ選択'
        export const S0006 = '発注明細入力_分割明細入力'
        export const S0007 = '発注分割承認者マスタ'
    }

    /** リンク */
    export namespace LinKSetting {
        export const L0000 = '<a href="#">TOP<a> >'
        export const L0001 = '<a href="/OrderDetailApproval">発注明細入力_明細入力<a> >'
        export const L0002 = '<a href="/OrderDetailInput>"発注明細入力_明細入力<a> >'
        export const L0003 = '<a href="/SupplierPattern>"発注明細入力_発注先パターン選択<a> >'
        export const L0004 = '<a href="/OrderJournalSelect>"発注仕訳マスタ選択<a> >'
        export const L0005 = '<a href="/OrderSupplierSelect>"発注先マスタ選択<a> >'
        export const L0006 = '<a href="/SplitDetailInput>"発注明細入力_分割明細入力<a> >'
        export const L0007 = '<a href="/OrderSplitApprovalMaster>"発注分割承認者マスタ<a> >'
    }

    /** リンクの定義 */
    export namespace UrlLinkName {
        export const S0001_Search = '/ODIS0010/search';
        // export const S0002_Search = '/ODIS0020/Search';
        export const S0003_Init = '/ODIS0030/init';
        export const S0004_Init = '/ODIS0040/init';
        export const S0005_Init = '/ODIS0050/init';

        export const S0007_Init = '/ODIS0070/init';
    }

    /** ページのURLを定義する */
    export namespace UrlSetting{
        /** TOP */
        export const U0000 = '/';

        /** 発注明細入力_承認処理 */
        export const U0001 = '/OrderDetailApproval';

        /** 発注明細入力_明細入力 */
        export const U0002 = '/OrderDetailInput';

        /** 発注明細入力_発注先パターン選択 */
        export const U0003 = '/SupplierPattern';

        /** 発注仕訳マスタ選択 */
        export const U0004 = '/OrderJournalSelect';

        /** 発注先マスタ選択 */
        export const U0005 = '/OrderSupplierSelect';

        /** 発注明細入力_分割明細入力 */
        export const U0006 = '/SplitDetailInput';

        /** 発注分割承認者マスタ */
        export const U0007 = '/OrderSplitApprovalMaster';

    }

    /**
     * 行動の定義
     */
    export namespace Action{

        /** 行の追加 */
        export const A0001 = 'RowInsert';

        /** 行の変更 */
        export const A0002 = 'RowModified';

        /** 行の削除 */
        export const A0003 = 'RowDelete';

        /** 行の選択 */
        export const T0001 = 'RowSelect';

        /** 行にて反映ボタンを押下する */
        export const T0002 = 'DisplaySplitAmount';

        /** 行を外す */
        export const T0003 = 'UnSelected';

    }

    /** 背景の色のコード */
    export namespace HighLightColour{

        export const None = '';
        export const Black = 'Black';
        export const Selected = '#CCFFFF';
        export const Modified = '#F57C00';
        export const Inserted = '#40a8c4';

    }
    
    /** エラーメッセージ */
    export namespace ErrorMsg{

        export const E0001 = '{0}が{1}を超えています。';
        export const E0002 = '該当データがありません。';
        export const E0003 = '発注仕訳コードは必須入力です。';
        export const E0004 = '経理分類は必須入力です。';
        export const E0005 = '発注先は必須入力です。';
        export const E0006 = '発注予定金額は必須入力です。';
        export const E0007 = '発注金額は必須入力です。';
        export const E0008 = '選択してください';

    }
}