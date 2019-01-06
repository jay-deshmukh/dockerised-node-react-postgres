import React, { Component } from "react";
import axios from "axios";

import NewOffersList from "./views/new-offers-list";
import AcceptedOffersList  from "./views/accepted-offers-list";

import './styles.css'


// -- Fetches offers for partner from API and renders them in a list view
class Offers extends Component {

  constructor(props){
    super(props);
    this.state = {}
    this.accept_offer = this.accept_offer.bind(this)
  }


  accept_offer(e){
    const i = e.target.id;
    const newOffers = this.state.newOffers;
    const {customer_id , partner_id} = newOffers[i]

    // -- Accept offer request
    axios.post(`http://localhost:9999/api/offer/${partner_id}`,{customer_id})
      .then(({data})=>{
        // -- remove offer from newOffers
        newOffers.splice(i,1);
        // -- add repsonse data to accepted offers
        this.setState({
          acceptedOffers : [data , ...this.state.acceptedOffers],
          newOffers
        })
      })
      .catch(err => {
        console.log(err);
      })
  }


  componentDidMount() {
    // -- get all the offers for the partner
    axios.get(`http://localhost:9999/api/offer/${'par_gemaxqt2'}`)
      .then(({data}) => {
        const {offers} = data;
        const newOffers = [];
        const acceptedOffers = []
        offers.forEach(offer => {
          offer.status === 'new' ? newOffers.push(offer) : acceptedOffers.push(offer)
        });
        this.setState({newOffers,acceptedOffers})
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {acceptedOffers , newOffers} = this.state; 
    if(acceptedOffers || newOffers){
      return (
        <div className="container">
          <h1 className="heading">Offers</h1>
          <h3 className="new-offer">New Offers</h3>
          <NewOffersList offers={newOffers} accept_offer={this.accept_offer}/>
          <h3 className="accepted-offer">Accepted Offers</h3>
          <AcceptedOffersList offers={acceptedOffers}/>
          <br/>
        </div>
      )
    }
    return (
      <div className="container">
        <div className="loader"></div>
      </div>
    )
  }
}
export default Offers;