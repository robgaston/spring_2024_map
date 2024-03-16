import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

mapboxgl.accessToken = settings.accessToken;

const map = new mapboxgl.Map(settings);

map.on("load", async () => {
    const neighborhoods = await import("../data/count-by-neighborhoods.json");
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("neighborhoods-polygons")
        .setData(neighborhoods);

    const popup = document.querySelector("#popup");

    map.on("mousemove", "neighborhoods-fill", (event) => {
        const hoveredFeature = event.features[0];

        popup.querySelector(".neighborhood-name").textContent = hoveredFeature.properties.name;
        popup.querySelector(".count-content").textContent = hoveredFeature.properties.count.toLocaleString();

        popup.style.display = "block";

        map.removeFeatureState({
            source: "neighborhoods-polygons"
        });
        map.setFeatureState({
            source: "neighborhoods-polygons",
            id: hoveredFeature.id
        }, {
            hover: true
        });
    });

    map.on("mouseleave", "neighborhoods-fill", (event) => {
        popup.style.display = "none";

        map.removeFeatureState({
            source: "neighborhoods-polygons"
        });
    });

    const legend = document.querySelector("#legend");
    const entryTemplate = document.querySelector("#legend-entry");
    const fillColorStyle = map.getPaintProperty("neighborhoods-fill", "fill-extrusion-color");

    fillColorStyle.splice(0, 2);
    let fromValue = 0;

    for (let index = 0; index < fillColorStyle.length; index+=2) {
        const entry = document.importNode(entryTemplate.content, true);
        const color = entry.querySelector(".color");
        const range = entry.querySelector(".range");
        const toValue = fillColorStyle[index+1];

        color.style.backgroundColor = fillColorStyle[index];

        if (index==fillColorStyle.length-1) {
            range.textContent = `>=${fromValue}`;
        } else {
            range.textContent = `${fromValue}-${toValue-1}`;
        }

        fromValue = toValue;

        legend.appendChild(entry);
    }
});
