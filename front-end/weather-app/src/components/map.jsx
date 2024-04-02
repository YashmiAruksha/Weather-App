import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
import "../style.css";
import {MapContainer, Marker, Polygon, Tooltip} from "react-leaflet";
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

  // Set up interval to fetch data every 
    const intervalId = setInterval(fetchAllWeatheData, 300000);

  // Cleanup function to clear interval when component unmounts or when effect re-runs
    return () => clearInterval(intervalId);
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
              <Marker position={JSON.parse(marker.geocode)} icon={getIcon(marker.weatherType)}/>
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
                  fillOpacity: 0.5,
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
                  fillOpacity: 0.5,
                  weight: 1,
                  dashArray: "0",
                  color: "#666",
                  fillcolor: "white",
                });
              },
            }}
            >
              <Tooltip>{districtName}</Tooltip>
          </Polygon>
        );
      })}
    </MapContainer>
    </>
  );
}

export default Map;