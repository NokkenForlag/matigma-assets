// scripts/index.mjs

import Rive from "https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.7.1/+esm";

// === Rive function ===
export function createRive(riveFilePath, canvasId = "rive-canvas") {
  const riveCanvas = document.getElementById(canvasId);

  if (!riveCanvas) {
    console.warn(`⛔️ Could not find canvas with id "${canvasId}"`);
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
      console.log("✅ Rive file loaded:", riveFilePath);
    },
    onError: (err) => {
      console.error("🚨 Rive error:", err);
    }
  });

  window.addEventListener("resize", () => {
    riveInstance.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
  });

  return riveInstance;
}

// === Utility for localStorage access ===
const canUseStorage = (() => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
})();

function updateDropdownHeight(content) {
  content.style.maxHeight = content.scrollHeight + "px";
  content.style.opacity = "1";
}

// === Dynamic initialization of multiple Rive icons from CMS ===
const baseUrl = "https://nokkenforlag.github.io/matigma-assets/";

function setupRiveCanvases() {
  const riveCanvases = document.querySelectorAll("canvas[data-rive]");

  if (!riveCanvases.length) {
    console.info("🎨 No Rive canvas found on this page.");
  }

  riveCanvases.forEach((canvas) => {
    if (!canvas) {
      console.warn("⛔️ Canvas element missing.");
      return;
    }

    const filePath = canvas.getAttribute("data-rive");
    if (!filePath) {
      console.warn("⛔️ Missing data-rive attribute.");
      return;
    }

    // Read visual size from CSS
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const dpr = window.devicePixelRatio || 1;

    // Scale for sharpness
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
        console.log("✅ Loaded:", filePath);
      },
      onError: (err) => {
        console.error("🚨 Error:", err);
      }
    });
  });
}

// === Iframe auto-height script ===
function sendHeight() {
  if (window.self !== window.top) {
    // Send the height of the document to the parent page
    window.parent.postMessage({
      type: 'setHeight',
      height: document.documentElement.scrollHeight
    }, '*');
  }
}

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
    console.warn("⚠️ renderMathInElement is not defined – check that KaTeX is loaded.");
  }
}

// === Dropdown with localStorage support ===
function preloadDropdownState() {
  document.body.classList.add("instant");
  document.querySelectorAll(".ui-dropdown-wrapper").forEach((wrapper, index) => {
    const stored = canUseStorage ? localStorage.getItem(`dropdown-open-${index}`) : null;
    let isOpen = stored === null ? true : stored === "true";
    if (wrapper.classList.contains("closed-by-default")) {
      isOpen = false;
    }
    const content = wrapper.querySelector(".ui-dropdown-content");
    if (isOpen && content) {
      wrapper.classList.add("open");
      updateDropdownHeight(content);
    }
  });
  requestAnimationFrame(() => {
    document.body.classList.remove("instant");
  });
}

function setupDropdowns() {
  const dropdowns = document.querySelectorAll(".ui-dropdown-wrapper");

  dropdowns.forEach((wrapper, index) => {
    const toggle = wrapper.querySelector(".ui-dropdown-flex-div");
    const content = wrapper.querySelector(".ui-dropdown-content");
    const icon = wrapper.querySelector(".ui-dropdown-button-icon");

    if (!toggle || !content || !icon) {
      console.warn(`⛔️ Dropdown content missing in wrapper #${index}`);
      return;
    }

    const storageKey = `dropdown-open-${index}`;

    // Load stored state, open by default if not stored
    const stored = canUseStorage ? localStorage.getItem(storageKey) : null;
    const isOpen = stored === null ? true : stored === "true";

    toggle.addEventListener("click", () => {
      const currentlyOpen = wrapper.classList.contains("open");
      if (currentlyOpen) {
        wrapper.classList.remove("open");
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        if (canUseStorage) {
          localStorage.setItem(storageKey, "false");
        }
      } else {
        wrapper.classList.add("open");
        requestAnimationFrame(() => {
          updateDropdownHeight(content);
        });

        const observer = new MutationObserver(() => {
          updateDropdownHeight(content);
        });

        observer.observe(content, {
          childList: true,
          subtree: true,
        });

        setTimeout(() => {
          observer.disconnect();
        }, 500);
        if (canUseStorage) {
          localStorage.setItem(storageKey, "true");
        }
      }
    });

    if (wrapper.classList.contains("ui-dropdown-closable")) {
      document.addEventListener("click", (event) => {
        const clickedInside = wrapper.contains(event.target);
        const clickedToggle = toggle.contains(event.target);

        if (!clickedInside && !clickedToggle && wrapper.classList.contains("open")) {
          wrapper.classList.remove("open");
          content.style.maxHeight = "0px";
          content.style.opacity = "0";
          if (canUseStorage) {
            localStorage.setItem(storageKey, "false");
          }
        }
      });
    }
  });

  // Update maxHeight and opacity of open dropdowns on window resize
  window.addEventListener("resize", () => {
    dropdowns.forEach((wrapper) => {
      if (wrapper.classList.contains("open")) {
        const content = wrapper.querySelector(".ui-dropdown-content");
        if (content) {
          updateDropdownHeight(content);
        }
      }
    });
  });
}

function setupSidebarToggle() {
  const toggleButton = document.querySelector(".ui-menu-toggle-button");
  const sidebar = document.querySelector(".ui-sidebar-wrapper");

  if (!toggleButton || !sidebar) return;

  toggleButton.addEventListener("click", () => {
    const isNowOpen = !document.body.classList.contains("sidebar-visible");
    if (isNowOpen) {
      document.body.classList.add("sidebar-visible");
      document.body.classList.add("instant");
      requestAnimationFrame(() => {
        document.body.classList.remove("instant");
      });
    } else {
      document.body.classList.remove("sidebar-visible");
    }
  });
}

function setupSidebarCloseOnOutsideClick() {
  const sidebar = document.querySelector(".ui-sidebar-wrapper");
  const toggleButton = document.querySelector(".ui-menu-toggle-button");

  document.addEventListener("click", (event) => {
    const isSidebarOpen = document.body.classList.contains("sidebar-visible");

    if (
      isSidebarOpen &&
      sidebar &&
      toggleButton &&
      !sidebar.contains(event.target) &&
      !toggleButton.contains(event.target)
    ) {
      document.body.classList.remove("sidebar-visible");
    }
  });
}

function setupCollectionItemToggles() {
  const items = document.querySelectorAll(".ui-collection-item");

  items.forEach((item) => {
    const trigger = item.querySelector(".ui-collection-item-content-div");
    const panel = item.querySelector(".ui-collection-item-right");

    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all other open items
      document.querySelectorAll(".ui-collection-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
        }
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add("open");
      } else {
        item.classList.remove("open");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupRiveCanvases();
  setupKaTeX();
  setupSidebarToggle();
  setupSidebarCloseOnOutsideClick();
  preloadDropdownState();
  setupDropdowns();
  setupCollectionItemToggles();
  document.body.classList.add("js-ready");
  sendHeight();

  if (window.self !== window.top) {
    document.documentElement.classList.add("no-scroll");
  } else {
    document.documentElement.classList.remove("no-scroll");
  }

  if (
    document.body.classList.contains("sidebar-visible") &&
    window.matchMedia("(max-width: 991px)").matches
  ) {
    document.body.classList.add("instant");
    requestAnimationFrame(() => {
      document.body.classList.remove("instant");
    });
  }
});

// Fade in page once fully loaded
window.addEventListener("load", () => {
  document.documentElement.classList.add("loaded");
});