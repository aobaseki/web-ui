import CartService from "./CartService";
import database from "../models/database";
import Carts from "../models/carts/Carts";
import {v4 as uuid} from 'uuid';
import LocalInfo from "./LocalInfo";
import ModelAction from "./ModelAction";
import SaleInstallments from "../models/saleInstallments/SaleInstallment";

export default class SaleService {
    async makeSell(data , paymentType){
        console.log(data , paymentType)
        const cartId = await new CartService().cartId();
        console.log(cartId)
        try {
            const cartCollection = await database.collections.get(Carts.table);
            const cart = await cartCollection.find(cartId);
            console.log(cart);
            const salesColumn = {
                type: 'sales',
                paymentType: SaleService.getPaymentType(paymentType),
                customerId: cart.customerId,
                discount: cart.discount,
                branchId: cart.branchId,
                receiptNumber: uuid(),
                createdBy: LocalInfo.userId,
            };

            console.log(salesColumn);
            await new ModelAction('Sales').post(salesColumn);
            const sale = await SaleService.getLastSale();
            await database.adapter.setLocal("saleId" , sale.id);

            console.log(sale);
            try {
                SaleService.importCartToSales(cartId , sale);
                SaleService.makePayment(sale , data);
                await database.adapter.removeLocal("activeCustomer");
                await database.adapter.removeLocal("cartId");
                localStorage.removeItem("cartId");
            }catch (e) {
                return false
            }

            return false;
        } catch (e) {
            return e;
        }
    }

    static getPaymentType(paymentType){
        switch (paymentType) {
            case 0:
                return 'cash';
            case 1:
                return 'MoMo';
            case 2:
                return 'credit';
            case 3:
                return 'other';
            default:
                return 'cash';
        }
    }

    static async makePayment(sales , data){
        console.log(sales , data)
        const salePaymentColumns = {
            saleId: sales.id,
            customerId: sales.customerId,
            createdBy: LocalInfo.userId,
            amount: parseFloat(data.amountPaid),
        };

        try {
            await new ModelAction('SaleInstallment').post(salePaymentColumns);
        } catch (e) {
            return false;
        }
    }

    static async getLastSale(){
        const sales = await new ModelAction('Sales').findByColumnNotObserve({
            name: 'branchId',
            value: LocalInfo.branchId,
            fxn: 'eq',
        });

        console.log(sales)
        return sales[sales.length - 1];
    }

    static async importCartToSales(cartId , sale){
        const cartEntries = await new ModelAction('CartEntry').findByColumnNotObserve({
            name: 'cartId',
            value: cartId,
            fxn: 'eq',
        });

        cartEntries.forEach(async entry => {
            const entryColumns = {
                productId: entry.productId,
                customerId: entry.customerId,
                sellingPrice: entry.sellingPrice,
                quantity: entry.quantity,
                saleId: sale.id,
                discount: entry.discount,
                costPrice: entry.costPrice,
                branchId: entry.branchId,
                branchProductId: entry.branchProductId,
            };

            await new ModelAction('SaleEntry').post(entryColumns);
        });
    }

    /*
    *
    * Get cart individual items total
    * */
    getSaleEntryTotal(product){
        return parseFloat(((product.sellingPrice * product.quantity) - product.discount)).toFixed(2);
    }

    /*
    * Get Cart products by Id
    */
    async getSaleProductsById(saleId){
        try {
            const saleCollection = await new ModelAction('SaleEntry').findByColumnNotObserve({
                name: 'saleId',
                value: saleId,
                fxn: 'eq',
            });

            return saleCollection;
        }catch (e) {
            return e;
        }
    }

    /*
    * Get Sale payment by Id
    */
    async getSalePaymentById(saleId){
        try {
            let paymentCollection = new ModelAction('SaleInstallment').findByColumnNotObserve({
                name: 'saleId',
                value: saleId,
                fxn: 'eq'
            });
            paymentCollection = await paymentCollection;

            return paymentCollection;
        }catch (e) {
            return e;
        }
    }
    /*
    * Get sale total amount by Id
    * */
    static async getSaleEntryAmountById(saleId){
        return ((await new SaleService().getSaleProductsById(saleId))).reduce((a, b) => parseFloat(a) + parseFloat(new SaleService().getSaleEntryTotal(b) || 0), 0).toFixed(2);
    }

    /*
    * Get sale total amountPaid by Id
    * */
    static async getSaleEntryAmountPaidById(saleId){
        return ((await new SaleService().getSalePaymentById(saleId))).reduce((a, b) => parseFloat(a) + parseFloat(b.amount || 0), 0).toFixed(2);
    }
}