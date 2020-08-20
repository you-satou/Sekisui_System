import { MatPaginatorIntl } from '@angular/material';

export function OrderDetailPaginator(){

    const paginator = new MatPaginatorIntl();

    paginator.getRangeLabel = function(page:number,pageSize:number,length:number){

        if (length === 0 || pageSize === 0) {
            return "";
        }
          length = Math.max(length, 0);
          const startIndex = page * pageSize;
          const endIndex = startIndex < length ? 
          Math.min(startIndex + pageSize, length) : startIndex + pageSize;

          return startIndex + 1 +"-" + endIndex;
    }
      
    return paginator;

}