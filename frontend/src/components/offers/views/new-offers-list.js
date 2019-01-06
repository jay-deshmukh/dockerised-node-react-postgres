import React from "react";
import PropTypes from "prop-types";
import NewOffer from "./new-offer";


const NewOffersList = ({offers , accept_offer}) => {
  return offers.map((offer,index) => {
    return(
      <NewOffer
        key = {index}
        index = {index}
        customer_name = {offer.customer_name}
        customer_company = {offer.customer_company}
        contract_price = {offer.contract_price}
        accept_offer = {accept_offer}
        matches = {offer.matches}
      />
    )
  })
}
//-- Proptype validation
NewOffersList.propTypes = {
  offers : PropTypes.array.isRequired,
  accept_offer : PropTypes.func.isRequired
}

export default NewOffersList;
