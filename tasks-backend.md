
# Backend tasks


## List of offers

You should add an endpoint that will return a list of offers for a given partner:

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


## (BONUS) Testing

Write unit and/or integration tests (whatever is more appropriate for each case) for every endpoint and function that you implement. You are free to choose a testing framework. Please document how to run the tests in the readme.


## (BONUS) Code review

Please take a look at the file `backend/src/api/offer/offer-post.js`. Is there anything dangerous in the approach or code implementation? Please document your findings in a new file `backend-code-review.md` in the root of this repository.


## (BONUS) Matching working schedule

For each offer in the offers list endpoint (see above task), you should include a boolean property `schedule_matches`. It should be true if the customer `schedule` is fully compatible with the given partners `working_schedule`, i.e. each day and time in the customer schedule can be served by the partner working hours. Look at the data in PG to get an idea of the format.


## (BONUS) BI team ask for metrics

The BI team needs some metrics on how well our offers feature is performing. Please write a PG query that will return the following data:

 -  Sum of contract prices grouped by area code
 -  For each area code, the count of active partners serving customers in that area

Please save the query in a new file `pg-query-1.sql` in the root of this repository.


## (BONUS) Marketing team ask for metrics

The marketing team needs some metrics on customer schedules. Please write a PG query that will return the following data:

 -  For each customer not yet served by a partner
 -  Get the total number of each week day in the schedules
 -  Grouped by area code

Please save the query in a new file `pg-query-2.sql` in the root of this repository.
