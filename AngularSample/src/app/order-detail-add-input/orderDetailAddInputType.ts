export class OrderDetailAddInputType{
    journalCode: String;
    accountingCategory: String;
    journalName: String;
    supplierCode: String;
    supplierName: String;
    orderPlansKin:String;
}

export class OrderJournalSelectType {
    journalCode: String;
    accountingCategory: String;
    journalName: String;
}

export class OrderSupplierSelectType {
    supplierCode: String;
    journalName: String;
    delivery: String;
}

