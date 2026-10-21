window.__ModuleLoader__.load({
  id: 'dsh-plugin-ui',
  factory(require) {
    const module = { exports: {} }
    const exports = module.exports
    ;(function (module, exports, require) {
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

// src/client/entry.jsx
var entry_exports = {};
__export(entry_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(entry_exports);

// src/client/ModelSelect.tsx
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_react = require("react");
var import_react_dom = require("react-dom");

// src/client/clsx.js
function clsx(...parts) {
  return parts.filter((part) => typeof part === "string" && part.length > 0).join(" ");
}

// src/client/ModelSelect.tsx
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// plugin-ui-css-module:/Users/tongyi/dsh-plugin-ui/src/client/ModelSelect.module.css
var styleId = "dsh-plugin-ui-ModelSelect";
if (typeof document !== "undefined" && document.getElementById(styleId) === null) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = ".dpui-ModelSelect-root {\n  position: relative;\n  min-width: 0;\n}\n\n/* Figma 313:14108 ToggleButton: 13/20 regular secondary label, 4px gap,\n   12px caption chevron; 28px chip height matches the sibling Plan /\n   Read-only selects in the same tool row. */\n.dpui-ModelSelect-trigger {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  min-width: 0;\n  /* Legacy fallback, then a row-relative cap that grants long names more\n     room without letting this trailing control consume the composer. */\n  max-width: 220px;\n  max-width: min(360px, 45cqw);\n  height: 28px;\n  padding: 0 4px 0 8px;\n  border: none;\n  /* Rounded chip chrome, matching the sibling permission trigger. */\n  border-radius: var(--dsw-radius-sm);\n  outline: none;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  line-height: 20px;\n  font-weight: 400;\n  cursor: pointer;\n}\n\n.dpui-ModelSelect-trigger:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dpui-ModelSelect-trigger:focus-visible:not([data-selection-focus]) {\n  box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n}\n\n.dpui-ModelSelect-trigger:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n\n.dpui-ModelSelect-triggerLabel {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* Effort value beside the model name (mock's 'High': same 13/20/400, caption\n   tone). Adaptive priority: the huge shrink factor makes the effort absorb\n   all deficit first \u2014 it ellipsizes away to nothing before the model name\n   loses a single pixel, and the chevron stays snug throughout. */\n.dpui-ModelSelect-triggerEffort {\n  flex-shrink: 1000;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--dsw-alias-label-caption);\n}\n\n/* The Models glyph replaces the text when the composer row cannot fit it. */\n.dpui-ModelSelect-triggerIcon {\n  display: var(--dsh-composer-model-icon-display, none);\n  flex: 0 0 auto;\n}\n\n/* The composer measures expanded row demand and owns these display variables.\n   Outside a composer, the trigger retains its text. */\n.dpui-ModelSelect-triggerLabel,\n.dpui-ModelSelect-triggerEffort {\n  display: var(--dsh-composer-model-text-display, block);\n}\n\n.dpui-ModelSelect-chevron {\n  flex: 0 0 auto;\n  color: var(--dsw-alias-label-caption);\n  transition: transform 120ms ease;\n}\n\n.dpui-ModelSelect-chevronOpen {\n  transform: rotate(180deg);\n}\n\n/* Portaled to body and placed from the trigger rect by the component (the\n   Menu primitive's portal rules), so the sidebar and the columns' overflow\n   clips cannot crop it; z matches the primitive's .dpui-ModelSelect-portal layer. */\n.dpui-ModelSelect-menu {\n  position: fixed;\n  z-index: 1100;\n  display: flex;\n  flex-direction: column;\n  /* Let the visible pane's rows set the card width, but keep pathological ids\n     and narrow screens inside a bounded card where ellipsis remains. */\n  width: max-content;\n  min-width: min(240px, calc(100vw - 32px));\n  max-width: min(420px, calc(100vw - 32px));\n  max-height: min(360px, calc(100vh - 96px));\n  overflow: hidden;\n  padding: 4px;\n  /* Surface tokens match the Menu primitive card (ui-primitives\n   * Menu.dpui-ModelSelect-module.dpui-ModelSelect-css) so every dropdown reads as the same material. */\n  border: 0;\n  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);\n  box-shadow: var(--dsw-elevation-prominent);\n  color: var(--dsw-alias-label-primary);\n  /* Elevated surface: the scrollbar thumb takes the l2 elevation tokens.\n     Declared here rather than on the scrolling `.dpui-ModelSelect-groups` child so the\n     elevation choice sits with the surface; the custom properties inherit\n     down to whichever descendant actually scrolls (see ui-theme\n     styles/scrollbar.dpui-ModelSelect-css for the rebinding contract). */\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n}\n\n.dpui-ModelSelect-status,\n.dpui-ModelSelect-empty {\n  padding: 8px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.dpui-ModelSelect-error,\n.dpui-ModelSelect-warning {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 6px;\n  margin-bottom: 3px;\n  padding: 6px 7px;\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.dpui-ModelSelect-warning {\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-state-warn-label);\n}\n\n.dpui-ModelSelect-retry {\n  flex: 0 0 auto;\n  padding: 0;\n  border: none;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.dpui-ModelSelect-searchRow {\n  position: relative;\n  flex-shrink: 0;\n  margin: 2px 0 3px;\n}\n\n.dpui-ModelSelect-searchRow .dpui-ModelSelect-search {\n  display: flex;\n  height: auto;\n  padding: 5px 7px;\n  border: 0 solid transparent;\n  border-radius: var(--dsw-radius-md);\n  background: transparent;\n}\n\n.dpui-ModelSelect-searchRow .dpui-ModelSelect-searchWithQuery {\n  padding-right: 34px;\n}\n\n.dpui-ModelSelect-searchClear {\n  position: absolute;\n  top: 50%;\n  right: 4px;\n  transform: translateY(-50%);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: none;\n  border-radius: 50%;\n  corner-shape: round;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\n.dpui-ModelSelect-searchClear:hover,\n.dpui-ModelSelect-searchClear:focus-visible {\n  outline: none;\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dpui-ModelSelect-searchRow .dpui-ModelSelect-search:focus-within {\n  border-color: transparent;\n}\n\n.dpui-ModelSelect-searchRow .dpui-ModelSelect-search input {\n  padding: 0;\n  font-size: 12px;\n  line-height: normal;\n}\n\n.dpui-ModelSelect-searchRow .dpui-ModelSelect-search input::placeholder {\n  color: var(--dsw-alias-label-caption);\n}\n\n.dpui-ModelSelect-groups {\n  min-height: 0;\n  overflow-y: auto;\n}\n\n.dpui-ModelSelect-option {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: auto;\n  min-width: 100%;\n  min-height: 34px;\n  padding: 5px 7px;\n  border: none;\n  border-radius: var(--dsw-radius-md);\n  outline: none;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n\n.dpui-ModelSelect-option:not(.dpui-ModelSelect-modelOption):hover:not(:disabled),\n.dpui-ModelSelect-option:focus-visible,\n.dpui-ModelSelect-optionActive:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n/* Selection marker is the trailing check, not a fill \u2014 matches the Menu\n * primitive's selected treatment. */\n.dpui-ModelSelect-selected {\n  background: transparent;\n}\n\n.dpui-ModelSelect-option:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n\n.dpui-ModelSelect-optionCopy {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.dpui-ModelSelect-modelName {\n  overflow: hidden;\n  color: inherit;\n  font-size: 13px;\n  line-height: 18px;\n  font-weight: 400;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dpui-ModelSelect-check {\n  display: grid;\n  place-items: center;\n  flex: 0 0 14px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.dpui-ModelSelect-check svg {\n  width: 14px;\n  height: 14px;\n}\n\n/* The model row's second line: the catalog's own one-line description, shown\n   only when the provider supplies one. */\n.dpui-ModelSelect-modelDescription {\n  overflow: hidden;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 15px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* One hairline between the card's regions: models, effort, management. */\n.dpui-ModelSelect-divider {\n  flex: none;\n  margin: 4px 8px;\n  border-top: 0.5px solid var(--dsw-alias-border-l2);\n}\n\n/* The effort region's heading: the section name and the level in use's own\n   description, so the row below never needs a second read. */\n.dpui-ModelSelect-sectionLabel {\n  display: flex;\n  align-items: baseline;\n  gap: 6px;\n  min-width: 0;\n  padding: 0 8px 4px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.dpui-ModelSelect-sectionHint {\n  min-width: 0;\n  overflow: hidden;\n  color: var(--dsw-alias-label-caption);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* Reasoning efforts as one segmented track. The treatment is the shared\n * SegmentedControl's \u2014 translucent groove, one raised surface under the value\n * in use \u2014 restated on radio rows so the card keeps a single \u2191/\u2193 ring and the\n * choice carries no tab panel. */\n.dpui-ModelSelect-segment {\n  display: grid;\n  flex: none;\n  grid-auto-flow: column;\n  grid-auto-columns: 1fr;\n  gap: 2px;\n  margin: 0 4px;\n  padding: 4px;\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dpui-ModelSelect-segmentItem {\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  min-width: 0;\n  height: 28px;\n  padding: 0 8px;\n  border: 0;\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  font-size: 13px;\n  line-height: 20px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  cursor: pointer;\n  outline: none;\n}\n\n.dpui-ModelSelect-segmentItem:hover:not(:disabled),\n.dpui-ModelSelect-segmentItem:focus-visible {\n  color: var(--dsw-alias-label-primary);\n}\n\n.dpui-ModelSelect-segmentItemActive {\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: var(--dsw-elevation-soft);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n}\n\n.dpui-ModelSelect-segmentItem:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n\n\n/* The effort card: the model in use, what the catalog says about it, and the\n   levels it advertises. It shares the list card's surface (MenuSurface owns\n   the material) and only adds measure and rhythm. */\n.dpui-ModelSelect-detail {\n  position: fixed;\n  z-index: 1100;\n  display: flex;\n  flex-direction: column;\n  width: max-content;\n  min-width: min(240px, calc(100vw - 32px));\n  max-width: min(300px, calc(100vw - 32px));\n  padding: 10px;\n}\n\n.dpui-ModelSelect-detailTitle {\n  overflow: hidden;\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  line-height: 20px;\n  font-weight: 500;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dpui-ModelSelect-detailDescription {\n  margin: 2px 0 0;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.dpui-ModelSelect-detail .dpui-ModelSelect-sectionLabel {\n  padding-top: 10px;\n}\n";
  document.head.append(style);
}
var ModelSelect_default = new Proxy({}, { get: (_target, key) => typeof key === "string" ? "dpui-ModelSelect-" + key : void 0 });

// src/client/provider-order.ts
function orderModelProviders(groups) {
  return groups.toSorted((left, right) => (left.id === "deepseek-account" ? 0 : left.id === "deepseek-official" ? 1 : 2) - (right.id === "deepseek-account" ? 0 : right.id === "deepseek-official" ? 1 : 2));
}

// src/client/ModelSelect.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var KNOWN_EFFORTS = /* @__PURE__ */ new Set(["off", "none", "minimal", "low", "medium", "high", "max"]);
function knownEffort(id) {
  const key = id?.toLowerCase();
  return key !== void 0 && KNOWN_EFFORTS.has(key) ? key : void 0;
}
function effortLabelFor(t, id, fallback) {
  const key = knownEffort(id);
  return key === void 0 ? fallback : t(`effort.${key}`);
}
function effortHintFor(t, id, fallback) {
  const key = knownEffort(id);
  return key === void 0 ? fallback : t(`effort.hint.${key}`);
}
var PLACE_MARGIN = 12;
var PLACE_GAP = 8;
function samePoint(current, left, top) {
  return current !== null && Math.abs(current.left - left) < 0.5 && Math.abs(current.top - top) < 0.5;
}
var MEASURE_STYLE = { visibility: "hidden", left: 0, top: 0 };
function ModelSelect({ locked, available, directory, load, select, t }) {
  const state = (0, import_react.useSyncExternalStore)(
    (fn) => directory.subscribe(fn),
    () => directory.getSnapshot()
  );
  const [open, setOpen] = (0, import_react.useState)(false);
  const [query, setQuery] = (0, import_react.useState)("");
  const [highlightedIndex, setHighlightedIndex] = (0, import_react.useState)(null);
  const [selectionFocus, setSelectionFocus] = (0, import_react.useState)(false);
  const lastActionRef = (0, import_react.useRef)("load");
  const [toast, setToast] = (0, import_react.useState)(null);
  const toastSeq = (0, import_react.useRef)(0);
  const rootRef = (0, import_react.useRef)(null);
  const triggerRef = (0, import_react.useRef)(null);
  const searchRef = (0, import_react.useRef)(null);
  const menuRef = (0, import_react.useRef)(null);
  const detailRef = (0, import_react.useRef)(null);
  const groupsRef = (0, import_react.useRef)(null);
  const [menuPos, setMenuPos] = (0, import_react.useState)(null);
  const [preview, setPreview] = (0, import_react.useState)(null);
  const [detailPos, setDetailPos] = (0, import_react.useState)(null);
  const itemRefs = (0, import_react.useRef)([]);
  const id = (0, import_react.useId)();
  const groups = (0, import_react.useMemo)(() => orderModelProviders(state.groups), [state.groups]);
  const choices = (0, import_react.useMemo)(() => groups.flatMap((group) => group.models.map((model) => ({
    group,
    model,
    selection: {
      provider: group.id,
      model: model.id,
      ...model.reasoning?.defaultEffort === void 0 ? {} : { reasoningEffort: model.reasoning.defaultEffort }
    }
  }))), [groups]);
  const showSearch = choices.length > 4;
  const filteredGroups = (0, import_react.useMemo)(() => groups.map((group) => ({
    ...group,
    models: (0, import_dsh_client_ui_primitives2.rankByName)(group.models, showSearch ? query.trim() : "")
  })).filter((group) => group.models.length > 0), [groups, query, showSearch]);
  const visibleModels = (0, import_react.useMemo)(() => filteredGroups.flatMap((group) => group.models.map((model) => ({
    provider: group.id,
    model: model.id
  }))), [filteredGroups]);
  const currentVisibleIndex = visibleModels.findIndex((model) => model.provider === state.current?.provider && model.model === state.current.model);
  const activeModelIndex = Math.min(highlightedIndex ?? Math.max(0, currentVisibleIndex), visibleModels.length - 1);
  const selectedIndex = state.current === null ? -1 : choices.findIndex((c) => c.selection.provider === state.current?.provider && c.selection.model === state.current.model);
  const currentChoice = choices[selectedIndex];
  const reasoning = currentChoice?.model.reasoning;
  const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
  const effortLabel = currentChoice === void 0 ? void 0 : reasoning === void 0 ? state.retainedEffort : effectiveEffort === void 0 ? t("effort.providerDefault") : effortLabelFor(t, effectiveEffort, reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ?? effectiveEffort);
  const shownChoice = preview === null ? currentChoice : choices.find((choice) => choice.group.id === preview.provider && choice.model.id === preview.model) ?? currentChoice;
  const shownReasoning = shownChoice?.model.reasoning;
  const shownEffort = shownChoice === currentChoice ? effectiveEffort : shownReasoning?.defaultEffort;
  const effortChoices = (0, import_react.useMemo)(() => shownReasoning === void 0 ? [] : [
    ...shownReasoning.defaultEffort === void 0 ? [{ key: "provider-default", effort: void 0, label: t("effort.providerDefault") }] : [],
    ...shownReasoning.efforts.map((effort) => ({
      key: `effort:${effort.id}`,
      effort: effort.id,
      label: effortLabelFor(t, effort.id, effort.name)
    }))
  ], [shownReasoning, t]);
  const providerDescription = shownReasoning?.efforts.find((level) => level.id === shownEffort)?.description;
  const effortDescription = effortHintFor(t, shownEffort, providerDescription);
  const { pending } = state;
  const busy = pending !== null;
  const reload = () => {
    lastActionRef.current = "load";
    load();
  };
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (rootRef.current?.contains(event.target) === true) return;
      if (menuRef.current?.contains(event.target) === true) return;
      if (detailRef.current?.contains(event.target) === true) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
    };
  }, [open]);
  (0, import_react.useLayoutEffect)(() => {
    if (!showSearch) {
      setQuery("");
      setHighlightedIndex(null);
    }
  }, [showSearch]);
  const focusIntent = (0, import_react.useRef)(null);
  const previousShowSearch = (0, import_react.useRef)(showSearch);
  (0, import_react.useEffect)(() => {
    const changedSearchMode = previousShowSearch.current !== showSearch;
    previousShowSearch.current = showSearch;
    if (!open || focusIntent.current === null && !changedSearchMode) return;
    focusIntent.current = null;
    if (showSearch) {
      searchRef.current?.focus();
      return;
    }
    const checked = menuRef.current?.querySelector('[role="menuitemradio"][aria-checked="true"]:not([disabled])');
    (checked ?? itemRefs.current.find((item) => item !== null && !item.disabled) ?? triggerRef.current)?.focus();
  }, [open, showSearch]);
  (0, import_react.useEffect)(() => {
    const viewport = groupsRef.current;
    if (viewport === null) return;
    return (0, import_dsh_client_ui_primitives.observeStickyMenuGroups)(viewport);
  }, [available, open, filteredGroups]);
  const pointerPicked = (0, import_react.useRef)(false);
  (0, import_react.useLayoutEffect)(() => {
    if (open && activeModelIndex >= 0 && !pointerPicked.current) {
      itemRefs.current[activeModelIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeModelIndex, visibleModels]);
  (0, import_react.useLayoutEffect)(() => {
    if (!open) {
      setMenuPos(null);
      setDetailPos(null);
      return;
    }
    const place = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect === void 0) return;
      const lw = menuRef.current?.offsetWidth ?? 0;
      const lh = menuRef.current?.offsetHeight ?? 0;
      let x = rect.right - lw;
      let y = rect.top - PLACE_GAP - lh;
      if (lw > 0) x = Math.min(Math.max(x, PLACE_MARGIN), window.innerWidth - lw - PLACE_MARGIN);
      if (lh > 0) y = Math.min(Math.max(y, PLACE_MARGIN), window.innerHeight - lh - PLACE_MARGIN);
      setMenuPos((current) => samePoint(current, x, y) ? current : { left: x, top: y });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, query, visibleModels.length]);
  (0, import_react.useLayoutEffect)(() => {
    if (!open || menuPos === null) {
      setDetailPos(null);
      return;
    }
    const place = () => {
      const list = menuRef.current?.getBoundingClientRect();
      if (list === void 0) return;
      const dw = detailRef.current?.offsetWidth ?? 0;
      const dh = detailRef.current?.offsetHeight ?? 0;
      let dx = list.left - PLACE_GAP - dw;
      if (dx < PLACE_MARGIN) dx = list.right + PLACE_GAP;
      const x = Math.min(Math.max(dx, PLACE_MARGIN), window.innerWidth - dw - PLACE_MARGIN);
      const y = Math.min(Math.max(list.bottom - dh, PLACE_MARGIN), window.innerHeight - dh - PLACE_MARGIN);
      setDetailPos((current) => samePoint(current, x, y) ? current : { left: x, top: y });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, menuPos, shownChoice, shownReasoning]);
  if (!available) return null;
  const show = () => {
    setSelectionFocus(false);
    triggerRef.current?.focus();
    setQuery("");
    setHighlightedIndex(null);
    pointerPicked.current = false;
    setPreview(null);
    if (currentChoice === void 0) focusIntent.current = "first";
    setOpen(true);
    reload();
  };
  const changeQuery = (next) => {
    setQuery(next);
    setHighlightedIndex(0);
  };
  const close = (restoreFocus = false) => {
    setOpen(false);
    setPreview(null);
    if (restoreFocus) queueMicrotask(() => {
      triggerRef.current?.focus();
    });
  };
  const closeAfterSelection = () => {
    setSelectionFocus(true);
    close(true);
  };
  const moveFocus = (offset) => {
    pointerPicked.current = false;
    const items = [menuRef.current, detailRef.current].flatMap((root) => Array.from(root?.querySelectorAll("[data-ring]") ?? []));
    if (items.length === 0) return;
    const active = items.findIndex((item) => item === document.activeElement);
    const next = active === -1 ? offset > 0 ? 0 : items.length - 1 : (active + offset + items.length) % items.length;
    items[next]?.focus();
  };
  const onRootKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close(true);
      return;
    }
    if (!open) return;
    const inSearch = showSearch && event.target instanceof HTMLInputElement;
    if (inSearch && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      if (!busy && visibleModels.length > 0) {
        pointerPicked.current = false;
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setHighlightedIndex((activeModelIndex + direction + visibleModels.length) % visibleModels.length);
        searchRef.current?.focus();
      }
      return;
    }
    if (inSearch && (event.key === "Enter" || event.key === "Tab" && !event.shiftKey)) {
      if (event.key === "Tab" && visibleModels.length === 0) return;
      event.preventDefault();
      const highlighted = visibleModels[activeModelIndex];
      if (!busy && highlighted !== void 0) choose(highlighted);
      return;
    }
    if (event.key === "Tab") {
      if (event.shiftKey) {
        event.preventDefault();
        close(true);
        return;
      }
      const focused = document.activeElement;
      const rows = itemRefs.current.filter((item) => item !== null);
      if (focused instanceof HTMLButtonElement && rows.includes(focused)) {
        event.preventDefault();
        focused.click();
        return;
      }
      if (focused !== triggerRef.current) return;
      event.preventDefault();
      if (showSearch) {
        setHighlightedIndex(null);
        searchRef.current?.focus();
        return;
      }
      const checked = menuRef.current?.querySelector('[role="menuitemradio"][aria-checked="true"]:not([disabled])');
      (checked ?? rows.find((item) => !item.disabled))?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(event.key === "ArrowDown" ? 1 : -1);
    }
  };
  const onBlur = (event) => {
    if (event.relatedTarget instanceof Node && (rootRef.current?.contains(event.relatedTarget) === true || menuRef.current?.contains(event.relatedTarget) === true || detailRef.current?.contains(event.relatedTarget) === true)) return;
    close();
  };
  const keepOpenAfterSettle = (0, import_react.useRef)(false);
  const settleSelection = (result) => {
    if (result === void 0) return;
    if (result.ok) {
      if (rootRef.current === null) return;
      if (keepOpenAfterSettle.current) {
        keepOpenAfterSettle.current = false;
        return;
      }
      closeAfterSelection();
      return;
    }
    const { error } = result;
    toastSeq.current += 1;
    setToast({
      seq: toastSeq.current,
      text: error.code === "session/writer-held" ? t("error.sessionInUse") : t("error.action", { message: `${error.code}: ${error.message}` })
    });
  };
  const submit = (selection) => {
    lastActionRef.current = "select";
    setSelectionFocus(true);
    triggerRef.current?.focus();
    void select(selection).then(settleSelection);
  };
  const choose = (selection) => {
    if (state.current?.provider === selection.provider && state.current.model === selection.model) {
      closeAfterSelection();
      return;
    }
    keepOpenAfterSettle.current = true;
    submit(selection);
  };
  const chooseEffort = (effort) => {
    if (shownChoice === void 0) return;
    const provider = shownChoice.group.id;
    const model = shownChoice.model.id;
    if (state.current?.provider === provider && state.current?.model === model && effectiveEffort === effort) {
      closeAfterSelection();
      return;
    }
    keepOpenAfterSettle.current = false;
    submit({ provider, model, ...effort === void 0 ? {} : { reasoningEffort: effort } });
  };
  const waiting = currentChoice === void 0 && state.status === "loading";
  const modelLabel = waiting ? t("trigger.loading") : currentChoice?.model.name ?? t("trigger.fallback");
  const triggerLabel = effortLabel === void 0 ? modelLabel : `${modelLabel} \xB7 ${effortLabel}`;
  const triggerAria = waiting ? t("trigger.loading") : currentChoice === void 0 ? t("trigger.selectAria") : effortLabel === void 0 ? t("trigger.aria", { model: modelLabel }) : t("trigger.ariaEffort", { model: modelLabel, effort: effortLabel });
  itemRefs.current = [];
  let itemIndex = 0;
  let modelIndex = 0;
  const itemRef = () => {
    const at = itemIndex++;
    return (node) => {
      itemRefs.current[at] = node;
    };
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      ref: rootRef,
      className: ModelSelect_default.root,
      onKeyDown: onRootKeyDown,
      onBlur,
      onMouseDown: (event) => {
        if (event.target instanceof Element && event.target.closest("button") !== null) event.preventDefault();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            ref: triggerRef,
            type: "button",
            className: ModelSelect_default.trigger,
            "aria-label": triggerAria,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-controls": open ? `${id}-menu` : void 0,
            title: triggerLabel,
            "aria-busy": busy,
            "data-selection-focus": selectionFocus ? "" : void 0,
            onBlur: () => {
              setSelectionFocus(false);
            },
            disabled: locked,
            onClick: () => {
              if (open) {
                close(true);
              } else {
                show();
              }
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.IconDataOutlineRegular, { className: ModelSelect_default.triggerIcon, size: 16 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ModelSelect_default.triggerLabel, children: modelLabel }),
              effortLabel !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ModelSelect_default.triggerEffort, children: effortLabel }),
              busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.StateDot, { state: "ongoing" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.IconChevronDownOutlineRegular, { className: clsx(ModelSelect_default.chevron, open && ModelSelect_default.chevronOpen) })
            ]
          }
        ),
        open && (0, import_react_dom.createPortal)(
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_dsh_client_ui_primitives.MenuSurface,
            {
              ref: menuRef,
              id: `${id}-menu`,
              className: ModelSelect_default.menu,
              style: menuPos ?? MEASURE_STYLE,
              role: "group",
              "aria-label": t("menu.aria"),
              "aria-busy": state.status === "loading" || busy,
              children: [
                showSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ModelSelect_default.searchRow, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_dsh_client_ui_primitives2.Input,
                    {
                      ref: searchRef,
                      className: clsx(ModelSelect_default.search, query !== "" && ModelSelect_default.searchWithQuery),
                      type: "text",
                      role: "searchbox",
                      "aria-label": t("search.placeholder"),
                      "aria-controls": `${id}-models`,
                      "aria-activedescendant": activeModelIndex < 0 ? void 0 : `${id}-model-${activeModelIndex}`,
                      placeholder: t("search.placeholder"),
                      value: query,
                      readOnly: busy,
                      onChange: (event) => {
                        changeQuery(event.target.value);
                      }
                    }
                  ),
                  query !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      className: ModelSelect_default.searchClear,
                      "aria-label": t("search.clear"),
                      disabled: busy,
                      onClick: () => {
                        changeQuery("");
                        searchRef.current?.focus();
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.IconCloseFillRegular, {})
                    }
                  )
                ] }),
                state.status === "loading" && filteredGroups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: ModelSelect_default.status, children: t("status.loading") }),
                state.error !== null && lastActionRef.current === "load" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ModelSelect_default.error, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("error.action", { message: state.error }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: ModelSelect_default.retry, onClick: reload, children: t("retry") })
                ] }),
                state.failures.map((failure) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ModelSelect_default.warning, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("warning.groupLoad", { name: failure.id === "deepseek-account" ? t("provider.account") : failure.name, message: failure.message }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: ModelSelect_default.retry, onClick: reload, children: t("retry") })
                ] }, failure.id)),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "div",
                  {
                    ref: groupsRef,
                    id: `${id}-models`,
                    className: clsx(ModelSelect_default.groups, "scrollable"),
                    role: "menu",
                    "aria-label": t("menu.model"),
                    hidden: filteredGroups.length === 0,
                    children: filteredGroups.map((group) => {
                      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.MenuGroup, { label: group.id === "deepseek-account" ? t("provider.account") : group.name, children: group.models.map((model) => {
                        const index = modelIndex++;
                        const selected = state.current?.provider === group.id && state.current.model === model.id;
                        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          "button",
                          {
                            ref: itemRef(),
                            type: "button",
                            role: "menuitemradio",
                            "data-ring": "",
                            "aria-checked": selected,
                            id: `${id}-model-${index}`,
                            tabIndex: showSearch ? -1 : 0,
                            onFocus: () => {
                              setHighlightedIndex(index);
                            },
                            onPointerEnter: () => {
                              pointerPicked.current = true;
                              setPreview({ provider: group.id, model: model.id });
                            },
                            "data-highlighted": index === activeModelIndex ? "" : void 0,
                            className: clsx(
                              ModelSelect_default.option,
                              ModelSelect_default.modelOption,
                              selected && ModelSelect_default.selected,
                              index === activeModelIndex && ModelSelect_default.optionActive
                            ),
                            onMouseMove: busy || index === activeModelIndex ? void 0 : () => {
                              if (showSearch) setHighlightedIndex(index);
                              else itemRefs.current[index]?.focus();
                            },
                            title: model.name,
                            disabled: busy,
                            onClick: () => {
                              choose({ provider: group.id, model: model.id });
                            },
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ModelSelect_default.optionCopy, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ModelSelect_default.modelName, children: model.name }) }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ModelSelect_default.check, children: pending?.provider === group.id && pending.model === model.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.StateDot, { state: "ongoing" }) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.IconCheckOutlineRegular, {}) : null })
                            ]
                          },
                          model.id
                        );
                      }) }, group.id);
                    })
                  }
                ),
                state.status === "ready" && filteredGroups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: ModelSelect_default.empty, role: "status", children: t(choices.length === 0 ? "empty.models" : "search.empty") })
              ]
            }
          ),
          document.body
        ),
        open && shownChoice !== void 0 && (0, import_react_dom.createPortal)(
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_dsh_client_ui_primitives.MenuSurface,
            {
              ref: detailRef,
              className: ModelSelect_default.detail,
              style: detailPos ?? MEASURE_STYLE,
              role: "group",
              "aria-label": t("menu.effort"),
              "aria-busy": busy,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: ModelSelect_default.detailTitle, children: shownChoice?.model.name ?? modelLabel }),
                shownChoice?.model.description !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: ModelSelect_default.detailDescription, children: shownChoice.model.description }),
                shownReasoning !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ModelSelect_default.sectionLabel, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("menu.effort") }),
                    effortDescription !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ModelSelect_default.sectionHint, children: effortDescription })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: ModelSelect_default.segment, role: "radiogroup", "aria-label": t("menu.effort"), children: effortChoices.map((level) => {
                    const active = shownEffort === level.effort;
                    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "button",
                      {
                        ref: itemRef(),
                        type: "button",
                        role: "radio",
                        "data-ring": "",
                        "aria-checked": active,
                        className: clsx(ModelSelect_default.segmentItem, active && ModelSelect_default.segmentItemActive),
                        disabled: busy,
                        onClick: () => {
                          chooseEffort(level.effort);
                        },
                        children: pending !== null && pending.provider === shownChoice?.group.id && pending.model === shownChoice?.model.id && pending.reasoningEffort === level.effort ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.StateDot, { state: "ongoing" }) : level.label
                      },
                      level.key
                    );
                  }) })
                ] })
              ]
            }
          ),
          document.body
        ),
        toast !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dsh_client_ui_primitives2.Toast,
          {
            text: toast.text,
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives2.IconWarningOutlineRegular, {}),
            anchor: rootRef.current?.closest("[data-composer-card]") ?? null,
            onDone: () => {
              setToast(null);
            }
          },
          toast.seq
        )
      ]
    }
  );
}

// src/client/account.jsx
var import_react4 = require("react");
var import_dsh_client_ui_primitives5 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/quick-settings.jsx
var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/generated-palettes.js
var PALETTE_LAYERS = { "forest": { "--dsw-alias-bg-base": { "light": "#fff", "dark": "#191b1a" }, "--dsw-alias-bg-document-preview": { "light": "#fff", "dark": "#191b1a" }, "--dsw-alias-bg-layer-1": { "light": "#fff", "dark": "#222523" }, "--dsw-alias-button-elevated-fill": { "light": "#fff", "dark": "#222523" }, "--dsw-alias-button-floating-fill": { "light": "#fff", "dark": "#222523" }, "--dsw-alias-bg-layer-2": { "light": "#f9f9f9", "dark": "#252825" }, "--dsw-alias-bg-overlay": { "light": "#f9f9f9", "dark": "#252825" }, "--dsw-alias-menu-group-header-fill": { "light": "#f9f9f9", "dark": "#252825" }, "--dsw-alias-label-primary": { "light": "#141414", "dark": "#d9dcd9" }, "--dsw-alias-markdown-code-block": { "light": "#f9f9f9", "dark": "#252825" }, "--dsw-alias-label-secondary": { "light": "#636261", "dark": "#b3bab4" }, "--dsw-alias-label-primary-dimmed": { "light": "#636261", "dark": "#b3bab4" }, "--dsw-alias-label-tertiary": { "light": "#838280", "dark": "#949d96" }, "--dsw-alias-menu-icon": { "light": "#838280", "dark": "#949d96" }, "--dsw-alias-label-dimmed": { "light": "#aaa9a8", "dark": "#8a948c" }, "--dsw-alias-label-caption": { "light": "#aaa9a8", "dark": "#8a948c" }, "--dsw-alias-label-primary-foreground": { "light": "#fdfdfd", "dark": "#080807" }, "--dsw-alias-brand-primary": { "light": "#4b6f5a", "dark": "#4d9c61" }, "--dsw-alias-state-business-primary": { "light": "#4b6f5a", "dark": "#4d9c61" }, "--dsw-alias-brand-text": { "light": "#4b6f5a", "dark": "#4d9c61" }, "--dsw-alias-button-primary-hover": { "light": "#436651", "dark": "#62ad78" }, "--dsw-alias-button-floating-hover": { "light": "#f6f6f6", "dark": "#2d332e" }, "--dsw-alias-interactive-bg-hover-accent": { "light": "#3a5747", "dark": "#428955" }, "--dsw-alias-button-ghost-active-hover": { "light": "#3a5747", "dark": "#428955" }, "--dsw-alias-border-l3": { "light": "#ddd", "dark": "#404842" }, "--dsw-alias-button-ghost-active-border": { "light": "#d5dbd8", "dark": "#335942" }, "--dsw-alias-state-business-tertiary": { "light": "#f2f4f2", "dark": "#14261c" }, "--dsw-alias-turn-trigger-bg": { "light": "#f2f4f2", "dark": "#14261c" }, "--dsw-alias-interactive-bg-hover": { "light": "#00000012", "dark": "#2d332e" }, "--dsw-alias-border-l4": { "light": "#bcbbba", "dark": "#4b554d" }, "--dsw-alias-border-l2": { "light": "#e6e6e6", "dark": "#363c37" }, "--dsw-alias-border-l2-darkmode-thin": { "light": "#e6e6e6", "dark": "#363c37" }, "--dsw-alias-border-l1": { "light": "#eee", "dark": "#2b302c" }, "--dsw-alias-interactive-bg-active": { "light": "#dfdfdf", "dark": "#363d37" }, "--dsw-alias-bg-layer-3": { "light": "#f9f9f9", "dark": "#252825" }, "--dsw-alias-state-error-primary": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-state-error-secondary": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-marker": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-bg": { "light": "#fdf2f0", "dark": "#4a1a1b" }, "--dsw-alias-state-success-primary": { "light": "#579b6e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-marker": { "light": "#579b6e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-bg": { "light": "#ebf7f0", "dark": "#14261c" }, "--dsw-alias-button-info-fill": { "light": "#4b6f5a", "dark": "#4d9c61" }, "--dsw-alias-link": { "light": "#4d9868", "dark": "#8ee5a1" }, "--dsw-alias-button-info-hover": { "light": "#436651", "dark": "#62ad78" }, "--dsw-alias-markdown-code-block-banner": { "light": "#f6f6f6", "dark": "#2d332e" }, "--dsw-alias-markdown-inline-code": { "light": "#f6f6f6", "dark": "#252b26" }, "--dsw-alias-markdown-tag": { "light": "#f6f6f6", "dark": "#252b26" }, "--dsw-alias-bg-module-platform": { "light": "#f6f6f6", "dark": "#363d37" }, "--dsw-alias-interactive-bg-hover-solid": { "light": "#f6f6f6", "dark": "#2d332e" }, "--dsw-alias-button-ghost-active-fill": { "light": "#00000012", "dark": "#363d37" }, "--dsw-alias-markdown-citation": { "light": "#e6e6e6", "dark": "#4b554d" }, "--dsw-alias-label-document-preview": { "light": "#636261", "dark": "#b3bab4" }, "--dsw-alias-brand-primary-new-colorprimary-new-color": { "light": "#4b6f5a", "dark": "#4d9c61" }, "--dsw-specific-sidebar-fill": { "light": "#fff", "dark": "#222523" }, "--dsw-specific-bubble": { "light": "#f2f4f2", "dark": "#14261c" }, "--dsw-specific-input-major": { "light": "#fff", "dark": "#252825" }, "--dsw-specific-selector": { "light": "#f6f6f6", "dark": "#363d37" }, "--dsw-specific-sidebar-nav-item-active": { "light": "#00000012", "dark": "#363d37" }, "--dsw-specific-sidebar-nav-item-hover": { "light": "#f6f6f6", "dark": "#2d332e" }, "--dsw-specific-menu": { "light": "color-mix(in srgb, #f9f9f9 94%, transparent)", "dark": "color-mix(in srgb, #252825 94%, transparent)" }, "--dsw-menu-surface-fill": { "light": "color-mix(in srgb, #f9f9f9 58%, transparent)", "dark": "color-mix(in srgb, #252825 45%, transparent)" }, "--dsw-alias-bg-document-selection": { "light": "color-mix(in srgb, #4b6f5a 40%, transparent)", "dark": "color-mix(in srgb, #4d9c61 40%, transparent)" }, "--dsw-specific-sidebar-nav-item-active-accent": { "light": "color-mix(in srgb, #4b6f5a 14%, transparent)", "dark": "color-mix(in srgb, #4d9c61 14%, transparent)" }, "--dsw-radius-xs": { "light": "2px", "dark": "2px" }, "--dsw-radius-sm": { "light": "4px", "dark": "4px" }, "--dsw-radius-md": { "light": "6px", "dark": "6px" }, "--dsw-radius-lg": { "light": "8px", "dark": "8px" }, "--dsw-radius-xl": { "light": "12px", "dark": "12px" }, "--dsw-radius-panel": { "light": "16px", "dark": "16px" }, "--dsh-font-family-text": { "light": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif', "dark": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif' }, "--dsh-font-family-code": { "light": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', "dark": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } }, "mint": { "--dsw-alias-bg-base": { "light": "#f9fbf9", "dark": "#0b110e" }, "--dsw-alias-bg-document-preview": { "light": "#f9fbf9", "dark": "#0b110e" }, "--dsw-alias-bg-layer-1": { "light": "#fff", "dark": "#0a0f0d" }, "--dsw-alias-button-elevated-fill": { "light": "#fff", "dark": "#0a0f0d" }, "--dsw-alias-button-floating-fill": { "light": "#fff", "dark": "#0a0f0d" }, "--dsw-alias-bg-layer-2": { "light": "#f9f9f9", "dark": "#1a2420" }, "--dsw-alias-bg-overlay": { "light": "#f9f9f9", "dark": "#1a2420" }, "--dsw-alias-menu-group-header-fill": { "light": "#f9f9f9", "dark": "#1a2420" }, "--dsw-alias-label-primary": { "light": "#2f4b2d", "dark": "#eaf3ef" }, "--dsw-alias-markdown-code-block": { "light": "#f9f9f9", "dark": "#1a2420" }, "--dsw-alias-label-secondary": { "light": "#536157", "dark": "#b0c3ba" }, "--dsw-alias-label-primary-dimmed": { "light": "#536157", "dark": "#b0c3ba" }, "--dsw-alias-label-tertiary": { "light": "#737f76", "dark": "#788f85" }, "--dsw-alias-menu-icon": { "light": "#737f76", "dark": "#788f85" }, "--dsw-alias-label-dimmed": { "light": "#98a29a", "dark": "#52645c" }, "--dsw-alias-label-caption": { "light": "#98a29a", "dark": "#52645c" }, "--dsw-alias-label-primary-foreground": { "light": "#f7faf8", "dark": "#07130f" }, "--dsw-alias-brand-primary": { "light": "#4fa98f", "dark": "#62c9a8" }, "--dsw-alias-state-business-primary": { "light": "#4fa98f", "dark": "#62c9a8" }, "--dsw-alias-brand-text": { "light": "#4fa98f", "dark": "#62c9a8" }, "--dsw-alias-button-primary-hover": { "light": "#66b89f", "dark": "#8de2c5" }, "--dsw-alias-button-floating-hover": { "light": "#f6f6f6", "dark": "#232e29" }, "--dsw-alias-interactive-bg-hover-accent": { "light": "#3f8f78", "dark": "#76d9b9" }, "--dsw-alias-button-ghost-active-hover": { "light": "#3f8f78", "dark": "#76d9b9" }, "--dsw-alias-border-l3": { "light": "#d1e4dd", "dark": "#314039" }, "--dsw-alias-button-ghost-active-border": { "light": "#a9d8c8", "dark": "#285546" }, "--dsw-alias-state-business-tertiary": { "light": "#e6f5f0", "dark": "#122a24" }, "--dsw-alias-turn-trigger-bg": { "light": "#e6f5f0", "dark": "#122a24" }, "--dsw-alias-interactive-bg-hover": { "light": "#00000012", "dark": "#232e29" }, "--dsw-alias-border-l4": { "light": "#afcbc1", "dark": "#394a42" }, "--dsw-alias-border-l2": { "light": "#e1eee9", "dark": "#27332e" }, "--dsw-alias-border-l2-darkmode-thin": { "light": "#e1eee9", "dark": "#27332e" }, "--dsw-alias-border-l1": { "light": "#eef6f3", "dark": "#1d2722" }, "--dsw-alias-interactive-bg-active": { "light": "#dfdfdf", "dark": "#2b3731" }, "--dsw-alias-bg-layer-3": { "light": "#f9f9f9", "dark": "#1a2420" }, "--dsw-alias-state-error-primary": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-state-error-secondary": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-marker": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-bg": { "light": "#fdf2f0", "dark": "#4a1a1b" }, "--dsw-alias-state-success-primary": { "light": "#579b6e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-marker": { "light": "#579b6e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-bg": { "light": "#ebf7f0", "dark": "#14261c" }, "--dsw-alias-button-info-fill": { "light": "#4fa98f", "dark": "#62c9a8" }, "--dsw-alias-link": { "light": "#2a7b68", "dark": "#75d7b7" }, "--dsw-alias-button-info-hover": { "light": "#66b89f", "dark": "#8de2c5" }, "--dsw-alias-markdown-code-block-banner": { "light": "#f6f6f6", "dark": "#232e29" }, "--dsw-alias-markdown-inline-code": { "light": "#f6f6f6", "dark": "#1a2420" }, "--dsw-alias-markdown-tag": { "light": "#f6f6f6", "dark": "#1a2420" }, "--dsw-alias-bg-module-platform": { "light": "#f6f6f6", "dark": "#2b3731" }, "--dsw-alias-interactive-bg-hover-solid": { "light": "#f6f6f6", "dark": "#232e29" }, "--dsw-alias-button-ghost-active-fill": { "light": "#00000012", "dark": "#2b3731" }, "--dsw-alias-markdown-citation": { "light": "#e1eee9", "dark": "#394a42" }, "--dsw-alias-label-document-preview": { "light": "#536157", "dark": "#b0c3ba" }, "--dsw-alias-brand-primary-new-colorprimary-new-color": { "light": "#4fa98f", "dark": "#62c9a8" }, "--dsw-specific-sidebar-fill": { "light": "#f9fbf9", "dark": "#0a0f0d" }, "--dsw-specific-bubble": { "light": "#e6f5f0", "dark": "#122a24" }, "--dsw-specific-input-major": { "light": "#fff", "dark": "#1a2420" }, "--dsw-specific-selector": { "light": "#f6f6f6", "dark": "#2b3731" }, "--dsw-specific-sidebar-nav-item-active": { "light": "#00000012", "dark": "#2b3731" }, "--dsw-specific-sidebar-nav-item-hover": { "light": "#f6f6f6", "dark": "#232e29" }, "--dsw-specific-menu": { "light": "color-mix(in srgb, #f9f9f9 94%, transparent)", "dark": "color-mix(in srgb, #1a2420 94%, transparent)" }, "--dsw-menu-surface-fill": { "light": "color-mix(in srgb, #f9f9f9 58%, transparent)", "dark": "color-mix(in srgb, #1a2420 45%, transparent)" }, "--dsw-alias-bg-document-selection": { "light": "color-mix(in srgb, #4fa98f 40%, transparent)", "dark": "color-mix(in srgb, #62c9a8 40%, transparent)" }, "--dsw-specific-sidebar-nav-item-active-accent": { "light": "color-mix(in srgb, #4fa98f 14%, transparent)", "dark": "color-mix(in srgb, #62c9a8 14%, transparent)" }, "--dsw-radius-xs": { "light": "2px", "dark": "2px" }, "--dsw-radius-sm": { "light": "4px", "dark": "4px" }, "--dsw-radius-md": { "light": "6px", "dark": "6px" }, "--dsw-radius-lg": { "light": "8px", "dark": "8px" }, "--dsw-radius-xl": { "light": "12px", "dark": "12px" }, "--dsw-radius-panel": { "light": "16px", "dark": "16px" }, "--dsh-font-family-text": { "light": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif', "dark": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif' }, "--dsh-font-family-code": { "light": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', "dark": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } }, "bee": { "--dsw-alias-bg-base": { "light": "#fff", "dark": "#10110e" }, "--dsw-alias-bg-document-preview": { "light": "#fff", "dark": "#10110e" }, "--dsw-alias-bg-layer-1": { "light": "#fff", "dark": "#0f100d" }, "--dsw-alias-button-elevated-fill": { "light": "#fff", "dark": "#0f100d" }, "--dsw-alias-button-floating-fill": { "light": "#fff", "dark": "#0f100d" }, "--dsw-alias-bg-layer-2": { "light": "#f9f9f9", "dark": "#20221d" }, "--dsw-alias-bg-overlay": { "light": "#f9f9f9", "dark": "#20221d" }, "--dsw-alias-menu-group-header-fill": { "light": "#f9f9f9", "dark": "#20221d" }, "--dsw-alias-label-primary": { "light": "#141414", "dark": "#f2f1e8" }, "--dsw-alias-markdown-code-block": { "light": "#f9f9f9", "dark": "#20221d" }, "--dsw-alias-label-secondary": { "light": "#636261", "dark": "#c1bfb1" }, "--dsw-alias-label-primary-dimmed": { "light": "#636261", "dark": "#c1bfb1" }, "--dsw-alias-label-tertiary": { "light": "#838280", "dark": "#89877a" }, "--dsw-alias-menu-icon": { "light": "#838280", "dark": "#89877a" }, "--dsw-alias-label-dimmed": { "light": "#aaa9a8", "dark": "#626056" }, "--dsw-alias-label-caption": { "light": "#aaa9a8", "dark": "#626056" }, "--dsw-alias-label-primary-foreground": { "light": "#fdfdfd", "dark": "#171407" }, "--dsw-alias-brand-primary": { "light": "#0d0d0d", "dark": "#e0c65c" }, "--dsw-alias-state-business-primary": { "light": "#0d0d0d", "dark": "#e0c65c" }, "--dsw-alias-brand-text": { "light": "#0d0d0d", "dark": "#e0c65c" }, "--dsw-alias-button-primary-hover": { "light": "#436651", "dark": "#f0da78" }, "--dsw-alias-button-floating-hover": { "light": "#f6f6f6", "dark": "#2c2e28" }, "--dsw-alias-interactive-bg-hover-accent": { "light": "#3a5747", "dark": "#e8d06e" }, "--dsw-alias-button-ghost-active-hover": { "light": "#3a5747", "dark": "#e8d06e" }, "--dsw-alias-border-l3": { "light": "#ddd", "dark": "#3b3d36" }, "--dsw-alias-button-ghost-active-border": { "light": "#d5dbd8", "dark": "#5a4d1f" }, "--dsw-alias-state-business-tertiary": { "light": "#f2f4f2", "dark": "#2e2916" }, "--dsw-alias-turn-trigger-bg": { "light": "#f2f4f2", "dark": "#2e2916" }, "--dsw-alias-interactive-bg-hover": { "light": "#efefef", "dark": "#2c2e28" }, "--dsw-alias-border-l4": { "light": "#bcbbba", "dark": "#47483f" }, "--dsw-alias-border-l2": { "light": "#e6e6e6", "dark": "#30322d" }, "--dsw-alias-border-l2-darkmode-thin": { "light": "#e6e6e6", "dark": "#30322d" }, "--dsw-alias-border-l1": { "light": "#eee", "dark": "#252721" }, "--dsw-alias-interactive-bg-active": { "light": "#dfdfdf", "dark": "#363830" }, "--dsw-alias-bg-layer-3": { "light": "#f9f9f9", "dark": "#20221d" }, "--dsw-alias-state-error-primary": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-state-error-secondary": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-marker": { "light": "#ec5b56", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-bg": { "light": "#fdf2f0", "dark": "#4a1a1b" }, "--dsw-alias-state-success-primary": { "light": "#579b6e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-marker": { "light": "#579b6e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-bg": { "light": "#ebf7f0", "dark": "#14261c" }, "--dsw-alias-button-info-fill": { "light": "#0d0d0d", "dark": "#e0c65c" }, "--dsw-alias-link": { "light": "#4d9868", "dark": "#e6ce6a" }, "--dsw-alias-button-info-hover": { "light": "#436651", "dark": "#f0da78" }, "--dsw-alias-markdown-code-block-banner": { "light": "#f6f6f6", "dark": "#2c2e28" }, "--dsw-alias-markdown-inline-code": { "light": "#f6f6f6", "dark": "#23251f" }, "--dsw-alias-markdown-tag": { "light": "#f6f6f6", "dark": "#23251f" }, "--dsw-alias-bg-module-platform": { "light": "#f6f6f6", "dark": "#363830" }, "--dsw-alias-interactive-bg-hover-solid": { "light": "#f6f6f6", "dark": "#2c2e28" }, "--dsw-alias-button-ghost-active-fill": { "light": "#efefef", "dark": "#363830" }, "--dsw-alias-markdown-citation": { "light": "#e6e6e6", "dark": "#47483f" }, "--dsw-alias-label-document-preview": { "light": "#636261", "dark": "#c1bfb1" }, "--dsw-alias-brand-primary-new-colorprimary-new-color": { "light": "#0d0d0d", "dark": "#e0c65c" }, "--dsw-specific-sidebar-fill": { "light": "#fff", "dark": "#0f100d" }, "--dsw-specific-bubble": { "light": "#f2f4f2", "dark": "#2e2916" }, "--dsw-specific-input-major": { "light": "#fff", "dark": "#20221d" }, "--dsw-specific-selector": { "light": "#f6f6f6", "dark": "#363830" }, "--dsw-specific-sidebar-nav-item-active": { "light": "#efefef", "dark": "#363830" }, "--dsw-specific-sidebar-nav-item-hover": { "light": "#f6f6f6", "dark": "#2c2e28" }, "--dsw-specific-menu": { "light": "color-mix(in srgb, #f9f9f9 94%, transparent)", "dark": "color-mix(in srgb, #20221d 94%, transparent)" }, "--dsw-menu-surface-fill": { "light": "color-mix(in srgb, #f9f9f9 58%, transparent)", "dark": "color-mix(in srgb, #20221d 45%, transparent)" }, "--dsw-alias-bg-document-selection": { "light": "color-mix(in srgb, #0d0d0d 40%, transparent)", "dark": "color-mix(in srgb, #e0c65c 40%, transparent)" }, "--dsw-specific-sidebar-nav-item-active-accent": { "light": "color-mix(in srgb, #0d0d0d 14%, transparent)", "dark": "color-mix(in srgb, #e0c65c 14%, transparent)" }, "--dsw-radius-xs": { "light": "2px", "dark": "2px" }, "--dsw-radius-sm": { "light": "4px", "dark": "4px" }, "--dsw-radius-md": { "light": "6px", "dark": "6px" }, "--dsw-radius-lg": { "light": "8px", "dark": "8px" }, "--dsw-radius-xl": { "light": "12px", "dark": "12px" }, "--dsw-radius-panel": { "light": "16px", "dark": "16px" }, "--dsh-font-family-text": { "light": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif', "dark": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif' }, "--dsh-font-family-code": { "light": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', "dark": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } }, "parchment": { "--dsw-alias-bg-base": { "light": "#fbfbfa", "dark": "#151310" }, "--dsw-alias-bg-document-preview": { "light": "#fbfbfa", "dark": "#151310" }, "--dsw-alias-bg-layer-1": { "light": "#fff", "dark": "#12100e" }, "--dsw-alias-button-elevated-fill": { "light": "#fff", "dark": "#12100e" }, "--dsw-alias-button-floating-fill": { "light": "#fff", "dark": "#12100e" }, "--dsw-alias-bg-layer-2": { "light": "#f6f5f3", "dark": "#26221d" }, "--dsw-alias-bg-overlay": { "light": "#f6f5f3", "dark": "#26221d" }, "--dsw-alias-menu-group-header-fill": { "light": "#f6f5f3", "dark": "#26221d" }, "--dsw-alias-label-primary": { "light": "#202116", "dark": "#f1ece5" }, "--dsw-alias-markdown-code-block": { "light": "#f6f5f3", "dark": "#26221d" }, "--dsw-alias-label-secondary": { "light": "#4a463c", "dark": "#c2b7ac" }, "--dsw-alias-label-primary-dimmed": { "light": "#4a463c", "dark": "#c2b7ac" }, "--dsw-alias-label-tertiary": { "light": "#6b665c", "dark": "#8e8175" }, "--dsw-alias-menu-icon": { "light": "#6b665c", "dark": "#8e8175" }, "--dsw-alias-label-dimmed": { "light": "#a7a49b", "dark": "#665b52" }, "--dsw-alias-label-caption": { "light": "#a7a49b", "dark": "#665b52" }, "--dsw-alias-label-primary-foreground": { "light": "#fff9f4", "dark": "#1b0e09" }, "--dsw-alias-brand-primary": { "light": "#c96442", "dark": "#e08a68" }, "--dsw-alias-state-business-primary": { "light": "#c96442", "dark": "#e08a68" }, "--dsw-alias-brand-text": { "light": "#c96442", "dark": "#e08a68" }, "--dsw-alias-button-primary-hover": { "light": "#b24e32", "dark": "#eea184" }, "--dsw-alias-button-floating-hover": { "light": "#f5f4f1", "dark": "#302b26" }, "--dsw-alias-interactive-bg-hover-accent": { "light": "#a9432a", "dark": "#e79576" }, "--dsw-alias-button-ghost-active-hover": { "light": "#a9432a", "dark": "#e79576" }, "--dsw-alias-border-l3": { "light": "#e5e1d9", "dark": "#413a33" }, "--dsw-alias-button-ghost-active-border": { "light": "#f2c7b6", "dark": "#704233" }, "--dsw-alias-state-business-tertiary": { "light": "#f1f0ed", "dark": "#321f19" }, "--dsw-alias-turn-trigger-bg": { "light": "#f1f0ed", "dark": "#321f19" }, "--dsw-alias-interactive-bg-hover": { "light": "#e9e8e5", "dark": "#302b26" }, "--dsw-alias-border-l4": { "light": "#d4cfc6", "dark": "#4b433b" }, "--dsw-alias-border-l2": { "light": "#ede9e2", "dark": "#352f2a" }, "--dsw-alias-border-l2-darkmode-thin": { "light": "#ede9e2", "dark": "#352f2a" }, "--dsw-alias-border-l1": { "light": "#f3efe8", "dark": "#292520" }, "--dsw-alias-interactive-bg-active": { "light": "#f1f0ed", "dark": "#3b352f" }, "--dsw-alias-bg-layer-3": { "light": "#f6f5f3", "dark": "#26221d" }, "--dsw-alias-state-error-primary": { "light": "#c9363e", "dark": "#ff4d4f" }, "--dsw-alias-state-error-secondary": { "light": "#c9363e", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-marker": { "light": "#c9363e", "dark": "#ff4d4f" }, "--dsw-alias-file-diff-deleted-bg": { "light": "#fff2f0", "dark": "#4a1a1b" }, "--dsw-alias-state-success-primary": { "light": "#5a7a5e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-marker": { "light": "#5a7a5e", "dark": "#73cd94" }, "--dsw-alias-file-diff-added-bg": { "light": "#eef2ed", "dark": "#14261c" }, "--dsw-alias-button-info-fill": { "light": "#c96442", "dark": "#e08a68" }, "--dsw-alias-link": { "light": "#c96442", "dark": "#e79576" }, "--dsw-alias-button-info-hover": { "light": "#b24e32", "dark": "#eea184" }, "--dsw-alias-markdown-code-block-banner": { "light": "#f5f4f1", "dark": "#302b26" }, "--dsw-alias-markdown-inline-code": { "light": "#f5f4f1", "dark": "#26221d" }, "--dsw-alias-markdown-tag": { "light": "#f5f4f1", "dark": "#26221d" }, "--dsw-alias-bg-module-platform": { "light": "#f5f4f1", "dark": "#3b352f" }, "--dsw-alias-interactive-bg-hover-solid": { "light": "#f5f4f1", "dark": "#302b26" }, "--dsw-alias-button-ghost-active-fill": { "light": "#e9e8e5", "dark": "#3b352f" }, "--dsw-alias-markdown-citation": { "light": "#ede9e2", "dark": "#4b433b" }, "--dsw-alias-label-document-preview": { "light": "#4a463c", "dark": "#c2b7ac" }, "--dsw-alias-brand-primary-new-colorprimary-new-color": { "light": "#c96442", "dark": "#e08a68" }, "--dsw-specific-sidebar-fill": { "light": "#fbfbfa", "dark": "#12100e" }, "--dsw-specific-bubble": { "light": "#f1f0ed", "dark": "#321f19" }, "--dsw-specific-input-major": { "light": "#fff", "dark": "#26221d" }, "--dsw-specific-selector": { "light": "#f5f4f1", "dark": "#3b352f" }, "--dsw-specific-sidebar-nav-item-active": { "light": "#e9e8e5", "dark": "#3b352f" }, "--dsw-specific-sidebar-nav-item-hover": { "light": "#f5f4f1", "dark": "#302b26" }, "--dsw-specific-menu": { "light": "color-mix(in srgb, #f6f5f3 94%, transparent)", "dark": "color-mix(in srgb, #26221d 94%, transparent)" }, "--dsw-menu-surface-fill": { "light": "color-mix(in srgb, #f6f5f3 58%, transparent)", "dark": "color-mix(in srgb, #26221d 45%, transparent)" }, "--dsw-alias-bg-document-selection": { "light": "color-mix(in srgb, #c96442 40%, transparent)", "dark": "color-mix(in srgb, #e08a68 40%, transparent)" }, "--dsw-specific-sidebar-nav-item-active-accent": { "light": "color-mix(in srgb, #c96442 14%, transparent)", "dark": "color-mix(in srgb, #e08a68 14%, transparent)" }, "--dsw-radius-xs": { "light": "2px", "dark": "2px" }, "--dsw-radius-sm": { "light": "4px", "dark": "4px" }, "--dsw-radius-md": { "light": "6px", "dark": "6px" }, "--dsw-radius-lg": { "light": "8px", "dark": "8px" }, "--dsw-radius-xl": { "light": "12px", "dark": "12px" }, "--dsw-radius-panel": { "light": "16px", "dark": "16px" }, "--dsh-font-family-text": { "light": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif', "dark": 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif' }, "--dsh-font-family-code": { "light": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', "dark": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } } };
var PALETTE_NAMES = ["forest", "mint", "bee", "parchment"];
var FONT_FACE_CSS = "@font-face{font-family:Inter;font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,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)}@font-face{font-family:Inter;font-style:normal;font-weight:500;font-display:swap;src:url(data:font/woff2;base64,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)}@font-face{font-family:Inter;font-style:normal;font-weight:600;font-display:swap;src:url(data:font/woff2;base64,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)}";

// src/client/palette-icons.jsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var GLYPHS = {
  none: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "8", cy: "8", r: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 2a6 6 0 0 1 0 12V2Z", fill: "currentColor", stroke: "none" })
  ] }),
  /** Forest: a two-tier conifer, unmistakable even at 14px. */
  forest: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 1.6 12 6.9H4L8 1.6Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 5.6 13.2 11.6H2.8L8 5.6Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 11.6v2.6" })
  ] }),
  /** Mint: a sprig leaf with its stem, cool and herbal. */
  mint: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M13.5 2.5C13.5 7.2 9.9 11 5.3 11c-1.5 0-2.8-1.2-2.8-2.7C2.5 4.4 7 2.5 13.5 2.5Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12.6 3.4 3.2 12.8" })
  ] }),
  /** Bee: a bee with wings, stripes, and antennae — the skin's literal mascot. */
  bee: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ellipse", { cx: "8", cy: "9.3", rx: "2.8", ry: "3.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "8", cy: "5", r: "1.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M7.1 3.9 6.5 2.6M8.9 3.9 9.5 2.6" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ellipse", { cx: "5.3", cy: "7.1", rx: "2.3", ry: "1.2", transform: "rotate(-32 5.3 7.1)" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ellipse", { cx: "10.7", cy: "7.1", rx: "2.3", ry: "1.2", transform: "rotate(32 10.7 7.1)" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M5.6 8.6h4.8M6.3 10.9h3.4" })
  ] }),
  /** Parchment: a page with a folded corner and two ruled lines. */
  parchment: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9.3 1.9H4.5a1.6 1.6 0 0 0-1.6 1.6v8.9a1.6 1.6 0 0 0 1.6 1.6h7a1.6 1.6 0 0 0 1.6-1.6V5.5L9.3 1.9Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M9.2 2.1v3.4h3.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M5 8.9h4.6M5 11.2h3" })
  ] })
};
function PaletteIcon({ id, size = 14 }) {
  const glyph = GLYPHS[id];
  if (glyph === void 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: glyph
    }
  );
}

// src/client/palette.jsx
var import_react2 = require("react");

// src/client/skin.css
var skin_default = `/* Qoder shell geometry. Selectors use the stable CSS-module local-name suffix:
   the hashed prefix changes per build, the suffix is the source class name. */
[class*="_frame"] > [class*="_centerCol"] { margin: 5px !important; border: none !important; border-radius: 16px !important; overflow: hidden; background: var(--dsw-alias-bg-base) !important; }
html:not([data-platform='darwin']) [class*="_frame"] { background: var(--dsw-specific-sidebar-fill) !important; }
/* macOS paints its sidebar with a translucent tint and two blue-violet washes.
   Those washes stay DeepSeek-blue under every palette, so retint them with the
   palette accent; alphas and the vibrancy underneath stay as official. Original
   colors keep the official washes. */
html[data-platform='darwin'] body[data-dsh-palette] [class*="_sidebarCol"] {
  background:
    linear-gradient(
      to bottom,
      rgb(from var(--dsw-alias-brand-primary) r g b / 0.1),
      rgb(from var(--dsw-alias-brand-primary) r g b / 0) 35%,
      rgb(from var(--dsw-alias-brand-primary) r g b / 0) 68%,
      rgb(from var(--dsw-alias-brand-primary) r g b / 0.09)
    ),
    color-mix(in srgb, var(--dsw-specific-sidebar-fill) 40%, transparent) !important;
}
html[data-platform='darwin'] body[data-dsh-palette][data-ds-dark-theme] [class*="_sidebarCol"] {
  background:
    linear-gradient(
      to bottom,
      rgb(from var(--dsw-alias-brand-primary) r g b / 0.08),
      rgb(from var(--dsw-alias-brand-primary) r g b / 0) 35%,
      rgb(from var(--dsw-alias-brand-primary) r g b / 0) 68%,
      rgb(from var(--dsw-alias-brand-primary) r g b / 0.07)
    ),
    color-mix(in srgb, var(--dsw-specific-sidebar-fill) 50%, transparent) !important;
}
[class*="_frame"] > [class*="_rightbarCol"] { background: transparent !important; }
/* Sidebar geometry and text size follow the app's text-size setting: General
   and the quick menu both write theme.fontSizes.text, which the theme presenter
   publishes as --dsh-content-font-size. Row height and line box derive from the
   same value so the rows stay in proportion at every size. Scope to the sidebar
   root element itself: plain [class*="_root"] also matches inner component
   roots, and [class*="_quietBars"] tracks the pointer (the root drops it while
   the pointer is inside), which retracted these variables on every hover. */
[class*="_sidebarCol"] > div > [class*="_root"]:not([class*="_root_"]) {
  --dpui-sidebar-font-size: var(--dsh-content-font-size, 14px);
  --dpui-sidebar-row-height: max(30px, calc(var(--dpui-sidebar-font-size) + 16px));
  --dpui-sidebar-line-height: calc(var(--dpui-sidebar-font-size) + 7px);
}
/* Qoder's tighter padding and lifted top strip are expanded-only: the rail
   keeps the official 18px/10px padding that the strip's negative margins
   are calibrated against. */
[class*="_sidebarCol"] > div > [class*="_root"]:not([class*="_root_"]):not([class*="_collapsed"]) {
  --dsh-sidebar-inline-padding: 8px;
  padding-top: 0 !important;
}
/* The panel list sits after the scrollable region so Plugins and Automation
   tasks rest directly above the account footer, under a solid separator.
   Expanded-only: the collapsed rail keeps the official order and 12px icon
   rhythm. */
[class*="_sidebarCol"] [class*="_root"]:not([class*="_collapsed"]) [class*="_panelList"] { order: 1 !important; gap: 0 !important; margin-bottom: 4px !important; border-top: 1px solid var(--dsw-alias-border-l2) !important; padding-top: 8px !important; }
[class*="_sidebarCol"] [class*="_root"]:not([class*="_collapsed"]) [class*="_footArea"] { order: 2 !important; }
[class*="_sidebarCol"] [class*="_root"]:not([class*="_collapsed"]) [class*="_panelRow"] { min-height: var(--dpui-sidebar-row-height) !important; height: var(--dpui-sidebar-row-height) !important; margin: 0 !important; padding: 4px 8px !important; border-radius: 8px !important; font-size: var(--dpui-sidebar-font-size) !important; line-height: var(--dpui-sidebar-line-height) !important; }
[class*="_sidebarCol"] [class*="_sectionHeader"] { height: var(--dpui-sidebar-row-height) !important; margin-bottom: 2px !important; font-size: calc(var(--dpui-sidebar-font-size) - 1px) !important; }
[class*="_sidebarCol"] [class*="_projectRow"] { height: var(--dpui-sidebar-row-height) !important; min-height: var(--dpui-sidebar-row-height) !important; font-size: var(--dpui-sidebar-font-size) !important; }
[class*="_sidebarCol"] [class*="_sessionRow"] { height: var(--dpui-sidebar-row-height) !important; min-height: var(--dpui-sidebar-row-height) !important; font-size: var(--dpui-sidebar-font-size) !important; border-radius: 8px !important; }
/* Titles carry their own official 14px rule; both the workspace label and
   its session rows follow the same setting as every other sidebar row. */
[class*="_sidebarCol"] [class*="_projectRow"] [class*="_title"],
[class*="_sidebarCol"] [class*="_sessionRow"] [class*="_title"] { font-size: var(--dpui-sidebar-font-size) !important; line-height: var(--dpui-sidebar-line-height) !important; }
/* The official New Session button keeps its geometry; only its type scales,
   including the \u2318N keycaps that inherit the button's font size. */
[class*="_sidebarCol"] [class*="_root"]:not([class*="_collapsed"]) button[class*="_newSession"] { font-size: var(--dpui-sidebar-font-size) !important; }
[class*="_centerCol"] header[class*="_header"] { padding-left: 24px !important; padding-right: 24px !important; border-bottom: none !important; }
[class*="_composerStack"] [class*="_card"] { background: var(--dsw-alias-bg-layer-1) !important; border-radius: 16px !important; }

/* A-list structural corrections: selected rows use the active fill, and the
   hero's release-stage badge is removed. */
[class*="_sidebarCol"] [class*="_sessionRow"][class*="_selected"],
[class*="_sidebarCol"] [class*="_searchResultRow"][class*="_selected"],
[class*="_sidebarCol"] [class*="_panelRow"][class*="_panelActive"] { background: var(--dsw-alias-interactive-bg-active) !important; }
[class*="_previewBadge"] { display: none !important; }

/* A-list composer controls: the send/stop control is a rounded square, not a
   circle. The theme's own superellipse corner shape stays in effect. */
[class*="_composerStack"] button[class$="_primary"] { border-radius: var(--dsw-radius-sm) !important; }
`;

// plugin-ui-css-module:/Users/tongyi/dsh-plugin-ui/src/client/palette.module.css
var styleId2 = "dsh-plugin-ui-palette";
if (typeof document !== "undefined" && document.getElementById(styleId2) === null) {
  const style = document.createElement("style");
  style.id = styleId2;
  style.textContent = "/* Palette preview row: same row rhythm as the other General rows, with one\n   miniature window per choice so the colors are visible before applying. */\n.dpui-palette-section {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px 0;\n  border-bottom: 0.5px solid var(--dsw-alias-border-l2);\n}\n\n.dpui-palette-head {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.dpui-palette-title {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.dpui-palette-desc {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 18px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.dpui-palette-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.dpui-palette-card {\n  display: flex;\n  flex: 1 1 92px;\n  flex-direction: column;\n  gap: 6px;\n  max-width: 148px;\n  min-width: 92px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  text-align: left;\n  cursor: pointer;\n}\n\n.dpui-palette-preview {\n  display: flex;\n  height: 56px;\n  overflow: hidden;\n  border: 0.5px solid;\n  border-radius: var(--dsw-radius-md);\n}\n\n.dpui-palette-card:hover .dpui-palette-preview {\n  filter: brightness(0.97);\n}\n\n.dpui-palette-cardActive .dpui-palette-preview,\n.dpui-palette-card:focus-visible .dpui-palette-preview {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 1px;\n}\n\n.dpui-palette-side {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  flex: none;\n  width: 32%;\n  padding: 8px 6px;\n  border-right: 0.5px solid;\n}\n\n.dpui-palette-main {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 4px;\n  padding: 8px 6px;\n}\n\n.dpui-palette-accent {\n  width: 20px;\n  height: 6px;\n  border-radius: 3px;\n}\n\n.dpui-palette-line {\n  width: 72%;\n  height: 3px;\n  border-radius: 2px;\n  opacity: 0.8;\n}\n\n.dpui-palette-lineShort {\n  width: 44%;\n  height: 3px;\n  border-radius: 2px;\n  opacity: 0.4;\n}\n\n.dpui-palette-label {\n  overflow: hidden;\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-secondary);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dpui-palette-cardActive .dpui-palette-label {\n  color: var(--dsw-alias-label-primary);\n}\n";
  document.head.append(style);
}
var palette_default = new Proxy({}, { get: (_target, key) => typeof key === "string" ? "dpui-palette-" + key : void 0 });

// src/client/palette.jsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var STORAGE_KEY = "dsh-plugin-ui.palette";
var DEFAULT_PALETTE = "forest";
var SKIN_STYLE_ID = "dsh-plugin-ui-structure";
var FONT_STYLE_ID = "dsh-plugin-ui-fonts";
function storedPalette() {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "none" || PALETTE_NAMES.includes(value) ? value : DEFAULT_PALETTE;
}
function paletteLabel(id, t) {
  return id === "none" ? t("palette.none") : t(`palette.${id}`);
}
function showSkinCss(on) {
  const existing = document.getElementById(SKIN_STYLE_ID);
  if (!on) {
    existing?.remove();
    return;
  }
  if (existing !== null) return;
  const style = document.createElement("style");
  style.id = SKIN_STYLE_ID;
  style.textContent = skin_default;
  document.head.append(style);
}
function installFonts() {
  if (document.getElementById(FONT_STYLE_ID) !== null) return;
  const style = document.createElement("style");
  style.id = FONT_STYLE_ID;
  style.textContent = FONT_FACE_CSS;
  document.head.append(style);
}
function createPaletteController(ctx) {
  let current = storedPalette();
  let layer;
  const listeners = /* @__PURE__ */ new Set();
  const notify = () => {
    for (const listener of listeners) listener();
  };
  const apply2 = (id) => {
    current = id;
    document.body.toggleAttribute("data-dsh-palette", id !== "none");
    showSkinCss(true);
    installFonts();
    layer?.();
    layer = id === "none" ? void 0 : ctx.theme.overrideTokens("dsh-plugin-ui", PALETTE_LAYERS[id]);
  };
  return {
    get: () => current,
    choose(id) {
      if (id !== "none" && !PALETTE_NAMES.includes(id)) return;
      localStorage.setItem(STORAGE_KEY, id);
      apply2(id);
      notify();
    },
    /** @param listener - called after every {@link choose}. @returns the unsubscribe. */
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    install() {
      apply2(current);
      return () => {
        layer?.();
        layer = void 0;
        document.body.removeAttribute("data-dsh-palette");
        showSkinCss(false);
      };
    }
  };
}
var NONE_COLORS = {
  light: { bg: "#fff", side: "#e5e5e5", border: "#e5e5e5", accent: "#4d6bfe", ink: "#141414" },
  dark: { bg: "#171717", side: "#333", border: "#333", accent: "#6b8aff", ink: "#e5e5e5" }
};
function paletteColors(id, scheme) {
  if (id === "none") return NONE_COLORS[scheme];
  const layer = PALETTE_LAYERS[id];
  return {
    bg: layer["--dsw-alias-bg-base"]?.[scheme],
    side: layer["--dsw-alias-border-l2"]?.[scheme],
    border: layer["--dsw-alias-border-l2"]?.[scheme],
    accent: layer["--dsw-alias-brand-primary"]?.[scheme],
    ink: layer["--dsw-alias-label-primary"]?.[scheme]
  };
}
function useColorScheme(ctx) {
  const read = () => ctx.theme.getTheme().active?.colorScheme ?? "light";
  const [scheme, setScheme] = (0, import_react2.useState)(read);
  (0, import_react2.useEffect)(() => {
    const update = () => {
      setScheme(read());
    };
    update();
    const off = ctx.on("theme/change", update);
    return () => {
      off?.();
    };
  }, [ctx]);
  return scheme;
}
function PaletteSettings({ t, controller, ctx }) {
  const [pair, setPair] = (0, import_react2.useState)(() => controller.get());
  const scheme = useColorScheme(ctx);
  (0, import_react2.useEffect)(() => {
    const update = () => {
      setPair(controller.get());
    };
    update();
    return controller.subscribe(update);
  }, [controller]);
  const choose = (id) => {
    controller.choose(id);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: palette_default.section, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: palette_default.head, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: palette_default.title, children: t("palette.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: palette_default.desc, children: t("palette.hint") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: palette_default.grid, role: "radiogroup", "aria-label": t("palette.title"), children: ["none", ...PALETTE_NAMES].map((id) => {
      const colors = paletteColors(id, scheme);
      const active = pair === id;
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": active,
          className: clsx(palette_default.card, active && palette_default.cardActive),
          onClick: () => {
            choose(id);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: palette_default.preview, style: { background: colors.bg, borderColor: colors.border }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: palette_default.side, style: { background: colors.side, borderColor: colors.border }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: palette_default.line, style: { background: colors.ink } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: palette_default.lineShort, style: { background: colors.ink } })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: palette_default.main, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: palette_default.accent, style: { background: colors.accent } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: palette_default.line, style: { background: colors.ink } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: palette_default.lineShort, style: { background: colors.ink } })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: palette_default.label, children: paletteLabel(id, t) })
          ]
        },
        id
      );
    }) })
  ] });
}

// src/client/quick-settings.jsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var SIZE_CHOICES = [[12, "account.sizeSmall"], [14, "account.sizeMedium"], [16, "account.sizeLarge"]];
function quickSettingsView(ctx, palette) {
  const theme = ctx.theme.getTheme();
  return {
    locale: ctx.locale.getSnapshot(),
    preference: theme.preference,
    textSize: theme.fontSizes.text,
    palette: palette?.get()
  };
}
function marked(label, selected) {
  return selected ? `\u2713 ${label}` : label;
}
function quickSettingsItems(view, t) {
  const language = view.locale.locales.map((item) => ({
    id: `locale:${item.id}`,
    label: marked(item.label, item.id === view.locale.active)
  }));
  const modes = [
    { id: "mode:light", label: marked(t("account.themeLight"), view.preference === "light"), icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconLightOutlineMedium, { size: 16 }) },
    { id: "mode:dark", label: marked(t("account.themeDark"), view.preference === "dark"), icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconDarkOutlineMedium, { size: 16 }) },
    { id: "mode:system", label: marked(t("account.themeSystem"), view.preference === "system"), icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconFollowsystemOutlineMedium, { size: 16 }) }
  ];
  const sizes = SIZE_CHOICES.map(([px, key]) => ({
    id: `size:${px}`,
    label: marked(t(key), px === view.textSize)
  }));
  const palettes = ["none", ...PALETTE_NAMES].map((id) => ({
    id: `palette:${id}`,
    label: marked(paletteLabel(id, t), id === view.palette),
    icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PaletteIcon, { id, size: 14 })
  }));
  return [
    { id: "language", label: t("account.language"), icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconGlobeOutlineMedium, { size: 16 }), submenu: language },
    { id: "mode", label: t("account.appearanceMode"), icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconDarkOutlineMedium, { size: 16 }), submenu: modes },
    ...view.palette === void 0 ? [] : [{
      id: "palette",
      label: t("palette.title"),
      icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconSparkleMedium, { size: 16 }),
      submenu: palettes
    }],
    { id: "text-size", label: t("account.textSize"), icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconEnhanceOutlineMedium, { size: 16 }), submenu: sizes },
    {
      id: "all-settings",
      label: t("account.allSettings"),
      icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconSettingsOutlineMedium, { size: 16 })
    }
  ];
}
function applyQuickSetting(ctx, id, palette) {
  if (id.startsWith("mode:")) {
    ctx.theme.setTheme(id.slice("mode:".length));
    return true;
  }
  if (id.startsWith("palette:") && palette !== void 0) {
    palette.choose(id.slice("palette:".length));
    return true;
  }
  const size = /^size:(\d+)$/.exec(id);
  if (size !== null) {
    ctx.theme.setFontSize("text", Number(size[1]));
    return true;
  }
  if (id.startsWith("locale:")) {
    ctx.locale.setLocale(id.slice("locale:".length));
    return true;
  }
  return false;
}

// src/client/quick-actions.js
var import_dsh_client_store = require("@deepseek-ai/dsh-client-store");
var BUILTIN_QUICK_ACTIONS = [
  { id: "settings", labelKey: "account.action.settings" },
  { id: "new-session", labelKey: "account.action.newSession" },
  { id: "plugins", labelKey: "account.action.plugins" },
  { id: "schedules", labelKey: "account.action.schedules" },
  { id: "theme", labelKey: "account.action.theme" },
  { id: "sidebar", labelKey: "account.action.sidebar" },
  { id: "all-settings", labelKey: "account.action.allSettings" }
];
var QUICK_ACTION_SLOT = "pluginUi.quickAction";
var QUICK_ACTIONS_PERSIST = "dsh-plugin-ui.quick-actions.v1";
var DEFAULT_QUICK_ACTIONS = [null, "settings"];
function createQuickActionsStore() {
  return (0, import_dsh_client_store.defineStore)({
    init: () => ({ seats: [...DEFAULT_QUICK_ACTIONS] }),
    persist: QUICK_ACTIONS_PERSIST,
    actions: {
      setSeat: (draft, index, id) => {
        draft.seats[index] = id;
      }
    }
  });
}

// src/client/quick-actions-catalog.jsx
var import_react3 = require("react");
var import_dsh_client_ui_slots = require("@deepseek-ai/dsh-client-ui-slots");
var import_dsh_client_ui_primitives4 = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime5 = require("react/jsx-runtime");
var BUILTIN_ICONS = {
  settings: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives4.IconSettingsOutlineMedium, { size: 14 }),
  "new-session": /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives4.IconNewChatOutlineMedium, { size: 14 }),
  plugins: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives4.IconCordisPluginOutlineMedium, { size: 14 }),
  schedules: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives4.IconClockOutlineMedium, { size: 14 }),
  theme: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives4.IconLightOutlineMedium, { size: 14 }),
  sidebar: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives4.IconPanelLeftOutlineMedium, { size: 14 }),
  "all-settings": /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives4.IconSlidersTwoOutlineMedium, { size: 14 })
};
var BUILTIN_IDS = new Set(BUILTIN_QUICK_ACTIONS.map((action) => action.id));
function builtinQuickActionIcon(id) {
  return BUILTIN_ICONS[id];
}
function externalQuickActions(ctx) {
  return ctx.slots.entriesOfSlot(QUICK_ACTION_SLOT).map(({ options }) => ({
    id: options.id,
    label: options.label ?? options.id,
    order: options.order ?? 0
  })).filter((action) => !BUILTIN_IDS.has(action.id)).sort((a, b) => a.order - b.order);
}
function useQuickActionCatalog(ctx, t) {
  const [external, setExternal] = (0, import_react3.useState)(() => externalQuickActions(ctx));
  (0, import_react3.useEffect)(() => {
    const update = () => {
      setExternal(externalQuickActions(ctx));
    };
    update();
    const off = ctx.slots.subscribe(QUICK_ACTION_SLOT, update);
    return () => {
      off?.();
    };
  }, [ctx]);
  return (0, import_react3.useMemo)(() => [
    ...BUILTIN_QUICK_ACTIONS.map((action) => ({
      id: action.id,
      label: t(action.labelKey),
      builtin: true,
      icon: BUILTIN_ICONS[action.id]
    })),
    ...external.map((action) => ({ ...action, label: (0, import_dsh_client_ui_slots.resolveSlotLabel)(action.label) ?? action.id }))
  ], [external, t]);
}
function quickActionLabel(id, catalog, t) {
  return catalog.find((action) => action.id === id)?.label ?? t("account.emptyChoice");
}

// plugin-ui-css-module:/Users/tongyi/dsh-plugin-ui/src/client/account.module.css
var styleId3 = "dsh-plugin-ui-account";
if (typeof document !== "undefined" && document.getElementById(styleId3) === null) {
  const style = document.createElement("style");
  style.id = styleId3;
  style.textContent = ".dpui-account-root {\n  flex: 1;\n  min-width: 0;\n}\n\n/* Rail: the seat is the 36x36 avatar box. As a shrink-to-fit item in the\n   centered column the trigger overflows a max-content root and the avatar\n   lands half outside the rail; a fixed box keeps it on the official seat. */\n.dpui-account-root:has(.dpui-account-trigger[data-collapsed='true']) {\n  flex: none;\n  width: 36px;\n}\n\n.dpui-account-anchor {\n  width: 100%;\n}\n\n.dpui-account-triggerRow {\n  display: flex;\n  align-items: stretch;\n  gap: 8px;\n  min-width: 0;\n  width: 100%;\n}\n\n.dpui-account-trigger {\n  user-select: none;\n  display: flex;\n  align-items: center;\n  flex: 1;\n  box-sizing: border-box;\n  min-width: 0;\n  height: 44px;\n  gap: 8px;\n  padding: 6px;\n  border: 0;\n  border-radius: var(--dsw-radius-md);\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: var(--dsh-content-font-size, 14px);\n  line-height: calc(var(--dsh-content-font-size, 14px) + 7px);\n  cursor: pointer;\n}\n\n.dpui-account-trigger:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n/* Signed-out launcher keeps the official 32px More row. */\n.dpui-account-trigger[data-signed-out='true']:not([data-collapsed='true']) {\n  height: 32px;\n  padding: 6px 2px 6px 6px;\n  line-height: calc(var(--dsh-content-font-size, 14px) + 6px);\n}\n\n.dpui-account-trigger[data-collapsed='true'] {\n  flex: none;\n  box-sizing: border-box;\n  width: 36px;\n  height: 36px;\n  justify-content: center;\n  gap: 0;\n  padding: 0;\n}\n\n.dpui-account-avatar {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  overflow: hidden;\n  border-radius: 50%;\n  corner-shape: round;\n  background: var(--dsw-alias-bg-skeleton);\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.dpui-account-avatarImage {\n  display: block;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  corner-shape: round;\n  object-fit: cover;\n}\n\n.dpui-account-label {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dpui-account-seats {\n  display: flex;\n  align-items: stretch;\n  flex: none;\n  gap: 2px;\n}\n\n.dpui-account-seat {\n  display: flex;\n  align-items: center;\n  flex: none;\n  box-sizing: border-box;\n  max-width: 30px;\n  overflow: hidden;\n  padding: 0 6px;\n  border: 0;\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font: inherit;\n  font-size: 0.93em;\n  cursor: pointer;\n  transition: max-width 160ms ease, background 120ms ease, color 120ms ease;\n}\n\n.dpui-account-seat:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\n.dpui-account-seatIcon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex: none;\n  width: 18px;\n}\n\n.dpui-account-seatSpacer {\n  flex: none;\n  width: 30px;\n}\n\n/* External slot contribution: the entry renders the button, the cell owns the column. */\n.dpui-account-externalSeat {\n  display: flex;\n  align-items: stretch;\n  justify-content: center;\n  flex: none;\n  width: 30px;\n}\n\n.dpui-account-list {\n  min-width: 236px;\n}\n\n/* Signed-out launcher menu card and rows, matching the official menu. */\n.dpui-account-signedOutMenu[role='menu'] {\n  min-width: 124px;\n  max-width: 280px;\n  padding: 4px;\n}\n\n.dpui-account-signedOutMenu [role='menuitem'] {\n  min-height: 40px;\n  gap: 8px;\n  padding: 8px 10px;\n  border-radius: var(--dsw-radius-md);\n  font-size: 14px;\n  line-height: 22px;\n}\n\n.dpui-account-signedOutMenu [role='menuitem'] > span:first-child:not(:last-child) {\n  width: 16px;\n  height: 16px;\n  color: var(--dsw-alias-menu-icon);\n}\n\n.dpui-account-signedOutMenu [role='menuitem'] > span:first-child:not(:last-child) svg {\n  width: 16px;\n  height: 16px;\n}\n\n.dpui-account-dialog {\n  width: min(420px, calc(100vw - 32px));\n  padding: 0;\n}\n\n.dpui-account-dialogContent {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 20px 20px 12px;\n}\n\n.dpui-account-dialogHeader {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n}\n\n.dpui-account-dialogTitle {\n  margin: 0;\n  color: var(--dsw-alias-label-primary);\n  font-size: 16px;\n  line-height: 24px;\n  font-weight: 500;\n}\n\n.dpui-account-dialogClose {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\n.dpui-account-dialogClose:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dpui-account-dialogDescription {\n  margin: 0;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.dpui-account-dialogActions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  padding: 12px 20px 20px;\n}\n\n.dpui-account-secondaryButton,\n.dpui-account-primaryButton {\n  min-width: 88px;\n}\n\n.dpui-account-link {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--dsw-alias-brand-primary);\n  font: inherit;\n  cursor: pointer;\n}\n\n.dpui-account-link:hover {\n  text-decoration: underline;\n}\n\n.dpui-account-spinner {\n  animation: dpui-spin 1s linear infinite;\n}\n\n@keyframes dpui-spin {\n  to { transform: rotate(360deg); }\n}\n";
  document.head.append(style);
}
var account_default = new Proxy({}, { get: (_target, key) => typeof key === "string" ? "dpui-account-" + key : void 0 });

// src/client/account.jsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function createAccountStore(ctx) {
  let snapshot = { view: void 0, profile: void 0, failed: false };
  let revision = 0;
  let disposed = false;
  const listeners = /* @__PURE__ */ new Set();
  const publish = (next) => {
    snapshot = next;
    for (const listener of listeners) listener();
  };
  const client = () => ({
    version: "0.1.0",
    locale: ctx.locale.getSnapshot().active,
    timezoneOffsetSeconds: -(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60
  });
  const refresh = async () => {
    if (snapshot.view?.status !== "credential-stored") return;
    const generation = revision;
    try {
      const result = await ctx.remote.account.getProfile(client());
      if (disposed || generation !== revision) return;
      if (result.ok) publish({ ...snapshot, profile: result.value });
    } catch {
    }
  };
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    refresh,
    start() {
      const stream = ctx.remote.$stream({
        name: "account",
        open: (signal) => ctx.remote.account.watch(signal),
        ended: () => new Error("account stream ended")
      });
      ctx.effect(() => () => {
        disposed = true;
        return stream.dispose();
      }, "dsh-plugin-ui: account stream");
      void (async () => {
        for await (const frame of stream) {
          revision += 1;
          publish({ view: frame.value, profile: void 0, failed: false });
          frame.accept();
          void refresh();
        }
      })().catch(() => {
        if (!disposed) publish({ ...snapshot, failed: true });
      });
    },
    async signIn() {
      const transport = globalThis.__DSH_TRANSPORT__;
      const origin = transport?.streamBaseUrl !== void 0 ? new URL(transport.streamBaseUrl).origin : window.location.origin;
      const result = await ctx.remote.account.startSignIn(client(), origin, "desktop");
      if (!result.ok) throw new Error("account start failed");
    },
    async cancelSignIn(id) {
      const result = await ctx.remote.account.cancelSignIn(id);
      if (!result.ok) throw new Error("account cancel failed");
    },
    async hasRunningTasks() {
      const result = await ctx.remote.account.hasRunningAccountTasks();
      if (!result.ok) throw new Error("account task query failed");
      return result.value;
    },
    async signOut() {
      const result = await ctx.remote.account.signOut(client());
      if (!result.ok) throw new Error("account sign out failed");
    }
  };
}
function useSnapshot(store) {
  return (0, import_react4.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
function useQuickView(ctx, palette) {
  const [view, setView] = (0, import_react4.useState)(() => quickSettingsView(ctx, palette));
  (0, import_react4.useEffect)(() => {
    const update = () => {
      setView(quickSettingsView(ctx, palette));
    };
    update();
    const offTheme = ctx.on("theme/change", update);
    const offLocale = ctx.locale.subscribe(update);
    const offPalette = palette?.subscribe(update);
    return () => {
      offTheme?.();
      offLocale?.();
      offPalette?.();
    };
  }, [ctx, palette]);
  return view;
}
function Avatar({ url }) {
  const [failed, setFailed] = (0, import_react4.useState)(false);
  (0, import_react4.useEffect)(() => {
    setFailed(false);
  }, [url]);
  if (url !== void 0 && url !== null && url !== "" && !failed) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("img", { className: account_default.avatarImage, src: url, alt: "", onError: () => {
      setFailed(true);
    } });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconUserOutlineMedium, { size: 16 });
}
function LogoutIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { width: 16, height: 16, position: "relative" }, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "svg",
    {
      style: { position: "absolute", left: 1.168, top: 1.214 },
      width: "13.664",
      height: "13.571",
      viewBox: "0 0 14 14",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M3.9961 1.40039C3.37842 1.40039 2.96028 1.40039 2.63867 1.42871C2.32631 1.45627 2.17171 1.50666 2.06641 1.56543C1.85606 1.68288 1.68189 1.85605 1.56446 2.06641C1.50569 2.17173 1.45625 2.32627 1.42871 2.63867C1.40036 2.9603 1.39942 3.37827 1.39942 3.9961L1.39942 9.5752C1.39942 10.193 1.40036 10.611 1.42871 10.9326C1.45625 11.245 1.50569 11.3996 1.56445 11.5049C1.68188 11.7153 1.85605 11.8884 2.06641 12.0059C2.17171 12.0646 2.32631 12.115 2.63867 12.1426C2.96028 12.1709 3.37842 12.1709 3.9961 12.1709V13.5713C3.4033 13.5713 2.91297 13.5721 2.51563 13.5371C2.10906 13.5013 1.73277 13.4233 1.38379 13.2285C0.946838 12.9845 0.585697 12.6235 0.341799 12.1865C0.14725 11.8377 0.0700118 11.4621 0.0341815 11.0557C-0.000847399 10.6583 1.58129e-06 10.1681 1.85029e-06 9.5752L2.09416e-06 3.9961C1.83027e-06 3.40325 -0.000846367 2.91297 0.0341818 2.51563C0.0700164 2.10924 0.147239 1.73362 0.341799 1.38477C0.585703 0.947758 0.946825 0.586744 1.38379 0.342775C1.73277 0.148001 2.10906 0.0700381 2.51563 0.0341813C2.91297 -0.000823893 3.40331 1.37805e-06 3.9961 1.71712e-06L3.9961 1.40039Z", fill: "currentColor" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M13.6426 6.51953C13.6705 6.6957 13.6705 6.8756 13.6426 7.05176C13.5902 7.38188 13.4302 7.64112 13.2539 7.86035C13.0857 8.06937 12.8546 8.29971 12.6006 8.55371L9.3086 11.8447L8.31836 10.8545L11.6104 7.56348C11.637 7.53681 11.6628 7.51104 11.6875 7.48633H3.74317V6.08594H11.6885C11.6635 6.06088 11.6374 6.03487 11.6104 6.00781L8.31836 2.7168L9.3086 1.72656L12.6006 5.01758C12.8547 5.27169 13.0857 5.50185 13.2539 5.71094C13.4303 5.93018 13.5902 6.18939 13.6426 6.51953Z", fill: "currentColor" })
      ]
    }
  ) });
}
function QuickActionSeat({ seat, t, view, onQuickSelect, onAllSettings, onBuiltin, renderSlot }) {
  const [open, setOpen] = (0, import_react4.useState)(false);
  if (seat === null || seat === void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: account_default.seatSpacer, "aria-hidden": "true" });
  }
  if (seat === "settings") {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_dsh_client_ui_primitives5.Menu,
      {
        open,
        side: "top",
        align: "end",
        portal: true,
        autoFocus: true,
        listClassName: account_default.list,
        items: quickSettingsItems(view, t),
        onClose: () => {
          setOpen(false);
        },
        onSelect: (id) => {
          if (id === "all-settings") {
            setOpen(false);
            onAllSettings();
          } else onQuickSelect(id);
        },
        anchor: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "button",
          {
            type: "button",
            className: account_default.seat,
            "aria-label": t("account.settingsAction"),
            "aria-haspopup": "menu",
            "aria-expanded": open,
            onClick: () => {
              setOpen((value) => !value);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: account_default.seatIcon, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconSettingsOutlineMedium, { size: 14 }) })
          }
        )
      }
    );
  }
  const builtin = BUILTIN_QUICK_ACTIONS.find((action) => action.id === seat);
  if (builtin !== void 0) {
    const label = t(builtin.labelKey);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.Tooltip, { label, side: "top", align: "end", delayMs: 500, portal: true, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: account_default.seat, "aria-label": label, onClick: () => {
      onBuiltin(seat);
    }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: account_default.seatIcon, children: builtinQuickActionIcon(seat) }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: account_default.externalSeat, "data-quick-action": seat, children: renderSlot?.(QUICK_ACTION_SLOT, { size: 14 }, { only: seat }) });
}
function QuickActionsRow({ seats, ...seatProps }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: account_default.seats, children: seats.map((seat, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(QuickActionSeat, { seat, ...seatProps }, index)) });
}
function SignInDialog({ t, account, store, close }) {
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [failed, setFailed] = (0, import_react4.useState)(false);
  const [copyResult, setCopyResult] = (0, import_react4.useState)(null);
  const attempt = account.view?.attempt;
  const phase = attempt?.phase;
  const active = busy || phase === "initializing" || phase === "waiting-browser" || phase === "exchanging" || phase === "committing";
  const waiting = active && !failed;
  const expired = phase === "expired";
  const error = failed || phase === "failed";
  (0, import_react4.useEffect)(() => {
    setCopyResult(null);
  }, [attempt?.id, attempt?.authorizeUrl]);
  (0, import_react4.useEffect)(() => {
    if (copyResult === null) return;
    const timer = setTimeout(() => {
      setCopyResult(null);
    }, 2e3);
    return () => {
      clearTimeout(timer);
    };
  }, [copyResult]);
  (0, import_react4.useEffect)(() => {
    if (account.view?.status === "credential-stored") close();
  }, [account.view?.status, close]);
  const run = async (action) => {
    setBusy(true);
    setFailed(false);
    try {
      await action();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };
  const dismiss = () => {
    if (busy || phase === "committing") return;
    if (active && attempt !== void 0) void run(async () => {
      await store.cancelSignIn(attempt.id);
      close();
    });
    else close();
  };
  const retry = async () => {
    if (active && attempt !== void 0) await store.cancelSignIn(attempt.id);
    await store.signIn();
  };
  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyResult(t("account.copied"));
    } catch {
      setCopyResult(t("account.copyFailed"));
    }
  };
  const title = error ? t("account.failed") : active ? t("account.waitingTitle") : expired ? t("account.expired") : t("account.signInTitle");
  const authorizeUrl = attempt?.authorizeUrl;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_dsh_client_ui_primitives5.Modal, { open: true, headless: true, title, onClose: dismiss, className: account_default.dialog, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: account_default.dialogContent, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: account_default.dialogHeader, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { className: account_default.dialogTitle, children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: account_default.dialogClose, "aria-label": t("account.close"), onClick: dismiss, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconCloseOutlineRegular, { size: 14 }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: account_default.dialogDescription, children: waiting ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        t("account.waiting"),
        authorizeUrl !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              type: "button",
              className: account_default.link,
              onClick: () => {
                void copyLink(authorizeUrl);
              },
              children: copyResult ?? t("account.copyLink")
            }
          )
        ] })
      ] }) : error ? t("account.failed") : expired ? t("account.expired") : t("account.signInDescription") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: account_default.dialogActions, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        import_dsh_client_ui_primitives5.Button,
        {
          variant: "outline",
          className: account_default.secondaryButton,
          disabled: busy || phase === "committing",
          onClick: dismiss,
          children: t("account.cancel")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        import_dsh_client_ui_primitives5.Button,
        {
          variant: "primary",
          className: account_default.primaryButton,
          disabled: busy || phase === "committing" || waiting,
          onClick: () => {
            void run(retry);
          },
          children: waiting ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconLoadingOutlineRegular, { className: account_default.spinner }) : t(error || expired ? "account.retry" : "account.signIn")
        }
      )
    ] })
  ] });
}
function SignOutDialog({ t, running, busy, close, confirm }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_dsh_client_ui_primitives5.Modal, { open: true, headless: true, title: t("account.signOutTitle"), onClose: close, className: account_default.dialog, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: account_default.dialogContent, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: account_default.dialogHeader, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { className: account_default.dialogTitle, children: t("account.signOutTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: account_default.dialogClose, "aria-label": t("account.close"), onClick: close, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconCloseOutlineRegular, { size: 14 }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: account_default.dialogDescription, children: running === "unknown" ? t("account.signOutUnknown") : running ? t("account.signOutRunning") : t("account.signOutDescription") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: account_default.dialogActions, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.Button, { variant: "outline", className: account_default.secondaryButton, disabled: busy, onClick: close, children: t("account.cancel") }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        import_dsh_client_ui_primitives5.Button,
        {
          variant: "primary",
          className: account_default.primaryButton,
          disabled: busy,
          onClick: () => {
            void confirm();
          },
          children: t("account.signOut")
        }
      )
    ] })
  ] });
}
function AccountMenu({
  t,
  ctx,
  useStore,
  actions,
  wide,
  settingsShortcut,
  openSettings,
  accountStore,
  settingsOpen,
  uiWorkspace,
  layout,
  palette,
  renderSlot
}) {
  const seats = useStore((state) => state.seats);
  const account = useSnapshot(accountStore);
  const view = useQuickView(ctx, palette);
  const anchor = (0, import_react4.useRef)(null);
  const trigger = (0, import_react4.useRef)(null);
  const [open, setOpen] = (0, import_react4.useState)(false);
  const [loginVisible, setLoginVisible] = (0, import_react4.useState)(false);
  const [signOutState, setSignOutState] = (0, import_react4.useState)(void 0);
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const signedIn = account.view?.status === "credential-stored";
  const profile = account.profile;
  const name = profile?.status === "ready" ? profile.value.name ?? profile.value.contact ?? null : null;
  const label = signedIn ? profile === void 0 ? null : name ?? t("account.signedIn") : t("account.more");
  const settingsWasOpen = (0, import_react4.useRef)(false);
  (0, import_react4.useEffect)(() => {
    if (settingsOpen && !settingsWasOpen.current) void accountStore.refresh();
    settingsWasOpen.current = settingsOpen;
  }, [accountStore, settingsOpen]);
  const quickSelect = (id) => {
    applyQuickSetting(ctx, id, palette);
  };
  const openSettingsPage = () => {
    setOpen(false);
    queueMicrotask(() => {
      trigger.current?.focus({ preventScroll: true });
    });
    openSettings();
  };
  const runBuiltin = (id) => {
    if (id === "new-session") {
      uiWorkspace?.startSession();
      return;
    }
    if (id === "plugins") {
      layout?.selectPanel("plugins");
      return;
    }
    if (id === "schedules") {
      layout?.selectPanel("schedules");
      return;
    }
    if (id === "theme") {
      const scheme = ctx.theme.getTheme().active.colorScheme;
      ctx.theme.setTheme(scheme === "dark" ? "light" : "dark");
      return;
    }
    if (id === "sidebar") {
      layout?.toggleSidebar();
      return;
    }
    if (id === "all-settings") openSettingsPage();
  };
  const requestSignOut = async () => {
    setOpen(false);
    setBusy(true);
    try {
      const running = await accountStore.hasRunningTasks();
      if (!running) {
        await accountStore.signOut();
        return;
      }
      setSignOutState(true);
    } catch {
      setSignOutState("unknown");
    } finally {
      setBusy(false);
    }
  };
  const confirmSignOut = async () => {
    setBusy(true);
    try {
      await accountStore.signOut();
      setSignOutState(void 0);
    } catch {
      setSignOutState("unknown");
    } finally {
      setBusy(false);
    }
  };
  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const contactUs = () => {
    const config = globalThis.__DSH_CONTACT_CONFIG__;
    openLink(config?.contactFormUrl ?? "https://github.com/deepseek-ai/deepseek-harness/issues/new/choose");
  };
  const items = [
    {
      id: "settings",
      label: t("account.settings"),
      icon: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconSettingsOutlineMedium, { size: 16 }),
      ...settingsShortcut === void 0 ? {} : { shortcut: settingsShortcut }
    },
    { id: "contact", label: t("account.contact"), icon: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconPaperPlaneOutlineMedium, { size: 16 }) },
    ...signedIn ? [{ id: "signout", label: t("account.signOut"), icon: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(LogoutIcon, {}), disabled: busy }] : [{ id: "signin", label: t("account.signIn"), icon: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconUserOutlineMedium, { size: 16 }) }]
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { ref: anchor, className: account_default.root, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_dsh_client_ui_primitives5.Menu,
      {
        open,
        side: "top",
        portal: true,
        autoFocus: true,
        className: account_default.anchor,
        listClassName: signedIn ? void 0 : account_default.signedOutMenu,
        anchor: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: account_default.triggerRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "button",
            {
              ref: trigger,
              type: "button",
              className: account_default.trigger,
              "data-collapsed": !wide,
              "data-signed-out": !signedIn,
              "aria-label": t("account.menu"),
              "aria-haspopup": "menu",
              "aria-expanded": open,
              onClick: () => {
                setOpen((value) => !value);
              },
              children: [
                signedIn ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: account_default.avatar, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Avatar, { url: profile?.status === "ready" ? profile.value.avatarUrl : null }) }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives5.IconEllipsisOutlineMedium, { size: 14 }),
                wide && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: account_default.label, children: label })
              ]
            }
          ),
          wide && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            QuickActionsRow,
            {
              seats,
              t,
              view,
              renderSlot,
              onQuickSelect: quickSelect,
              onAllSettings: openSettingsPage,
              onBuiltin: runBuiltin
            }
          )
        ] }),
        items,
        onClose: () => {
          setOpen(false);
        },
        onSelect: (id) => {
          if (id === "settings") openSettingsPage();
          else if (id === "contact") {
            setOpen(false);
            contactUs();
          } else if (id === "signin") {
            setOpen(false);
            setLoginVisible(true);
            void accountStore.signIn().catch(() => void 0);
          } else if (id === "signout") void requestSignOut();
        }
      }
    ),
    loginVisible && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SignInDialog, { t, account, store: accountStore, close: () => {
      setLoginVisible(false);
    } }),
    signOutState !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      SignOutDialog,
      {
        t,
        running: signOutState,
        busy,
        close: () => {
          setSignOutState(void 0);
        },
        confirm: confirmSignOut
      }
    )
  ] });
}

// src/client/quick-actions-settings.jsx
var import_react5 = require("react");
var import_dsh_client_ui_primitives6 = require("@deepseek-ai/dsh-client-ui-primitives");

// plugin-ui-css-module:/Users/tongyi/dsh-plugin-ui/src/client/quick-actions-settings.module.css
var styleId4 = "dsh-plugin-ui-quick-actions-settings";
if (typeof document !== "undefined" && document.getElementById(styleId4) === null) {
  const style = document.createElement("style");
  style.id = styleId4;
  style.textContent = "/* Quick-action seat row: the same two-column rhythm and pill as the other General rows. */\n.dpui-quick-actions-settings-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 16px 0;\n  border-bottom: 0.5px solid var(--dsw-alias-border-l2);\n}\n\n.dpui-quick-actions-settings-rowText {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding-right: 48px;\n}\n\n.dpui-quick-actions-settings-title {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.dpui-quick-actions-settings-desc {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 18px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.dpui-quick-actions-settings-selector {\n  display: inline-flex;\n  align-items: center;\n  gap: 12px;\n  height: 36px;\n  padding: 0 14px;\n  border: none;\n  border-radius: var(--dsw-radius-xl);\n  background: var(--dsw-alias-bg-module-platform);\n  font: inherit;\n  font-size: 14px;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n}\n\n.dpui-quick-actions-settings-selector:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dpui-quick-actions-settings-chevron {\n  flex: none;\n}\n";
  document.head.append(style);
}
var quick_actions_settings_default = new Proxy({}, { get: (_target, key) => typeof key === "string" ? "dpui-quick-actions-settings-" + key : void 0 });

// src/client/quick-actions-settings.jsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function SeatRow({ seat, title, description, items, labelFor, onSelect }) {
  const [open, setOpen] = (0, import_react5.useState)(false);
  const pill = (0, import_react5.useRef)(null);
  const chosen = (id) => {
    pill.current?.focus({ preventScroll: true });
    setOpen(false);
    onSelect(id === "" ? null : id);
  };
  const anchor = /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "button",
    {
      ref: pill,
      type: "button",
      className: quick_actions_settings_default.selector,
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: () => {
        setOpen((value) => !value);
      },
      children: [
        labelFor(seat),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_dsh_client_ui_primitives6.IconChevronDownOutlineRegular, { className: quick_actions_settings_default.chevron })
      ]
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: quick_actions_settings_default.row, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: quick_actions_settings_default.rowText, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: quick_actions_settings_default.title, children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: quick_actions_settings_default.desc, children: description })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      import_dsh_client_ui_primitives6.Menu,
      {
        open,
        onClose: () => {
          setOpen(false);
        },
        align: "end",
        portal: true,
        items,
        onSelect: chosen,
        anchor
      }
    )
  ] });
}
function QuickActionsSettings({ t, useStore, actions, ctx }) {
  const seats = useStore((state) => state.seats);
  const catalog = useQuickActionCatalog(ctx, t);
  const items = (0, import_react5.useMemo)(() => {
    const builtins = catalog.filter((action) => action.builtin);
    const external = catalog.filter((action) => !action.builtin);
    return [
      ...builtins.map((action) => ({ id: action.id, label: action.label })),
      ...external.length === 0 ? [] : [
        { type: "label", id: "account.quickActionExternal", text: t("account.quickActionExternal") },
        ...external.map((action) => ({ id: action.id, label: action.label }))
      ],
      { id: "", label: t("account.emptyChoice") }
    ];
  }, [catalog, t]);
  const labelFor = (seat) => seat === null ? t("account.emptyChoice") : quickActionLabel(seat, catalog, t);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_jsx_runtime7.Fragment, { children: seats.map((seat, index) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    SeatRow,
    {
      seat: seat ?? null,
      title: t("account.quickActionSeat", { index: index + 1 }),
      description: t("account.quickActionSeatDescription", { index: index + 1 }),
      items,
      labelFor,
      onSelect: (next) => {
        actions.setSeat(index === 0 ? 0 : 1, next);
      }
    },
    index
  )) });
}

// src/client/locales.js
var zh = {
  "account.menu": "\u8D26\u53F7\u83DC\u5355",
  "account.signedIn": "\u5DF2\u767B\u5F55 DeepSeek",
  "account.more": "\u66F4\u591A",
  "account.settings": "\u8BBE\u7F6E",
  "account.contact": "\u8054\u7CFB\u6211\u4EEC",
  "account.signIn": "\u767B\u5F55",
  "account.signOut": "\u9000\u51FA\u767B\u5F55",
  "account.signInTitle": "\u5F00\u59CB\u4F7F\u7528",
  "account.signInDescription": "\u767B\u5F55 DeepSeek \u8D26\u53F7\uFF0C\u5373\u53EF\u5F00\u59CB\u4F7F\u7528\u3002\u4F60\u7684\u9879\u76EE\u548C\u6587\u4EF6\u4FDD\u5B58\u5728\u672C\u5730\u3002",
  "account.waitingTitle": "\u7B49\u5F85\u767B\u5F55",
  "account.waiting": "\u8BF7\u5728\u6D4F\u89C8\u5668\u4E2D\u7EE7\u7EED\u5B8C\u6210\u767B\u5F55",
  "account.copyLink": "\u590D\u5236\u767B\u5F55\u94FE\u63A5",
  "account.copied": "\u94FE\u63A5\u5DF2\u590D\u5236",
  "account.copyFailed": "\u590D\u5236\u5931\u8D25",
  "account.cancel": "\u53D6\u6D88",
  "account.close": "\u5173\u95ED",
  "account.retry": "\u91CD\u65B0\u767B\u5F55",
  "account.expired": "\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "account.failed": "\u64CD\u4F5C\u672A\u5B8C\u6210\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "account.noResponse": "\u64CD\u4F5C\u672A\u5B8C\u6210\uFF0C\u53EF\u80FD\u662F\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u72B6\u51B5\u540E\u91CD\u8BD5",
  "account.signOutTitle": "\u9000\u51FA\u767B\u5F55",
  "account.signOutDescription": "\u9000\u51FA\u767B\u5F55\u4E0D\u4F1A\u4E22\u5931\u4EFB\u4F55\u6570\u636E\uFF0C\u4F60\u4ECD\u53EF\u4EE5\u767B\u5F55\u6B64\u8D26\u53F7\u3002",
  "account.signOutRunning": "\u5F53\u524D\u6709\u4EFB\u52A1\u6B63\u5728\u6267\u884C\uFF0C\u9000\u51FA\u767B\u5F55\u4F1A\u4E2D\u65AD\u8FD9\u4E9B\u4EFB\u52A1\u3002\u662F\u5426\u7EE7\u7EED\uFF1F",
  "account.signOutUnknown": "\u6682\u65F6\u65E0\u6CD5\u786E\u8BA4\u4EFB\u52A1\u72B6\u6001\uFF0C\u9000\u51FA\u767B\u5F55\u53EF\u80FD\u4F1A\u4E2D\u65AD\u4F7F\u7528\u6B64\u8D26\u53F7\u7684\u4EFB\u52A1\u3002\u662F\u5426\u7EE7\u7EED\uFF1F",
  "account.quickActionSeat": "\u5FEB\u6377\u64CD\u4F5C\u4F4D\u7F6E {index}",
  "account.quickActionSeatDescription": "\u4FA7\u680F\u8D26\u53F7\u884C\u4E0A\u7684\u7B2C {index} \u4E2A\u6309\u94AE\uFF1B\u53EF\u9009\u5185\u7F6E\u52A8\u4F5C\u3001\u5DF2\u5B89\u88C5\u63D2\u4EF6\u63D0\u4F9B\u7684\u52A8\u4F5C\uFF0C\u6216\u7559\u7A7A\u3002",
  "account.quickActionExternal": "\u63D2\u4EF6\u63D0\u4F9B\u7684\u52A8\u4F5C",
  "account.action.settings": "\u5FEB\u6377\u8BBE\u7F6E",
  "account.action.newSession": "\u65B0\u5EFA\u4F1A\u8BDD",
  "account.action.plugins": "\u63D2\u4EF6",
  "account.action.schedules": "\u81EA\u52A8\u5316\u4EFB\u52A1",
  "account.action.theme": "\u5207\u6362\u660E\u6697",
  "account.action.sidebar": "\u6536\u8D77\u4FA7\u680F",
  "account.action.allSettings": "\u5168\u90E8\u8BBE\u7F6E\u2026",
  "account.emptyChoice": "\u7A7A",
  "account.settingsAction": "\u5FEB\u6377\u8BBE\u7F6E",
  "account.language": "\u8BED\u8A00",
  "account.appearanceMode": "\u660E\u6697\u6A21\u5F0F",
  "account.themeLight": "\u6D45\u8272",
  "account.themeDark": "\u6DF1\u8272",
  "account.themeSystem": "\u8DDF\u968F\u7CFB\u7EDF",
  "account.textSize": "\u6587\u5B57\u5927\u5C0F",
  "account.sizeSmall": "\u5C0F",
  "account.sizeMedium": "\u4E2D",
  "account.sizeLarge": "\u5927",
  "account.allSettings": "\u5168\u90E8\u8BBE\u7F6E\u2026",
  "account.quickActionsTitle": "\u8D26\u53F7\u884C\u5FEB\u6377\u64CD\u4F5C",
  "palette.title": "\u76AE\u80A4\u914D\u8272",
  "palette.hint": "\u53EA\u66FF\u6362\u989C\u8272\uFF1B\u5E03\u5C40\u4E0E\u7EC4\u4EF6\u4FDD\u6301\u63D2\u4EF6\u8BBE\u8BA1\uFF0C\u660E\u6697\u4ECD\u8DDF\u968F\u5E94\u7528\u5F53\u524D\u7684\u6D45\u8272/\u6DF1\u8272",
  "palette.none": "\u539F\u8272",
  "palette.forest": "\u68EE\u6797",
  "palette.mint": "\u8584\u8377",
  "palette.bee": "\u871C\u9EC4",
  "palette.parchment": "\u7F8A\u76AE"
};
var en = {
  "account.menu": "Account menu",
  "account.signedIn": "Signed in to DeepSeek",
  "account.more": "More",
  "account.settings": "Settings",
  "account.contact": "Contact us",
  "account.signIn": "Sign in",
  "account.signOut": "Sign out",
  "account.signInTitle": "Get started",
  "account.signInDescription": "Sign in to your DeepSeek account to get started. Your projects and files are stored locally.",
  "account.waitingTitle": "Waiting for sign in",
  "account.waiting": "Continue in your browser",
  "account.copyLink": "Copy sign-in link",
  "account.copied": "Link copied",
  "account.copyFailed": "Copy failed",
  "account.cancel": "Cancel",
  "account.close": "Close",
  "account.retry": "Sign in again",
  "account.expired": "Sign in expired. Try again.",
  "account.failed": "Could not complete the operation. Try again.",
  "account.noResponse": "Something went wrong. Check your network connection and try again.",
  "account.signOutTitle": "Sign out",
  "account.signOutDescription": "Signing out will not delete any data. You can sign in to this account again.",
  "account.signOutRunning": "Tasks are currently running. Signing out will interrupt them. Sign out now?",
  "account.signOutUnknown": "Could not check running tasks. Signing out may interrupt tasks using this account. Sign out now?",
  "account.quickActionSeat": "Quick action slot {index}",
  "account.quickActionSeatDescription": "The button in position {index} of the sidebar account row. Pick a built-in action, one contributed by an installed plugin, or leave it empty.",
  "account.quickActionExternal": "From installed plugins",
  "account.action.settings": "Quick settings",
  "account.action.newSession": "New session",
  "account.action.plugins": "Plugins",
  "account.action.schedules": "Automation tasks",
  "account.action.theme": "Toggle light/dark",
  "account.action.sidebar": "Toggle sidebar",
  "account.action.allSettings": "All settings\u2026",
  "account.emptyChoice": "Empty",
  "account.settingsAction": "Quick settings",
  "account.language": "Language",
  "account.appearanceMode": "Color mode",
  "account.themeLight": "Light",
  "account.themeDark": "Dark",
  "account.themeSystem": "System",
  "account.textSize": "Text size",
  "account.sizeSmall": "Small",
  "account.sizeMedium": "Medium",
  "account.sizeLarge": "Large",
  "account.allSettings": "All settings\u2026",
  "account.quickActionsTitle": "Account row quick actions",
  "palette.title": "Skin palette",
  "palette.hint": "Colors only; layout and components keep the plugin design, while light or dark follows the app",
  "palette.none": "Original colors",
  "palette.forest": "Forest",
  "palette.mint": "Mint",
  "palette.bee": "Bee",
  "palette.parchment": "Parchment"
};
var modelZh = {
  "provider.account": "DeepSeek \u8D26\u53F7",
  "trigger.fallback": "\u8BF7\u9009\u62E9\u6A21\u578B",
  "trigger.loading": "\u6B63\u5728\u52A0\u8F7D\u6A21\u578B\u2026",
  "trigger.selectAria": "\u8BF7\u9009\u62E9\u6A21\u578B",
  "trigger.aria": "\u9009\u62E9\u6A21\u578B\uFF0C\u5F53\u524D {model}",
  "trigger.ariaEffort": "\u9009\u62E9\u6A21\u578B\uFF0C\u5F53\u524D {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}",
  "menu.aria": "\u6A21\u578B\u4E0E\u63A8\u7406\u7B49\u7EA7",
  "menu.model": "\u6A21\u578B",
  "menu.effort": "\u63A8\u7406\u7B49\u7EA7",
  "effort.providerDefault": "\u9ED8\u8BA4",
  "effort.off": "\u5173\u95ED",
  "effort.none": "\u65E0",
  "effort.minimal": "\u6700\u4F4E",
  "effort.low": "\u4F4E",
  "effort.medium": "\u4E2D",
  "effort.high": "\u9AD8",
  "effort.max": "\u6700\u9AD8",
  "effort.hint.off": "\u4E0D\u8FDB\u884C\u63A8\u7406",
  "effort.hint.none": "\u4E0D\u8FDB\u884C\u63A8\u7406",
  "effort.hint.minimal": "\u6700\u4F4E\u9650\u5EA6\u7684\u63A8\u7406",
  "effort.hint.low": "\u66F4\u5FEB\u54CD\u5E94\uFF0C\u9002\u5408\u7B80\u5355\u4EFB\u52A1",
  "effort.hint.medium": "\u517C\u987E\u901F\u5EA6\u4E0E\u6DF1\u5EA6",
  "effort.hint.high": "\u9002\u5408\u5927\u591A\u6570\u4EFB\u52A1\u7684\u9ED8\u8BA4\u5E73\u8861\u6863",
  "effort.hint.max": "\u5C3D\u53EF\u80FD\u6DF1\u5165\u63A8\u7406",
  "status.loading": "\u6B63\u5728\u5237\u65B0\u6A21\u578B\u5217\u8868\u2026",
  "error.action": "\u6A21\u578B\u64CD\u4F5C\u5931\u8D25\uFF1A{message}",
  "error.sessionInUse": "\u5F53\u524D\u4F1A\u8BDD\u5DF2\u88AB\u5360\u7528\uFF0C\u53EF\u80FD\u662F\u5176\u4ED6\u6B63\u5728\u8FD0\u884C\u7684 DSH \u5BFC\u81F4\u7684\uFF08\u5982\u5176\u4ED6 dsh web\u3001\u684C\u9762\u7AEF\uFF09\uFF0C\u8BF7\u9000\u51FA\u5176\u4ED6\u6B63\u5728\u8FD0\u884C\u7684 DSH \u540E\u91CD\u8BD5\u3002",
  "action.reload": "\u91CD\u65B0\u52A0\u8F7D",
  "retry": "\u91CD\u8BD5",
  "warning.groupLoad": "{name} \u52A0\u8F7D\u5931\u8D25\uFF1A{message}",
  "search.placeholder": "\u641C\u7D22\u6A21\u578B\u2026",
  "search.clear": "\u6E05\u9664\u641C\u7D22",
  "search.empty": "\u6CA1\u6709\u5339\u914D\u7684\u6A21\u578B\u3002",
  "empty.models": "\u6682\u65E0\u53EF\u7528\u6A21\u578B"
};
var modelEn = {
  "provider.account": "DeepSeek Account",
  "trigger.fallback": "Select model",
  "trigger.loading": "Loading models\u2026",
  "trigger.selectAria": "Select model",
  "trigger.aria": "Select model, current {model}",
  "trigger.ariaEffort": "Select model, current {model}, reasoning effort {effort}",
  "menu.aria": "Model and reasoning effort",
  "menu.model": "Model",
  "menu.effort": "Effort",
  "effort.providerDefault": "Default",
  "effort.off": "Off",
  "effort.none": "None",
  "effort.minimal": "Minimal",
  "effort.low": "Low",
  "effort.medium": "Medium",
  "effort.high": "High",
  "effort.max": "Max",
  "effort.hint.off": "No reasoning",
  "effort.hint.none": "No reasoning",
  "effort.hint.minimal": "Minimal reasoning",
  "effort.hint.low": "Faster responses for simple tasks",
  "effort.hint.medium": "Balanced speed and depth",
  "effort.hint.high": "The default balance for most tasks",
  "effort.hint.max": "Maximum reasoning depth",
  "status.loading": "Refreshing model list\u2026",
  "error.action": "Model operation failed: {message}",
  "error.sessionInUse": "This session is already in use, possibly by another running DSH instance (such as dsh web or the desktop app). Quit other running DSH instances and try again.",
  "action.reload": "Reload",
  "retry": "Retry",
  "warning.groupLoad": "{name} failed to load: {message}",
  "search.placeholder": "Search models\u2026",
  "search.clear": "Clear search",
  "search.empty": "No matching models.",
  "empty.models": "No models available."
};

// src/client/entry.jsx
var inject = ["slots", "locale", "theme"];
var UI_NS = "plugin-ui";
var MODEL_NS = "plugin-ui.model";
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(UI_NS, { zh, en }), "dsh-plugin-ui: dictionaries");
  ctx.effect(
    () => ctx.locale.register(MODEL_NS, { zh: modelZh, en: modelEn }),
    "dsh-plugin-ui: model dictionaries"
  );
  const palette = createPaletteController(ctx);
  ctx.effect(() => palette.install(), "dsh-plugin-ui: palette layer");
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "plugin-ui.palette",
    order: 10.5,
    locale: UI_NS,
    inject: () => ({ controller: palette, ctx })
  }, PaletteSettings));
  ctx.inject(["slots", "modelDirectories", "sessions", "remote", "remote.session"], (scope) => {
    const models = scope.modelDirectories;
    const sessions = scope.sessions;
    scope.slots.inject("conversation.input.model", () => scope.slots.register({
      name: "conversation.input.model",
      locale: MODEL_NS,
      priority: -1,
      inject: (sessionId) => {
        const directory = models.directoryFor(sessionId);
        const available = sessions.subagentAddress(sessionId) === void 0;
        return {
          available,
          directory: directory.store,
          load: () => {
            if (available) directory.load().catch(() => {
            });
          },
          select: (selection) => available ? directory.select(selection) : Promise.resolve(void 0)
        };
      }
    }, ModelSelect));
  });
  if (!("dshDesktop" in globalThis)) return;
  ctx.inject(["slots", "remote", "remote.account", "uiWorkspace", "layout"], (scope) => {
    const quickActions = createQuickActionsStore();
    const accountStore = createAccountStore(scope);
    accountStore.start();
    scope.slots.inject("settings.launcher", () => scope.slots.register({
      name: "settings.launcher",
      locale: UI_NS,
      store: quickActions,
      priority: -1,
      children: { [QUICK_ACTION_SLOT]: { kind: "list", scope: "root" } },
      inject: () => ({
        ctx: scope,
        accountStore,
        palette,
        uiWorkspace: scope.get("uiWorkspace"),
        layout: scope.get("layout")
      })
    }, AccountMenu));
    scope.slots.inject("settings.general.item", () => scope.slots.register({
      name: "settings.general.item",
      id: "plugin-ui.quick-actions",
      order: 12,
      locale: UI_NS,
      store: quickActions,
      inject: () => ({ ctx: scope })
    }, QuickActionsSettings));
  });
}

    })(module, exports, require)
    return module.exports
  },
})
