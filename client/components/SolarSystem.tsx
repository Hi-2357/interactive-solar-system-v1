import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Play,
  Pause,
  Plus,
  Zap,
  ExternalLink,
  Loader2,
  Focus,
  Trash2,
  RotateCcw,
} from "lucide-react";

interface CelestialBody {
  id: string;
  name: string;
  type: "planet" | "moon" | "asteroid" | "comet" | "custom";
  size: number;
  distance: number;
  speed: number;
  color: string;
  angle: number;
  image?: string;
  description?: string;
  parent?: string;
}

const ParentChildSystem = ({
  parent,
  children,
  speed,
  isPlaying,
  onObjectClick,
  selectedId,
}: {
  parent: CelestialBody;
  children: CelestialBody[];
  speed: number;
  isPlaying: boolean;
  onObjectClick: (body: CelestialBody) => void;
  selectedId: string | null;
}) => {
  return (
    <group>
      <CelestialObjectMesh
        body={parent}
        speed={isPlaying ? speed : 0}
        onObjectClick={onObjectClick}
        isSelected={selectedId === parent.id}
      />
      {children.map((child) => (
        <OrbitingSatellite
          key={child.id}
          parent={parent}
          satellite={child}
          speed={isPlaying ? speed : 0}
          onObjectClick={onObjectClick}
          isSelected={selectedId === child.id}
        />
      ))}
    </group>
  );
};

const CelestialObjectMesh = ({
  body,
  speed,
  onObjectClick,
  isSelected,
}: {
  body: CelestialBody;
  speed: number;
  onObjectClick: (body: CelestialBody) => void;
  isSelected: boolean;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [angle, setAngle] = useState(body.angle);

  useEffect(() => {
    if (body.distance === 0) return;
    const interval = setInterval(() => {
      setAngle((prev) => prev + body.speed * speed * 0.0001);
    }, 50);
    return () => clearInterval(interval);
  }, [body.speed, speed, body.distance]);

  const x = body.distance > 0 ? Math.cos(angle) * body.distance : 0;
  const z = body.distance > 0 ? Math.sin(angle) * body.distance : 0;

  return (
    <group position={[x, 0, z]}>
      {body.distance > 0 && (
        <line>
          <bufferGeometry
            attach="geometry"
            args={[
              new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-x, 0, -z),
                new THREE.Vector3(x, 0, z),
              ]),
            ]}
          />
          <lineBasicMaterial
            attach="material"
            color="#444"
            transparent
            opacity={0.3}
          />
        </line>
      )}

      <mesh
        ref={ref}
        onClick={() => onObjectClick(body)}
        onPointerOver={() => {
          if (ref.current) ref.current.scale.set(1.3, 1.3, 1.3);
        }}
        onPointerOut={() => {
          if (ref.current) ref.current.scale.set(1, 1, 1);
        }}
        style={{ cursor: "pointer" }}
      >
        <sphereGeometry args={[body.size * 0.3, 32, 32]} />
        <meshPhongMaterial
          color={body.color}
          emissive={isSelected ? "#00FFFF" : body.color}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
        />
      </mesh>
    </group>
  );
};

const OrbitingSatellite = ({
  parent,
  satellite,
  speed,
  onObjectClick,
  isSelected,
}: {
  parent: CelestialBody;
  satellite: CelestialBody;
  speed: number;
  onObjectClick: (body: CelestialBody) => void;
  isSelected: boolean;
}) => {
  const [angle, setAngle] = useState(satellite.angle);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + satellite.speed * speed * 0.0001);
    }, 50);
    return () => clearInterval(interval);
  }, [satellite.speed, speed]);

  const parentPos = parent.distance === 0 ? [0, 0, 0] : [0, 0, 0];
  const x = Math.cos(angle) * satellite.distance;
  const z = Math.sin(angle) * satellite.distance;

  return (
    <group>
      <line>
        <bufferGeometry
          attach="geometry"
          args={[
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(x, 0, z),
            ]),
          ]}
        />
        <lineBasicMaterial
          attach="material"
          color="#555"
          transparent
          opacity={0.15}
          linewidth={1}
        />
      </line>
      <group position={[x, 0, z]}>
        <mesh
          onClick={() => onObjectClick(satellite)}
          onPointerOver={(e) => {
            e.stopPropagation();
            const mesh = e.currentTarget as THREE.Mesh;
            mesh.scale.set(1.4, 1.4, 1.4);
          }}
          onPointerOut={(e) => {
            const mesh = e.currentTarget as THREE.Mesh;
            mesh.scale.set(1, 1, 1);
          }}
          style={{ cursor: "pointer" }}
        >
          <sphereGeometry args={[satellite.size * 0.2, 24, 24]} />
          <meshPhongMaterial
            color={satellite.color}
            emissive={isSelected ? "#00FFFF" : satellite.color}
            emissiveIntensity={isSelected ? 0.8 : 0.15}
          />
        </mesh>
      </group>
    </group>
  );
};

export default function SolarSystem() {
  const [bodies, setBodies] = useState<CelestialBody[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [newBodyName, setNewBodyName] = useState("");
  const [newBodySize, setNewBodySize] = useState(0.5);
  const [newBodyDistance, setNewBodyDistance] = useState(50);
  const [newBodyColor, setNewBodyColor] = useState("#FF00FF");
  const orbitControlsRef = useRef<any>(null);

  // Satellite parent relationships
  const SATELLITE_PARENTS: Record<string, string> = {
    moon: "earth",
    phobos: "mars",
    deimos: "mars",
    io: "jupiter",
    europa: "jupiter",
    ganymede: "jupiter",
    callisto: "jupiter",
    titan: "saturn",
    rhea: "saturn",
    iapetus: "saturn",
    titania: "uranus",
    oberon: "uranus",
    triton: "neptune",
  };

  // Load NASA celestial data on mount
  useEffect(() => {
    const fetchNASAData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/nasa/celestials");
        const data = await response.json();
        if (data.success && data.data) {
          const bodiesWithParents = data.data.map((body: any) => ({
            ...body,
            angle: Math.random() * Math.PI * 2,
            parent: SATELLITE_PARENTS[body.id] || undefined,
          }));
          setBodies(bodiesWithParents);
        }
      } catch (error) {
        console.error("Failed to load NASA data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNASAData();
  }, []);

  const addCustomBody = () => {
    if (newBodyName.trim()) {
      const newBody: CelestialBody = {
        id: `custom-${Date.now()}`,
        name: newBodyName,
        type: "custom",
        size: newBodySize,
        distance: newBodyDistance,
        speed: 0.005,
        color: newBodyColor,
        angle: Math.random() * Math.PI * 2,
      };
      setBodies([...bodies, newBody]);
      setNewBodyName("");
      setNewBodySize(0.5);
      setNewBodyDistance(50);
      setNewBodyColor("#FF00FF");
    }
  };

  const deleteCustomBody = () => {
    if (selectedBody?.type === "custom") {
      setBodies(bodies.filter((b) => b.id !== selectedBody.id));
      setSelectedBody(null);
    }
  };

  const zoomToObject = () => {
    if (selectedBody && orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const distance =
        selectedBody.distance === 0
          ? 3
          : Math.max(selectedBody.distance * 0.3, 5);
      controls.target.set(
        selectedBody.distance === 0
          ? 0
          : Math.cos(selectedBody.angle) * selectedBody.distance,
        0,
        selectedBody.distance === 0
          ? 0
          : Math.sin(selectedBody.angle) * selectedBody.distance
      );
      controls.object.position.set(
        Math.random() * distance - distance / 2,
        distance * 0.5,
        distance * 0.8
      );
      controls.update();
    }
  };

  const resetView = () => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      controls.target.set(0, 0, 0);
      controls.object.position.set(0, 250, 250);
      controls.update();
    }
    setSelectedBody(null);
  };

  // Group bodies by type
  const planets = bodies.filter((b) => b.type === "planet" && !b.parent);
  const asteroids = bodies.filter((b) => b.type === "asteroid");
  const customBodies = bodies.filter((b) => b.type === "custom");
  const satellites = bodies.filter((b) => b.type === "moon" && b.parent);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
            <p className="text-white">Loading NASA celestial data...</p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{
            position: [0, 250, 250],
            fov: 45,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={2} />
          <Stars radius={500} depth={50} count={5000} factor={4} />
          <OrbitControls ref={orbitControlsRef} />

          {/* Render planets with their satellites */}
          {planets.map((planet) => {
            const planetSatellites = bodies.filter((b) => b.parent === planet.id);
            return (
              <ParentChildSystem
                key={planet.id}
                parent={planet}
                children={planetSatellites}
                speed={isPlaying ? speed : 0}
                onObjectClick={setSelectedBody}
                selectedId={selectedBody?.id || null}
              />
            );
          })}

          {/* Render asteroids */}
          {asteroids.map((asteroid) => (
            <CelestialObjectMesh
              key={asteroid.id}
              body={asteroid}
              speed={isPlaying ? speed : 0}
              onObjectClick={setSelectedBody}
              isSelected={selectedBody?.id === asteroid.id}
            />
          ))}

          {/* Render custom objects */}
          {customBodies.map((custom) => (
            <CelestialObjectMesh
              key={custom.id}
              body={custom}
              speed={isPlaying ? speed : 0}
              onObjectClick={setSelectedBody}
              isSelected={selectedBody?.id === custom.id}
            />
          ))}
        </Canvas>

        {/* Control Panel */}
        <div className="absolute top-4 left-4 right-4 flex flex-col gap-4 pointer-events-none">
          {/* Header Card */}
          <Card className="w-full max-w-2xl pointer-events-auto backdrop-blur-sm bg-slate-900/80 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Interactive Solar System
              </CardTitle>
              <CardDescription className="text-slate-400">
                Click any planet, moon, or asteroid to select it
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Controls Card */}
          <Card className="w-full max-w-2xl pointer-events-auto backdrop-blur-sm bg-slate-900/80 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Play/Pause */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <span className="text-sm text-slate-300">
                  Speed: {speed.toFixed(1)}x
                </span>
              </div>

              {/* Speed Slider */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">
                  Simulation Speed
                </Label>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Reset Button */}
              <Button
                onClick={resetView}
                size="sm"
                variant="outline"
                className="w-full border-slate-600 text-slate-200 hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>

              {/* Add Object */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-slate-600 text-slate-200 hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Object
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Add Custom Object
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Create a custom planet, asteroid, or satellite
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Name</Label>
                      <Input
                        value={newBodyName}
                        onChange={(e) => setNewBodyName(e.target.value)}
                        placeholder="Enter object name"
                        className="mt-2 bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">
                        Size: {newBodySize.toFixed(2)}
                      </Label>
                      <Slider
                        value={[newBodySize]}
                        onValueChange={(value) => setNewBodySize(value[0])}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">
                        Distance: {newBodyDistance.toFixed(0)}
                      </Label>
                      <Slider
                        value={[newBodyDistance]}
                        onValueChange={(value) => setNewBodyDistance(value[0])}
                        min={10}
                        max={400}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="color"
                          value={newBodyColor}
                          onChange={(e) => setNewBodyColor(e.target.value)}
                          className="w-12 h-10 bg-slate-800 border-slate-600 cursor-pointer"
                        />
                        <Input
                          value={newBodyColor}
                          onChange={(e) => setNewBodyColor(e.target.value)}
                          placeholder="#FF00FF"
                          className="flex-1 bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addCustomBody}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      Add Object
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Objects List */}
        <div className="absolute top-4 right-4 pointer-events-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
          <Card className="w-80 backdrop-blur-sm bg-slate-900/80 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">
                Objects ({bodies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="planets" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800 text-xs">
                  <TabsTrigger value="planets">Planets</TabsTrigger>
                  <TabsTrigger value="moons">Moons</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="planets" className="space-y-1">
                  {planets.map((body) => (
                    <button
                      key={body.id}
                      onClick={() => setSelectedBody(body)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedBody?.id === body.id
                          ? "bg-cyan-600 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: body.color }}
                        />
                        {body.name}
                      </div>
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="moons" className="space-y-1">
                  {satellites.length > 0 ? (
                    satellites.map((body) => (
                      <button
                        key={body.id}
                        onClick={() => setSelectedBody(body)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedBody?.id === body.id
                            ? "bg-cyan-600 text-white"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: body.color }}
                          />
                          <span className="flex-1">{body.name}</span>
                          <span className="text-xs text-slate-500">
                            {body.parent}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-2">
                      No moons loaded
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="custom" className="space-y-1">
                  {customBodies.length > 0 ? (
                    customBodies.map((body) => (
                      <button
                        key={body.id}
                        onClick={() => setSelectedBody(body)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedBody?.id === body.id
                            ? "bg-cyan-600 text-white"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: body.color }}
                          />
                          {body.name}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-2">
                      No custom objects yet
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Selected Body Info */}
          {selectedBody && (
            <Card className="w-80 mt-4 backdrop-blur-sm bg-slate-900/80 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedBody.color }}
                  />
                  {selectedBody.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {selectedBody.description && (
                  <div>
                    <p className="text-slate-300 italic">
                      {selectedBody.description}
                    </p>
                  </div>
                )}

                <div className="space-y-2 border-t border-slate-700 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-300 capitalize">
                      {selectedBody.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-300">
                      {selectedBody.size.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance:</span>
                    <span className="text-slate-300">
                      {selectedBody.distance.toFixed(1)} AU
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Speed:</span>
                    <span className="text-slate-300">
                      {selectedBody.speed.toFixed(4)} °/frame
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-2 space-y-2">
                  <Button
                    onClick={zoomToObject}
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Focus className="w-4 h-4 mr-2" />
                    Zoom to Object
                  </Button>

                  {selectedBody.image && (
                    <a
                      href={selectedBody.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View NASA Image</span>
                    </a>
                  )}

                  {selectedBody.type === "custom" && (
                    <Button
                      onClick={deleteCustomBody}
                      size="sm"
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
