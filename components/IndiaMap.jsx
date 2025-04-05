"use client"
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function IndiaMap() {
  const mountRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  // Tourism data for different locations in India
  const tourismData = {
    delhi: {
      name: "Delhi",
      description: "India's capital territory, a massive metropolitan area in the country's north.",
      attractions: ["Red Fort", "Qutub Minar", "India Gate", "Humayun's Tomb", "Lotus Temple"],
      howToReach: "Delhi has an international airport (Indira Gandhi International Airport) with excellent connectivity. It's also a major railway junction with trains from all parts of India.",
      bestTimeToVisit: "October to March",
      position: { x: 0.02, y: 0.25, z: 0.1 }
    },
    agra: {
      name: "Agra",
      description: "Home to the iconic Taj Mahal, Agra is one of India's most visited cities.",
      attractions: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh", "Itimad-ud-Daulah's Tomb"],
      howToReach: "Agra is well-connected by train from Delhi (2-3 hours). The nearest airport is in Delhi, though Agra has a smaller airport with limited flights.",
      bestTimeToVisit: "October to March",
      position: { x: 0, y: 0.18, z: 0.1 }
    },
    jaipur: {
      name: "Jaipur",
      description: "Known as the 'Pink City', Jaipur is part of the Golden Triangle tourist circuit along with Delhi and Agra.",
      attractions: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Jal Mahal"],
      howToReach: "Jaipur has an international airport. It's also well-connected by train from Delhi (4-5 hours) and other major cities.",
      bestTimeToVisit: "October to March",
      position: { x: -0.07, y: 0.18, z: 0.1 }
    },
    mumbai: {
      name: "Mumbai",
      description: "India's financial center and its most populous city, known for its vibrant culture and colonial architecture.",
      attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Chhatrapati Shivaji Terminus", "Juhu Beach"],
      howToReach: "Mumbai has a major international airport (Chhatrapati Shivaji International Airport). It's also connected by railway to all major cities.",
      bestTimeToVisit: "October to May",
      position: { x: -0.12, y: 0, z: 0.1 }
    },
    goa: {
      name: "Goa",
      description: "India's smallest state known for its beaches, nightlife, and Portuguese colonial architecture.",
      attractions: ["Baga Beach", "Anjuna Beach", "Basilica of Bom Jesus", "Fort Aguada", "Dudhsagar Falls"],
      howToReach: "Goa has an international airport. It's also accessible by train from Mumbai and other major cities.",
      bestTimeToVisit: "November to February",
      position: { x: -0.12, y: -0.1, z: 0.1 }
    },
    kerala: {
      name: "Kerala",
      description: "Known as 'God's Own Country', Kerala is famous for its backwaters, beaches, and wildlife.",
      attractions: ["Alleppey Backwaters", "Munnar", "Kovalam Beach", "Periyar Wildlife Sanctuary", "Fort Kochi"],
      howToReach: "Kerala has three international airports: Kochi, Thiruvananthapuram, and Kozhikode. It's also well-connected by train.",
      bestTimeToVisit: "September to March",
      position: { x: -0.08, y: -0.25, z: 0.1 }
    },
    varanasi: {
      name: "Varanasi",
      description: "One of the world's oldest continuously inhabited cities and a major religious hub in India.",
      attractions: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Ramnagar Fort", "Morning Boat Ride on Ganges"],
      howToReach: "Varanasi has an international airport. It's also well-connected by train to major cities like Delhi and Kolkata.",
      bestTimeToVisit: "October to March",
      position: { x: 0.1, y: 0.1, z: 0.1 }
    },
    kolkata: {
      name: "Kolkata",
      description: "The cultural capital of India, known for its literature, art, and colonial architecture.",
      attractions: ["Victoria Memorial", "Howrah Bridge", "Park Street", "Indian Museum", "Dakshineswar Kali Temple"],
      howToReach: "Kolkata has an international airport. It's also connected by train to all major cities in India.",
      bestTimeToVisit: "October to March",
      position: { x: 0.25, y: 0.1, z: 0.1 }
    }
  };

  useEffect(() => {
    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001133);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 0.6;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.minDistance = 0.4;
    controls.maxDistance = 1.2;
    
    // Create the base map of India
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x3366cc,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const india = new THREE.Mesh(geometry, material);
    scene.add(india);

    // Add location markers
    const markerGeometry = new THREE.SphereGeometry(0.01, 16, 16);
    const locations = [];
    
    Object.entries(tourismData).forEach(([key, location]) => {
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff9900 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(location.position.x, location.position.y, location.position.z);
      marker.userData = { locationId: key };
      scene.add(marker);
      locations.push(marker);
    });
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function onMouseClick(event) {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Find intersections
      const intersects = raycaster.intersectObjects(locations);
      
      if (intersects.length > 0) {
        const locationId = intersects[0].object.userData.locationId;
        setSelectedLocation(tourismData[locationId]);
        setShowInfo(true);
      } else {
        // Close info panel if clicking elsewhere
        setShowInfo(false);
      }
    }
    
    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);
  
  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full"></div>
      
      {showInfo && selectedLocation && (
        <div className="absolute top-4 right-4 w-80 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg overflow-y-auto max-h-96">
          <button 
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={() => setShowInfo(false)}
          >
            ×
          </button>
          <h2 className="text-xl font-bold text-blue-800 mb-2">{selectedLocation.name}</h2>
          <p className="text-gray-700 mb-3">{selectedLocation.description}</p>
          
          <h3 className="text-lg font-semibold text-blue-700 mb-1">Top Attractions</h3>
          <ul className="mb-3">
            {selectedLocation.attractions.map((attraction, index) => (
              <li key={index} className="ml-4 text-gray-700 list-disc">{attraction}</li>
            ))}
          </ul>
          
          <h3 className="text-lg font-semibold text-blue-700 mb-1">How to Reach</h3>
          <p className="text-gray-700 mb-3">{selectedLocation.howToReach}</p>
          
          <h3 className="text-lg font-semibold text-blue-700 mb-1">Best Time to Visit</h3>
          <p className="text-gray-700">{selectedLocation.bestTimeToVisit}</p>
        </div>
      )}
      
      <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-3 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-blue-800">Interactive India Tourism Map</h1>
        <p className="text-sm text-gray-700">Click on any highlighted location to view tourism details</p>
      </div>
    </div>
  );
}