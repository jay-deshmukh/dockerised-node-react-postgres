/**
 * @module config
 */

module.exports = {
    server: {
        port: +process.env.PORT || 9999,
    },
    email: {
        from: "app@example.com",
    },
    price_tool: {
        base: {
            berlin              : 1795.00,
            cologne             : 2545.00,
            hamburg             : 2295.00,
            stuttgart           : 2295.00,
            duesseldorf         : 2495.00,
            leipzig             : 2545.00,
            dortmund            : 2495.00,
            munich              : 2545.00,
            essen               : 2295.00,
            frankfurt           : 2595.00,
        },
    },
    cors: {
        optionsSuccessStatus    : 200, //-- HTTP 200 pre-flight response is required for some old browsers --
        credentials             : true, //-- Authorization header --
        maxAge                  : 600, //-- Cache for 10 min (maximum for Chrome) --
        methods                 : ["GET", "PUT", "POST", "DELETE"],
        allowedHeaders          : [
            "Accept",
            "Accept-Encoding",
            "Authorization",
            "Content-Length",
            "Content-Type",
            "Origin",
            "X-Requested-With",
        ],
    },
};
