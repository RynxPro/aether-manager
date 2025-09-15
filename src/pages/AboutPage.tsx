import React from "react";
import PageContainer, {
  PageHeader,
} from "../components/characters/PageContainer";
import { cnButton } from "../styles/buttons";

const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="About Aether Manager"
        description="Version 1.0.0 • Lightweight mod manager for Zenless Zone Zero"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--moon-text)] mb-2">
            Overview
          </h2>
          <p className="text-[var(--moon-muted)]">
            Aether Manager helps you install, organize, and toggle mods for
            Zenless Zone Zero. It supports character-specific mods and other
            mods, with instant toggling and consistent state across pages.
          </p>
        </section>

        <section className="bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--moon-text)] mb-3">
            Quick Start
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--moon-text)]">
            <li>
              Open <span className="font-semibold">Settings</span> and set the{" "}
              <span className="font-mono">ZZMI mods path</span> to your
              zzmi/mods folder.
            </li>
            <li>
              Go to <span className="font-semibold">Characters</span> or{" "}
              <span className="font-semibold">Other Mods</span> and click{" "}
              <span className="font-semibold">Upload Mod</span>.
            </li>
            <li>
              Choose your mod folder. Title and character can be set during
              install.
            </li>
            <li>
              Toggle mods on/off instantly from the dashboard or per-character
              page.
            </li>
          </ol>
        </section>

        <section className="bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--moon-text)] mb-3">
            Detailed Guide
          </h2>
          <div className="space-y-4 text-[var(--moon-text)]">
            <div>
              <h3 className="font-semibold mb-1">Installing Mods</h3>
              <ul className="list-disc list-inside text-[var(--moon-muted)] space-y-1">
                <li>Use the Upload Mod button on any mods page.</li>
                <li>
                  Pick a folder containing your mod. The folder name is used as
                  default title.
                </li>
                <li>Optionally assign a character to categorize the mod.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Managing Mods</h3>
              <ul className="list-disc list-inside text-[var(--moon-muted)] space-y-1">
                <li>
                  Use the toggle switch on each card to activate/deactivate a
                  mod.
                </li>
                <li>
                  Click a card to view details and edit title, thumbnail, or
                  URL.
                </li>
                <li>Use search and sort to quickly find mods.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Troubleshooting</h3>
              <ul className="list-disc list-inside text-[var(--moon-muted)] space-y-1">
                <li>If toggling fails, verify the ZZMI path in Settings.</li>
                <li>
                  Ensure mod folders and files are accessible and not
                  write-protected.
                </li>
                <li>
                  Reopen the app to rebuild internal indexes if files were moved
                  externally.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--moon-text)] mb-2">
            Shortcuts
          </h2>
          <p className="text-[var(--moon-muted)] mb-4">
            Common actions at a glance.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className={cnButton({ variant: "ghost", size: "sm" })}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#go/settings";
              }}
            >
              Open Settings
            </a>
            <a
              className={cnButton({ variant: "ghost", size: "sm" })}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#go/characters";
              }}
            >
              Characters
            </a>
            <a
              className={cnButton({ variant: "ghost", size: "sm" })}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#go/mods";
              }}
            >
              Other Mods
            </a>
          </div>
        </section>

        <div className="text-[var(--moon-muted)] text-sm text-center">
          © {new Date().getFullYear()} Aether Manager
        </div>
      </div>
    </PageContainer>
  );
};

export default AboutPage;
