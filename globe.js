import * as THREE from "https://esm.sh/three@0.158.0";
import { OrbitControls } from "https://esm.sh/three@0.158.0/examples/jsm/controls/OrbitControls.js";

const containerEl = document.querySelector(".globe-wrapper");
const canvasEl = containerEl?.querySelector("#globe-3d");
const svgMapDomEl = document.querySelector("#map");
const svgCountries = svgMapDomEl ? Array.from(svgMapDomEl.querySelectorAll("path")) : [];
const svgCountryDomEl = document.querySelector("#country");
const countryNameEl = document.querySelector(".info span");

if (!containerEl || !canvasEl || !svgMapDomEl || !svgCountryDomEl || !countryNameEl) {
  // required DOM missing — silently skip initialization
} else {
  let renderer, scene, camera, rayCaster, controls;
  let globeGroup, globeColorMesh, globeStrokesMesh, globeSelectionOuterMesh;

  const svgViewBox = [2000, 1000];
  const offsetY = -0.1;

  const params = {
    strokeColor: "#111111",
    defaultColor: "#9a9591",
    hoverColor: "#00C9A2",
    fogColor: "#e4e5e6",
    fogDistance: 2.6,
    strokeWidth: 1.6,
    hiResScalingFactor: 2,
    lowResScalingFactor: 0.7,
  };

  let hoveredCountryIdx = 0;
  let isTouchScreen = false;
  let isHoverable = true;
  const pointer = new THREE.Vector2(-1, -1);

  const textureLoader = new THREE.TextureLoader();
  let staticMapUri;
  const bBoxes = [];
  const dataUris = [];

  initScene();
  window.addEventListener("resize", updateSize);

  containerEl.addEventListener("touchstart", () => {
    isTouchScreen = true;
  }, { passive: true });

  containerEl.addEventListener("mousemove", (e) => {
    updatePointerFromEvent(e.clientX, e.clientY);
  }, { passive: true });

  containerEl.addEventListener("click", (e) => {
    updatePointerFromEvent(e.clientX, e.clientY);
  }, { passive: true });

  function updatePointerFromEvent(eX, eY) {
    const rect = containerEl.getBoundingClientRect();
    pointer.x = ((eX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((eY - rect.top) / rect.height) * 2 - 1);
  }

  function initScene() {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(params.fogColor, 0, params.fogDistance);

    camera = new THREE.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, 0, 3);
    camera.position.z = 1.3;

    globeGroup = new THREE.Group();
    scene.add(globeGroup);

    rayCaster = new THREE.Raycaster();
    rayCaster.far = 1.15;

    createOrbitControls();
    createGlobe();
    prepareHiResTextures();
    prepareLowResTextures();
    updateSize();

    const loop = () => { render(); requestAnimationFrame(loop); };
    loop();
  }

  function createOrbitControls() {
    controls = new OrbitControls(camera, canvasEl);

    // Interaction settings:
    controls.enablePan = false;     // no pan
    controls.enableZoom = false;    // disable zooming (wheel / pinch)
    controls.enableRotate = true;   // allow rotate via drag
    controls.enableDamping = true;
    controls.minPolarAngle = 0.46 * Math.PI;
    controls.maxPolarAngle = 0.46 * Math.PI;

    // continuous auto-rotate (spinning globe) when not interacting
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8; // adjust for slow/fast spin

    // When user interacts (drag/rotate), pause autoRotate and disable hover updates.
    controls.addEventListener("start", () => {
      // user started dragging
      isHoverable = false;
      controls.autoRotate = false;
    });

    controls.addEventListener("end", () => {
      // user finished dragging
      controls.autoRotate = true;
      // re-enable hover after a tiny delay to avoid immediate raycast flicker
      setTimeout(() => { isHoverable = true; }, 80);
    });
  }

  function createGlobe() {
    const globeGeometry = new THREE.IcosahedronGeometry(1, 16);

    const globeColorMaterial = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: true, side: THREE.DoubleSide });
    const globeStrokeMaterial = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false });
    const outerSelectionColorMaterial = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });

    globeColorMesh = new THREE.Mesh(globeGeometry, globeColorMaterial);
    globeStrokesMesh = new THREE.Mesh(globeGeometry, globeStrokeMaterial);
    globeSelectionOuterMesh = new THREE.Mesh(globeGeometry, outerSelectionColorMaterial);

    globeStrokesMesh.renderOrder = 2;

    globeGroup.add(globeStrokesMesh, globeSelectionOuterMesh, globeColorMesh);
  }

  function setMapTexture(material, URI) {
    textureLoader.load(URI, (t) => {
      t.repeat.set(1, 1);
      material.map = t;
      material.needsUpdate = true;
    });
  }

  function prepareHiResTextures() {
    if (!svgMapDomEl) return;
    let svgData;
    if (!svgMapDomEl.querySelector('rect.__bg')) {
      const bg = document.createElementNS('http://www.w3.org/2000/svg','rect');
      bg.setAttribute('class','__bg');
      bg.setAttribute('x','0');
      bg.setAttribute('y', String(offsetY * svgViewBox[1]));
      bg.setAttribute('width', String(svgViewBox[0]));
      bg.setAttribute('height', String(svgViewBox[1]));
      bg.setAttribute('fill', '#ffffff');
      svgMapDomEl.insertBefore(bg, svgMapDomEl.firstChild);
    }
    window.gsap?.set(svgMapDomEl, {
      attr: {
        viewBox: `0 ${offsetY * svgViewBox[1]} ${svgViewBox[0]} ${svgViewBox[1]}`,
        "stroke-width": params.strokeWidth,
        stroke: params.strokeColor,
        fill: params.defaultColor,
        width: svgViewBox[0] * params.hiResScalingFactor,
        height: svgViewBox[1] * params.hiResScalingFactor,
      },
    });
    svgData = new XMLSerializer().serializeToString(svgMapDomEl);
    staticMapUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    setMapTexture(globeColorMesh.material, staticMapUri);

    // Strokes texture (transparent bg)
    const bgRect = svgMapDomEl.querySelector('rect.__bg');
    const prevBgFill = bgRect ? bgRect.getAttribute('fill') : null;
    if (bgRect) {
      bgRect.setAttribute('fill', 'none');
      bgRect.setAttribute('stroke', 'none');
    }
    window.gsap?.set(svgMapDomEl, { attr: { fill: 'none', stroke: params.strokeColor } });
    svgData = new XMLSerializer().serializeToString(svgMapDomEl);
    if (bgRect && prevBgFill) {
      bgRect.setAttribute('fill', prevBgFill);
    }
    staticMapUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    setMapTexture(globeStrokesMesh.material, staticMapUri);

    if (svgCountries[hoveredCountryIdx]) {
      countryNameEl.textContent = svgCountries[hoveredCountryIdx].getAttribute("data-name") || "";
    }
  }

  function prepareLowResTextures() {
    if (!svgCountryDomEl) return;
    window.gsap?.set(svgCountryDomEl, {
      attr: {
        viewBox: `0 ${offsetY * svgViewBox[1]} ${svgViewBox[0]} ${svgViewBox[1]}`,
        "stroke-width": params.strokeWidth,
        stroke: params.strokeColor,
        fill: params.hoverColor,
        width: svgViewBox[0] * params.lowResScalingFactor,
        height: svgViewBox[1] * params.lowResScalingFactor,
      },
    });
    svgCountries.forEach((path, idx) => {
      bBoxes[idx] = path.getBBox();
    });
    svgCountries.forEach((path, idx) => {
      svgCountryDomEl.innerHTML = "";
      svgCountryDomEl.appendChild(path.cloneNode(true));
      const svgData = new XMLSerializer().serializeToString(svgCountryDomEl);
      dataUris[idx] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    });
    if (dataUris[hoveredCountryIdx]) {
      setMapTexture(globeSelectionOuterMesh.material, dataUris[hoveredCountryIdx]);
    }
  }

  function updateMap(uv = { x: 0, y: 0 }) {
    const pointObj = svgMapDomEl.createSVGPoint();
    pointObj.x = uv.x * svgViewBox[0];
    pointObj.y = (1 + offsetY - uv.y) * svgViewBox[1];

    for (let i = 0; i < svgCountries.length; i++) {
      const boundingBox = bBoxes[i];
      if (
        pointObj.x > boundingBox.x &&
        pointObj.x < boundingBox.x + boundingBox.width &&
        pointObj.y > boundingBox.y &&
        pointObj.y < boundingBox.y + boundingBox.height
      ) {
        const isHovering = svgCountries[i].isPointInFill(pointObj);
        if (isHovering && i !== hoveredCountryIdx) {
          hoveredCountryIdx = i;
          setMapTexture(globeSelectionOuterMesh.material, dataUris[hoveredCountryIdx]);
          countryNameEl.textContent = svgCountries[hoveredCountryIdx].getAttribute("data-name") || "";
          break;
        }
      }
    }
  }

  function render() {
    controls.update();
    if (isHoverable) {
      rayCaster.setFromCamera(pointer, camera);
      const intersects = rayCaster.intersectObject(globeStrokesMesh);
      if (intersects.length) updateMap(intersects[0].uv);
    }
    if (isTouchScreen && isHoverable) isHoverable = false;
    renderer.render(scene, camera);
  }

  function updateSize() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const target = Math.min(vw * 0.36 + vh * 0.12, 560);
    const side = Math.max(240, Math.floor(target));
    containerEl.style.width = side + "px";
    containerEl.style.height = side + "px";
    renderer.setSize(side, side);
  }
}
