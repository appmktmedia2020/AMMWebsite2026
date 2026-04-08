import { useEffect, useRef } from "react";

/**
 * Interactive Leaflet map showing AMM's service area.
 * Used on both the Service Areas page and the Contact page.
 */
export default function ServiceMap({ height = 420 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const CITIES = [
    { name: "New Boston, OH", lat: 38.7448, lng: -82.9974, hq: true,  desc: "AMM Headquarters · 3879 Rhodes Ave, Suite 226" },
    { name: "Portsmouth, OH",  lat: 38.7318, lng: -82.9977, hq: false, desc: "Scioto County seat" },
    { name: "Chillicothe, OH", lat: 39.3331, lng: -82.9821, hq: false, desc: "Ross County" },
    { name: "Logan, OH",       lat: 39.5403, lng: -82.4074, hq: false, desc: "Hocking Hills gateway" },
    { name: "Jackson, OH",     lat: 39.0531, lng: -82.6374, hq: false, desc: "Jackson County" },
    { name: "Ironton, OH",     lat: 38.5370, lng: -82.6824, hq: false, desc: "Lawrence County" },
    { name: "Ashland, KY",     lat: 38.4784, lng: -82.6379, hq: false, desc: "Boyd County, Kentucky" },
    { name: "Huntington, WV",  lat: 38.4193, lng: -82.4452, hq: false, desc: "Cabell County, West Virginia" },
    { name: "Charleston, WV",  lat: 38.3498, lng: -81.6326, hq: false, desc: "West Virginia capital" },
  ];

  useEffect(() => {
    if (mapInstanceRef.current) return;
    let cancelled = false;

    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(([L]) => {
      if (cancelled || !mapRef.current) return;
      const map = L.map(mapRef.current, {
        center: [38.85, -82.6],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.circle([38.7448, -82.9974], {
        radius: 160934,
        color: "#25516A",
        fillColor: "#25516A",
        fillOpacity: 0.06,
        weight: 2,
        dashArray: "8, 8",
      }).addTo(map);

      const makeIcon = (isHq) => L.divIcon({
        className: "",
        html: isHq
          ? `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#CD9B42,#b8842e);border:3px solid #fff;box-shadow:0 4px 16px rgba(205,155,66,0.5);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`
          : `<div style="width:26px;height:26px;border-radius:50%;background:#25516A;border:3px solid #fff;box-shadow:0 3px 10px rgba(37,81,106,0.45);"></div>`,
        iconSize: isHq ? [36, 36] : [26, 26],
        iconAnchor: isHq ? [18, 18] : [13, 13],
        popupAnchor: [0, isHq ? -20 : -15],
      });

      CITIES.forEach(city => {
        const marker = L.marker([city.lat, city.lng], { icon: makeIcon(city.hq) }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:'Montserrat',sans-serif;min-width:160px;padding:4px 2px;">
            <div style="font-weight:700;font-size:14px;color:#1a3d52;margin-bottom:4px;">${city.hq ? "⭐ " : ""}${city.name}</div>
            <div style="font-size:12px;color:#666;line-height:1.5;">${city.desc}</div>
            ${city.hq ? `<a href="/contact" style="display:inline-block;margin-top:8px;background:#CD9B42;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;text-decoration:none;letter-spacing:.5px;">Get In Touch</a>` : ""}
          </div>`, { maxWidth: 220 });
      });

      const legend = L.control({ position: "bottomleft" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div");
        div.innerHTML = `<div style="background:white;padding:12px 16px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.12);font-family:'Montserrat',sans-serif;font-size:12px;min-width:160px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;"><div style="width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#CD9B42,#b8842e);border:2px solid #fff;box-shadow:0 2px 6px rgba(205,155,66,0.4);flex-shrink:0;"></div><span style="font-weight:700;color:#1a3d52;">Headquarters</span></div><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;"><div style="width:16px;height:16px;border-radius:50%;background:#25516A;border:2px solid #fff;box-shadow:0 2px 6px rgba(37,81,106,0.35);flex-shrink:0;"></div><span style="color:#444;">Cities Served</span></div><div style="display:flex;align-items:center;gap:10px;"><div style="width:16px;height:0;border-top:2px dashed #25516A;flex-shrink:0;"></div><span style="color:#444;">~100-Mile Radius</span></div></div>`;
        return div;
      };
      legend.addTo(map);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapRef} style={{
      width: "100%",
      height: "100%",
      minHeight: height,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    }} />
  );
}
