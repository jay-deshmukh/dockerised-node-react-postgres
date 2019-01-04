# Frontend tasks

In this challenge, we have a small set of the structure we currently have in the company. In our business, we have partners and customers and we manage the contracts that our partners will execute to our customers. This works via offers that we send to our partners that will accept or not a job from our customers.

Your task is to implement a list of offers that a given partner can accept. This list has to be created as shown in the `layout.pdf` file.

## Requirements

1.  The offers list must be created as shown in `layout.pdf`. Don't worry about it being pixel perfect, just try to follow the concept. There are some specs to help you on the last page
2.  Imagine that a partner is logged in the platform. You have to make a request to get the offers. You can make a get request to `http://localhost:9999/api/offer/par_nxvjj7em`, where `par_nxvjj7em` is the id of a partner
3.  You have to use the Axios library to make the requests (which is already installed on the project)
4.  You will receive a payload like that:
    ```json
        {
            "offers": [
                {
                    "status": "new",
                    "partner_id": "par_nxvjj7em",
                    "customer_id": "cus_aiead5s4",
                    "customer_name": "Ian Duncan",
                    "customer_company": "Perini Corp",
                    "address_street": "Oszo Road 407",
                    "address_city": "Berlin",
                    "address_postalcode": "12421",
                    "schedule": {
                        "friday": "10-14",
                        "monday": "12-16",
                        "tuesday": "09-15",
                        "saturday": "12-16",
                        "thursday": "11-15",
                        "wednesday": "11-17"
                    },
                    "schedule_matches": true,
                    "contract_price": 1654.76,
                    "contract_name": null,
                    "contract_start": null
                }
            ]
        }
    ```
    The offers list must display the customer company (first name on the layout), the customer name, the contract price, and a circle that shows if the offer matches with the company schedule or not. If yes, the offer must show a green circle, otherwise a red circle. This field correlates with `schedule_matches` on the payload
5.  The offers list is split into two sublists, the new offers, and the accepted offers. The new offers have the field `status` equals `new` and the accepted offers have the status equals `accepted`
6.  If the partner clicks on the accept button, a post request must be sent to `http://localhost:9999/api/offer/par_nxvjj7em` with the `customer_id` field and value in the body of the request. The data must be sent as `application/json` format
7.  Once the request is made, the accepted offer must be removed from the new offers list and appear on the accepted offers list
8.  The price must be formatted as shown in the layout
9.  The app should be barely responsive as shown in the layout
10. You can not use css frameworks, like Bootstrap, Bulma and etc

## Disclaimers

1.  The basic app structure is already set. You can change the structure and add as many files and libraries as you want
2.  Don't worry about the complex backend structure. This challenge was built on top a backend challenge. So, the only thing that you have to deal is how to run the app and use the two endpoints already mentioned
3.  The frontend part was built using the parcel bundler. So, it's really easy to run the app for development. All you have to do is:
    ```bash
        cd frontend
        yarn install
        yarn dev
    ```
4. The only asset (the logo) is already on the project and already imported in the app

## (BONUS) Add loading feedback

Add some UI feedback when the is making requests, e.g., getting the list or accepting an offer. So the partner can understand that it may take a while. Be creative.
