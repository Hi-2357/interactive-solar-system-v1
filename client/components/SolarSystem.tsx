import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
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
import { Play, Pause, Plus, Zap } from "lucide-react";

interface CelestialBody {
  id: string;
  name: string;
  type: "planet" | "moon" | "asteroid" | "comet" | "custom";
  size: number;
  distance: number;
  speed: number;
  color: string;
  angle: number;
  parent?: string;
}

const PLANETS: CelestialBody[] = [
  {
    id: "sun",
    name: "Sun",
    type: "planet",
    size: 1,
    distance: 0,
    speed: 0,
    color: "#FDB813",
    angle: 0,
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    size: 0.38,
    distance: 3.8,
    speed: 0.04,
    color: "#8C7853",
    angle: 0,
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    size: 0.95,
    distance: 7.2,
    speed: 0.015,
    color: "#FFC649",
    angle: 0,
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    size: 1,
    distance: 10,
    speed: 0.01,
    color: "#4B9BFF",
    angle: 0,
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    size: 0.53,
    distance: 15.2,
    speed: 0.008,
    color: "#E27B58",
    angle: 0,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    size: 11.21,
    distance: 52,
    speed: 0.002,
    color: "#DAA520",
    angle: 0,
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    size: 9.45,
    distance: 95,
    speed: 0.0009,
    color: "#FAD5A5",
    angle: 0,
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    size: 4.01,
    distance: 192,
    speed: 0.0004,
    color: "#4FD0E7",
    angle: 0,
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    size: 3.88,
    distance: 300,
    speed: 0.0001,
    color: "#4166F5",
    angle: 0,
  },
];

const CelestialObject = ({
  body,
  speed,
}: {
  body: CelestialBody;
  speed: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [angle, setAngle] = useState(body.angle);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + body.speed * speed * 0.0001);
    }, 50);
    return () => clearInterval(interval);
  }, [body.speed, speed]);

  const x = Math.cos(angle) * body.distance;
  const z = Math.sin(angle) * body.distance;

  return (
    <group>
      {body.distance > 0 && (
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
          <lineBasicMaterial attach="material" color="#666" transparent opacity={0.2} />
        </line>
      )}

      <mesh ref={ref} position={[x, 0, z]}>
        <sphereGeometry args={[body.size * 0.3, 32, 32]} />
        <meshPhongMaterial color={body.color} emissive={body.color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};

export default function SolarSystem() {
  const [bodies, setBodies] = useState<CelestialBody[]>(PLANETS);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [newBodyName, setNewBodyName] = useState("");
  const [newBodySize, setNewBodySize] = useState(0.5);
  const [newBodyDistance, setNewBodyDistance] = useState(50);
  const [newBodyColor, setNewBodyColor] = useState("#FF00FF");

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

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
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
          <OrbitControls />

          {bodies.map((body) => (
            <CelestialObject
              key={body.id}
              body={body}
              speed={isPlaying ? speed : 0}
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
                Explore planets, moons, and asteroids tracked by NASA
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
                <Label className="text-xs text-slate-400">Simulation Speed</Label>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>

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
                <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                  <TabsTrigger value="planets" className="text-xs">
                    Planets
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="text-xs">
                    Custom
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="planets" className="space-y-1">
                  {bodies
                    .filter((b) => b.type === "planet")
                    .map((body) => (
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
                <TabsContent value="custom" className="space-y-1">
                  {bodies
                    .filter((b) => b.type === "custom")
                    .map((body) => (
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
                  {bodies.filter((b) => b.type === "custom").length === 0 && (
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
              <CardContent className="space-y-2 text-xs">
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
