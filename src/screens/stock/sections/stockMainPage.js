import React, {Fragment, useState} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from '@material-ui/core/Container';
import SectionNavbars from "../../Components/Sections/SectionNavbars";
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import SystemDate from "../../Components/Date/SystemDate";
import CardDefault from "../../Components/Cards/CardDefault";
import Typography from "@material-ui/core/Typography";
import TabPanel from "../../Components/Tabs/TabPanel";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import StockSearchMode from "./SearchMode/StockSearchMode";
import StockBarcodeMode from "./BarcodeMode/StockBarcodeMode";
import SecondaryButton from "../../Components/Buttons/SecondaryButton";
import Box from "@material-ui/core/Box";


const StockMainPage = props => {
    const [value , setValue] = useState(0);


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
                        icons={
                            <MoreVertIcon
                                style={{fontSize: '2rem'}}
                            />
                        }
                    >
                        <MenuIcon
                            style={{fontSize: '2.5rem'}}
                        />
                    </SectionNavbars>

                    <Container
                        className={`mt-6`}
                    >
                        <SystemDate/>
                    </Container>
                    <Grid
                        container
                        spacing={1}
                        style={{paddingRight: '10px', paddingLeft: '10px' , width: '100%', margin: 'auto'}}
                    >
                        <Grid item xs={4}>
                            <CardDefault styles={{width: '100%', marginTop: '10px', borderRadius: '10px'}} >
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
                                    2000 items
                                </Typography>
                            </CardDefault>
                        </Grid>

                        <Grid item xs={4}>
                            <CardDefault styles={{width: '100%', marginTop: '10px', borderRadius: '10px'}} >
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
                                    50 items
                                </Typography>
                            </CardDefault>
                        </Grid>

                        <Grid item xs={4}>
                            <CardDefault styles={{width: '100%', marginTop: '10px', borderRadius: '10px'}} >
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
                                    100 items
                                </Typography>
                            </CardDefault>
                        </Grid>
                    </Grid>

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
                            <StockSearchMode addProductStockView={props.addProductStockView} stock={props.stock}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <StockBarcodeMode/>
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