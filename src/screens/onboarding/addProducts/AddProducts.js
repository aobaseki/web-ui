import React, {Component} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {withRouter} from "react-router";
import './sections/AddProducts.scss';
import MainView from "./sections/MainView";
import AddProductView from "./sections/AddProductView";
import AddedProductView from "./sections/AddedProductView";
import {confirmAlert} from "react-confirm-alert";
import EditProductView from "./sections/EditProductView";
import CompleteView from "./sections/CompleteView";
import './addProduct.scss';
import Api from "../../../services/Api";
import { v1 as uuidv1 } from 'uuid';

class AddProducts extends Component{
    state = {
        isDrawerShow: false,
        value: 0,
        storeProducts: 1,
        loading: false,
        activeStep: 0,
        currentProduct: 0,
        productList: [

        ],
        addedProducts: [

        ]
    };

    /*searchProductHandler = (search) => {
        /!*
        * @todo
        * Work on fetchin data from source
        * *!/
        const old_products = this.state.productList;

        const products = old_products.filter(function(item) {
            return (item.pro_name).toLowerCase().indexOf(search.toLowerCase()) !== -1
        });

        this.setState({
            productList: products
        });
    };*/

    async componentDidMount() {
        const branchId = localStorage.getItem('activeBranch');
        const accessToken = localStorage.getItem('accessToken');
        try {
            let products = await new Api('others').index(
                {},
                {'Authorization': `Bearer ${accessToken}`},
                `https://elp-core-api-dev.herokuapp.com/v1/client/branches/${branchId}/products`,
            );

            localStorage.setItem('storeProductsLookup' , JSON.stringify(products.data.products));

            this.setState({
                'productList' : products.data.products,
            });

            console.log(products);
        }catch (error) {
            console.log(error)
        }
    }

    //Steps to select category
    getSteps = () => {
        return ['Main View' , 'Product Details View'];
    };

    getStepContent = step => {
        const shop_products = (this.state.productList).filter((item) => item['status'] === true);

        switch (step) {
            case 0:
                return <MainView searchHandler={this.searchHandler.bind(this)} optionFilter={this.optionProductHandler.bind(this)} finishAddProducts={this.completeAddProducts.bind(this)} loading={this.state.loading} searchBarcode={this.searchBarcode.bind(this)} setView={this.setStepContentView.bind(this)} product={this.state.currentProduct} viewAddedProducts={this.viewAddedProducts(this)} products={this.state.productList} productAdd={this.showAddView.bind(this)} removeProduct={this.removeProduct.bind(this)} spCount={shop_products.length} />;
            case 1:
                return <AddProductView deleteHistory={this.deleteHistory.bind(this)} undoAddProduct={this.undoAddProducts.bind(this)} addNewProduct={this.addNewProduct.bind(this)} setView={this.setStepContentView.bind(this)} product={this.state.currentProduct}/>;
            case 2:
                return <AddedProductView deleteProduct={this.deleteProduct.bind(this)} products={this.state.addedProducts} setView={this.setStepContentView.bind(this)} pro_quantity={this.state.storeProducts} productEdit={this.showEditView.bind(this)}/>;
            case 3:
                return <EditProductView products={this.state.addedProducts} setView={this.setStepContentView.bind(this)} product={this.state.currentProduct} />;
            case 4:
                return <CompleteView/>;
            default:
                return 'Complete';
        }
    };

    setStepContentView = step => {
        this.setState({
            activeStep: step
        });
    };

    /*
    * Search products handler...
    * */
    searchHandler = (search) => {
        console.log(search);
        /*
        * @todo
        * Work on fetching data from source
        * */
        let storeProducts = JSON.parse(localStorage.getItem('storeProductsLookup'));

        const searchResults = storeProducts.filter(function(item) {
            return (item.name).toLowerCase().indexOf(search.toLowerCase()) !== -1
        });

        this.setState({
            productList: searchResults
        });
    };

    completeAddProducts = async() => {
        const branchId = localStorage.getItem('activeBranch');
        const accessToken = localStorage.getItem('accessToken');

        this.setState({
            loading: true
        });

        const branchProductsAdded = JSON.parse(localStorage.getItem('branchProductsAdded')) || [];
        const branchProductsRemoved = localStorage.getItem('branchProductsRemoved') || [];
        const branchDeletedProducts = localStorage.getItem('branchDeletedProducts') || [];

        if (Array.isArray(branchProductsAdded) && branchProductsAdded.length) {
            console.log(branchProductsAdded);
            const addedProducts = await new Api('others').create(
                branchProductsAdded,
                {'Authorization': `Bearer ${accessToken}`},
                {},
                `https://elp-core-api-dev.herokuapp.com/v1/client/branches/${branchId}/products`,
            );

            localStorage.removeItem('branchProductsAdded');
            console.log(addedProducts);
        }

        if (typeof branchProductsRemoved != "undefined" && branchProductsRemoved != null && branchProductsRemoved.length != null
            && branchProductsRemoved.length > 0) {
            console.log(branchProductsRemoved);
            let removedProducts = await new Api('others').destroy(
                {'Authorization': `Bearer ${accessToken}`},
                {},
                `https://elp-core-api-dev.herokuapp.com/v1/client/branches/${branchId}/products?product_ids=${branchProductsRemoved}`,
            );

            localStorage.removeItem('branchProductsRemoved');
            console.log(removedProducts)
        }

        if (typeof branchDeletedProducts != "undefined" && branchDeletedProducts != null && branchDeletedProducts.length != null
            && branchDeletedProducts.length > 0) {
            console.log(branchDeletedProducts);
            let removedProducts = await new Api('others').destroy(
                {'Authorization': `Bearer ${accessToken}`},
                {},
                `https://elp-core-api-dev.herokuapp.com/v1/client/branches/${branchId}/histories?history_ids=${branchDeletedProducts}`,
            );

            localStorage.removeItem('branchProductsRemoved');
        }

        this.setState({
            loading: false,
            activeStep: 4,
        });
    };

    viewAddedProducts = () => {
        return 0;
    };

    deleteHistory = (historyId) => {
        //console.log(historyId);
        const branchDeletedProducts = JSON.parse(localStorage.getItem('branchDeletedProducts')) || [];

        /*if(branchDeletedProducts.filter((item) => item.id === historyId)){
            return false;
        }*/

        branchDeletedProducts.push(historyId);

        localStorage.setItem('branchDeletedProducts' , JSON.stringify(branchDeletedProducts));

        /*console.log(historyId);
        const productId = this.state.productList[0].id;
        console.log(productId);
        return true;
        let branchProductsAdded = JSON.parse(localStorage.getItem('branchProductsAdded')) || [];

        console.log(branchProductsAdded);
        const product = branchProductsAdded.findIndex((item => item.id === productId));
        console.log(product);
        //branchProductsAdded = (branchProductsAdded[product]).filter((history => (history.temp_id !== productId || history.temp_id !== historyId)));

        console.log(branchProductsAdded);
        return true;
        localStorage.setItem('branchProductsAdded' , JSON.stringify(branchProductsAdded));

        let branchProductsRemoved = JSON.parse(localStorage.getItem('branchProductsRemoved')) || [];

        let old_list = this.state.productList;

        const productIndex = old_list.findIndex((item => item.id === (productId)));
        const item = {...old_list[productIndex]};

        if(item.owned){
            item.owned = false;
        }

        branchProductsRemoved.push(productId);
        item.stock = [];

        old_list[productIndex] = item;

        console.log(item);
        localStorage.setItem('branchProductsRemoved' , JSON.stringify(branchProductsRemoved));

        localStorage.setItem('storeProductsLookup' , JSON.stringify(old_list));

        this.setState({
            productList: old_list
        });*/
    };

    undoAddProducts = () => {
        let branchProductsAdded = JSON.parse(localStorage.getItem('branchProductsAdded')) || [];
        branchProductsAdded = branchProductsAdded.filter((item => item.productId !== this.state.currentProduct[0].id));

        localStorage.setItem('branchProductsAdded' , JSON.stringify(branchProductsAdded));

        let branchProductsRemoved = JSON.parse(localStorage.getItem('branchProductsRemoved')) || [];

        let old_list = this.state.productList;

        const productIndex = old_list.findIndex((item => item.id === (this.state.currentProduct)));
        const item = {...old_list[productIndex]};

        if(item.owned){
            item.owned = false;
        }

        branchProductsRemoved.push(this.state.currentProduct);
        item.stock = [];

        old_list[productIndex] = item;

        console.log(item);
        localStorage.setItem('branchProductsRemoved' , JSON.stringify(branchProductsRemoved));

        localStorage.setItem('storeProductsLookup' , JSON.stringify(old_list));

        this.setState({
            productList: old_list
        });
    };

    removeProduct = (productId) => {
        confirmAlert({
            title: 'Confirm to remove',
            message: 'Are you sure you want to remove this product. It may be having stock',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        //console.log(formFields);
                        let branchProductsAdded = JSON.parse(localStorage.getItem('branchProductsAdded')) || [];
                        branchProductsAdded = branchProductsAdded.filter((item => item.productId !== productId));

                        localStorage.setItem('branchProductsAdded' , JSON.stringify(branchProductsAdded));

                        let branchProductsRemoved = JSON.parse(localStorage.getItem('branchProductsRemoved')) || [];

                        let old_list = this.state.productList;

                        const productIndex = old_list.findIndex((item => item.id === (productId)));
                        const item = {...old_list[productIndex]};

                        if(item.owned){
                            item.owned = false;
                        }

                        branchProductsRemoved.push(productId);
                        item.stock = [];

                        old_list[productIndex] = item;

                        console.log(item);
                        localStorage.setItem('branchProductsRemoved' , JSON.stringify(branchProductsRemoved));

                        localStorage.setItem('storeProductsLookup' , JSON.stringify(old_list));

                        this.setState({
                            productList: old_list
                        });
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return false;
                    }
                }
            ]
        });
    };

    showAddView = (productId , step) => {
        console.log(`${productId} from addProduct`);
        const old_list = this.state.productList;

        //Find index of specific object using findIndex method.
        const itemIndex = old_list.filter((item => item.id === productId));
        //Assign current object to new variable

        //console.log(itemIndex)
        this.setState({
            currentProduct: itemIndex,
            activeStep: step
        });
    };

    searchBarcode = async (barcode) => {
        //console.log(`${proId} from addProduct`);
        const old_list = this.state.productList;

        //Find index of specific object using findIndex method.
        const itemIndex = old_list.filter((item => item.barcode === barcode));
        //Assign current object to new variable

        console.log(itemIndex)
        await this.setState({
            currentProduct: itemIndex
        });

        return itemIndex;
    };


    showEditView = (proId , step) => {
        const old_list = this.state.addedProducts;

        //Find index of specific object using findIndex method.
        const product = old_list.filter((item => item.pro_id === proId));
        //Assign current object to new variable

        this.setState({
            currentProduct: product,
            activeStep: step
        });
    };

    //OptionSelectProducts
    /*
    * Bring products per option selected...
    * */

    optionProductHandler = async (value) => {
        console.log(value);
        let storeProducts = [];

        switch (value) {
            case 'all':
                storeProducts = JSON.parse(localStorage.getItem('storeProductsLookup'));
                console.log(storeProducts);
                break;

            case 'stocked':
                storeProducts = JSON.parse(localStorage.getItem('storeProductsLookup')).filter((product) => product.stock.length !== 0);
                console.log(storeProducts);

                break;

            case 'incomplete':
                storeProducts = JSON.parse(localStorage.getItem('storeProductsLookup')).filter((product) => (product.owned === true && (!product.sellingPrice || (product.stock[(product.stock.length - 1).costPrice]) === null)));
                console.log(storeProducts);

                break;
            default:
                alert('Value does not exist');
                break;
        }

        this.setState({
            productList: storeProducts
        });
    };

    addNewProduct = async(formFields) => {
        //console.log(formFields);
        let branchProductsAdded = JSON.parse(localStorage.getItem('branchProductsAdded')) || [];

        let old_list = this.state.productList;

        const productIndex = old_list.findIndex((item => item.id === (formFields.productId)));
        const item = {...old_list[productIndex]};

        if(!item.owned){
            item.owned = true;
        }

        const temp_id = uuidv1();
        const historyItem = {
            quantity: formFields.quantity,
            branch_stock_id: formFields.branchId,
            temp_id: temp_id,
        };

        branchProductsAdded.push(formFields);
        item.stock = item.stock || [];
        (item.stock).push(
            {
                ...formFields,
                temp_id: temp_id,
            }
        );

        (item.history).push(historyItem);

        //quantity //branch_stock_id //id
        old_list[productIndex] = item;

        console.log(item);



        localStorage.setItem('branchProductsAdded' , JSON.stringify(branchProductsAdded));

        localStorage.setItem('storeProductsLookup' , JSON.stringify(old_list));

        this.setState({
            productList: old_list
        });
    };

    deleteProduct = (pId , event) => {
        console.log(pId);

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this product.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let old_list = [...this.state.addedProducts];

                        const result = old_list.filter(item => item.id !== pId);

                        this.setState({
                            addedProducts: [...result],
                        });
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return false;
                    }
                }
            ]
        })
    };

    useStyles = () => makeStyles(theme => ({
        root: {
            backgroundColor: theme.palette.background.paper,
            width: 500,
        },
    }));

    render(){
        return(
            <div className={`addProducts`}>

                {this.getStepContent(this.state.activeStep)}
            </div>
        );
    }
}

export default withRouter(AddProducts);