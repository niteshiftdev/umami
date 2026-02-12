"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DialsOverlay: () => DialsOverlay,
  DialsProvider: () => DialsProvider,
  buildColorOptions: () => buildColorOptions,
  getDialRegistry: () => getDialRegistry,
  getManifestBorderRadius: () => getManifestBorderRadius,
  getManifestColors: () => getManifestColors,
  getManifestShadows: () => getManifestShadows,
  getManifestSpacing: () => getManifestSpacing,
  getManifestTypography: () => getManifestTypography,
  loadManifest: () => loadManifest,
  useDialsContext: () => useDialsContext,
  useDynamicBoolean: () => useDynamicBoolean,
  useDynamicColor: () => useDynamicColor,
  useDynamicNumber: () => useDynamicNumber,
  useDynamicSpacing: () => useDynamicSpacing,
  useDynamicVariant: () => useDynamicVariant
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useDial.ts
var import_react = require("react");

// src/registry.ts
var STORAGE_KEY_PREFIX = "niteshift-dials";
var STORAGE_VERSION = "1";
function getStorageKey(projectId) {
  return projectId ? `${STORAGE_KEY_PREFIX}-${projectId}-v${STORAGE_VERSION}` : `${STORAGE_KEY_PREFIX}-v${STORAGE_VERSION}`;
}
var REGISTRY_KEY = "__NITESHIFT_DIALS_REGISTRY__";
var DialRegistry = class {
  /** All registered dials */
  dials = /* @__PURE__ */ new Map();
  /** Listeners for specific dial changes */
  changeListeners = /* @__PURE__ */ new Map();
  /** Listeners for any registry change (for overlay UI) */
  registryListeners = /* @__PURE__ */ new Set();
  /** Project ID for storage scoping */
  projectId;
  constructor() {
    this.loadFromStorage();
  }
  /**
   * Set the project ID for storage scoping
   */
  setProjectId(projectId) {
    this.projectId = projectId;
    this.loadFromStorage();
  }
  /**
   * Register a new dial or get existing value
   * Returns the current value (persisted or default)
   */
  register(id, type, config) {
    if (this.dials.has(id)) {
      return this.dials.get(id).currentValue;
    }
    const persistedValue = this.getPersistedValue(id);
    const currentValue = persistedValue !== null ? persistedValue : config.default;
    const registration = {
      id,
      type,
      config,
      currentValue,
      updatedAt: Date.now()
    };
    this.dials.set(id, registration);
    this.notifyRegistryListeners();
    return currentValue;
  }
  /**
   * Update a dial's value
   */
  setValue(id, value) {
    const dial = this.dials.get(id);
    if (!dial) {
      console.warn(`[Dials] Attempted to set value for unregistered dial: ${id}`);
      return;
    }
    dial.currentValue = value;
    dial.updatedAt = Date.now();
    this.persistValue(id, value);
    this.notifyChangeListeners(id, value);
    this.notifyRegistryListeners();
  }
  /**
   * Get a dial's current value
   */
  getValue(id) {
    return this.dials.get(id)?.currentValue;
  }
  /**
   * Get a dial's registration
   */
  getDial(id) {
    return this.dials.get(id);
  }
  /**
   * Get all registered dials
   */
  getAllDials() {
    return Array.from(this.dials.values());
  }
  /**
   * Get dials by group
   */
  getDialsByGroup() {
    const groups = /* @__PURE__ */ new Map();
    for (const dial of this.dials.values()) {
      const group = dial.config.group || "Ungrouped";
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group).push(dial);
    }
    return groups;
  }
  /**
   * Reset a dial to its default value
   */
  reset(id) {
    const dial = this.dials.get(id);
    if (!dial) return;
    this.setValue(id, dial.config.default);
  }
  /**
   * Reset all dials to their default values
   */
  resetAll() {
    for (const [id] of this.dials) {
      this.reset(id);
    }
  }
  /**
   * Subscribe to changes for a specific dial
   */
  subscribe(id, listener) {
    if (!this.changeListeners.has(id)) {
      this.changeListeners.set(id, /* @__PURE__ */ new Set());
    }
    this.changeListeners.get(id).add(listener);
    return () => {
      this.changeListeners.get(id)?.delete(listener);
    };
  }
  /**
   * Subscribe to any registry change (for overlay UI)
   */
  subscribeToRegistry(listener) {
    this.registryListeners.add(listener);
    return () => {
      this.registryListeners.delete(listener);
    };
  }
  /**
   * Notify listeners of a dial value change
   */
  notifyChangeListeners(id, value) {
    const listeners = this.changeListeners.get(id);
    if (listeners) {
      listeners.forEach((listener) => listener(id, value));
    }
  }
  /**
   * Notify registry listeners (for overlay UI updates)
   * Deferred to avoid React "setState during render" errors
   */
  notifyRegistryListeners() {
    queueMicrotask(() => {
      this.registryListeners.forEach((listener) => listener());
    });
  }
  /**
   * Load persisted values from localStorage
   */
  loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const key = getStorageKey(this.projectId);
      const stored = localStorage.getItem(key);
      if (stored) {
        JSON.parse(stored);
      }
    } catch (error) {
      console.warn("[Dials] Failed to load from localStorage:", error);
    }
  }
  /**
   * Get a persisted value for a dial
   */
  getPersistedValue(id) {
    if (typeof window === "undefined") return null;
    try {
      const key = getStorageKey(this.projectId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        return data[id] !== void 0 ? data[id] : null;
      }
    } catch (error) {
      console.warn("[Dials] Failed to get persisted value:", error);
    }
    return null;
  }
  /**
   * Persist a dial value to localStorage
   */
  persistValue(id, value) {
    if (typeof window === "undefined") return;
    try {
      const key = getStorageKey(this.projectId);
      const stored = localStorage.getItem(key);
      const data = stored ? JSON.parse(stored) : {};
      data[id] = value;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("[Dials] Failed to persist value:", error);
    }
  }
  /**
   * Export all current values as an object
   */
  exportValues() {
    const values = {};
    for (const [id, dial] of this.dials) {
      values[id] = dial.currentValue;
    }
    return values;
  }
  /**
   * Export all dials with their configurations
   */
  exportDials() {
    return this.getAllDials();
  }
  /**
   * Clear all persisted values
   */
  clearStorage() {
    if (typeof window === "undefined") return;
    try {
      const key = getStorageKey(this.projectId);
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("[Dials] Failed to clear storage:", error);
    }
  }
};
function getGlobalRegistry() {
  if (typeof window !== "undefined") {
    if (!window[REGISTRY_KEY]) {
      window[REGISTRY_KEY] = new DialRegistry();
    }
    return window[REGISTRY_KEY];
  }
  if (!ssrInstance) {
    ssrInstance = new DialRegistry();
  }
  return ssrInstance;
}
var ssrInstance = null;
var getDialRegistry = getGlobalRegistry;

// src/hooks/useDial.ts
function useDial(id, type, config) {
  const registry = getDialRegistry();
  const [value, setValue] = (0, import_react.useState)(() => registry.register(id, type, config));
  (0, import_react.useEffect)(() => {
    const unsubscribe = registry.subscribe(id, (dialId, newValue) => {
      setValue(newValue);
    });
    return unsubscribe;
  }, [id, registry]);
  return value;
}

// src/components/DialsProvider.tsx
var import_react2 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var DialsContext = (0, import_react2.createContext)({
  manifest: null
});
function DialsProvider({ children, manifest = null, projectId }) {
  (0, import_react2.useEffect)(() => {
    if (projectId) {
      const registry = getDialRegistry();
      registry.setProjectId(projectId);
    }
  }, [projectId]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialsContext.Provider, { value: { manifest }, children });
}
function useDialsContext() {
  return (0, import_react2.useContext)(DialsContext);
}

// src/hooks/useDynamicColor.ts
function useDynamicColor(id, config) {
  const { manifest } = useDialsContext();
  const finalConfig = { ...config, type: "color" };
  if (!config.options && manifest?.colors) {
    const category = config.manifestCategory || "accent";
    const colorCategory = manifest.colors[category];
    if (colorCategory?.values) {
      const values = colorCategory.values;
      finalConfig.options = Array.isArray(values) ? values : Object.values(values);
    }
  }
  return useDial(id, "color", finalConfig);
}

// src/hooks/useDynamicSpacing.ts
function useDynamicSpacing(id, config) {
  const { manifest } = useDialsContext();
  const finalConfig = { ...config, type: "spacing" };
  if (!config.options && manifest?.spacing?.values) {
    finalConfig.options = manifest.spacing.values;
  }
  return useDial(id, "spacing", finalConfig);
}

// src/hooks/useDynamicVariant.ts
function useDynamicVariant(id, config) {
  return useDial(id, "variant", { ...config, type: "variant" });
}

// src/hooks/useDynamicBoolean.ts
function useDynamicBoolean(id, config) {
  return useDial(id, "boolean", { ...config, type: "boolean" });
}

// src/hooks/useDynamicNumber.ts
function useDynamicNumber(id, config) {
  return useDial(id, "number", { ...config, type: "number" });
}

// src/components/DialsOverlay.tsx
var import_react6 = require("react");

// ../../node_modules/.pnpm/lucide-react@0.543.0_react@19.2.3/node_modules/lucide-react/dist/esm/createLucideIcon.js
var import_react4 = require("react");

// ../../node_modules/.pnpm/lucide-react@0.543.0_react@19.2.3/node_modules/lucide-react/dist/esm/shared/src/utils.js
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
var toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
var hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

// ../../node_modules/.pnpm/lucide-react@0.543.0_react@19.2.3/node_modules/lucide-react/dist/esm/Icon.js
var import_react3 = require("react");

// ../../node_modules/.pnpm/lucide-react@0.543.0_react@19.2.3/node_modules/lucide-react/dist/esm/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// ../../node_modules/.pnpm/lucide-react@0.543.0_react@19.2.3/node_modules/lucide-react/dist/esm/Icon.js
var Icon = (0, import_react3.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => (0, import_react3.createElement)(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => (0, import_react3.createElement)(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

// ../../node_modules/.pnpm/lucide-react@0.543.0_react@19.2.3/node_modules/lucide-react/dist/esm/createLucideIcon.js
var createLucideIcon = (iconName, iconNode) => {
  const Component = (0, import_react4.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react4.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

// ../../node_modules/.pnpm/lucide-react@0.543.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/gauge.js
var __iconNode = [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
];
var Gauge = createLucideIcon("gauge", __iconNode);

// src/controls/ColorControl.tsx
var import_react5 = require("react");
var import_niteshift_manifest = require("@/config/niteshift-manifest");
var import_jsx_runtime2 = require("react/jsx-runtime");
function getColorName(hex) {
  const normalizedHex = hex.toLowerCase();
  if (import_niteshift_manifest.designManifest.colors.accent.values) {
    for (const [name, color] of Object.entries(import_niteshift_manifest.designManifest.colors.accent.values)) {
      if (color.toLowerCase() === normalizedHex) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  }
  if (import_niteshift_manifest.designManifest.colors.semantic.values) {
    for (const [name, color] of Object.entries(import_niteshift_manifest.designManifest.colors.semantic.values)) {
      if (color.toLowerCase() === normalizedHex) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  }
  return null;
}
function ColorControl({ id, value, config, onChange, onReset }) {
  const [showPicker, setShowPicker] = (0, import_react5.useState)(false);
  const [pickerPosition, setPickerPosition] = (0, import_react5.useState)({ top: 0, left: 0 });
  const swatchRef = (0, import_react5.useRef)(null);
  const pickerRef = (0, import_react5.useRef)(null);
  const colorName = getColorName(value);
  const handleSwatchClick = () => {
    if (swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
      setShowPicker(true);
    }
  };
  const handlePresetClick = (color) => {
    onChange(color);
  };
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };
  (0, import_react5.useEffect)(() => {
    if (!showPicker) return;
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target) && swatchRef.current && !swatchRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dial-control color-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "control-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: id, title: config.description, children: config.label }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "reset-button", onClick: onReset, title: "Reset to default", children: "\u21BA" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "control-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "div",
        {
          ref: swatchRef,
          className: "color-swatch",
          style: { backgroundColor: value },
          onClick: handleSwatchClick,
          title: colorName || value
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          type: "text",
          className: "color-value-input",
          value: colorName || value,
          onChange: handleInputChange,
          placeholder: "#000000"
        }
      ),
      showPicker && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "color-picker-overlay", onClick: () => setShowPicker(false) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            ref: pickerRef,
            className: "color-picker-wrapper",
            style: {
              top: pickerPosition.top,
              left: pickerPosition.left
            },
            children: config.options && config.options.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "color-presets", children: config.options.map((color) => {
              const name = getColorName(color);
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "div",
                {
                  className: `color-preset ${value === color ? "active" : ""}`,
                  style: { backgroundColor: color },
                  onClick: () => handlePresetClick(color),
                  title: name || color
                },
                color
              );
            }) })
          }
        )
      ] })
    ] })
  ] });
}

// src/controls/SpacingControl.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function SpacingControl({ id, value, config, onChange, onReset }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dial-control spacing-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "control-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { htmlFor: id, children: config.label }),
      config.description && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "control-description", children: config.description }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "reset-button", onClick: onReset, title: "Reset to default", children: "\u21BA" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "control-body", children: [
      config.options && config.options.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "spacing-options", children: config.options.map((spacing) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          className: `spacing-option ${value === spacing ? "active" : ""}`,
          onClick: () => onChange(spacing),
          children: spacing
        },
        spacing
      )) }),
      config.allowCustom && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "spacing-custom", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          type: "text",
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder: `e.g., 16${config.unit || "px"}`
        }
      ) })
    ] })
  ] });
}

// src/controls/VariantControl.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function VariantControl({ id, value, config, onChange, onReset }) {
  const allNumeric = config.options.every((opt) => !isNaN(Number(opt)));
  const handleSliderChange = (e) => {
    const index = Number(e.target.value);
    onChange(config.options[index]);
  };
  const currentIndex = config.options.indexOf(value);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dial-control variant-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "control-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { htmlFor: id, children: config.label }),
      config.description && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "control-description", children: config.description }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "reset-button", onClick: onReset, title: "Reset to default", children: "\u21BA" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "control-body", children: allNumeric ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "variant-slider", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "input",
      {
        type: "range",
        min: 0,
        max: config.options.length - 1,
        step: 1,
        value: currentIndex,
        onChange: handleSliderChange,
        title: `${config.options[0]} - ${config.options[config.options.length - 1]}`
      }
    ) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { className: "variant-select", value, onChange: (e) => onChange(e.target.value), children: config.options.map((option) => {
      const label = config.optionLabels?.[option] || option;
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: option, children: label }, option);
    }) }) })
  ] });
}

// src/controls/BooleanControl.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function BooleanControl({ id, value, config, onChange, onReset }) {
  const trueLabel = config.trueLabel || "On";
  const falseLabel = config.falseLabel || "Off";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dial-control boolean-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "control-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { htmlFor: id, children: config.label }),
      config.description && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "control-description", children: config.description }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: "reset-button", onClick: onReset, title: "Reset to default", children: "\u21BA" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "control-body", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "boolean-toggle", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          className: `toggle-option ${value ? "active" : ""}`,
          onClick: () => onChange(true),
          children: trueLabel
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          className: `toggle-option ${!value ? "active" : ""}`,
          onClick: () => onChange(false),
          children: falseLabel
        }
      )
    ] }) })
  ] });
}

// src/controls/NumberControl.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function NumberControl({ id, value, config, onChange, onReset }) {
  const handleSliderChange = (e) => {
    onChange(Number(e.target.value));
  };
  const handleInputChange = (e) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      onChange(num);
    }
  };
  const hasRange = config.min !== void 0 && config.max !== void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dial-control number-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "control-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { htmlFor: id, children: config.label }),
      config.description && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "control-description", children: config.description }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: "reset-button", onClick: onReset, title: "Reset to default", children: "\u21BA" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "control-body", children: [
      hasRange && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "number-slider", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            type: "range",
            min: config.min,
            max: config.max,
            step: config.step || 1,
            value,
            onChange: handleSliderChange,
            title: `${config.min} - ${config.max}`
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "number-input", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "input",
            {
              type: "number",
              value,
              onChange: handleInputChange,
              min: config.min,
              max: config.max,
              step: config.step || 1
            }
          ),
          config.unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "number-unit", children: config.unit })
        ] })
      ] }),
      !hasRange && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "number-input", style: { gridColumn: "1 / -1" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            type: "number",
            value,
            onChange: handleInputChange,
            min: config.min,
            max: config.max,
            step: config.step || 1
          }
        ),
        config.unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "number-unit", children: config.unit })
      ] })
    ] })
  ] });
}

// src/components/DialsOverlay.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function DialsOverlay({
  defaultVisible = true,
  position = "bottom-left"
}) {
  const [overlayState, setOverlayState] = (0, import_react6.useState)(
    defaultVisible ? "expanded" : "collapsed"
  );
  (0, import_react6.useEffect)(() => {
    const stored = localStorage.getItem("niteshift-dials-state");
    if (stored !== null && ["hidden", "collapsed", "expanded"].includes(stored)) {
      setOverlayState(stored);
    }
  }, []);
  const [searchTerm, setSearchTerm] = (0, import_react6.useState)("");
  const [dials, setDials] = (0, import_react6.useState)([]);
  const [isMacLike, setIsMacLike] = (0, import_react6.useState)(false);
  const registry = getDialRegistry();
  (0, import_react6.useEffect)(() => {
    localStorage.setItem("niteshift-dials-state", overlayState);
  }, [overlayState]);
  (0, import_react6.useEffect)(() => {
    const updateDials = () => {
      setDials(registry.getAllDials());
    };
    updateDials();
    const unsubscribe = registry.subscribeToRegistry(updateDials);
    return unsubscribe;
  }, [registry]);
  (0, import_react6.useEffect)(() => {
    if (typeof navigator === "undefined") return;
    const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
    setIsMacLike(isMac);
  }, []);
  (0, import_react6.useEffect)(() => {
    const handleKeyPress = (e) => {
      if (!e.key) return;
      const key = e.key.toLowerCase();
      if (key !== "d") return;
      const macCombo = isMacLike && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
      const otherCombo = !isMacLike && e.ctrlKey && e.altKey && !e.metaKey && !e.shiftKey;
      const hideCombo = e.ctrlKey && e.shiftKey && !e.metaKey && !e.altKey;
      if (hideCombo) {
        e.preventDefault();
        setOverlayState((prev) => prev === "hidden" ? "collapsed" : "hidden");
      } else if (macCombo || otherCombo) {
        e.preventDefault();
        setOverlayState((prev) => prev === "expanded" ? "collapsed" : "expanded");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isMacLike]);
  const filteredDials = (0, import_react6.useMemo)(() => {
    if (!searchTerm) return dials;
    const term = searchTerm.toLowerCase();
    return dials.filter((dial) => {
      const label = dial.config.label.toLowerCase();
      const group = dial.config.group?.toLowerCase() || "";
      const id = dial.id.toLowerCase();
      return label.includes(term) || group.includes(term) || id.includes(term);
    });
  }, [dials, searchTerm]);
  const groupedDials = (0, import_react6.useMemo)(() => {
    const groups = /* @__PURE__ */ new Map();
    for (const dial of filteredDials) {
      const group = dial.config.group || "Ungrouped";
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group).push(dial);
    }
    return groups;
  }, [filteredDials]);
  const handleChange = (id, value) => {
    registry.setValue(id, value);
  };
  const handleReset = (id) => {
    registry.reset(id);
  };
  const handleResetAll = () => {
    if (confirm("Reset all dials to their default values?")) {
      registry.resetAll();
    }
  };
  if (overlayState === "hidden") {
    return null;
  }
  if (overlayState === "collapsed") {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        className: "dials-toggle-button",
        onClick: () => setOverlayState("expanded"),
        title: "Show Dials (Ctrl+D)",
        style: {
          position: "fixed",
          [position.includes("bottom") ? "bottom" : "top"]: "20px",
          [position.includes("right") ? "right" : "left"]: "20px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "2px solid #666",
          background: "#1a1a1a",
          color: "#fff",
          fontSize: "20px",
          cursor: "pointer",
          zIndex: 9999999,
          // Very high to be above everything
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Gauge, { size: 24 })
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className: "dials-overlay",
      style: {
        position: "fixed",
        [position.includes("bottom") ? "bottom" : "top"]: "20px",
        [position.includes("right") ? "right" : "left"]: "20px",
        width: "320px",
        maxHeight: "80vh",
        background: "#181c20",
        border: "1px solid #292d39",
        borderRadius: "4px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        zIndex: 9999999,
        // Very high to be above everything
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "11px"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "div",
          {
            style: {
              padding: "10px 12px",
              borderBottom: "1px solid #292d39",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Gauge, { size: 16, color: "#8c92a4" }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { style: { margin: 0, fontSize: "13px", fontWeight: 500, color: "#fefefe" }, children: "Design Dials" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { fontSize: "10px", color: "#8c92a4", marginTop: "2px" }, children: "Ctrl+D toggle \xB7 Ctrl+Shift+D hide" })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "button",
                {
                  onClick: () => setOverlayState("collapsed"),
                  style: {
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: 0,
                    lineHeight: 1,
                    color: "#8c92a4"
                  },
                  title: "Collapse (Ctrl+D)",
                  children: "\xD7"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { padding: "8px 12px", borderBottom: "1px solid #292d39" }, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "input",
          {
            type: "search",
            placeholder: "Search dials...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            style: {
              width: "100%",
              padding: "6px 8px",
              border: "1px solid transparent",
              borderRadius: "2px",
              fontSize: "11px",
              background: "#373c4b",
              color: "#fefefe",
              outline: "none"
            }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "div",
          {
            style: {
              flex: 1,
              overflowY: "auto",
              padding: "0"
            },
            children: filteredDials.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { textAlign: "center", color: "#8c92a4", padding: "32px 16px" }, children: searchTerm ? "No dials match your search" : "No dials registered yet" }) : Array.from(groupedDials.entries()).map(([groupName, groupDials]) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { marginBottom: "0" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "h4",
                {
                  style: {
                    margin: "0",
                    padding: "8px 12px",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "#b4b4b4",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    background: "#292d39",
                    borderBottom: "1px solid #373c4b"
                  },
                  children: groupName
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: "0" }, children: groupDials.map((dial) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: renderControl(dial, handleChange, handleReset) }, dial.id)) })
            ] }, groupName))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "div",
          {
            style: {
              padding: "8px 12px",
              borderTop: "1px solid #292d39",
              display: "flex",
              gap: "8px",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "button",
                {
                  onClick: handleResetAll,
                  disabled: dials.length === 0,
                  style: {
                    padding: "4px 12px",
                    background: "#373c4b",
                    border: "1px solid transparent",
                    borderRadius: "2px",
                    cursor: dials.length > 0 ? "pointer" : "not-allowed",
                    fontSize: "11px",
                    color: dials.length > 0 ? "#fefefe" : "#535760",
                    transition: "border-color 0.15s"
                  },
                  children: "Reset All"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { fontSize: "11px", color: "#b4b4b4", display: "flex", alignItems: "center" }, children: [
                dials.length,
                " dial",
                dials.length !== 1 ? "s" : ""
              ] })
            ]
          }
        )
      ]
    }
  );
}
function renderControl(dial, onChange, onReset) {
  const commonProps = {
    id: dial.id,
    value: dial.currentValue,
    onChange: (value) => onChange(dial.id, value),
    onReset: () => onReset(dial.id)
  };
  switch (dial.type) {
    case "color":
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ColorControl, { ...commonProps, config: dial.config });
    case "spacing":
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(SpacingControl, { ...commonProps, config: dial.config });
    case "variant":
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(VariantControl, { ...commonProps, config: dial.config });
    case "boolean":
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(BooleanControl, { ...commonProps, config: dial.config });
    case "number":
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(NumberControl, { ...commonProps, config: dial.config });
    default:
      return null;
  }
}

// src/utils/manifest.ts
var cachedManifest = null;
async function loadManifest(manifestPath = "/.niteshift-manifest") {
  if (cachedManifest) {
    return cachedManifest;
  }
  try {
    const response = await fetch(manifestPath);
    if (!response.ok) {
      console.warn("[Dials] Design manifest not found at", manifestPath);
      return null;
    }
    const manifest = await response.json();
    cachedManifest = manifest;
    return manifest;
  } catch (error) {
    console.warn("[Dials] Failed to load design manifest:", error);
    return null;
  }
}
function getManifestColors(manifest, category) {
  if (!manifest.colors) return [];
  if (category && manifest.colors[category]) {
    const cat = manifest.colors[category];
    if (Array.isArray(cat.values)) {
      return cat.values;
    } else if (typeof cat.values === "object") {
      return Object.values(cat.values);
    }
  }
  const allColors = [];
  for (const cat of Object.values(manifest.colors)) {
    if (Array.isArray(cat.values)) {
      allColors.push(...cat.values);
    } else if (typeof cat.values === "object") {
      allColors.push(...Object.values(cat.values));
    }
  }
  return allColors;
}
function getManifestSpacing(manifest, useVariables = false) {
  if (!manifest.spacing) return [];
  if (useVariables && manifest.spacing.variables) {
    return manifest.spacing.variables;
  }
  return manifest.spacing.values || [];
}
function getManifestTypography(manifest, type, useVariables = false) {
  if (!manifest.typography || !manifest.typography[type]) return [];
  const config = manifest.typography[type];
  if (useVariables && "variables" in config && config.variables) {
    return config.variables;
  }
  return config.values || [];
}
function getManifestBorderRadius(manifest, useVariables = false) {
  if (!manifest.borderRadius) return [];
  if (useVariables && manifest.borderRadius.variables) {
    return manifest.borderRadius.variables;
  }
  return manifest.borderRadius.values || [];
}
function getManifestShadows(manifest, useVariables = false) {
  if (!manifest.shadows) return [];
  if (useVariables && manifest.shadows.variables) {
    return manifest.shadows.variables;
  }
  return manifest.shadows.values || [];
}
function buildColorOptions(manifest, categories) {
  const colors = [];
  for (const category of categories) {
    const categoryColors = getManifestColors(manifest, category);
    colors.push(...categoryColors);
  }
  return colors;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DialsOverlay,
  DialsProvider,
  buildColorOptions,
  getDialRegistry,
  getManifestBorderRadius,
  getManifestColors,
  getManifestShadows,
  getManifestSpacing,
  getManifestTypography,
  loadManifest,
  useDialsContext,
  useDynamicBoolean,
  useDynamicColor,
  useDynamicNumber,
  useDynamicSpacing,
  useDynamicVariant
});
/*! Bundled license information:

lucide-react/dist/esm/shared/src/utils.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/gauge.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.543.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=index.js.map