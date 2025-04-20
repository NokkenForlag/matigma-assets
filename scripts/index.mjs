import Rive from "https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.7.1/+esm";

// Oppsett av layout – dekker canvas og skalerer jevnt
const layout = new Rive.Layout({
  fit: Rive.Fit.Contain, // Eller Cover, FitWidth – test hva som passer best
  alignment: Rive.Alignment.Center,
});

// Hent canvas
const riveCanvas = document.getElementById("rive-canvas");

// Opprett ny instans
const riveInstance = new Rive.Rive({
  src: "/rive/banner_background.riv",
  canvas: riveCanvas,
  autoplay: true,
  stateMachines: "State Machine 1", // Juster hvis nødvendig
  layout: layout,
  onLoad: () => {
    // Juster tegneflate ved last
    resizeCanvas();
    console.log("✅ Rive-fil lastet og animasjon startet!");
  },
  onError: (err) => {
    console.error("🚨 Rive-feil:", err);
  }
});

// Funksjon for å håndtere skalering
function resizeCanvas() {
  if (riveCanvas && riveInstance) {
    riveInstance.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
  }
}

// Trigger resize når vinduet endres
window.addEventListener("resize", resizeCanvas);