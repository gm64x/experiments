import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// loadModel now returns a Promise that resolves to an object:
// { object, params, update(deltaSeconds) }
export function loadModel(scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "models/vulcan_horuses_145d.glb",
      function (gltf) {
        const obj = gltf.scene;
        // sensible defaults
        obj.scale.set(0.001, 0.001, 0.001);
        obj.rotation.x = 0.3;

        const params = {
          rotationSpeed: 45, // radians per second
          tiltAmplitude: 0.1, // radians
          tiltSpeed: 2.0, // cycles per second
          paused: false,
        };

        let elapsed = 0;

        function update(delta) {
          if (params.paused) return;
          elapsed += delta;
          // tilt uses a sine wave based on elapsed seconds
          obj.rotation.x =
            params.tiltAmplitude *
            Math.sin(elapsed * params.tiltSpeed * Math.PI * 2);
          // continuous rotation around Y scaled by delta
          obj.rotation.y += params.rotationSpeed * delta;
        }

        scene.add(obj);
        console.log("Modelo carregado com sucesso", gltf);
        resolve({ object: obj, params, update });
      },
      undefined,
      function (error) {
        console.error("Erro ao carregar o modelo:", error);
        reject(error);
      }
    );
  });
}
