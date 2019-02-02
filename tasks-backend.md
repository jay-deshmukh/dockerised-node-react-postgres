
# Backend tasks


## List of offers

Adds an endpoint that will return a list of offers for a given partner:

 1. Get a list of offers querying the PG database
 2. For each offer, invoke a service that will determine the appropriate price level

For point 1, you can look at the structure and data in the `backend/pg/` folder. The query must do the following:

 -  The given partner can only serve potential customers with the same area code
 -  Only `b2b` customer type can be served
 -  Only partners with `active` status can serve a customer
 -  Offer status should be "new" if customer is `served_by` is null, it should be "active" if customer is already served by the given partner
 -  If customer is already served by the given partner, some fields from the contract object should be added, like: `name`, `price`, `start`

For point 2, please take a look at the inline documentation in `backend/src/services/price-tool.js`.

The endpoint should be invoked as a GET request to `/api/offer/:partner_id/` where `:parner_id` is a `public_id` parameter for a given partner.

The endpoint should respond in the following format (example):

```js
{
    offers: [
        {
            status              : "accepted", // or "new"
            partner_id          : "<public id of partner>",
            customer_id         : "<public id of customer>",
            customer_name       : "<customer name>",
            customer_company    : "<customer company name>",
            address_street      : "<customer address>",
            address_city        : "<customer address>",
            address_postalcode  : "<customer address>",
            schedule            : "<customer schedule>",
            schedule_matches    : true, // see BONUS task below
            contract_price      : 559.75, // Contract price if status="accepted", otherwise invoke price-tool service (see point 2)
            contract_name       : null, // Contract name if status="accepted"
            contract_start      : null, // Contract start if status="accepted"
        },
//      ...
    ]
}
```

In case of errors, an appropriate HTTP status code should be used and response should look like `{error:"<custom error code here>"}`.


## Testing

Unit tests for  endpoint and function that is implemented.w