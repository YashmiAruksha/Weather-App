import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
import "../style.css";
import {MapContainer, Marker, Polygon} from "react-leaflet";
import { Icon, marker } from "leaflet";
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
    // {
    //   geocode: [6.93194, 79.84778],
    //   name: "Colombo",
    //   icon: "Rainy"
    // },
    // {
    //   geocode: [6.5854, 79.9607],
    //   name: "Kaluthara",
    //   icon: "Windy"
    // },
    // {
    //   geocode: [7.0840,80.0098],
    //   name: "Gampaha",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [7.2906, 80.6337],
    //   name: "Kandy",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [6.0329, 80.2168],
    //   name: "Galle",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [5.9496, 80.5469],
    //   name: "Matara",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [6.1429, 81.1212],
    //   name: "Hambanthota",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [9.6615, 80.0255],
    //   name: "Jaffna",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [8.5874, 81.2152],
    //   name: "Trincomalee",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [7.3018, 81.6747],
    //   name: "Ampara",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [7.7249, 81.6967],
    //   name: "Batticaloa",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [7.4818, 80.3609],
    //   name: "Kurunegala",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [8.0408, 79.8394],
    //   name: "Puttalam",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [8.3114, 80.4037],
    //   name: "Anuradhapura",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [7.9403, 81.0188],
    //   name: "Polonnaruwa",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [6.9934, 81.0550],
    //   name: "Badulla",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [6.8906, 81.3454],
    //   name: "Monaragala",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [6.7055, 80.3848],
    //   name: "Ratnapura",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [7.2513, 80.3464],
    //   name: "Kegalle",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [7.4675, 80.6234],
    //   name: "Matale",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [6.9497, 80.7891],
    //   name: "Nuwara Eliya",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [8.7542, 80.4982],
    //   name: "Vavuniya",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [8.9810, 79.9044],
    //   name: "Mannar",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [9.2671, 80.8142],
    //   name: "Mullaitivu",
    //   icon: "Sunny"
    // },
    // {
    //   geocode: [9.3803, 80.3770],
    //   name: "Kilinochchi",
    //   icon: "Sunny"
    // },
    
    
  ];

  const Sunny = new Icon({
    iconUrl: require("../img/sunny.png"),
    iconSize: [20, 20],
  });

  const Rainy = new Icon({
    iconUrl: require("../img/rain.png"),
    iconSize: [20, 20],
  });

  const Cloudy = new Icon({
    iconUrl: require("../img/storm.png"),
    iconSize: [24, 24],
  });
  const Windy = new Icon({
    iconUrl: require("../img/windy.png"),
    iconSize: [24,24],
  });
  function getIcon(iconName) {
    switch (iconName) {
      case 'Sunny':
        return Sunny;
      case 'Rainy':
        return Rainy;
      case 'Windy':
        return Windy;
      case 'Cloudy':
        return Cloudy;
      default:
        return null; // Return null or default icon if no match found
    }
  }

  
  const [allWeatherData, setAllWeatherData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [district, setDistrict] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const Colombo = [6.88, 79.861244];
  const Anuradhapura = [8.31223, 80.41306];
  const [popupContent ,setPopupContent] = useState(null);

  const togglePopup = (districtName) => {
    setDistrict(districtName);
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const fetchAllWeatheData = async () => {
      try{
        const allWeatherResponse = await axios.get('http://localhost:5000/api/weather');
        setAllWeatherData(allWeatherResponse.data);
        console.log(allWeatherResponse.data);
      }catch(error){
        console.error(error);
      }
    };

    fetchAllWeatheData();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      axios.get('http://localhost:5000/api/weather/'+ district)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error(error);
      })
    };

    if(district){
      console.log(district)
      fetchWeatherData();
    }
    console.log(district);
  }, [district]);

  useEffect(() => {
    if(weatherData){
      // console.log(weatherData);
      const content = (
        <div>
          <h2>{district}</h2>
          <ul>
            <li>Tempertature: {weatherData.temperature}</li>
            <li>Humidity: {weatherData.humidity}</li>
            <li>Air Pressure:  {weatherData.airPressure}</li>
            <li>Weather: {weatherData.weatherType} </li>
          </ul>
        </div>
      
      );

      setPopupContent(content);
    }
  }, [district, weatherData, togglePopup])

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
    <MapContainer center={[7.8774222, 80.7003428]} zoom={7.5} style={{ backgroundColor: '#6a90ad' }}>
      {showPopup && (
        <div className="popup" id="popup">
          <div className="popup-inner">
            {popupContent}
          </div>
        </div>
      )}
      {
          allWeatherData && (
            allWeatherData.map((marker) =>(
              <Marker position={marker.geocode} icon={getIcon(marker.weatherType)}/>
            ))
          )
      }
    
      
          {/* <Marker position={Colombo} icon={Sunny}></Marker> */}

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
        const districtName = state.properties.name;

        return (
          <Polygon
          key={districtName}
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
                  fillOpacity: 0.3,
                  weight: 2,
                  dashArray: "0",
                  color: "white",
                  fillcolor: "white",
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.7,
                  weight: 2,
                  dashArray: "3",
                  color: "white",
                  fillclor: "white",
                });
              },
              click: (e) => {
                togglePopup(state.properties.name);
                // console.log(district);
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 1,
                  weight: 2,
                  dashArray: "0",
                  color: "#666",
                  fillcolor: "white",
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