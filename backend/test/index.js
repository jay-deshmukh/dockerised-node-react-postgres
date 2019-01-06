const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

describe("Books", () => {
    describe("GET/offers/:partner_id", () => {
        it("it should GET all the offers for a partner", (done) => {
            chai.request("http://localhost:9999/")
                .get("api/offer/par_w54u2u55")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
});
