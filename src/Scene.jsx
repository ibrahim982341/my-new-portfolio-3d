import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

var RED = "#ff1f2d";
var LAYERS = [3, 5, 5, 3]; // a small neural network: input, two hidden layers, output

function buildNetwork() {
  var layerNodes = [];
  var nodes = [];
  for (var l = 0; l < LAYERS.length; l++) {
    var layer = [];
    for (var i = 0; i < LAYERS[l]; i++) {
      var x = (l - (LAYERS.length - 1) / 2) * 1.6;
      var y = (i - (LAYERS[l] - 1) / 2) * 1.0;
      var z = (Math.random() - 0.5) * 1.2;
      var p = new THREE.Vector3(x, y, z);
      layer.push(p);
      nodes.push(p);
    }
    layerNodes.push(layer);
  }
  var edges = [];
  for (var a = 0; a < layerNodes.length - 1; a++) {
    for (var b = 0; b < layerNodes[a].length; b++) {
      for (var c = 0; c < layerNodes[a + 1].length; c++) {
        edges.push([layerNodes[a][b], layerNodes[a + 1][c]]);
      }
    }
  }
  return { nodes: nodes, edges: edges };
}

function Node(props) {
  var ref = useRef();
  useFrame(function (state) {
    var s = 1 + Math.sin(state.clock.elapsedTime * 2 + props.phase) * 0.25;
    ref.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={ref} position={props.position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshBasicMaterial color={RED} />
    </mesh>
  );
}

// a white dot that travels along one connection, like data flowing through the network
function Pulse(props) {
  var ref = useRef();
  useFrame(function (state) {
    var t = (state.clock.elapsedTime * props.speed + props.offset) % 1;
    ref.current.position.lerpVectors(props.edge[0], props.edge[1], t);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

function Network() {
  var group = useRef();
  var net = useMemo(buildNetwork, []);

  var linePositions = useMemo(function () {
    var arr = [];
    net.edges.forEach(function (e) {
      arr.push(e[0].x, e[0].y, e[0].z, e[1].x, e[1].y, e[1].z);
    });
    return new Float32Array(arr);
  }, [net]);

  var pulses = useMemo(function () {
    var list = [];
    for (var i = 0; i < 16; i++) {
      list.push({
        edge: net.edges[Math.floor(Math.random() * net.edges.length)],
        speed: 0.25 + Math.random() * 0.4,
        offset: Math.random()
      });
    }
    return list;
  }, [net]);

  useFrame(function (state) {
    var t = state.clock.elapsedTime;
    var max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    var scroll = Math.min(1, window.scrollY / max);
    var wide = window.innerWidth > 900;
    // mouse tilts it, scrolling spins it and slides it from the right to the centre
    group.current.rotation.y = t * 0.12 + scroll * Math.PI * 3 + state.pointer.x * 0.5;
    group.current.rotation.x = state.pointer.y * 0.3 + scroll * 0.8;
    group.current.position.x += ((wide ? 2.6 * (1 - Math.min(1, scroll * 5)) : 0) - group.current.position.x) * 0.05;
    group.current.position.y = Math.sin(t * 0.6) * 0.15;
    var scale = wide ? 1 : 0.65;
    group.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.22} />
      </lineSegments>
      {net.nodes.map(function (p, i) {
        return <Node key={i} position={p} phase={i} />;
      })}
      {pulses.map(function (p, i) {
        return <Pulse key={i} edge={p.edge} speed={p.speed} offset={p.offset} />;
      })}
      <Ring radius={3.9} tilt={1.2} speed={0.25} />
      <Ring radius={4.6} tilt={-0.6} speed={-0.18} />
    </group>
  );
}

function Ring(props) {
  var ref = useRef();
  useFrame(function (state) {
    ref.current.rotation.z = state.clock.elapsedTime * props.speed;
  });
  return (
    <mesh ref={ref} rotation={[props.tilt, 0.3, 0]}>
      <torusGeometry args={[props.radius, 0.008, 8, 160]} />
      <meshBasicMaterial color={RED} transparent opacity={0.7} />
    </mesh>
  );
}

// floating dust, like bits of data drifting in space
function Particles() {
  var ref = useRef();
  var positions = useMemo(function () {
    var arr = new Float32Array(700 * 3);
    for (var i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 22;
    return arr;
  }, []);
  useFrame(function (state) {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = state.pointer.y * 0.05;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.03} transparent opacity={0.55} />
    </points>
  );
}

export default function Scene() {
  return (
    <div className="scene">
      <Canvas camera={{ position: [0, 0, 8.5], fov: 55 }} dpr={[1, 1.5]}>
        <Particles />
        <Network />
      </Canvas>
    </div>
  );
}
