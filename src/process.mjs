import { collect } from "@turf/turf";
import fs from "fs";
import sites from "../data/sites.json" assert {type: "json"};
import neighborhoods from "../data/neighborhoods.json" assert {type: "json"};

sites.features.forEach(
    (feature) => {
        feature.properties = {
            count: 1
        };
    }
);

let output = collect(neighborhoods, sites, "count", "count");

output.features.forEach(
    (feature, index) => {
        feature.id = index;
        feature.properties.count = feature.properties.count.length;
    }
);

output = JSON.stringify(output, null, "\t");

fs.writeFileSync("../data/count-by-neighborhoods.json", output);

console.log("success. 👍");
