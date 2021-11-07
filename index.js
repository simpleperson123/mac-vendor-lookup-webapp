const express = require("express")
const sqlite3 = require("sqlite3")
const bparser = require("body-parser")

const app = express();

app.use(bparser.json());
app.use(express.static("public"));

app.use((err, req, res, next) => {
    if(err.status === 400) {
        res.status(400).json({status: "error", msg: "invalid body"});
    }
    next();
});

let db = new sqlite3.Database("./macvendors.db", (err) => {
    if(err) {
        console.log("Error while connecting to database");
    }

    console.log("Connected to database");
});

function toNormalMac(macaddr) {
    var replaced = macaddr.toUpperCase().replaceAll(".", "").replaceAll(" ", "").replaceAll("-", "").replaceAll(":", "");
    return replaced;
}

function isValidMac(macaddr) {
    var maclen = macaddr.length;
    if(maclen == 6 || maclen == 12 || maclen == 14 || maclen == 17) {
        var normalizedMac = toNormalMac(macaddr);
        if(normalizedMac.match("^[0-9A-F]+$")) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

function queryMac(range) {
    return new Promise((res, rej) => {
        db.get("SELECT vendor FROM vendors WHERE range = ?", [range], (err, row) => {
            if(err) {
                console.log(err.message);
                rej("error");
            }

            if(row) {
                res(row.vendor);
            }
            else {
                rej("notfound");
            }
        });
    });
}

app.post("/api/lookup", (req, res) => {
    if(!req.is("application/json")) {
        res.status(400).json({status: "error", msg: "invalid content-type"});
    }
    else {
        try {
            var parsed = req.body;

            if(isValidMac(parsed.mac)) {
                var range = toNormalMac(parsed.mac).substring(0, 6);
                
                queryMac(range).then((resolve) => {
                    res.status(200).json({status: "success", vendor: resolve});
                },
                (reject) => {
                    if(reject === "notfound") {
                        res.status(404).json({status: "notfound"});
                    }
                    else {
                        res.status(500).json({status: "error"});
                    }
                });

            }
            else {
                res.status(400).json({status: "error", msg: "invalid mac address"});
            }
        }
        catch(ex) {
            res.status(400).json({status: "error", msg: "invalid json body"});
        }
    }
});

app.listen(8080, () => {
    console.log("Listening on :8080");
});