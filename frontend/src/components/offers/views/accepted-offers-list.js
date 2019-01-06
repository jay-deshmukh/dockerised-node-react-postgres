import React from "react";
import PropTypes from "prop-types";
import AcceptedOffer from "./accepted-offer";

const AcceptedOffersList = ({offers}) => {
  return offers.map((offer,index) => {
    return(
      <AcceptedOffer
        key = {index}
        customer_name = {offer.customer_name}
        customer_company = {offer.customer_company}
        contract_price = {offer.contract_price}
      />
    )
  })
}

//-- Proptype validation
AcceptedOffersList.propTypes = {
  offers : PropTypes.array.isRequired,
}

export default AcceptedOffersList;