import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OCEAN_REGIONS } from '../data/oceanData';
import { Globe2, Eye, Navigation } from 'lucide-react';

interface EarthGlobeProps {
  onSelectRegion?: (regionId: string) => void;
  selectedRegionId?: string;
  className?: string;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  onSelectRegion,
  selectedRegionId,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Earth Procedural / High-detail Texture Canvas
    // Generates a rich, deep space oceanic sphere with continents, grid lines, and glowing current channels
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 2048;
    textureCanvas.height = 1024;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      // Deep space ocean gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      oceanGrad.addColorStop(0, '#0a1630');
      oceanGrad.addColorStop(0.5, '#050c1e');
      oceanGrad.addColorStop(1, '#0a1630');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Lat/Lon Wireframe Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
      ctx.lineWidth = 1;
      for (let y = 0; y <= 1024; y += 1024 / 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(2048, y);
        ctx.stroke();
      }
      for (let x = 0; x <= 2048; x += 2048 / 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }

      // Simplified High-Tech Continental Silhouettes (Vector approximations)
      ctx.fillStyle = 'rgba(34, 211, 238, 0.12)';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.lineWidth = 2;

      // Draw stylized world continents
      const continents = [
        // North America
        [[300, 200], [520, 180], [560, 320], [480, 420], [420, 520], [380, 480], [320, 360]],
        // South America
        [[450, 550], [540, 600], [520, 780], [460, 920], [410, 740]],
        // Eurasia
        [[850, 160], [1350, 180], [1520, 320], [1420, 500], [1180, 450], [980, 340], [860, 300]],
        // Africa
        [[920, 420], [1120, 460], [1160, 680], [1040, 840], [940, 660], [880, 520]],
        // Australia
        [[1500, 680], [1680, 700], [1640, 840], [1480, 800]],
      ];

      continents.forEach(poly => {
        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 1; i < poly.length; i++) {
          ctx.lineTo(poly[i][0], poly[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Ocean Current Streamlines (Glowing paths)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 3;
      // Gulf Stream
      ctx.beginPath();
      ctx.moveTo(420, 450);
      ctx.bezierCurveTo(460, 380, 560, 320, 720, 260);
      ctx.stroke();

      // Kuroshio
      ctx.beginPath();
      ctx.moveTo(1420, 460);
      ctx.bezierCurveTo(1460, 380, 1540, 320, 1720, 300);
      ctx.stroke();

      // ACC (Circumpolar belt)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.beginPath();
      ctx.moveTo(0, 850);
      ctx.lineTo(2048, 850);
      ctx.stroke();
    }

    const earthTexture = new THREE.CanvasTexture(textureCanvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 3. Earth Globe Mesh
    const globeGeometry = new THREE.SphereGeometry(1.0, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 25,
      specular: new THREE.Color(0x22d3ee),
      bumpScale: 0.05,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // 4. Atmospheric Glow Mesh (Inner & Outer Atmosphere Aura)
    const atmosphereGeometry = new THREE.SphereGeometry(1.06, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1628, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 6. Observation Station Telemetry Beacons
    const beaconGroup = new THREE.Group();
    globe.add(beaconGroup);

    const latLonToVector3 = (lat: number, lon: number, radius = 1.02): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const beaconMeshes: { mesh: THREE.Mesh; id: string; name: string }[] = [];

    OCEAN_REGIONS.forEach((region) => {
      const pos = latLonToVector3(region.lat, region.lon);
      const beaconGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: region.id === selectedRegionId ? 0x00f0ff : 0x38bdf8,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(pos);
      beaconGroup.add(beaconMesh);

      // Halo ring around beacon
      const ringGeo = new THREE.RingGeometry(0.035, 0.05, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      beaconGroup.add(ringMesh);

      beaconMeshes.push({ mesh: beaconMesh, id: region.id, name: region.name });
    });

    // 7. Interactive Dragging Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // Raycasting for beacon hover
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(beaconMeshes.map(b => b.mesh));
        if (intersects.length > 0) {
          const hit = beaconMeshes.find(b => b.mesh === intersects[0].object);
          if (hit) setHoveredRegion(hit.name);
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredRegion(null);
          renderer.domElement.style.cursor = 'grab';
        }
        return;
      }

      renderer.domElement.style.cursor = 'grabbing';
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globe.rotation.y += deltaX * 0.006;
      globe.rotation.x += deltaY * 0.006;
      // Clamp x rotation to avoid upside-down flip
      globe.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globe.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(beaconMeshes.map(b => b.mesh));
      if (intersects.length > 0) {
        const hit = beaconMeshes.find(b => b.mesh === intersects[0].object);
        if (hit && onSelectRegion) {
          onSelectRegion(hit.id);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('click', onClick);

    // 8. Animation Loop
    let animationFrameId: number;
    let pulseAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        globe.rotation.y += 0.0018;
      }

      // Beacon breathing animation
      pulseAngle += 0.05;
      const scale = 1 + Math.sin(pulseAngle) * 0.25;
      beaconMeshes.forEach(b => {
        b.mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [autoRotate, onSelectRegion, selectedRegionId]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full min-h-[380px] max-h-[550px] cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 bg-space-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-hud">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>NASA ECCO2 SPHERICAL PROJECTION</span>
        </div>
        {hoveredRegion && (
          <div className="flex items-center gap-2 bg-cyan-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-cyan-400/50 text-xs font-mono text-white shadow-glow-cyan/30 animate-pulse">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target: {hoveredRegion}</span>
          </div>
        )}
      </div>

      {/* Quick Interactive Toggles */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all backdrop-blur-md ${
            autoRotate
              ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
              : 'bg-space-900/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle Earth Auto-Rotation"
        >
          <Navigation className={`w-3.5 h-3.5 ${autoRotate ? 'text-cyan-400' : 'text-slate-400'}`} />
          {autoRotate ? 'Orbit: ON' : 'Orbit: PAUSED'}
        </button>
      </div>
    </div>
  );
};
