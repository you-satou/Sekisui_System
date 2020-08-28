export class OrderDetailAddInputType{
    journalCode: String;
    accountingCategory: String;
    orderJournalName: String;
    supplierCode: String;
    supplierJournalName: String;
    orderPlansKin:String;
}

export class OrderJournalSelectType {
    journalCode: String;
    accountingCategory: String;
    orderJournalName: String;
}

export class OrderSupplierSelectType {
    supplierCode: String;
    supplierJournalName: String;
    delivery: String;
}

