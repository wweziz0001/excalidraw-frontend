import { DefaultSidebar, Sidebar, THEME } from "@excalidraw/excalidraw";
import {
  messageCircleIcon,
  presentationIcon,
} from "@excalidraw/excalidraw/components/icons";
import { LinkButton } from "@excalidraw/excalidraw/components/LinkButton";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";

import "./AppSidebar.scss";

type AppSidebarProps = {
  backendLoggedIn: boolean;
  backendCanvases: Array<{ id: string; name: string; thumbnail?: string }>;
  backendLoadingCanvases: boolean;
  onCreateCanvas: () => void;
  onOpenCanvas: (canvasId: string) => void;
  onDeleteCanvas: (canvasId: string) => void;
};

export const AppSidebar = ({
  backendLoggedIn,
  backendCanvases,
  backendLoadingCanvases,
  onCreateCanvas,
  onOpenCanvas,
  onDeleteCanvas,
}: AppSidebarProps) => {
  const { theme, openSidebar } = useUIAppState();

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

            <button
              type="button"
              onClick={onCreateCanvas}
              style={{
                marginBottom: 12,
                width: "100%",
              }}
            >
              New Canvas
            </button>

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

                        <div style={{ fontWeight: 600 }}>{canvas.name}</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
                          {canvas.id}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
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