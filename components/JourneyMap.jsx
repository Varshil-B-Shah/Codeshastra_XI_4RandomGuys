'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Create a component for the map that will be dynamically imported with no SSR
const JourneyMap = () => {
  // Client-side only imports for Leaflet
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [timelinePanelVisible, setTimelinePanelVisible] = useState(true);

  useEffect(() => {
    // Dynamic imports for Leaflet and related libraries
    const loadMap = async () => {
      const L = await import('leaflet');
      const LRM = await import('leaflet-routing-machine');
      
      if (!mapInstance.current && mapRef.current) {
        // Initialize map
        const map = L.map(mapRef.current, {
          zoomControl: false,
        }).setView([50.0, 0.0], 4);
        
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
          return L.divIcon({
            className: `custom-marker custom-marker-${mode}`,
            html: number,
            iconSize: [30, 30]
          });
        }
        
        // Function to create custom tooltip
        function createCustomTooltip(segment, isStart) {
          const tooltipContent = document.createElement('div');
          
          // Add heading with icon based on transport mode
          const heading = document.createElement('h3');
          let icon = '';
          
          switch(segment.mode) {
            case 'plane':
              icon = '<i class="fas fa-plane"></i> ';
              break;
            case 'car':
              icon = '<i class="fas fa-car"></i> ';
              break;
            case 'ferry':
              icon = '<i class="fas fa-ship"></i> ';
              break;
            case 'train':
              icon = '<i class="fas fa-train"></i> ';
              break;
          }
          
          heading.innerHTML = icon + (isStart ? 'Departure' : 'Arrival');
          tooltipContent.appendChild(heading);
          
          // Add title (split the title by '->' to get departure and arrival locations)
          const locationParts = segment.title.split('->');
          const locationText = isStart ? locationParts[0].trim() : locationParts[1].trim();
          
          const location = document.createElement('p');
          location.innerHTML = '<strong>Location:</strong> ' + locationText;
          tooltipContent.appendChild(location);
          
          // Add description
          const description = document.createElement('p');
          description.textContent = segment.description;
          tooltipContent.appendChild(description);
          
          return tooltipContent;
        }

        // Define journey segments with start and end coordinates, transport mode, and titles
        const segments = [
          {
            "from": [28.556160, 77.100281],
            "to": [19.097403, 72.874245],
            "mode": "plane",
            "description": "Flight from Delhi to Mumbai",
            "title": "Delhi Airport -> Mumbai Airport"
          },
          {
            "from": [19.097403, 72.874245],
            "to": [19.07342, 72.86981],
            "mode": "car",
            "description": "Taxi from Mumbai Airport to The Retreat Hotel and Convention Centre",
            "title": "Mumbai Airport -> The Retreat Hotel"
          },
          {
            "from": [19.07342, 72.86981],
            "to": [18.922064, 72.834641],
            "mode": "car",
            "description": "Taxi from The Retreat Hotel to the Gateway of India",
            "title": "The Retreat Hotel -> Gateway of India"
          },
          {
            "from": [18.922064, 72.834641],
            "to": [18.963253, 72.931442],
            "mode": "ferry",
            "description": "Ferry from Gateway of India to Elephanta Island",
            "title": "Gateway of India -> Elephanta Island"
          },
          {
            "from": [18.963253, 72.931442],
            "to": [18.927391, 72.832054],
            "mode": "ferry",
            "description": "Ferry from Elephanta Island to Gateway of India and then taxi to Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
            "title": "Elephanta Island -> Chhatrapati Shivaji Maharaj Vastu Sangrahalaya"
          },
          {
            "from": [18.927391, 72.832054],
            "to": [18.944, 72.823],
            "mode": "car",
            "description": "Taxi from Chhatrapati Shivaji Maharaj Vastu Sangrahalaya to Marine Drive",
            "title": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya -> Marine Drive"
          },
          {
            "from": [18.944, 72.823],
            "to": [19.161697, 72.88678],
            "mode": "car",
            "description": "Taxi from Marine Drive to Film City",
            "title": "Marine Drive -> Film City"
          },
          {
            "from": [19.161697, 72.88678],
            "to": [18.91, 72.83],
            "mode": "car",
            "description": "Taxi from Film City to Dhobi Ghat",
            "title": "Film City -> Dhobi Ghat"
          },
          {
            "from": [18.91, 72.83],
            "to": [19.0427179, 72.8191316],
            "mode": "car",
            "description": "Taxi from Dhobi Ghat to Bandstand",
            "title": "Dhobi Ghat -> Bandstand"
          },
          {
            "from": [19.0427179, 72.8191316],
            "to": [19.0413, 72.8202],
            "mode": "car",
            "description": "Taxi from Bandstand to Mount Mary Church",
            "title": "Bandstand -> Mount Mary Church"
          },
          {
            "from": [19.0413, 72.8202],
            "to": [19.07342, 72.86981],
            "mode": "car",
            "description": "Taxi from Mount Mary Church to The Retreat Hotel and Convention Centre",
            "title": "Mount Mary Church -> The Retreat Hotel"
          },
          {
            "from": [19.07342, 72.86981],
            "to": [19.097403, 72.874245],
            "mode": "car",
            "description": "Taxi from The Retreat Hotel and Convention Centre to Mumbai Airport",
            "title": "The Retreat Hotel -> Mumbai Airport"
          },
          {
            "from": [19.097403, 72.874245],
            "to": [28.556160, 77.100281],
            "mode": "plane",
            "description": "Flight from Mumbai to Delhi",
            "title": "Mumbai Airport -> Delhi Airport"
          }
        ];
        
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
          const startTooltipContent = createCustomTooltip(segment, true);
          const startTooltipOptions = {
            className: 'custom-tooltip',
            direction: 'top',
            offset: [0, -15],
            opacity: 0.9
          };
          
          startMarker.bindTooltip(startTooltipContent, startTooltipOptions);
          
          if (isTerminal && endMarker) {
            const endTooltipContent = createCustomTooltip(segment, false);
            endMarker.bindTooltip(endTooltipContent, startTooltipOptions);
          }
          
          // Store markers for bounding
          allMarkers.push(startMarker);
          if (isTerminal && endMarker) allMarkers.push(endMarker);
          
          // Draw routes based on mode
          if (segment.mode === "plane") {
            // For plane segments, draw a curved path with airplane icon
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
              color: '#e74c3c',
              weight: 3,
              opacity: 0.7,
              smoothFactor: 1
            }).addTo(map);
            
            // Add plane icon to the middle of the curved line
            const midPoint = latlngs[1];
            const planeIcon = L.divIcon({
              className: '',
              html: '<i class="fas fa-plane" style="color: #e74c3c; font-size: 16px; transform: rotate(45deg);"></i>',
              iconSize: [20, 20]
            });
            
            L.marker(midPoint, { icon: planeIcon }).addTo(map);
            
            // Add tooltip to the route
            planeRoute.bindTooltip(segment.description, { 
              className: 'custom-tooltip',
              direction: 'top',
              sticky: true
            });
          } else if (segment.mode === "ferry") {
            // For ferry segments, draw a wavy purple line
            const ferryRoute = L.polyline([segment.from, segment.to], {
              color: '#9b59b6',
              weight: 3,
              opacity: 0.8,
              dashArray: '8,12'
            }).addTo(map);
            
            // Add ship icon to the ferry route
            const ferryMidPoint = [
              (segment.from[0] + segment.to[0]) / 2,
              (segment.from[1] + segment.to[1]) / 2
            ];
            
            const ferryIcon = L.divIcon({
              className: '',
              html: '<i class="fas fa-ship" style="color: #9b59b6; font-size: 14px;"></i>',
              iconSize: [20, 20]
            });
            
            L.marker(ferryMidPoint, { icon: ferryIcon }).addTo(map);
            
            // Add tooltip to the route
            ferryRoute.bindTooltip(segment.description, { 
              className: 'custom-tooltip',
              direction: 'top',
              sticky: true
            });
          } else if (segment.mode === "car") {
            // Define custom car route style
            const carRouteStyle = {
              styles: [{ 
                color: '#3498db',
                weight: 4,
                opacity: 0.8
              }]
            };
            
            // Use Leaflet Routing Machine for car routes
            const carRoute = L.Routing.control({
              waypoints: [
                L.latLng(segment.from[0], segment.from[1]),
                L.latLng(segment.to[0], segment.to[1])
              ],
              router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving'
              }),
              lineOptions: carRouteStyle,
              createMarker: function() { return null; },
              addWaypoints: false,
              draggableWaypoints: false,
              fitSelectedRoute: false,
              routeWhileDragging: false,
              show: false
            }).addTo(map);
          } else if (segment.mode === "train") {
            // For train segments, draw a dashed green line
            const trainRoute = L.polyline([segment.from, segment.to], {
              color: '#2ecc71',
              weight: 4,
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
              html: '<i class="fas fa-train" style="color: #2ecc71; font-size: 14px;"></i>',
              iconSize: [20, 20]
            });
            
            L.marker(trainMidPoint, { icon: trainIcon }).addTo(map);
            
            // Add tooltip to the route
            trainRoute.bindTooltip(segment.description, { 
              className: 'custom-tooltip',
              direction: 'top',
              sticky: true
            });
          }
          
          // Add to timeline items array
          let timelineColorClass;
          let timelineIcon;
          
          switch(segment.mode) {
            case 'plane':
              timelineColorClass = '#e74c3c';
              timelineIcon = 'fa-plane';
              break;
            case 'car':
              timelineColorClass = '#3498db';
              timelineIcon = 'fa-car';
              break;
            case 'ferry':
              timelineColorClass = '#9b59b6';
              timelineIcon = 'fa-ship';
              break;
            case 'train':
              timelineColorClass = '#2ecc71';
              timelineIcon = 'fa-train';
              break;
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
            padding: [50, 50]
          });
        }
        
        // Update timeline in DOM
        const timelineItemsEl = document.getElementById('timelineItems');
        if (timelineItemsEl) {
          timelineItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'timeline-item';
            itemEl.innerHTML = `
              <div class="timeline-icon" style="background-color: ${item.color}">
                <i class="fas ${item.icon} fa-xs"></i>
              </div>
              <div class="timeline-content">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
              </div>
            `;
            timelineItemsEl.appendChild(itemEl);
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
  }, []);

  const toggleTimelinePanel = () => {
    setTimelinePanelVisible(!timelinePanelVisible);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full z-10"></div>
      
      {/* Toggle button for timeline on mobile */}
      <button 
        className="absolute top-4 left-4 z-50 bg-white rounded px-3 py-2 shadow-md md:hidden flex items-center"
        onClick={toggleTimelinePanel}
      >
        <i className={`fas ${timelinePanelVisible ? 'fa-times' : 'fa-list'} mr-2`}></i>
        {timelinePanelVisible ? 'Hide Itinerary' : 'Show Itinerary'}
      </button>
      
      {/* Timeline panel */}
      <div 
        className={`absolute top-4 left-4 bg-white bg-opacity-90 p-5 rounded-lg shadow-md z-30 w-full max-w-sm max-h-[80vh] overflow-y-auto 
                    ${timelinePanelVisible ? 'block' : 'hidden'} md:block`}
        id="timelinePanel"
      >
        <h2 className="mt-0 border-b-2 border-gray-200 pb-2 text-gray-800 text-lg flex items-center">
          <i className="fas fa-route mr-2"></i> Journey Itinerary
        </h2>
        <div id="timelineItems" className="mt-4"></div>
      </div>
      
      {/* Journey Legend */}
      <div className="absolute bottom-8 right-4 bg-white bg-opacity-90 p-4 rounded-lg z-30 shadow-md">
        <h3 className="mt-0 mb-2 text-sm">Transportation Types</h3>
        <div className="flex items-center mb-2">
          <div className="w-8 h-1.5 bg-red-500 mr-2"></div>
          <div className="text-sm text-gray-700"><i className="fas fa-plane mr-1"></i> Plane</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-8 h-1.5 bg-blue-500 mr-2"></div>
          <div className="text-sm text-gray-700"><i className="fas fa-car mr-1"></i> Car</div>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-8 h-0.5 bg-purple-500 mr-2 mt-0.5"></div>
          <div className="text-sm text-gray-700"><i className="fas fa-ship mr-1"></i> Ferry</div>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-1.5 bg-green-500 mr-2"></div>
          <div className="text-sm text-gray-700"><i className="fas fa-train mr-1"></i> Train</div>
        </div>
      </div>
    </div>
  );
};

// Create a dynamic import with no-SSR for the map component
const InteractiveJourneyMap = () => {
  return (
    <>
      <div className="w-full h-screen">
        <JourneyMap />
      </div>
      {/* Font Awesome Script */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
      {/* Required CSS for Leaflet */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet/dist/leaflet.css" 
      />
      {/* Required CSS for Leaflet Routing Machine */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" 
      />
    </>
  );
};

export default InteractiveJourneyMap;