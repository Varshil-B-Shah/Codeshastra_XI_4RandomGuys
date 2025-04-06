'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Create a component for the map that will be dynamically imported with no SSR
const JourneyMap = ({ segments = [] }) => {
  // Client-side only imports for Leaflet
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [timelinePanelVisible, setTimelinePanelVisible] = useState(true);

  useEffect(() => {
    if (!segments || segments.length === 0) {
      return;
    }
    
    // Dynamic imports for Leaflet only (removed leaflet-routing-machine)
    const loadMap = async () => {
      const L = await import('leaflet');
      
      if (!mapInstance.current && mapRef.current) {
        // Initialize map
        const map = L.map(mapRef.current, {
          zoomControl: false,
        }).setView([20.5937, 78.9629], 5); // Default center of India
        
        // Add zoom control to bottom right
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        // Add a beautiful map layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        mapInstance.current = map;
        
        // Function to create custom icon based on transport mode and sequence number
        function createCustomIcon(mode, number) {
          let bgColor;
          switch(mode) {
            case 'plane': bgColor = '#e74c3c'; break;
            case 'car': bgColor = '#3498db'; break;
            case 'ferry': bgColor = '#9b59b6'; break;
            case 'train': bgColor = '#2ecc71'; break;
            default: bgColor = '#f39c12'; break;
          }
          
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background-color: ${bgColor};
              color: white;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              font-weight: bold;
              font-size: 12px;
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            ">${number}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
        }
        
        // Function to create custom tooltip
        function createCustomTooltip(segment, isStart) {
          return `
            <div style="min-width: 150px; padding: 8px;">
              <h4 style="margin: 0 0 8px; font-size: 14px;">${isStart ? 'Departure' : 'Arrival'}</h4>
              <p style="margin: 0; font-size: 12px;">${segment.description}</p>
            </div>
          `;
        }

        // Counter for the sequence number
        let sequenceNumber = 1;
        
        // Array to store all markers for eventual bounding
        const allMarkers = [];
        const timelineItems = [];
        
        // Process each segment in the journey
        segments.forEach(function(segment, index) {
          // Create custom markers with sequence numbers
          const startMarker = L.marker(segment.from, {
            icon: createCustomIcon(segment.mode, sequenceNumber++)
          }).addTo(map);
          
          // For end points, only add sequence numbers if it's the last segment or the next segment's start is different
          const isTerminal = (index === segments.length - 1) || 
                           (segments[index + 1].from[0] !== segment.to[0] || 
                            segments[index + 1].from[1] !== segment.to[1]);
          
          let endMarker;
          if (isTerminal) {
            endMarker = L.marker(segment.to, {
              icon: createCustomIcon(segment.mode, sequenceNumber++)
            }).addTo(map);
          }
          
          // Create custom tooltips for markers
          startMarker.bindTooltip(createCustomTooltip(segment, true));
          
          if (isTerminal && endMarker) {
            endMarker.bindTooltip(createCustomTooltip(segment, false));
          }
          
          // Store markers for bounding
          allMarkers.push(startMarker);
          if (isTerminal && endMarker) allMarkers.push(endMarker);
          
          // Draw routes based on mode - use simple polylines for all modes
          let routeColor, routeStyle;
          
          switch(segment.mode) {
            case 'plane':
              // For plane segments, draw a curved path
              routeColor = '#e74c3c';
              // Calculate a midpoint that's slightly offset to create a curve
              const latlngs = [
                segment.from,
                [
                  (segment.from[0] + segment.to[0]) / 2,
                  (segment.from[1] + segment.to[1]) / 2 + 
                  Math.sqrt(Math.pow(segment.from[0] - segment.to[0], 2) + Math.pow(segment.from[1] - segment.to[1], 2)) * 0.07
                ],
                segment.to
              ];
              
              const planeRoute = L.polyline(latlngs, {
                color: routeColor,
                weight: 3,
                opacity: 0.7,
                smoothFactor: 1
              }).addTo(map);
              
              // Add plane icon to the middle of the curved line
              const midPoint = latlngs[1];
              const planeIcon = L.divIcon({
                className: '',
                html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c" width="16px" height="16px" style="transform: rotate(45deg);"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
                iconSize: [20, 20]
              });
              
              L.marker(midPoint, { icon: planeIcon }).addTo(map);
              planeRoute.bindTooltip(segment.description);
              break;
              
            case 'ferry':
              routeColor = '#9b59b6';
              const ferryRoute = L.polyline([segment.from, segment.to], {
                color: routeColor,
                weight: 3,
                opacity: 0.8,
                dashArray: '8,12'
              }).addTo(map);
              
              // Add ferry icon to the middle
              const ferryMidPoint = [
                (segment.from[0] + segment.to[0]) / 2,
                (segment.from[1] + segment.to[1]) / 2
              ];
              
              const ferryIcon = L.divIcon({
                className: '',
                html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9b59b6" width="14px" height="14px"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>',
                iconSize: [20, 20]
              });
              
              L.marker(ferryMidPoint, { icon: ferryIcon }).addTo(map);
              ferryRoute.bindTooltip(segment.description);
              break;
              
            case 'train':
              routeColor = '#2ecc71';
              const trainRoute = L.polyline([segment.from, segment.to], {
                color: routeColor,
                weight: 3,
                opacity: 0.8,
                dashArray: '12,12'
              }).addTo(map);
              
              // Add train icon to the route
              const trainMidPoint = [
                (segment.from[0] + segment.to[0]) / 2,
                (segment.from[1] + segment.to[1]) / 2
              ];
              
              const trainIcon = L.divIcon({
                className: '',
                html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2ecc71" width="14px" height="14px"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zm0 2c3.71 0 5.13.46 5.67 1H6.43c.6-.52 2.05-1 5.57-1zM6 7h5v3H6V7zm12 8.5c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5V12h12v3.5zm0-5.5h-5V7h5v3z"/></svg>',
                iconSize: [20, 20]
              });
              
              L.marker(trainMidPoint, { icon: trainIcon }).addTo(map);
              trainRoute.bindTooltip(segment.description);
              break;
              
            case 'car':
            default:
              routeColor = '#3498db';
              const carRoute = L.polyline([segment.from, segment.to], {
                color: routeColor,
                weight: 3,
                opacity: 0.8
              }).addTo(map);
              
              // Add car icon to the route
              const carMidPoint = [
                (segment.from[0] + segment.to[0]) / 2,
                (segment.from[1] + segment.to[1]) / 2
              ];
              
              const carIcon = L.divIcon({
                className: '',
                html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3498db" width="14px" height="14px"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>',
                iconSize: [20, 20]
              });
              
              L.marker(carMidPoint, { icon: carIcon }).addTo(map);
              carRoute.bindTooltip(segment.description);
              break;
          }
          
          // Add to timeline items array
          let timelineColorClass;
          let timelineIcon;
          
          switch(segment.mode) {
            case 'plane':
              timelineColorClass = '#e74c3c';
              timelineIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12px" height="12px"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>';
              break;
            case 'car':
              timelineColorClass = '#3498db';
              timelineIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12px" height="12px"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>';
              break;
            case 'ferry':
              timelineColorClass = '#9b59b6';
              timelineIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12px" height="12px"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>';
              break;
            case 'train':
              timelineColorClass = '#2ecc71';
              timelineIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12px" height="12px"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zm0 2c3.71 0 5.13.46 5.67 1H6.43c.6-.52 2.05-1 5.57-1zM6 7h5v3H6V7zm12 8.5c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5V12h12v3.5zm0-5.5h-5V7h5v3z"/></svg>';
              break;
            default:
              timelineColorClass = '#f39c12';
              timelineIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12px" height="12px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
          }
          
          timelineItems.push({
            title: segment.title.replace('->', '→'),
            description: segment.description,
            color: timelineColorClass,
            icon: timelineIcon
          });
        });
        
        // Fit map to all markers
        if (allMarkers.length > 0) {
          const markerGroup = L.featureGroup(allMarkers);
          map.fitBounds(markerGroup.getBounds(), {
            padding: [30, 30]
          });
        }
        
        // Update timeline in DOM
        const timelineItemsEl = document.getElementById('timelineItems');
        if (timelineItemsEl) {
          timelineItemsEl.innerHTML = ''; // Clear existing items
          timelineItems.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'timeline-item';
            itemEl.style.marginBottom = '15px';
            itemEl.style.display = 'flex';
            
            const iconEl = document.createElement('div');
            iconEl.style.backgroundColor = item.color;
            iconEl.style.borderRadius = '50%';
            iconEl.style.width = '30px';
            iconEl.style.height = '30px';
            iconEl.style.display = 'flex';
            iconEl.style.alignItems = 'center';
            iconEl.style.justifyContent = 'center';
            iconEl.style.marginRight = '10px';
            iconEl.style.flexShrink = '0';
            iconEl.innerHTML = item.icon;
            
            const contentEl = document.createElement('div');
            contentEl.style.flexGrow = '1';
            
            const titleEl = document.createElement('h4');
            titleEl.textContent = item.title;
            titleEl.style.margin = '0 0 5px 0';
            titleEl.style.fontSize = '14px';
            
            const descEl = document.createElement('p');
            descEl.textContent = item.description;
            descEl.style.margin = '0';
            descEl.style.fontSize = '12px';
            descEl.style.color = '#666';
            
            contentEl.appendChild(titleEl);
            contentEl.appendChild(descEl);
            
            itemEl.appendChild(iconEl);
            itemEl.appendChild(contentEl);
            
            timelineItemsEl.appendChild(itemEl);
            
            // Add connector line between items
            if (index < timelineItems.length - 1) {
              const connectorEl = document.createElement('div');
              connectorEl.style.width = '2px';
              connectorEl.style.height = '15px';
              connectorEl.style.backgroundColor = '#ddd';
              connectorEl.style.margin = '0 0 15px 14px';
              timelineItemsEl.appendChild(connectorEl);
            }
          });
        }
      }
      
      setMapReady(true);
    };
    
    loadMap();

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [segments]);

  const toggleTimelinePanel = () => {
    setTimelinePanelVisible(!timelinePanelVisible);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full z-10"></div>
      
      {/* Timeline panel */}
      <div 
        className={`absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-md z-30 w-72 max-h-[85%] overflow-y-auto 
                    ${timelinePanelVisible ? 'block' : 'hidden'}`}
        id="timelinePanel"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold m-0">Journey Details</h3>
          <button 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleTimelinePanel}
          >
            <span className="sr-only">Close panel</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div id="timelineItems" className="mt-4"></div>
      </div>
      
      {/* Toggle button for timeline */}
      <button 
        className="absolute bottom-4 left-4 z-50 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
        onClick={toggleTimelinePanel}
        style={{ display: timelinePanelVisible ? 'none' : 'flex' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Journey Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg z-30 shadow-md">
        <h3 className="text-xs font-medium mb-2 text-gray-700">Transport Types</h3>
        <div className="flex items-center mb-1.5">
          <div className="w-6 h-1.5 bg-red-500 mr-2"></div>
          <div className="text-xs text-gray-700">Plane</div>
        </div>
        <div className="flex items-center mb-1.5">
          <div className="w-6 h-1.5 bg-blue-500 mr-2"></div>
          <div className="text-xs text-gray-700">Car</div>
        </div>
        <div className="flex items-center mb-1.5">
          <div className="w-6 h-1.5 bg-purple-500 mr-2 border-t border-b border-dashed border-purple-500"></div>
          <div className="text-xs text-gray-700">Ferry</div>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-1.5 bg-green-500 mr-2"></div>
          <div className="text-xs text-gray-700">Train</div>
        </div>
      </div>
    </div>
  );
};

export default JourneyMap;