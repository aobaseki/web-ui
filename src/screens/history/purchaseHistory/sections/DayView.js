import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'; 
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box/Box";
import { withRouter } from "react-router-dom";

import SingleDayView from './singleViews/SingleDayView';
import CardsSection from '../../../../components/Sections/CardsSection';
import PurchaseService from "../../../../services/PurchaseService";
import BranchStockService from "../../../../services/BranchStockService";

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    }
  }));

const DayView = props => {
    
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const handleDateChange = date => {
        setSelectedDate(date);
        getPurchaseDetails(date);
      };

    const [purchaseDetails , setPurchaseDetails] = useState(false);
    const [quantity , setQuantity] = useState(false);
    const [costPrice , setCostPrice] = useState(false);
    const [sellingPrice , setSellingPrice] = useState(false);
    const [expProfit , setExpProfit] = useState(false);
    const [purchases , setPurchases] = useState([]);

    useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
        if (!purchaseDetails) {
            getPurchaseDetails(selectedDate);
        }
    });

    const getPurchaseDetails = async (date) => {
        const response = await new PurchaseService().getPurchaseDetails('day', date);
        const q = await new BranchStockService().getCompanyItemsLeft();
        const c = await new BranchStockService().getTotalCostPrice();
        const s = await new BranchStockService().getTotalSellingPrice();
        const e = await new BranchStockService().getTotalExpectedProfit();
        setQuantity(q);
        setCostPrice(c);
        setSellingPrice(s);
        setExpProfit(e);
        setPurchaseDetails(response);
        setPurchases(response.purchases);
        console.log(response)
    };

    return(
        <div className={classes.root}>
            {/* {console.log(purchaseDetails.purchases)} */}

            <Grid container spacing={1}>
                <Grid item xs={6} >
                    <Typography style={{fontSize: '14px', paddingTop: '20px', textAlign: 'left'}} >
                        {props.pageName}
                    </Typography>
                </Grid>

                <Grid item xs={6} >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="outlined"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker"
                            className='text-dark font-weight-bold'
                            style={{float: 'right', width: '170px'}}
                            size='small'
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
            </Grid>

            <CardsSection quantity={quantity} costPrice={costPrice} sellingPrice={sellingPrice} profit={expProfit} profitName="Expected Profit" />
            {/* <CardsSection quantity='4' costPrice='20' sellingPrice='50' profit='30' profitName="Expected Profit" /> */}

            <Box style={{marginTop: '5px' , paddingBottom: '60px'}} p={1} className={`mt-3 mb-5`}>
                {purchases.length === 0
                    ?
                    <div className={`rounded mx-1 my-2 p-2 bordered`}>
                        <Grid container spacing={1} className={`py-1`}>
                            <Grid
                                item xs={12}
                                className={`text-left pl-2`}
                            >
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    style={{fontSize: '16px'}}
                                    className={`text-center text-dark`}
                                >
                                    No purchases made this day
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    :

                    purchases.map((purchase) => <SingleDayView  key={purchase.id} purchase={purchase} />)
                }
            </Box>

            {/* <Box style={{marginTop: '5px' , paddingBottom: '60px'}} p={1} className={`mt-3 mb-5`}>
                {props.products.map((item) => <SingleDayView  key={item.pro_id} item={item}/>)}
            </Box> */}
        </div>
    )
}

export default withRouter(DayView);