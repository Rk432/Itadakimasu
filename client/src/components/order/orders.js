import React from 'react';
import '../mainpage/right.css';
import { Scrollbars } from 'react-custom-scrollbars';

//Material UI
import {Card,CardContent,CardActions,Button} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RemoveIcon from '@material-ui/icons/Remove';

//graphql
import { graphql } from 'react-apollo';
import { getSpecificOrdersQuery,deleteOrder } from '../../queries/queries';
import {flowRight as compose} from 'lodash';

function Orders(params) {

    // ! error after execution of this function (not breaking) will need to find a way to not throw error

    function deleteTheOrder(orderId){
        params.deleteOrder({
            variables: {
                id:orderId,
            },
            refetchQueries: [{ 
                query: getSpecificOrdersQuery,
                variables: {
                    userId: params.userId,
                    status: params.status,
                }
            }]
        })
    }


    const RestResults = withStyles({
        root:{
            margin:"0.5rem",
            width:"22rem",
            height:"3.5rem",
            borderRadius:"4px",
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            paddingLeft:"1rem",
            paddingRight:"1rem",
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
    })(Card);
    const ResultInfo = withStyles({
        root:{
            width:"85%",
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
        },
    })(CardContent);

    return (
        <div className='orders'>
            <Scrollbars style={{ width: "100%", height: "100%" }}>
            {
                params?.getSpecificOrdersQuery?.order?.map((_data,idx)=>{
                    return(
                        <div key={idx}>
                            <RestResults>
                                <ResultInfo>
                                    <div>{_data?.dishinfo?.name}</div>
                                    <div>{_data?.finalprice}</div>
                                </ResultInfo>
                                <CardActions>
                                    <Button onClick={()=>deleteTheOrder(_data?.id)} variant="outlined" color="secondary">
                                        <RemoveIcon/>
                                    </Button>
                                </CardActions>
                            </RestResults>
                        </div>
                    )
                })
            }
            </Scrollbars>
        </div>
    )
}

export default compose(
    graphql(getSpecificOrdersQuery, {
        options: (params) => {
            return {
                variables: {
                    userId: params.userId,
                    status: params.status,
                }
            }
        },
        name : 'getSpecificOrdersQuery',
    }),
    graphql(deleteOrder,{name: 'deleteOrder'}),
)(Orders);