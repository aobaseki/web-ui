import LocalInfo from "./LocalInfo";
import ModelAction from "./ModelAction";
import isSameDay from "date-fns/isSameDay";
import isWeek from "date-fns/isThisWeek";
import isThisMonth from "date-fns/isThisMonth";
import isYear from "date-fns/isThisYear";
import SaleService from "./SaleService";

export default class InvoiceService {
    constructor(){
        this.branchId = LocalInfo.branchId;
    }

    static async getInvoiceHistory(duration , date){
        const sales = await new ModelAction('Sales').findByColumnNotObserve(
            {
                name: 'branchId',
                value: LocalInfo.branchId,
                fxn: 'eq'
            }
        );

        switch (duration) {
            case 'day':
                const day = new Date(date);
                return sales.filter(sale => isSameDay(sale.createdAt , day));
            case 'week':
                return sales.filter(sale => isWeek(sale.createdAt));
            case 'month':
                return sales.filter(sale => isThisMonth(sale.createdAt));
            case 'year':
                return sales.filter(sale => isYear(sale.createdAt));
        }
    }

    async getInvoiceDetails(duration , date) {
        const invoice = await InvoiceService.getInvoiceHistory(duration , date);

        let costPrice = 0;
        let profit = 0;
        let credit = 0;
        let sellingPrice = 0;
        let quantity = 0;

        for (let step = 0; step < invoice.length; step++) {
            costPrice += parseFloat(await SaleService.getSaleEntryCostPriceById(invoice[step].id));
        }

        for (let step = 0; step < invoice.length; step++) {
            profit += parseFloat(await SaleService.getSaleEntryProfitById(invoice[step].id));
        }

        for (let step = 0; step < invoice.length; step++) {
            credit += parseFloat(await SaleService.getSaleEntryCreditById(invoice[step].id));
        }

        for (let step = 0; step < invoice.length; step++) {
            sellingPrice += parseFloat(await SaleService.getSaleEntrySellingPriceById(invoice[step].id));
        }

        for (let step = 0; step < invoice.length; step++) {
            quantity += parseFloat(await SaleService.getSaleProductQuantity(invoice[step].id));
        }

        return {
            invoices: invoice,
            costPrice,
            profit,
            credit,
            sellingPrice,
            quantity
        }
    }
}