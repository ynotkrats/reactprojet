import * as React from 'react';
import { styled } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';
import {useState} from "react";
import {Button, Container} from "@mui/material";
import axios from "axios";
import Typography from "@mui/material/Typography";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={5} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },

}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



// Customized Accordins

export default function CustomizedAccordions(props) {

    const [expanded, setExpanded] = React.useState('panel1');
    const [policy, setPolicy] = useState(props.policy)
    const [cust, setCust] = useState(props.policy.customer_id)
    const [vehicle, setVehicle] = useState(props.policy.vehicle_segment_id)
    const [edit,setEdit] = useState(true);
    const [error,setError] = useState(false)


    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    //Function which handles how the policies have to updated when the user clicks edit and submit
    const handleSubmit =(event)=>{
        event.preventDefault()
        console.log(cust)
        //Api call to first update the changes the made to customer object
        axios.put(`http://127.0.0.1:8000/medi/customer/${cust.customer_id}`,
            {cust})
            .then((res)=>{
                            //nested api call to update policy details
                            axios.put(`http://127.0.0.1:8000/medi/policy/${policy.policy_id}`,
                        {policy,"segment":vehicle.vehicle_segment,"fuel":vehicle.fuel
                    })
                                .then(()=>{
                                    //Disabling the Edit option when API call is successful
                                    setEdit(true)
                                    alert('Updated')

                    }).catch((err)=>{
                        console.log(err)
                        // setEdit(true)
                                setError(true)
                        alert('Premium should be Less than 1 million')
                    })

        }).catch((err)=>{
            console.log(err)
            // setEdit(true)
            setError(true)
            alert("Not updated")
            props.search(props.data)
            // props.getData(policy.policy_id)
        })

    }


    return (
        <div>
            {/*logic to display proper message till the api has fetched the policies*/}
            {cust ? <Accordion expanded={expanded === props.ukey} onChange={handleChange(props.ukey)}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Grid container xs={12} spacing={5} justifyContent={'center'}>
                        <Grid item xs={4}>
                            <p id={'policy-id'}>Policy ID : {props.policy.policy_id}    </p>
                        </Grid>
                        <Grid item xs={4}>
                            <p id={'customer-id'}>Customer Id : {policy.customer_id && policy.customer_id['customer_id']} </p>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <p id={'date'}>
                        Date of Purchase : {policy.date_of_purchase}
                    </p>
                    {/* Form of Policy */}
                    <form action="" onSubmit={handleSubmit}>
                        <Container>
                            <Grid container spacing={2} xs={12}>
                                <Grid item container  xs={12} lg={6}>
                                    <Grid container item xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="">Premium</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="number" value={policy.premium} onChange={(e) => {
                                                setPolicy({
                                                    ...policy, premium: e.target.value
                                                })
                                            }} disabled={edit} required/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor='cust_gender'> Customer Gender</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <select id="cust_gender" placeholder={'region'} onChange={(e) => {
                                                setCust({
                                                    ...cust, customer_gender: e.target.value
                                                })
                                            }} value={cust.customer_gender} disabled={edit}  >
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                            </select>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor='vehicle_segment'> Vehicle Segment</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="text" id={'vehicle_segment'} value={vehicle.vehicle_segment} placeholder={'segment'}
                                                   onChange={(e) => {
                                                       setVehicle({
                                                           ...vehicle, vehicle_segment: e.target.value
                                                       })
                                                   }} disabled={edit} required/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="fuel"> Fuel</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="text" id={'fuel'} value={vehicle.fuel} placeholder={'fuel'}
                                                   onChange={(e) => {
                                                       setVehicle({
                                                           ...vehicle, fuel: e.target.value
                                                       })
                                                   }} disabled={edit} required/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="cust_income"> Customer Income Group</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="text" id={'cust_income'} value={cust.customer_income_group} placeholder={'income'}
                                                   onChange={(e) => {
                                                       setCust({
                                                           ...cust, customer_income_group: e.target.value
                                                       })
                                                   }} disabled={edit} required />
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="cust_region"> Customer Region</label>
                                        </Grid>
                                        <Grid item xs={6}>

                                            <select id="cust_region" placeholder={'region'} onChange={(e) => {
                                                setCust({
                                                    ...cust, customer_region: e.target.value
                                                })
                                            }} value={cust.customer_region} disabled={edit} >
                                                <option value="North">North</option>
                                                <option value="South">South</option>
                                                <option value="West">West</option>
                                                <option value="East">East</option>
                                            </select>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} lg={6}>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="bil"> Body Injury Liability</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="checkbox" id={'bil'} checked={policy.bil} placeholder={'bil'} onChange={(e) => {
                                                console.log(e.target.value)
                                                setPolicy({
                                                    ...policy, bil: !policy.bil
                                                })
                                            }} disabled={edit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="pdl"> Property Damage Liability</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="checkbox" id={'pdl'} checked={policy.pdl} placeholder={'bil'} onClick={(e) => {
                                                setPolicy({
                                                    ...policy, pdl: !policy.pdl
                                                })
                                            }} disabled={edit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="pip"> Personal injury protection</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="checkbox" id={'pip'} checked={policy.pip} placeholder={'bil'} onChange={(e) => {
                                                setPolicy({
                                                    ...policy, pip: !policy.pip
                                                })
                                            }} disabled={edit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                            <label htmlFor="collision"> Collision</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="checkbox" id={'collision'} checked={policy.collision} placeholder={'bil'}
                                                   onChange={(e) => {
                                                       setPolicy({
                                                           ...policy, collision: !policy.collision
                                                       })
                                                   }} disabled={edit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} container>
                                        <Grid item xs={6}>
                                            <label htmlFor="'comprehensive'"> Comprehensive</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="checkbox" id={'comprehensive'} checked={policy.comprehensive} placeholder={'bil'}
                                                   onChange={(e) => {
                                                       setPolicy({
                                                           ...policy, comprehensive: !policy.comprehensive
                                                       })
                                                   }} disabled={edit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} container>
                                        <Grid item xs={6}>
                                            <label htmlFor="'comprehensive'"> Customer Marital Status</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <input type="checkbox" id={'comprehensive'} checked={cust.customer_marital_status} placeholder={'bil'}
                                                   onChange={(e) => {
                                                       setCust({
                                                           ...cust, customer_marital_status: !cust.customer_marital_status
                                                       })
                                                   }} disabled={edit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} container justifyContent={'flex-end'}>
                                        {/* Logic to Enable and disable Edit and Submit Button*/}
                                        <Grid item xs={3}>
                                            {edit &&<Button variant="outlined" onClick={() => {
                                                setEdit(false)
                                            }}>Edit</Button>}
                                            {!edit && <Button variant="outlined" type={'submit'} value={'submit'}> Submit</Button>   }
                                                </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                    </form>
                </AccordionDetails>
            </Accordion>:
                <Grid container xs={12} height={'20vw'}  alignItems="center" justifyContent="center">
                    <Grid item xs={4} spacing={5}>
                        <Typography variant="h4" component="div" gutterBottom>
                            Please Make a search
                        </Typography>
                    </Grid>
                </Grid>
                }
        </div>
    );
}

