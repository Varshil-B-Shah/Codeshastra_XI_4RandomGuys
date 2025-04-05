"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";
import Link from "next/link";

// Enhanced attractions data with more details
const attractions = [
  {
    id: 1,
    name: "Taj Mahal",
    tagline: "Monument of Eternal Love",
    location: "Agra, Uttar Pradesh",
    description:
      "A white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    image: "/Taj_Mahal.jpeg",
    bgColor: "from-blue-900 to-indigo-950",
    accentColor: "bg-blue-500",
    textColor: "text-blue-400",
  },
  {
    id: 2,
    name: "Red Fort",
    tagline: "Symbol of Power & History",
    location: "Delhi",
    description:
      "A historic fort that served as the main residence of the Mughal Emperors for nearly 200 years.",
    image: "/red_fort.jpg",
    bgColor: "from-red-900 to-red-950",
    accentColor: "bg-red-500",
    textColor: "text-red-400",
  },
  {
    id: 3,
    name: "Golden Temple",
    tagline: "Spiritual Heart of Sikhism",
    location: "Amritsar, Punjab",
    description:
      "The holiest Gurdwara of Sikhism, known for its stunning golden architecture and spiritual significance.",
    image: "/golden_temple.jpg",
    bgColor: "from-amber-900 to-amber-950",
    accentColor: "bg-amber-500",
    textColor: "text-amber-400",
  },
  {
    id: 4,
    name: "Gateway of India",
    tagline: "Portal to India's Past",
    location: "Mumbai, Maharashtra",
    description:
      "An iconic arch-monument built during the British Raj, standing proud on Mumbai's harbor.",
    image: "/gateway_of_india.jpg",
    bgColor: "from-indigo-900 to-purple-950",
    accentColor: "bg-indigo-500",
    textColor: "text-indigo-400",
  },
];

// Three.js background animation component
function ThreeJSBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create a rotating torus knot
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      roughness: 0.5,
      metalness: 0.1,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Add some light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.005;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}

export default function ImmersiveHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const mainRef = useRef(null);
  const circleRefs = useRef([]);
  const imageWrapperRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const cursorRef = useRef(null);

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % attractions.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? attractions.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      circleRefs.current.forEach((circle, index) => {
        gsap.to(circle, {
          rotation: 360,
          repeat: -1,
          duration: 20 + index * 5,
          ease: "none",
        });
      });

      const imageParallax = (e) => {
        if (imageWrapperRef.current) {
          const x = (window.innerWidth / 2 - e.clientX) / 25;
          const y = (window.innerHeight / 2 - e.clientY) / 25;
          gsap.to(imageWrapperRef.current, {
            x: x,
            y: y,
            duration: 1,
            ease: "power2.out",
          });
        }
      };

      const updateCursor = (e) => {
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.2,
            ease: "power2.out",
          });
        }
      };

      window.addEventListener("mousemove", (e) => {
        imageParallax(e);
        updateCursor(e);
      });

      return () => {
        window.removeEventListener("mousemove", imageParallax);
        window.removeEventListener("mousemove", updateCursor);
      };
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: -30,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div
      ref={mainRef}
      className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center"
    >
      <ThreeJSBackground />

      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />

      {/* Circular decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            ref={(el) => (circleRefs.current[index] = el)}
            className={`absolute rounded-full border ${attractions[currentIndex].textColor} opacity-20`}
            style={{
              width: `${(index + 1) * 40}vw`,
              height: `${(index + 1) * 40}vw`,
              left: `calc(50% - ${(index + 1) * 20}vw)`,
              top: `calc(50% - ${(index + 1) * 20}vw)`,
              borderWidth: index === 0 ? "1px" : index === 1 ? "2px" : "3px",
            }}
          />
        ))}
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-br ${attractions[currentIndex].bgColor} transition-colors duration-1000`}
      />

      <div
        className="absolute inset-0 opacity-10 mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-3">
          {attractions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-16 h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? attractions[currentIndex].accentColor
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={prevSlide}
        className="absolute left-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSlide}
        className="absolute right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.button>

      <div className="relative h-full w-full flex flex-col md:flex-row items-center">
        <div className="h-full w-full md:w-3/5 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              ref={imageWrapperRef}
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center p-12 md:p-20"
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-10" />

                <Image
                  src={attractions[currentIndex].image}
                  alt={attractions[currentIndex].name}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 md:hidden">
                  <motion.h2
                    className="text-4xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {attractions[currentIndex].name}
                  </motion.h2>
                  <motion.p
                    className="text-lg text-white/80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    {attractions[currentIndex].location}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden md:block h-full w-full md:w-2/5 relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              ref={contentWrapperRef}
              key={`content-${currentIndex}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col justify-center h-full p-12"
            >
              <motion.p
                custom={1}
                variants={textVariants}
                className={`inline-block px-4 py-1 rounded-full border mb-6 text-sm font-medium ${attractions[currentIndex].textColor} border-current`}
              >
                {attractions[currentIndex].location}
              </motion.p>

              <motion.h1
                custom={2}
                variants={textVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
              >
                {attractions[currentIndex].name}
              </motion.h1>

              <motion.p
                custom={3}
                variants={textVariants}
                className={`text-2xl font-medium ${attractions[currentIndex].textColor} mb-6`}
              >
                {attractions[currentIndex].tagline}
              </motion.p>

              <motion.p
                custom={4}
                variants={textVariants}
                className="text-lg text-white/70 mb-10 max-w-lg"
              >
                {attractions[currentIndex].description}
              </motion.p>

              <motion.div
                custom={5}
                variants={textVariants}
                className="flex space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 rounded-full ${attractions[currentIndex].accentColor} text-white font-medium`}
                >
                  <Link href="/dashboard">
                  Explore Now
                  </Link>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Learn More
                </motion.button>
              </motion.div>

              <motion.div
                custom={6}
                variants={textVariants}
                className="absolute bottom-12 left-12 flex items-center space-x-4"
              >
                <span className="text-5xl font-bold text-white">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-px bg-white/50"></div>
                <span className="text-xl text-white/50">
                  {String(attractions.length).padStart(2, "0")}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute top-10 left-10 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border relative -top-5 left-7 border-white/20"
        >
          <span className="text-white font-medium">INCREDIBLE INDIA</span>
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-10 z-50">
        <div className="flex space-x-4">
          {["instagram", "twitter", "facebook"].map((social, index) => (
            <motion.button
              key={social}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <span className="text-white text-xs">
                {social[0].toUpperCase()}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
