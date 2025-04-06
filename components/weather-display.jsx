import React from 'react';
import { Card, CardContent } from './ui/card';
import { Cloud, Droplets, Thermometer, Wind, MapPin } from 'lucide-react';

export function WeatherDisplay({ data }) {
  if (!data || !data.current_condition || !data.current_condition[0]) {
    return null;
  }

  const current = data.current_condition[0];
  const location = data.nearest_area?.[0] || {};
  const forecast = data.weather?.[0] || {};

  // More compact version for in-chat display
  return (
    <div className="mt-3 w-full">
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          {/* Location Header */}
          <div className="flex items-center mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1 text-blue-500" />
            <span className="text-sm font-medium">
              {location.areaName?.[0]?.value}, {location.country?.[0]?.value}
            </span>
          </div>
          
          {/* Current Weather Overview */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-3xl font-bold">{current.temp_C}°C</div>
              <div className="ml-2">
                <div className="text-xs text-muted-foreground">Feels like: {current.FeelsLikeC}°C</div>
                <div className="text-sm">{current.weatherDesc?.[0]?.value}</div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Thermometer className="h-3 w-3 mr-1" />
                <span>Min: {forecast.mintempC}°C / Max: {forecast.maxtempC}°C</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Droplets className="h-3 w-3 mr-1" />
                <span>Humidity: {current.humidity}%</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Wind className="h-3 w-3 mr-1" />
                <span>Wind: {current.windspeedKmph} km/h</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
