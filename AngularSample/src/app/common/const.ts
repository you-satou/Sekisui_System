/** システム定数クラス */
export namespace Const{
    
    /** 画面名 */
    export namespace ScreenName {
        export const S0000 = 'Index';
        export const S0001 = '発注明細入力_承認処理';
        export const S0002 = '発注明細入力_詳細入力';
        export const S0003 = '発注明細入力_発注先パターン選択';
        export const S0004 = '発注仕訳マスタ選択';
        export const S0005 = '発注先マスタ選択';
        export const S0006 = '発注明細入力_分割明細入力';
        export const S0007 = '発注承認者マスタ';

        export const S0001EN = 'OrderDetailApproval';
        export const S0002EN = 'OrderDetailInput';
        export const S0003EN = 'OrderJournalSelect';
        export const S0004EN = 'OrderSupplierSelect';
        export const S0005EN = 'SupplierPattern';
        export const S0006EN = 'SplitDetailInput';
        export const S0007EN = 'OrderSplitApprovalMaster';
    }


    /** リンク */
    export namespace LinKSetting {
        export const L0000 = '<a href="#">TOP</a> > ';
        export const L0001 = '<a href="/OrderDetailApproval">発注明細入力_承認処理</a> > ';
        export const L0002 = '<a href="/OrderDetailInput">発注明細入力_明細入力</a> >';
        export const L0003 = '<a href="/SupplierPattern">発注明細入力_発注先パターン選択<a> > ';
        export const L0004 = '<a href="/OrderJournalSelect">発注仕訳マスタ選択</a> > ';
        export const L0005 = '<a href="/OrderSupplierSelect">発注先マスタ選択</a> > ';
        export const L0006 = '<a href="/SplitDetailInput">発注明細入力_分割明細入力</a> > ';
        export const L0007 = '<a href="/OrderSplitApprovalMaster">発注承認者マスタ</a> > ';
    }

    /** リンクの定義 */
    export namespace UrlLinkName {
        
        //Component名
        export const L0001 = '/ODIS0010';
        export const L0002 = '/ODIS0020';
        export const L0003 = '/ODIS0030';
        export const L0004 = '/ODIS0040';
        export const L0005 = '/ODIS0050';
        export const L0006 = '/ODIS0060';
        export const L0007 = '/ODIS0070';

        export const S0001_Search = '/ODIS0010/search';
        export const S0002_Init = '/ODIS0020/init';
        export const S0002_GetOrderCode = '/ODIS0020/getOrderCode';
        export const S0002_GetJournalCode = '/ODIS0020/getJournalCode';
        export const S0002_UPDATE = '/ODIS0020/update';
        export const S0003_Init = '/ODIS0030/init';
        export const S0004_Init = '/ODIS0040/init';
        export const S0005_Init = '/ODIS0050/init';
        export const S0007_Init = '/ODIS0070/init';
        export const S0007_GetUser = '/ODIS0070/getUser';
        export const S0007_Insert = '/ODIS0070/insert';
        export const S0007_Update = '/ODIS0070/update';
        export const S0007_Delete = '/ODIS0070/delete';

        
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

        /** 発注承認者マスタ */
        export const U0007 = '/OrderSplitApprovalMaster';

    }

    /**
     * 行動の定義
     * A: Action - テーブル、ページに対する行動
     * 
     * SA: Server Action サーバに行動する
     */
    export namespace Action{

        /** 行の追加 */
        export const A0001 = 'RowInsert';
        /** 行の変更 */
        export const A0002 = 'RowModified';
        /** 行の削除 */
        export const A0003 = 'RowDelete';
        /** 行の選択 */
        export const A0004 = 'RowSelect';
        /** 行にて反映ボタンを押下する */
        export const A0005 = 'DisplaySplitAmount';
        /** 行を外す */
        export const A0006 = 'UnSelected';

        export const A0007 = 'MoveToSplitPage';

        /**発注コードを取得 */
        export const SA_GET_ORDER_CODE = '/getOrderCode';
        /**仕訳コードを取得 */
        export const SA_GET_JOURNAL_CODE = '/getJournalCode';

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
        export const E0001 = `契約番号Fromが契約番号Toを超えています。`;
        export const E0002 = '該当データがありません。';
        export const E0003 = '発注仕訳コードは必須入力です。';
        export const E0004 = '経理分類は必須入力です。';
        export const E0005 = '発注先は必須入力です。';
        export const E0006 = '発注予定金額は必須入力です。';
        export const E0007 = '発注金額は必須入力です。';
        export const E0008 = '対象データを選択してください';
        //分割明細用エラーメッセージ
        export const E0010 = '明細情報を入力して下さい。';
        export const E0012 = '発注予定金額が未入力な状態で依頼ができません。';
        export const E0013 = '更新する明細を選択してください。';
        export const E0014 = '承認済な明細は更新できません。';
        export const E0015 = '変更されていないデータは更新できません。';
        export const E0016 = '個人認証ＩＤは必須入力です。';
    }
    /**
     * 警告メッセージ
     */
    export namespace WarningMsg {

        export const W0001 = '明細削除処理を行いますか？';
        export const W0002 = '通信中。。。';
        export const W0003 = '変更内容を更新せず、\n 承認処理画面に戻りますが、よろしいでしょうか';
    }

    /**
     * データベース接続結果
     */
    export namespace ConnectResult{

        export const R0001 = 'OK';
        export const R0002 = 'NG';

    } 

    /**
     * 受注枝番
     */
    export namespace JutyuEdaban{

        export const TabIndex_0 = '0'
        export const TabIndex_1 = '1'
        export const TabIndex_2 = '2'
    }

    /**
     * 受注枝番
     */
    export namespace TabName{
        export const TabName_0 = '設計'
        export const TabName_1 = '本体'
        export const TabName_2 = '追加'
    }
    
}