import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../style.css";
import {MapContainer, Marker, Polygon} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { districtData } from "../lk";


const Map = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  const getUserDetails = async (accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    );
    const data = await response.json();
    setUserDetails(data);
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("/");
    }

    getUserDetails(accessToken);
  }, [navigate]);

  const markers = [
    {
      geocode: [7.4698, 80.6217],
      popup: "Matale",
    },
    {
      geocode: [6.93194, 79.84778],
      popup: "Colombo",
    },
    {
      geocode: [7.29754, 81.68202],
      popup: "Ampara",
    },
  ];
  const sunny = new Icon({
    iconUrl: require("../img/sunny.png"),
    iconSize: [24, 24],
  });

  const rain = new Icon({
    iconUrl: require("../img/rain.png"),
    iconSize: [24, 24],
  });

  const storm = new Icon({
    iconUrl: require("../img/storm.png"),
    iconSize: [24, 24],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("hello");
  const [temp, setTemp] = useState("hello");
  const [humidity, setHumidity] = useState("hello");
  const [weather, setWeather] = useState("sunny");
  const colombo = [6.88, 79.861244];
  const anuradhapura = [8.31223, 80.41306];
  const togglePopup = (name) => {
    setName(name);
    setShowPopup(!showPopup);

    // console.log(element);
  };

  return (
    <>
      {userDetails ? (
        <div className="user-profile">
          <div className="card">
            <img
              src={userDetails.picture}
              alt={`${userDetails.given_name}'s profile`}
              className="profile-pic"
            />
            <p>Welcome</p>
            <h1 className="name">{userDetails.name}</h1>
            <p className="email">{userDetails.email}</p>
            <p className="locale">{`Locale: ${userDetails.locale}`}</p>
          </div>
        </div>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    <MapContainer center={[7.8774222, 80.7003428]} zoom={7.5}>
      {showPopup && (
        <div className="popup" id="popup">
          <div className="popup-inner">
            <h2>{name}</h2>
            <ul>
              <li>Tempertature: </li>
              <li>Humidity: </li>
              <li>Name: </li>
            </ul>
            <button onClick={togglePopup}>Close Popup</button>
          </div>
        </div>
      )}
      <Marker position={colombo} icon={rain}></Marker>
      <Marker position={anuradhapura} icon={sunny}></Marker>
      {districtData.features.map((state) => {
        let coordinates;
        if (state.geometry.type === "Polygon") {
          // For a single Polygon
          coordinates = state.geometry.coordinates[0].map((item) => [
            item[1],
            item[0],
          ]);
        } else if (state.geometry.type === "MultiPolygon") {
          // For MultiPolygon, handle each polygon separately
          coordinates = state.geometry.coordinates.map((polygon) => {
            return polygon[0].map((item) => [item[1], item[0]]);
          });
        }
        const names = state.properties.name;
        console.log(names);

        return (
          <Polygon
            pathOptions={{
              fillColor: "green",
              fillOpacity: 0.7,
              weight: 2,
              opacity: 1,
              dashArray: "3",
              color: "white",
            }}
            positions={coordinates}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.5,
                  weight: 2,
                  dashArray: "0",
                  color: "#666",
                  fillcolor: "red",
                  name: name,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.7,
                  weight: 2,
                  dashArray: "3",
                  color: "white",
                  fillclor: "red",
                });
              },
              click: (e) => {
                togglePopup(state.properties.name);
                console.log(state.properties.name);
                // change popup name to district name

                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 1,
                  weight: 2,
                  dashArray: "0",
                  color: "#666",
                  fillcolor: "red",
                });
              },
            }}
          />
        );
      })}
    </MapContainer>
    </>
  );
}

export default Map;