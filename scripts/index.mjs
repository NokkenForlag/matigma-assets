// scripts/index.mjs

import Rive from "https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.7.1/+esm";

// === Rive-funksjon ===
export function createRive(riveFilePath, canvasId = "rive-canvas") {
  const riveCanvas = document.getElementById(canvasId);

  if (!riveCanvas) {
    console.warn(`⛔️ Fant ikke canvas med id "${canvasId}"`);
    return;
  }

  const layout = new Rive.Layout({
    fit: Rive.Fit.Cover,
    alignment: Rive.Alignment.Center,
  });

  const riveInstance = new Rive.Rive({
    src: riveFilePath,
    canvas: riveCanvas,
    autoplay: true,
    stateMachines: "State Machine 1",
    layout,
    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
      console.log("✅ Rive-fil lastet:", riveFilePath);
    },
    onError: (err) => {
      console.error("🚨 Rive-feil:", err);
    }
  });

  window.addEventListener("resize", () => {
    riveInstance.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
  });

  return riveInstance;
}

// === Iframe auto-height script ===
function sendHeight() {
  if (window.self !== window.top) {
    // Send høyden på dokumentet til den overordnede siden
    window.parent.postMessage({
      type: 'setHeight',
      height: document.documentElement.scrollHeight
    }, '*');
  }
}

// Kjør funksjonen når innholdet lastes og ved endringer i størrelse
window.addEventListener('resize', sendHeight, { passive: true });
document.addEventListener('DOMContentLoaded', sendHeight);

// === KaTeX auto-rendering ===
function setupKaTeX() {
  if (typeof renderMathInElement !== "undefined") {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  } else {
    console.warn("⚠️ renderMathInElement er ikke definert – sjekk at KaTeX er lastet inn.");
  }
}

document.addEventListener("DOMContentLoaded", setupKaTeX);

document.addEventListener("DOMContentLoaded", () => {
  if (window.self !== window.top) {
    // Dokumentet er inne i en iframe
    document.documentElement.classList.add("no-scroll");
  } else {
    // Dokumentet er ikke inne i en iframe
    document.documentElement.classList.remove("no-scroll");
  }
});