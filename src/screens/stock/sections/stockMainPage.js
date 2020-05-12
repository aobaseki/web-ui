import React, {Fragment, useState} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from '@material-ui/core/Container';
import SectionNavbars from "../../../components/Sections/SectionNavbars";
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import SystemDate from "../../../components/Date/SystemDate";
import CardDefault from "../../../components/Cards/CardDefault";
import Typography from "@material-ui/core/Typography";
import TabPanel from "../../../components/Tabs/TabPanel";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import StockSearchMode from "./SearchMode/StockSearchMode";
import StockBarcodeMode from "./BarcodeMode/StockBarcodeMode";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import Box from "@material-ui/core/Box";
import BottomDrawer from "../../../components/Drawer/BottomDrawer/BottomDrawer";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import SwapHorizOutlinedIcon from '@material-ui/icons/SwapHorizOutlined';
import RedeemIcon from '@material-ui/icons/Redeem';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

import Drawer from "../../../components/Drawer/Drawer";
import BarcodeMode from "../../sell/sell/sections/BarcodeMode/BarcodeMode";

const StockMainPage = props => {
    const [value , setValue] = useState(0);
    const [isShowDrawer , setIsShowDrawer] = useState(false);
    const [isDrawerShow , setIsDrawerShow] = useState(false);
    const branchProducts = props.branchProducts;

    const a11yProps = (index) => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    const setView = (view) => {
        console.log('in');
        props.setView(view);
    };


    return (
        <div className={`stock`}>
            <Fragment>
                <CssBaseline/>

                <Container
                    maxWidth="sm"
                    style={{width: '100%'}}
                >
                    <SectionNavbars
                        title="Stock"
                        leftIcon={
                            <div onClick={() => setIsDrawerShow(true)}>
                                <MenuIcon
                                    style={{fontSize: '2rem'}}
                                />
                            </div>
                        }
                        icons={
                            <div onClick={() => setIsShowDrawer(true)}>
                                <MoreVertIcon
                                    style={{fontSize: '2rem'}}
                                />
                            </div>
                        }
                    />

                    <div
                        onClick={() => setIsDrawerShow(false)}
                        onKeyDown={() => setIsDrawerShow(false)}
                    >
                        <Drawer isShow={isDrawerShow} />
                    </div>

                    <div
                        onClick={() => setIsShowDrawer(false)}
                        onKeyDown={() => setIsShowDrawer(false)}
                    >
                        <BottomDrawer isShow={isShowDrawer}>
                            {/*<ListItem button key={4}>
                                <ListItemIcon><SwapHorizOutlinedIcon style={{color: '#707070'}} /></ListItemIcon>
                                <ListItemText primary="Stock movement" />
                            </ListItem>*/}
                            <ListItem button key={5}>
                                <ListItemIcon><KeyboardReturnIcon style={{color: '#707070'}} /></ListItemIcon>
                                <ListItemText primary="Return purchase" />
                            </ListItem>
                            {/*<ListItem button key={6}>
                                <ListItemIcon><QueryBuilderIcon style={{color: '#707070'}} /></ListItemIcon>
                                <ListItemText primary="Purchase history" />
                            </ListItem>*/}
                            {/*<ListItem button key={7}>
                                <ListItemIcon><LibraryAddIcon style={{color: '#707070'}} /></ListItemIcon>
                                <ListItemText primary="Move stock between branches" />
                            </ListItem>*/}
                            <ListItem button key={8}>
                                <ListItemIcon><ArrowForwardOutlinedIcon style={{color: '#707070'}} /></ListItemIcon>
                                <ListItemText primary="Request for new product" />
                            </ListItem>
                            <ListItem button key={9} onClick={setView.bind(this , 4)}>
                                <ListItemIcon><ReportProblemOutlinedIcon style={{color: '#707070'}} /></ListItemIcon>
                                <ListItemText primary="View low stock" />
                            </ListItem>
                            <ListItem button key={10}>
                                <ListItemIcon><RedeemIcon style={{color: '#707070'}} /></ListItemIcon>
                                <ListItemText primary="Others" />
                            </ListItem>
                        </BottomDrawer>
                    </div>

                    <Container
                        className={`mt-7`}
                    >
                        <SystemDate/>
                    </Container>

                    <div
                        style={{
                            display: 'flex',
                            width: '95%',
                            alignItems: 'center',
                            marginBottom: '5px' ,
                            margin: 'auto'
                        }}
                    >
                        <div
                            onClick={setView.bind(this , 2)}
                            style={{width: '100%', marginRight: '2%', marginTop: '0px'}}
                        >
                            <CardDefault
                                styles={{width: '100%' , borderRadius: '10px'}}
                            >
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    style={{fontWeight: '500', fontSize: '12px' , lineHeight: '1.3'}}
                                    className={`mx-2`}
                                >
                                    Items Left
                                </Typography>
                                <Typography
                                    component="h5"
                                    variant="h5"
                                    style={{fontWeight: '700', fontSize: '14px' , lineHeight: '1.2'}}
                                >
                                    {props.branchProducts.length - props.outOfStockItems.length} items
                                </Typography>
                            </CardDefault>
                        </div>

                        <div
                            onClick={setView.bind(this , 4)}
                            style={{width: '100%', marginRight: '2%', marginTop: '0px'}}
                        >
                            <CardDefault
                                styles={{width: '100%', borderRadius: '10px'}}
                            >
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    style={{fontWeight: '500', fontSize: '12px' , lineHeight: '1.3'}}
                                    className={`mx-2`}
                                >
                                    Low stock
                                </Typography>
                                <Typography
                                    component="h5"
                                    variant="h5"
                                    style={{fontWeight: '700', fontSize: '14px' , lineHeight: '1.2'}}
                                >
                                    {props.lowestStockItems.length} items
                                </Typography>
                            </CardDefault>
                        </div>
                        <div
                            onClick={setView.bind(this , 3)}
                            style={{width: '100%', marginTop: '0px'}}
                        >
                            <CardDefault
                                styles={{width: '100%', borderRadius: '10px'}}
                            >
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    style={{fontWeight: '500', fontSize: '12px' , lineHeight: '1.3'}}
                                    className={`mx-2`}
                                >
                                    Out of stock
                                </Typography>
                                <Typography
                                    component="h5"
                                    variant="h5"
                                    style={{fontWeight: '700', fontSize: '14px' , lineHeight: '1.2'}}
                                >
                                    {props.outOfStockItems.length} items
                                </Typography>
                            </CardDefault>
                        </div>
                    </div>
                    {/*<Grid
                        container
                        spacing={1}
                        style={{paddingRight: '10px', paddingLeft: '10px' , width: '100%', margin: 'auto'}}
                    >
                        <Grid
                            onClick={setView.bind(this , 2)}
                            item xs={4}>
                            <CardDefault
                                styles={{width: '100%', marginTop: '10px', borderRadius: '10px'}}
                            >
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    style={{fontWeight: '500', fontSize: '12px' , lineHeight: '1.3'}}
                                    className={`mx-2`}
                                >
                                    Items Left
                                </Typography>
                                <Typography
                                    component="h5"
                                    variant="h5"
                                    style={{fontWeight: '700', fontSize: '14px' , lineHeight: '1.2'}}
                                >
                                    {props.itemsLeft} items
                                </Typography>
                            </CardDefault>
                        </Grid>

                        <Grid
                            item xs={4}
                            onClick={setView.bind(this , 4)}
                        >
                            <CardDefault
                                styles={{width: '100%', marginTop: '10px', borderRadius: '10px'}}
                            >
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    style={{fontWeight: '500', fontSize: '12px' , lineHeight: '1.3'}}
                                    className={`mx-2`}
                                >
                                    Low stock
                                </Typography>
                                <Typography
                                    component="h5"
                                    variant="h5"
                                    style={{fontWeight: '700', fontSize: '14px' , lineHeight: '1.2'}}
                                >
                                    {props.lowestStockItems.length} items
                                </Typography>
                            </CardDefault>
                        </Grid>

                        <Grid
                            item xs={4}
                            onClick={setView.bind(this , 3)}
                        >
                            <CardDefault
                                styles={{width: '100%', marginTop: '10px', borderRadius: '10px'}}
                            >
                                <Typography
                                    component="h6"
                                    variant="h6"
                                    style={{fontWeight: '500', fontSize: '12px' , lineHeight: '1.3'}}
                                    className={`mx-2`}
                                >
                                    Out of stock
                                </Typography>
                                <Typography
                                    component="h5"
                                    variant="h5"
                                    style={{fontWeight: '700', fontSize: '14px' , lineHeight: '1.2'}}
                                >
                                    {props.outOfStockItems.length} items
                                </Typography>
                            </CardDefault>
                        </Grid>
                    </Grid>*/}

                    <AppBar position="static" color="default" className={`mt-2`}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Search mode" {...a11yProps(0)} />
                            <Tab label="Barcode mode" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>

                    <SwipeableViews
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0}>
                            <StockSearchMode searchProduct={props.searchProduct} branchProducts={branchProducts} addProductStockView={props.addProductStockView} stock={props.stock}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <StockBarcodeMode product={props.product} setView={props.setView} searchBarcode={props.searchBarcode} addProductStockView={props.addProductStockView}/>
                        </TabPanel>
                    </SwipeableViews>

                    <Box
                        className="shadow1"
                        bgcolor="background.paper"
                        p={1}
                        style={{ height: '4.0rem', position: "fixed", bottom:"0", width:"100%" }}
                    >
                        <SecondaryButton classes={`mr-2`}>
                            Suppliers
                        </SecondaryButton>
                        <SecondaryButton>
                            Add stock
                        </SecondaryButton>
                    </Box>
                </Container>
            </Fragment>
        </div>
    )
};

export default StockMainPage;
