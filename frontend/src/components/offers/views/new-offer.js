import React from "react";
import PropTypes from "prop-types";

const NewOffer = ({customer_name , customer_company , contract_price , accept_offer , index , matches}) => {
  let color = 'red';
  matches === true ? color = '#44c600' : '' 
  return(
    <div className="offer">
      <span className="dot" style={{backgroundColor : color}}></span> 
      <span className="customer-name">{customer_name}</span>
      <span className="customer-company">{customer_company}</span>
      <span className="offer-price">{contract_price.toLocaleString() + ' €'}</span>
      <button className="accept-offer" id={index} onClick={accept_offer}>Accept</button>
    </div>
  )
}

NewOffer.propTypes = {
  customer_name : PropTypes.string.isRequired,
  customer_company : PropTypes.string.isRequired,
  contract_price : PropTypes.number.isRequired,
  accept_offer : PropTypes.func.isRequired,
  index : PropTypes.number.isRequired,
  matches : PropTypes.bool
}

//-- sets matches = true by default
NewOffer.defaultProps = {
  matches : true
}

export default NewOffer