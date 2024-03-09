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
});
