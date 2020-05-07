import React, {useEffect , useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/Card/Card";
import Grid from "@material-ui/core/Grid/Grid";
import EditIcon from '@material-ui/icons/Edit';
import MainDialog from '../../../../../components/Dialog/MainDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import AppBar from '@material-ui/core/AppBar';
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import SwipeableViews from "react-swipeable-views";
import TabPanel from '../../../../../components/Tabs/TabPanel';
import Dates from '../../../../../components/Date/Date';
import InputAdornment from '@material-ui/core/InputAdornment';
import StayPrimaryPortraitIcon from '@material-ui/icons/StayPrimaryPortrait';
import Button from "@material-ui/core/Button/Button";
import TextField from '@material-ui/core/TextField';

import format from "date-fns/format";
import BranchStockService from '../../../../../services/BranchStockService';
import ProductServiceHandler from "../../../../../services/ProductServiceHandler";


const useStyles = makeStyles(theme => ({
    tabs: {
        textTransform: 'none',
        fontWeight: 'bold',
        color: '#333333',
    }
  }));

const SingleDayView = props => {
    const classes = useStyles();
    const prodName = props.prodName;
    const [mainDialog, setMainDialog] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const purchase = props.purchase;
    const [quantity , setQuantity] = useState(false);
    const [costPrice , setCostPrice] = useState(false);
    const [name , setName] = useState(false);
    const [image , setImage] = useState(false);
    const [product, setProduct] = useState(false);

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    // const image = `https://elparah.store/admin/upload/${product.image}`;

    const closeDialogHandler = (event) => {
        setMainDialog(false);
    };

    const openDialogHandler = (event) => {
        setMainDialog(true);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
  
    const handleChangeIndex = index => {
        setValue(index);
    };

    useEffect(() => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if (!quantity) {
            getProduct();
        }
    });

    const getProduct = async () => {
        //const newProduct = await purchase.product.fetch();
        /*
        * @todo get entries via query on model
        * */
        const newProduct = await props.purchaseEntry.product.fetch();
        setProduct(newProduct);
        setImage(new ProductServiceHandler(product).getProductImage());
        setName((newProduct.name).length > 20 ? (newProduct.name).slice(0 , 20) + '...' : newProduct.name);


        const costP = await BranchStockService.getStockEntryCostPriceById(purchase.id);
        const quant = await BranchStockService.getStockProductQuantity(purchase.id);
        // setProduct(newProduct);
        // setName(new ProductServiceHandler(product).getProductName());
        // setImage(new ProductServiceHandler(product).getProductImage());
        setCostPrice(costP);
        setQuantity(quant);

    };

    return(
        <div>
            {prodName === name
                ?
                <div>
                    <Grid container spacing={1} className={`shadow1 mb-3 borderRadius10`}>
                        <Grid item xs={3}>
                            <Card
                                className="shadow1"
                                style={{
                                    margin: '5px auto', 
                                    backgroundImage: `url(${image})`, 
                                    backgroundPosition: 'center', 
                                    backgroundSize: 'cover', 
                                    width: '60px', 
                                    borderRadius: '50%', 
                                    height: '60px', 
                                    padding: '0px'
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} style={{display: 'table', height: '60px', margin: '8px 0px'}}>
                            <div style={{textAlign: 'left', display: 'table-cell', verticalAlign: 'middle'}}>
                                <span className='text-dark font-weight-bold' >{name}</span>
                                <div className="font-weight-light mt-1" style={{ fontSize: '13px'}}>Quantity: {quantity}</div>
                                <div className="font-weight-light mt-1" style={{ fontSize: '13px'}}>Cost: GHC {costPrice}</div>
                            </div>
                        </Grid>

                        <Grid item xs={3} style={{height: '60px', margin: '10px 0px 0px 0px'}}>  
                            <span className='text-dark font-weight-bold' >{format(new Date(purchase.createdAt) , "HH:mm a")}</span>                     
                            <EditIcon
                                onClick={openDialogHandler.bind(this)}
                                style={{fontSize: '30px', color: '#DAAB59', textAlign: 'right'}}
                            /> 
                        </Grid>
                    </Grid>

                    <MainDialog handleDialogClose={closeDialogHandler.bind(this)} states={mainDialog} >
                        <div className="row p-3 pt-0 mx-auto text-center w-100" >
                            <Grid container spacing={1} className={`shadow1 mb-3 borderRadius10`}>
                                <Grid item xs={3}>
                                    <Card
                                        className="shadow1"
                                        style={{
                                            margin: '5px auto', 
                                            backgroundImage: `url(${image})`, 
                                            backgroundPosition: 'center', 
                                            backgroundSize: 'cover', 
                                            width: '60px', 
                                            borderRadius: '50%', 
                                            height: '60px', 
                                            padding: '0px'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{display: 'table', height: '60px', margin: '8px 0px'}}>
                                    <div style={{textAlign: 'left', display: 'table-cell', verticalAlign: 'middle'}}>
                                        <span className='text-dark font-weight-bold' >{name}</span>
                                        <div className="font-weight-light mt-1" style={{ fontSize: '13px'}}>Quantity: {quantity}</div>
                                        <div className="font-weight-light mt-1" style={{ fontSize: '13px'}}>Cost: GHC {costPrice}</div>
                                        <div className="font-weight-light mt-1" style={{ fontSize: '13px'}}>Audit sale</div>
                                    </div>
                                </Grid>

                                <Grid item xs={3} style={{height: '60px', margin: '10px 0px 0px 0px'}}>                     
                                    <DeleteIcon
                                        onClick={openDialogHandler.bind(this)}
                                        style={{fontSize: '30px', color: '#DAAB59', textAlign: 'right'}}
                                    /> 
                                </Grid>
                            </Grid>
                            
                            <AppBar position="static" color="white">
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                    aria-label="full width tabs example"
                                >
                                    <Tab className={classes.tabs} label="Change date"  {...a11yProps(0)} />
                                    <Tab className={classes.tabs} label="Change quantity"  {...a11yProps(1)} />
                                    <Tab className={classes.tabs} label="Change price"  {...a11yProps(2)} />
                                </Tabs>
                            </AppBar>

                            <SwipeableViews
                                index={value}
                                onChangeIndex={handleChangeIndex}
                            >
                                <TabPanel value={value} index={0} >

                                    <Dates label="Pick new date" style={{margin: '50px'}} />
                                    
                                </TabPanel>

                                <TabPanel value={value} index={1}  >
                                    <TextField 
                                        id="outlined-basic" 
                                        label="Quantity" 
                                        value={quantity}
                                        variant="outlined" 
                                        size="small" 
                                        style={{margin: '50px'}} 
                                    />
                                </TabPanel>

                                <TabPanel value={value} index={2}  >
                                    <form noValidate autoComplete="off">
                                        <TextField
                                            className={classes.margin}
                                            id="input-with-icon-textfield"
                                            variant="outlined"
                                            size="small"
                                            style={{margin: '20px'}}
                                            label="Selling price"
                                            InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="end">
                                                    <StayPrimaryPortraitIcon />
                                                </InputAdornment>
                                            ),
                                            }}
                                        />

                                        <Dates label="From" style={{margin: '20px'}} />
                                        
                                        <Dates label="To" style={{margin: '20px'}} />
                                        
                                    </form>
                                </TabPanel>

                            </SwipeableViews>

                            <Grid container spacing={1} >
                                <Grid item xs={6}>
                                    <Button
                                        variant="outlined"
                                        style={{border: '1px solid #DAAB59', color: '#DAAB59', padding: '5px 30px', textTransform: 'none', fontSize:'15px'}}
                                        onClick={closeDialogHandler.bind(this)}
                                    >
                                        Cancel  
                                    </Button>
                                </Grid>

                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        style={{'backgroundColor': '#DAAB59' , color: '#333333', padding: '5px 15px', textTransform: 'none', fontSize:'15px'}}
                                        onClick={closeDialogHandler.bind(this)}
                                    >
                                        Save changes
                                    </Button>
                                </Grid>
                            </Grid>    
                            
                        </div>
                    </MainDialog>
                </div>
                :
                ''
            }
        </div>

    );
};

export default SingleDayView;