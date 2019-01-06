import React from "react";
import PropTypes from "prop-types";

const AcceptedOffer = ({customer_name , customer_company , contract_price}) => {
  return(
    <div className="offer">
      <span className="customer-name">{customer_name}</span>
      <span className="customer-company">{customer_company}</span>
      <span className="accepted-offer-price">{contract_price.toLocaleString() + ' €'}</span>
    </div>
  )
}

AcceptedOffer.propTypes = {
  customer_name : PropTypes.string.isRequired,
  customer_company : PropTypes.string.isRequired,
  contract_price : PropTypes.string.isRequired,
}

export default AcceptedOffer