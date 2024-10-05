import { useState } from 'react';
import './App.css';
import APIForm from './components/APIForm';
import Gallery from './components/Gallery';  

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);

  const submitForm = () => {
    console.log("Submit button clicked!"); // Debugging log

    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    if (inputs.url === "" || inputs.url === " ") {
      alert("You forgot to submit a URL!");
      return;
    }

    for (const [key, value] of Object.entries(inputs)) {
      if (value === "") {
        inputs[key] = defaultValues[key];
      }
    }

    console.log("Final inputs: ", inputs); // Debugging log
    makeQuery();
  };

  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let fullURL = "https://" + inputs.url;

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    console.log("API Query: ", query); // Debugging log
    callAPI(query).catch(console.error);
  };

  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const json = await response.json();

      if (!json.url) {
        alert("Oops! Something went wrong with that query, let's try again!");
      } else {
        console.log("API response: ", json.url); // Debugging log
        setCurrentImage(json.url);
        setPrevImages((images) => [...images, json.url]);
        reset();
      }
    } catch (error) {
      console.error("API call failed: ", error);
    }
  };

  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
  };

  return (
    <div className="whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>
      
      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}  // Pass the submitForm function
      />

      {currentImage && (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot"
        />
      )}

      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
        </p>
      </div>

      <div className="container">
        <Gallery images={prevImages} />
      </div>
    </div>
  );
}

export default App;