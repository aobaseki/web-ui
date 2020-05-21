import React from "react";
import { withRouter } from "react-router-dom";
import Component from "@reactions/component";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Q } from "@nozbe/watermelondb";
import Grid from '@material-ui/core/Grid';
import paths from "../../../../utilities/paths";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {makeStyles} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Search from '@material-ui/icons/Search';
import SectionNavbars from "../../../../components/Sections/SectionNavbars";
import Drawer from "../../../../components/Drawer/Drawer";

import LocalInfo from '../../../../services/LocalInfo';
import Button from "@material-ui/core/Button/Button";
import InputBase from "@material-ui/core/InputBase/InputBase";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Box from "@material-ui/core/Box/Box";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";



const useStyles = makeStyles(theme => ({
    root: {
        width: '60%',
        display: 'flex',
        padding: '2px 5px',
        alignItems: 'center',
        borderRadius: '5px',
        height: '35px',
        border: '1px solid #ced4da',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
    },
    search: {
        width: '800%',
        display: 'flex',
        padding: '2px 5px',
        alignItems: 'center',
        borderRadius: '30px',
        height: '35px',
        border: '1px solid #ced4da',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    button: {
        minWidth: '40px !important',
        width: '40px !important',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    shadow1: {
        '-webkit-box-shadow': '3px 5px 5px 0px rgba(227,227,227,1)',
        '-moz-box-shadow': '3px 5px 5px 0px rgba(227,227,227,1)',
        'box-shadow': '3px 5px 5px 0px rgba(227,227,227,1)',
    },
    shadow2: {
        'box-shadow': '0 0 1rem 2px #dcc7a4',
    },
    margin1: {
        margin: '20px auto',
    },
    padding1: {
        'padding-bottom': '20px',
    },
    boxRadius: {
        'border-radius': '10px',
    },

    'input:focus': {
        backgroundColor: '#daab59',
    }
}));

const apiUrl = "";

async function getUserStoreFromLocal(database, user, store) {
    return database.collections
        .get("users_stores")
        .query(Q.where("user_id", user.id), Q.where("store_id", store.id))
        .fetch();
}

async function getUserFromLocal(database, usernameOrPhone, password) {
    return database.collections
        .get("users")
        .query(
            Q.where("username", usernameOrPhone),
            Q.or(Q.where("phone", usernameOrPhone)),
            Q.where("password", password)
        )
        .fetch();
}

async function getStore(database) {
    return database.collections
        .get("stores")
        .query()
        .fetch();
}

async function getUsersFromLocal(database) {
    return database.collections
        .get("users")
        .query()
        .fetch();
}

const OrderDetails = props => {

    const classes = useStyles();
    const [mainDialog, setMainDialog] = React.useState(false);
    const [addDialog, setAddDialog] = React.useState(false);

    /*
    * @todo replace user name with localInfo details.
    * */
    const username = JSON.parse(localStorage.getItem('userDetails')).firstName;
    console.log(username);

    const { history } = props;
    const database = useDatabase();

    if (LocalInfo.storeId && LocalInfo.userId) {
        history.push(paths.home);
    }




    return (
        <div style={{height: '100vh'}}>
            <Component
                initialState={{
                    isDrawerShow: false,
                }}
            >
                {({ state, setState }) => (
                    <React.Fragment>
                        <CssBaseline />


                        <SectionNavbars title={`Order history`}>
                            <ArrowBackIcon
                                onClick={() => history.push(paths.customer_orders)}
                            />
                        </SectionNavbars>

                        <Drawer isShow={state.isDrawerShow} />

                        <div style={{ position: "fixed", top:"60px", width:"100%" }}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={1} style={{padding: '0px 2px 8px', textAlign: 'center'}}>
                                    <Grid item xs={12} style={{marginTop: '5px', padding: '4px 0px'}}>

                                        <div style={{width: '100%'}}>
                                            <span
                                                className="shadow1"
                                                style={{width: 'fit-content', padding: '3px 10px' , borderRadius: '50px' , border: '1px solid #DAA95B'}}
                                            >
                                                Today
                                            </span>
                                            <span
                                                className="shadow1"
                                                style={{width: 'fit-content', padding: '3px 10px' , borderRadius: '50px' , border: '1px solid #DAA95B'}}
                                            >
                                                Yesterday
                                            </span>
                                            <span
                                                className="shadow1"
                                                style={{width: 'fit-content', padding: '3px 10px' , borderRadius: '50px' , border: '1px solid #DAA95B'}}
                                            >
                                                This week
                                            </span>
                                            <span
                                                className="shadow1"
                                                style={{width: 'fit-content', padding: '3px 10px' , borderRadius: '50px' , border: '1px solid #DAA95B'}}
                                            >
                                                This month
                                            </span>
                                        </div>
                                    </Grid>
                                </Grid>

                            </Paper>
                            <Grid container spacing={1} style={{padding: '0px 2% 20px', textAlign: 'center'}}>
                                <Grid item xs={12} style={{marginTop: '15px', padding: '0px 30px'}}>
                                    <Paper className={classes.search} style={{width: '100%'}}>
                                        <InputBase
                                            className={`${classes.input} search-box`}
                                            placeholder="Search for date , invoice , name"
                                            inputProps={{ 'aria-label': 'Search for date , invoice , name' }}
                                        />
                                        <IconButton className={classes.iconButton} aria-label="search">
                                            <Search/>
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Paper className={classes.paper} style={{padding: "3px 7px"}}>
                                <Grid container style={{padding: "10px", border: "1px solid #0000003b"}}>


                                </Grid>


                            </Paper>

                            <Box
                                className="shadow1"
                                bgcolor="background.paper"
                                p={1}
                                style={{ height: '3.0rem', position: "fixed", bottom:"1px", width:"100%" }}
                            >

                                <Button
                                    variant="contained"
                                    style={{'backgroundColor': '#DAAB59' , color: '#333333', padding: '5px 50px'}}
                                    onClick={()=> history.push(paths.customer_orders)}
                                >
                                    Close
                                </Button>
                            </Box>
                        </div>

                    </React.Fragment>
                )}
            </Component>
        </div>
    );
};

export default withRouter(OrderDetails);
