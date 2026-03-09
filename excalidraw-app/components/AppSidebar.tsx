import { DefaultSidebar, Sidebar, THEME } from "@excalidraw/excalidraw";
import {
  messageCircleIcon,
  presentationIcon,
} from "@excalidraw/excalidraw/components/icons";
import { LinkButton } from "@excalidraw/excalidraw/components/LinkButton";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";

import { useState } from "react";

import "./AppSidebar.scss";

type AppSidebarProps = {
  backendLoggedIn: boolean;
  backendCanvases: Array<{ id: string; name: string; thumbnail?: string }>;
  backendLoadingCanvases: boolean;
  currentCanvasId: string | null;
  currentCanvasName: string;
  canvasNameInput: string;
  onCanvasNameInputChange: (value: string) => void;
  onCreateCanvas: () => void;
  onSaveCurrentCanvas: () => void;
  onSaveAsCanvas: () => void;
  onOpenCanvas: (canvasId: string) => void;
  onDeleteCanvas: (canvasId: string) => void;
  onRenameCanvas: (canvasId: string, newName: string) => void;
};

export const AppSidebar = ({
  backendLoggedIn,
  backendCanvases,
  backendLoadingCanvases,
  currentCanvasId,
  currentCanvasName,
  canvasNameInput,
  onCanvasNameInputChange,
  onCreateCanvas,
  onSaveCurrentCanvas,
  onSaveAsCanvas,
  onOpenCanvas,
  onDeleteCanvas,
  onRenameCanvas,
}: AppSidebarProps) => {
  const { theme, openSidebar } = useUIAppState();
  const [renamingCanvasId, setRenamingCanvasId] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState<string>("");
  return (
    <DefaultSidebar>
      <DefaultSidebar.TabTriggers>
        {backendLoggedIn && (
          <Sidebar.TabTrigger
            tab="canvases"
            style={{ opacity: openSidebar?.tab === "canvases" ? 1 : 0.4 }}
          >
            📁
          </Sidebar.TabTrigger>
        )}

        <Sidebar.TabTrigger
          tab="comments"
          style={{ opacity: openSidebar?.tab === "comments" ? 1 : 0.4 }}
        >
          {messageCircleIcon}
        </Sidebar.TabTrigger>

        <Sidebar.TabTrigger
          tab="presentation"
          style={{ opacity: openSidebar?.tab === "presentation" ? 1 : 0.4 }}
        >
          {presentationIcon}
        </Sidebar.TabTrigger>
      </DefaultSidebar.TabTriggers>

      {backendLoggedIn && (
        <Sidebar.Tab tab="canvases" className="px-3">
          <div className="app-sidebar-promo-container">
            <div className="app-sidebar-promo-text">My Canvases</div>

            {currentCanvasId && (
              <div
                style={{
                  marginBottom: 10,
                  fontSize: 12,
                  opacity: 0.7,
                }}
              >
                Current-Name: {currentCanvasName} && Current-ID:
                {currentCanvasId}
              </div>
            )}

            <input
              type="text"
              value={canvasNameInput}
              onChange={(event) => onCanvasNameInputChange(event.target.value)}
              placeholder="Canvas name"
              style={{
                width: "100%",
                marginBottom: 10,
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <button
                type="button"
                onClick={onCreateCanvas}
                style={{ width: "100%" }}
              >
                New Canvas
              </button>

              <button
                type="button"
                onClick={onSaveCurrentCanvas}
                style={{ width: "100%" }}
              >
                Save Current Canvas
              </button>

              <button
                type="button"
                onClick={onSaveAsCanvas}
                style={{ width: "100%" }}
              >
                Save As
              </button>
            </div>

            {backendLoadingCanvases ? (
              <div>Loading…</div>
            ) : backendCanvases.length === 0 ? (
              <div>No canvases yet</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                {backendCanvases.map((canvas) => (
                  <li key={canvas.id} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        background: "white",
                        padding: 10,
                      }}
                    >
                      <div
                        onClick={() => onOpenCanvas(canvas.id)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {canvas.thumbnail ? (
                          <img
                            src={canvas.thumbnail}
                            alt={canvas.name}
                            style={{
                              width: "100%",
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 6,
                              marginBottom: 8,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: 100,
                              borderRadius: 6,
                              marginBottom: 8,
                              background: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              opacity: 0.6,
                            }}
                          >
                            No thumbnail
                          </div>
                        )}

                        <div style={{ fontWeight: 600 }}>
                          {canvas.name}
                          {currentCanvasId === canvas.id ? " (Current)" : ""}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            opacity: 0.6,
                            marginBottom: 8,
                          }}
                        >
                          {canvas.id}
                        </div>
                      </div>

                      {renamingCanvasId === canvas.id ? (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={renamingValue}
                            onChange={(event) =>
                              setRenamingValue(event.target.value)
                            }
                            style={{
                              flex: 1,
                              padding: "6px 8px",
                              border: "1px solid #ddd",
                              borderRadius: 6,
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              onRenameCanvas(canvas.id, renamingValue);
                              setRenamingCanvasId(null);
                              setRenamingValue("");
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingCanvasId(null);
                              setRenamingValue("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : null}

                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenCanvas(canvas.id)}
                          style={{
                            flex: 1,
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Open
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRenamingCanvasId(canvas.id);
                            setRenamingValue(canvas.name);
                          }}
                          style={{
                            flex: 1,
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Rename
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCanvas(canvas.id)}
                          style={{
                            flex: 1,
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Sidebar.Tab>
      )}

      <Sidebar.Tab tab="comments">
        <div className="app-sidebar-promo-container">
          <div
            className="app-sidebar-promo-image"
            style={{
              ["--image-source" as any]: `url(/oss_promo_comments_${
                theme === THEME.DARK ? "dark" : "light"
              }.jpg)`,
              opacity: 0.7,
            }}
          />
          <div className="app-sidebar-promo-text">
            Make comments with Excalidraw+
          </div>
          <LinkButton
            href={`${
              import.meta.env.VITE_APP_PLUS_LP
            }/plus?utm_source=excalidraw&utm_medium=app&utm_content=comments_promo#excalidraw-redirect`}
          >
            Sign up now
          </LinkButton>
        </div>
      </Sidebar.Tab>

      <Sidebar.Tab tab="presentation" className="px-3">
        <div className="app-sidebar-promo-container">
          <div
            className="app-sidebar-promo-image"
            style={{
              ["--image-source" as any]: `url(/oss_promo_presentations_${
                theme === THEME.DARK ? "dark" : "light"
              }.svg)`,
              backgroundSize: "60%",
              opacity: 0.4,
            }}
          />
          <div className="app-sidebar-promo-text">
            Create presentations with Excalidraw+
          </div>
          <LinkButton
            href={`${
              import.meta.env.VITE_APP_PLUS_LP
            }/plus?utm_source=excalidraw&utm_medium=app&utm_content=presentations_promo#excalidraw-redirect`}
          >
            Sign up now
          </LinkButton>
        </div>
      </Sidebar.Tab>
    </DefaultSidebar>
  );
};
