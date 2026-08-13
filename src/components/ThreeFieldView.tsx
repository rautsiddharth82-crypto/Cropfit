import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CropField, FieldZone, HealthStatus } from '../types';
import { Layers, RotateCcw, ZoomIn, ZoomOut, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ThreeFieldViewProps {
  field: CropField;
  onZoneSelect: (zone: FieldZone) => void;
  selectedZone: FieldZone | null;
}

export type MapOverlay = 'health' | 'moisture' | 'climate' | 'satellite' | 'sensor';

export const ThreeFieldView: React.FC<ThreeFieldViewProps> = ({
  field,
  onZoneSelect,
  selectedZone,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [overlay, setOverlay] = useState<MapOverlay>('health');
  const [hoveredZone, setHoveredZone] = useState<FieldZone | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = Math.max(380, container.clientHeight || 420);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8F7EF');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear old canvases
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
    dirLight.position.set(10, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Soil Base Plot
    const baseGeo = new THREE.BoxGeometry(16, 0.6, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: overlay === 'satellite' ? 0x2A3D2C : 0x7A5B3D,
      roughness: 0.9,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.3;
    baseMesh.receiveShadow = true;
    scene.add(baseMesh);

    // Grid helper
    const grid = new THREE.GridHelper(16, 8, 0x6FAF78, 0xD1D5DB);
    grid.position.y = 0.02;
    scene.add(grid);

    // Color mapper based on health status and overlay
    const getZoneColor = (zone: FieldZone): number => {
      if (overlay === 'moisture') {
        if (zone.moisturePercent < 30) return 0xE88B8B; // red dry
        if (zone.moisturePercent < 45) return 0xF4B66A; // orange
        return 0x9CCFE5; // moist blue
      }
      if (overlay === 'climate') {
        if (zone.temperatureC >= 35) return 0xE88B8B;
        if (zone.temperatureC >= 31) return 0xF4B66A;
        return 0x6FAF78;
      }
      if (overlay === 'sensor') {
        return zone.nitrogenLevel === 'Low' ? 0xF7E7A8 : 0x6FAF78;
      }

      // Default Health Overlay
      switch (zone.health) {
        case 'healthy':
          return 0x6FAF78;
        case 'monitor':
          return 0xF7E7A8;
        case 'moderate_stress':
          return 0xF4B66A;
        case 'high_stress':
          return 0xE88B8B;
        default:
          return 0x6FAF78;
      }
    };

    // Render Field Zones as 3D Interactive Tiles
    const zoneMeshes: { mesh: THREE.Mesh; zone: FieldZone }[] = [];

    field.zones.forEach((zone) => {
      const tileWidth = 4.8;
      const tileDepth = 4.8;
      const tileGeo = new THREE.BoxGeometry(tileWidth, 0.3, tileDepth);

      const colorHex = getZoneColor(zone);
      const isSelected = selectedZone?.id === zone.id;

      const tileMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: isSelected ? 1.0 : 0.88,
      });

      const tileMesh = new THREE.Mesh(tileGeo, tileMat);
      tileMesh.position.set(zone.gridPos[0] * 2.8, 0.15, zone.gridPos[1] * 2.8);
      tileMesh.castShadow = true;
      tileMesh.receiveShadow = true;

      // Add selection border box if selected
      if (isSelected) {
        const borderGeo = new THREE.BoxGeometry(tileWidth + 0.2, 0.4, tileDepth + 0.2);
        const borderMat = new THREE.MeshBasicMaterial({
          color: 0x26332A,
          wireframe: true,
        });
        const borderMesh = new THREE.Mesh(borderGeo, borderMat);
        borderMesh.position.copy(tileMesh.position);
        scene.add(borderMesh);
      }

      scene.add(tileMesh);
      zoneMeshes.push({ mesh: tileMesh, zone });

      // Add 3D Crop Plants on tile
      const plantCount = 9;
      for (let i = 0; i < plantCount; i++) {
        const px = (Math.random() - 0.5) * (tileWidth - 1);
        const pz = (Math.random() - 0.5) * (tileDepth - 1);

        const stemGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.9, 6);
        const stemMat = new THREE.MeshStandardMaterial({
          color: zone.health === 'high_stress' ? 0xC28448 : 0x4A8552,
        });
        const stemMesh = new THREE.Mesh(stemGeo, stemMat);
        stemMesh.position.set(
          tileMesh.position.x + px,
          0.6,
          tileMesh.position.z + pz
        );
        stemMesh.castShadow = true;
        scene.add(stemMesh);

        // Add crop top head (Wheat spike / Rice grain)
        const topGeo = new THREE.SphereGeometry(0.18, 6, 6);
        const topMat = new THREE.MeshStandardMaterial({
          color: zone.health === 'high_stress' ? 0xE8BD76 : 0x82C28C,
        });
        const topMesh = new THREE.Mesh(topGeo, topMat);
        topMesh.position.set(
          stemMesh.position.x,
          1.1,
          stemMesh.position.z
        );
        scene.add(topMesh);
      }
    });

    // Raycasting for Mouse / Touch Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        zoneMeshes.map((zm) => zm.mesh)
      );

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const found = zoneMeshes.find((zm) => zm.mesh === hitMesh);
        if (found) {
          onZoneSelect(found.zone);
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        zoneMeshes.map((zm) => zm.mesh)
      );

      if (intersects.length > 0) {
        const found = zoneMeshes.find((zm) => zm.mesh === intersects[0].object);
        if (found) setHoveredZone(found.zone);
      } else {
        setHoveredZone(null);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('click', handlePointerDown);
    domEl.addEventListener('mousemove', handlePointerMove);

    // Gentle Auto Orbit Animation
    let reqId: number;
    let angle = 0;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      angle += 0.003;
      camera.position.x = Math.sin(angle) * 22;
      camera.position.z = Math.cos(angle) * 22;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(380, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('click', handlePointerDown);
      domEl.removeEventListener('mousemove', handlePointerMove);
      renderer.dispose();
    };
  }, [field, overlay, selectedZone, onZoneSelect]);

  return (
    <div id="three-field-container" className="bg-white rounded-3xl border border-[#E6E9E5] overflow-hidden shadow-xs">
      {/* 3D View Header Controls */}
      <div className="p-4 bg-[#F8F7EF] border-b border-[#E6E9E5] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-[#26332A] text-base flex items-center gap-2">
            <span>3D Field View: {field.name}</span>
            <span className="text-xs font-bold text-[#56965F] bg-[#EAF5EC] px-2.5 py-0.5 rounded-full">
              Interactive 3D Plot
            </span>
          </h3>
          <p className="text-xs text-[#68736B] mt-0.5">
            Tap any field zone to inspect micro-climate risk & recommendations
          </p>
        </div>

        {/* Overlay Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[#68736B] flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#6FAF78]" /> Overlay:
          </span>
          {(
            [
              { id: 'health', label: 'Crop Health' },
              { id: 'moisture', label: 'Soil Moisture' },
              { id: 'climate', label: 'Climate Risk' },
              { id: 'satellite', label: 'Satellite' },
              { id: 'sensor', label: 'Sensors' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              id={`btn-overlay-${item.id}`}
              onClick={() => setOverlay(item.id)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                overlay === item.id
                  ? 'bg-[#6FAF78] text-white shadow-2xs'
                  : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:bg-[#EAF5EC]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full h-[380px] sm:h-[420px] bg-[#F8F7EF]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Hover / Active Zone Quick Tag overlay */}
        {(hoveredZone || selectedZone) && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#E6E9E5] shadow-md max-w-xs text-xs z-10 animate-fade-in">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-extrabold text-[#26332A]">
                {(hoveredZone || selectedZone)?.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                  (hoveredZone || selectedZone)?.health === 'healthy'
                    ? 'bg-[#EAF5EC] text-[#56965F]'
                    : (hoveredZone || selectedZone)?.health === 'monitor'
                    ? 'bg-[#F7E7A8] text-[#854D0E]'
                    : 'bg-[#E88B8B] text-white'
                }`}
              >
                {(hoveredZone || selectedZone)?.health.replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#68736B]">
              <div>Soil Moisture: <b className="text-[#26332A]">{(hoveredZone || selectedZone)?.moisturePercent}%</b></div>
              <div>Temp: <b className="text-[#26332A]">{(hoveredZone || selectedZone)?.temperatureC}°C</b></div>
            </div>
            <p className="text-[11px] text-[#26332A] font-medium mt-1.5 pt-1.5 border-t border-[#E6E9E5]">
              {(hoveredZone || selectedZone)?.riskReason}
            </p>
          </div>
        )}

        {/* Legend Overlay at bottom right */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#E6E9E5] shadow-xs text-xs flex items-center gap-3">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#6FAF78]" /><span className="text-[#26332A] font-bold">Healthy</span></div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#F7E7A8]" /><span className="text-[#26332A] font-bold">Watch</span></div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#F4B66A]" /><span className="text-[#26332A] font-bold">Moderate</span></div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#E88B8B]" /><span className="text-[#26332A] font-bold">High Stress</span></div>
        </div>
      </div>
    </div>
  );
};
