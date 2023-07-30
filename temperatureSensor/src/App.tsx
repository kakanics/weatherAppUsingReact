import { useEffect, useState } from "react";

interface WeatherData {
  DailyForecasts: DailyForecast[];
}

interface DailyForecast {
  Date: string;
  Day: {
    HasPrecipitation: boolean;
  };
  Night: {
    HasPrecipitation: boolean;
  };
  Temperature: {
    Minimum: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
    Maximum: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
  };
}
async function getData() {
  let minimums: number[] = [];
  let maximums: number[] = [];
  let dayPrecipitation: number[] = [];
  let nightPrecipitation: number[] = [];

  // get api key from config.tsx and use it in the url
  const url =
    "http://dataservice.accuweather.com/forecasts/v1/daily/5day/260622?apikey=" +
    apikey +
    "&metric=true";

  await fetch(url)
    .then((res) => res.json())
    .then((data: WeatherData) => {
      console.log(data);
      const dailyForecasts: DailyForecast[] = data.DailyForecasts;
      minimums = dailyForecasts.map(
        (forecast) => forecast.Temperature.Minimum.Value
      );
      dayPrecipitation = dailyForecasts.map((forecast) =>
        forecast.Day.HasPrecipitation ? 1 : 0
      );
      nightPrecipitation = dailyForecasts.map((forecast) =>
        forecast.Night.HasPrecipitation ? 1 : 0
      );
      maximums = dailyForecasts.map(
        (forecast) => forecast.Temperature.Maximum.Value
      );
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  return [minimums, maximums, dayPrecipitation, nightPrecipitation];
}
function useGetMinMax() {
  const [mins, setMins] = useState<number[]>([]);
  const [maxs, setMaxs] = useState<number[]>([]);
  const [dayRain, setDayRain] = useState<number[]>([]);
  const [nightRain, setNightRain] = useState<number[]>([]);

  useEffect(() => {
    getData()
      .then((numbers) => {
        setMins(numbers[0]);
        setMaxs(numbers[1]);
        setDayRain(numbers[2]);
        setNightRain(numbers[3]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return { mins, maxs, dayRain, nightRain };
}

function App() {
  const { mins, maxs, dayRain, nightRain } = useGetMinMax();
  const date: Date[] = [];
  const tempElement: string[] = [];
  const rainElement: string[] = [];
  for (let i = 0; i < 5; i++) {
    date.push(new Date(+new Date() + 86400000 * i));
  }
  for (let i = 0; i < 5; i++) {
    tempElement.push(
      "Min: " +
        mins[i] +
        "°C | Max: " +
        maxs[i] +
        "°C" +
        " at " +
        date[i].toUTCString()
    );
    let x = dayRain[i] == 1 ? "may rain" : "no rain";
    let y = nightRain[i] == 1 ? "may rain" : "no rain";
    rainElement.push(
      "Day Time: " + x + " | Night Time: " + y + " at " + date[i].toUTCString()
    );
  }

  return (
    <div className="text-bg-dark p-3" style={{ height: "100vh" }}>
      <ul className="list-group">
        <h1>Temperature:</h1>
        {tempElement.map((temp) => (
          <li
            className="list-group-item"
            style={{ marginLeft: "2%", marginRight: "20%", paddingLeft: "2%" }}
          >
            {temp}
          </li>
        ))}
      </ul>
      <br />
      <br />
      <ul className="list-group">
        <h1>Raining Chances:</h1>
        {rainElement.map((rain) => (
          <li
            className="list-group-item"
            style={{ marginLeft: "2%", marginRight: "20%", paddingLeft: "2%" }}
          >
            {rain}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
