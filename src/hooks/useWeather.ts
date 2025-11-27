import { useQuery } from "@tanstack/react-query";

export interface Location {
  lat: number;
  lon: number;
}

export const useWeather = (location: Location | null) => {
  return useQuery({
    queryKey: ["weather", location],
    queryFn: async () => {
      if (!location) return null;
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=0314712e9b7d41449dd82505253110&q=${location.lat},${location.lon}&days=5&aqi=no`,
      );
      return res.json();
    },
    enabled: !!location,
  });
};
