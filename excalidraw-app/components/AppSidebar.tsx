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
  backendCanvases: Array<{ id: string; name: string }>;
  backendLoadingCanvases: boolean;
};

export const AppSidebar = ({
  backendLoggedIn,
  backendCanvases,
  backendLoadingCanvases,
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

            {backendLoadingCanvases ? (
              <div>Loading…</div>
            ) : backendCanvases.length === 0 ? (
              <div>No canvases yet</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {backendCanvases.map((canvas) => (
                  <li key={canvas.id} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 500 }}>{canvas.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                      {canvas.id}
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
