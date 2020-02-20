import React , {useState} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import Paper from "@material-ui/core/Paper/Paper";
import InputBase from "@material-ui/core/InputBase/InputBase";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        width: '92%',
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
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        textAlign: 'center',
    },
    iconButton: {
        padding: 10,
    }
}));

const QuantityInput = props => {
    const classes = useStyles();
    const [quantity , setQuantity] = useState();

    const increaseQ = () => {
        if(isNaN(quantity) || quantity.length <= 0)
        {
            setQuantity(1);
            return
        }

        setQuantity(quantity + 1);
    };

    const decreaseQ = () => {
        if(isNaN(quantity) || quantity.length <= 0 || quantity == 0)
        {
            setQuantity(0);
            return;
        }

        setQuantity(quantity - 1);
    };

    return(
        <div>
            <label className={`text-dark py-2`} style={{fontSize: '18px', fontWeight: '600'}}> {props.label}</label>

            <Grid container spacing={1} className={`mb-2`}>
                <Grid
                    item xs={3}
                    className={`text-right`}
                    style={{color: '#D34343'}}
                >
                    <RemoveCircleOutlineOutlinedIcon onClick={decreaseQ} className={`icon-font text-right`}/>
                </Grid>
                <Grid item xs={6} >
                    <Paper className={`${classes.root} text-center`} >
                        <InputBase
                            className={`${classes.input} search-box text-center`}
                            value={quantity}
                        />
                    </Paper>
                </Grid>
                <Grid
                    item xs={3}
                    className={`text-left`}
                    style={{color: '#53BF77'}}
                >
                    <AddCircleOutlineOutlinedIcon onClick={increaseQ} className={`icon-font`}/>
                </Grid>
            </Grid>
        </div>
    );
};

export default QuantityInput;