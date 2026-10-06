require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000
const cors = require("cors")
const API_KEY = process.env.OPEN_WEATHER_API_KEY


app.use(express.json());
app.use(cors());
// const frontendPath = path.join(__dirname, '..', "Frontend");
// app.use(express.static(frontendPath));


if(!API_KEY){
    console.error(`please provide API_KEY`);
    process.exit(1);
}
 


app.get("/api/weather", async (req, res) => {

    const city = req.query.city
    if(!city){
        return res.status(400).json({message:"please provide a city "})
    }
    try{
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        const weatherUrl = await fetch(url);
        const data = await weatherUrl.json();

        console.log(data)
    
        if (weatherUrl.status === 404){
            return res.status(404).json({message: "city not found"});
            }
        if (weatherUrl.status === 400){
            return res.status(400).json({message:`provide a city`})
            }
        if (weatherUrl.status === 500){
            return res.status(500).json({message:`server error`})
            }
        if (!weatherUrl.ok){
            return res.status(weatherUrl.status).json({message:`server error`})
            }
        res.json({
            city:data.name,
            country: data.sys.country,
            temp:data.main.temp,
            feels_like:data.main.feels_like,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            pressure: data.main.pressure,
            sea_level: data.main.sea_level ?? data.main.pressure,
            grnd_level: data.main.grnd_level ?? data.main.pressure,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            wind_deg: data.wind.deg,
            wind_gust: data.wind.gust ?? null


        })

        // return res.json(data);

        

    }catch(error){
        console.log(error)
        return res.status(500).json({ message:"not fetch weather"});
    }

})
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
