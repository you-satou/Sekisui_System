import { MatPaginatorIntl } from '@angular/material';

export function OrderDetailPaginator() {

    const paginator = new MatPaginatorIntl();

    paginator.getRangeLabel = function(page: number, pageSize: number, length: number) {
        if (length === 0 || pageSize === 0) {
            return '';
        }
        length = Math.max(length, 0);
        // return (page + 1) + ' / ' + (length % pageSize === 0 ? length / pageSize : (Math.floor(length / pageSize) +1));
        return '/ ' + (length % pageSize === 0 ? length / pageSize : (Math.floor(length / pageSize) +1));
    };


    return paginator;

}

