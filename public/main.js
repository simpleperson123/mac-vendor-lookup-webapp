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

function lookup() {
    var mac = document.getElementById("macaddr-tb").value;
    if(isValidMac(mac)) {
        callApi(mac);
    }
    else {
        setResultText("Invalid MAC address");
    }
}


function callApi(addr) {
    var obj = {
        mac: addr
    };

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onResponse);
    xhr.open("POST", "/api/lookup");
    xhr.setRequestHeader("Content-Type", "application/json")

    xhr.send(window.JSON.stringify(obj));
}

function onResponse() {
    try {
        parsed = window.JSON.parse(this.responseText);

        console.log(parsed);

        if(parsed.status === "success") {
            setResultText(parsed.vendor);
        }
        else if(parsed.status === "notfound") {
            setResultText("MAC range not found in database");
        }
        else if(this.status == 500) {
            setResultText("Internal server error");
        }
        else {
            setResultText("Error: " + parsed.msg);
        }
    }
    catch {
        setResultText("Server error - Invalid response")
    }
}

function setResultText(text) {
    document.getElementById("result-vendor-lbl").innerText = text;
}
