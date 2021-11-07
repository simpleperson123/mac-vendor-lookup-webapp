# mac-vendor-lookup-webapp
## A node.js web app for vendor lookup by MAC address


This web application allows you to lookup equipment/device vendor by its MAC address:  
Ex. XX:XX:XX:XX:XX:XX -> XYZ Corporation

This application uses Express.js and SQLite.

MAC vendors database is composed of CSV data published by IEEE registration authority.  
CSV source: http://standards-oui.ieee.org/oui/oui.csv  

Application listens on all interfaces on port 8080 by default.
