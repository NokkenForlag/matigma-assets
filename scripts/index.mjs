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
    fit: Rive.Fit.Contain,
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

// === Dynamisk initialisering av flere Rive-ikoner fra CMS ===
const baseUrl = "https://nokkenforlag.github.io/matigma-assets/";

document.addEventListener("DOMContentLoaded", () => {
  const riveCanvases = document.querySelectorAll("canvas[data-rive]");

  if (!riveCanvases.length) {
    console.info("🎨 Ingen Rive-canvas funnet på denne siden.");
  }

  riveCanvases.forEach((canvas) => {
    if (!canvas) {
      console.warn("⛔️ Canvas-element mangler.");
      return;
    }

    const filePath = canvas.getAttribute("data-rive");
    if (!filePath) {
      console.warn("⛔️ Mangel på data-rive-attributt.");
      return;
    }

    // Les visuell størrelse fra CSS
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const dpr = window.devicePixelRatio || 1;

    // Skaler for skarphet
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const fullUrl = baseUrl + filePath;

    const riveInstance = new Rive.Rive({
      src: fullUrl,
      canvas: canvas,
      autoplay: true,
      stateMachines: ["State Machine 1"],
      layout: new Rive.Layout({
        fit: Rive.Fit.Contain,
        alignment: Rive.Alignment.Center,
      }),
      onLoad: () => {
        riveInstance.resizeDrawingSurfaceToCanvas(dpr);
        console.log("✅ Lastet:", filePath);
      },
      onError: (err) => {
        console.error("🚨 Feil:", err);
      }
    });
  });
});

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
// === Dropdown med localStorage-støtte ===
function setupDropdowns() {
  const dropdowns = document.querySelectorAll(".ui-dropdown-wrapper");

  dropdowns.forEach((wrapper, index) => {
    const toggle = wrapper.querySelector(".ui-dropdown-flex-div");
    const content = wrapper.querySelector(".ui-dropdown-content");
    const icon = wrapper.querySelector(".ui-dropdown-button-icon");

    if (!toggle || !content || !icon) {
      console.warn(`⛔️ Dropdown-innhold mangler i wrapper #${index}`);
      return;
    }

    const storageKey = `dropdown-open-${index}`;

    // Last lagret tilstand, åpen som default hvis ikke lagret
    const stored = localStorage.getItem(storageKey);
    const isOpen = stored === null ? true : stored === "true";
    if (isOpen) {
      wrapper.classList.add("open");
      content.style.maxHeight = content.scrollHeight + "px";
    }

    toggle.addEventListener("click", () => {
      const currentlyOpen = wrapper.classList.contains("open");
      if (currentlyOpen) {
        wrapper.classList.remove("open");
        content.style.maxHeight = "0px";
        localStorage.setItem(storageKey, "false");
      } else {
        wrapper.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
        localStorage.setItem(storageKey, "true");
      }
    });
  });

  // Update maxHeight of open dropdowns on window resize
  window.addEventListener("resize", () => {
    dropdowns.forEach((wrapper) => {
      if (wrapper.classList.contains("open")) {
        const content = wrapper.querySelector(".ui-dropdown-content");
        if (content) {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }
    });
  });
}

// Add js-ready class after all DOMContentLoaded scripts and setupDropdowns after one animation frame
document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    setupDropdowns();
    requestAnimationFrame(() => {
      document.body.classList.add("js-ready");
    });
  });
});

function setupSidebarToggle() {
  const toggleButton = document.querySelector(".ui-menu-toggle-button");
  const sidebar = document.querySelector(".ui-sidebar-wrapper");

  if (!toggleButton || !sidebar) return;

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-visible");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSidebarToggle();
  console.log("🟢 setupSidebarToggle kjører");
  const testButton = document.querySelector(".ui-menu-toggle-button");
  if (!testButton) {
    console.warn("❌ .ui-menu-toggle-button ikke funnet i DOM");
  } else {
    console.log("✅ .ui-menu-toggle-button funnet");
  }
  function setupSidebarCloseOnOutsideClick() {
    document.addEventListener("click", (event) => {
      const isSidebarOpen = document.body.classList.contains("sidebar-visible");
      const sidebar = document.querySelector(".ui-sidebar-wrapper");
      const toggleButton = document.querySelector(".ui-menu-toggle-button");

      if (
        isSidebarOpen &&
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        document.body.classList.remove("sidebar-visible");
      }
    });
  }

  setupSidebarCloseOnOutsideClick();
});