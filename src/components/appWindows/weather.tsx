"use client";

import { Skeleton } from "@/shadcn/skeleton";
import { Cloud, Wind, Droplets } from "lucide-react";
import { useEffect, useState } from "react";
import { useWeather, type Location } from "@/hooks/useWeather";

const getWeatherIcon = (code: number, isDay: boolean) => {
  if (code === 1000) return "☀️";
  if (code === 1003) return "🌤️";
  if (code === 1006 || code === 1009) return "☁️";
  if (code === 1030 || code === 1135) return "🌫️";
  if (
    code === 1063 ||
    code === 1069 ||
    code === 1072 ||
    code === 1150 ||
    code === 1153
  )
    return "🌧️";
  if (code === 1066 || code === 1114 || code === 1117 || code === 1210)
    return "❄️";
  if (code === 1087 || code === 1279 || code === 1282) return "⛈️";
  return "🌤️";
};

export default function WeatherApp() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  const { data: weather, isLoading } = useWeather(location);

  if (isLoading || !weather) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    );
  }

  const current = weather.current;
  const location_data = weather.location;
  const forecast = weather.forecast.forecastday;
  const hourly = forecast[0].hour;
  const upcomingHours = hourly.filter(
    (h: any) => h.time_epoch * 1000 > Date.now(),
  );

  let displayHours = upcomingHours;

  if (displayHours.length < 24 && forecast.length > 1) {
    const tomorrowHours = forecast[1].hour;
    const needed = 24 - displayHours.length;
    displayHours = [...displayHours, ...tomorrowHours.slice(0, needed)];
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
      {/* Hourly Forecast */}
      <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm">
        <div className="flex flex-row justify-between">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-4xl">
              {getWeatherIcon(current.condition.code, current.is_day)}
            </span>
            <div>
              <div className="text-3xl font-semibold">{current.temp_c}°</div>
              <div className="text-muted-foreground text-sm">
                {current.condition.text}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{location_data.name}</h2>
            <div className="text-muted-foreground text-sm">
              High: {forecast[0].day.maxtemp_c}° Low:{" "}
              {forecast[0].day.mintemp_c}°
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3">
            {displayHours.slice(0, 24).map((hour: any) => (
              <div
                key={hour.time}
                className="mb-2 flex min-w-fit flex-col items-center"
              >
                <span className="text-2xl">
                  {getWeatherIcon(hour.condition.code, hour.is_day)}
                </span>
                <div className="text-md mt-2 font-medium">{hour.temp_c}°</div>
                <div className="text-muted-foreground text-sm">
                  {new Date(hour.time).getHours()}:00
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">5-Day Forecast</h3>
        <div className="space-y-3">
          {forecast.slice(0, 5).map((day: any, index: number) => {
            const date = new Date(day.date);
            const dayName =
              index === 0
                ? "Today"
                : index === 1
                  ? "Tomorrow"
                  : date.toLocaleDateString("en-US", { weekday: "long" });

            return (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex min-w-fit items-center gap-3">
                  <span className="text-2xl">
                    {getWeatherIcon(day.day.condition.code, true)}
                  </span>
                  <div className="w-24">
                    <div className="text-sm font-medium">{dayName}</div>
                    <div className="text-muted-foreground text-xs">
                      {day.day.condition.text}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{day.day.maxtemp_c}°</div>
                  </div>
                  <div className="text-muted-foreground text-right">
                    <div className="text-sm">{day.day.mintemp_c}°</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Wind size={18} className="text-accent" />
            <span className="text-muted-foreground text-xs">Wind</span>
          </div>
          <div className="text-lg font-semibold">{current.wind_kph} km/h</div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Droplets size={18} className="text-accent" />
            <span className="text-muted-foreground text-xs">Humidity</span>
          </div>
          <div className="text-lg font-semibold">{current.humidity}%</div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Cloud size={18} className="text-accent" />
            <span className="text-muted-foreground text-xs">Cloud</span>
          </div>
          <div className="text-lg font-semibold">{current.cloud}%</div>
        </div>
      </div>
    </div>
  );
}
