import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
import "../style.css";
import {MapContainer, Marker, Polygon, Tooltip} from "react-leaflet";
import { Icon, marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { districtData } from "../lk";
import SunnyImage from "../img/sunny.png"
import RainyImage from "../img/rain.png"
import CloudyImage from "../img/cloudy.png"
import WindyImage from "../img/windy.png"


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
    iconUrl: require("../img/cloudy.png"),
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
  function getImage(imageName) {
    switch (imageName) {
      case 'Sunny':
        return SunnyImage;
      case 'Rainy':
        return RainyImage;
      case 'Windy':
        return WindyImage;
      case 'Cloudy':
        return CloudyImage;
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
        <div  style={{ padding: '0 20px', fontFamily: 'Poppins', display: 'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div style={{display:'flex', justifyContent:'space-between', justifyItems: 'center', alignItems: 'center', margin: '5px 0'}}>
            <h2 style={{fontSize: '25px', marginRight: '15px'}}>{district}</h2>
            <div>{weatherData.weatherType}</div>
          </div>
          <div style={{display: 'flex', width:'100%', justifyContent:'space-between'}}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px', margin: '0' }}>
              <div style={{fontSize: '60px', fontWeight: 'bold', color: 'black', margin: 0, padding: 0, display: 'flex', alignItems:'flex-start' }}>{weatherData.temperature}<div style={{fontSize: '15px', fontWeight: 'light'}}>°C</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'flex-end', padding:'5px 0 0 0' }}>
              <div style={{display: 'flex', gap: '5px', justifyContent: 'flex-end'}}>
                <img style={{height: 'auto', width: '50px'}} src={getImage(weatherData.weatherType)}/>
              </div>
              <div style={{display: 'flex', gap: '5px', justifyContent: 'space-between'}}>
                <p>Humidity</p>
                <p style={{fontWeight:'bold'}}>{weatherData.humidity}</p>
              </div>
              <div style={{display: 'flex', gap: '5px'}}>
                <p>Air Pressure</p>
                <p style={{fontWeight:'bold'}}>{weatherData.airPressure}</p>
              </div>
            </div>
          </div>
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
    <MapContainer center={[7.8774222, 80.7003428]} zoom={7.5} scrollWheelZoom={false} style={{ backgroundColor: '#6a90ad' } }>
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
              <Tooltip>
                 {districtName}
              </Tooltip>
          </Polygon>
        );
      })}
    </MapContainer>
    </>
  );
}

export default Map;