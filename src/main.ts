import { command } from '@josephuspaye/powershell';

export interface ClassicApp {
  type: 'classic';
  appUserModelId: string;
  targetPath: string;
  targetArguments: string;
  startMenuLink?: string;
  [others: string]: any;
}

export interface StoreApp {
  type: 'store';
  appUserModelId: string;
  [others: string]: any;
}

type App = ClassicApp | StoreApp;

/**
 * Escape double quotes in the given string for PowerShell
 */
function escapeQuotes(string: string) {
  return string.replace(/`/g, '``').replace(/"/g, '`"');
}

/**
 * Launch the given store app. Returns a Promise that resolves with the
 * exit code of the launching process (not the app launched).
 */
export async function launch(app: StoreApp): Promise<number | null>;

/**
 * Launch the given classic app, optionally as an administrator. Returns a
 * Promise that resolves with the exit code of the launching process (not
 * the app launched).
 */
export async function launch(
  app: ClassicApp,
  options?: { runAsAdmin: boolean }
): Promise<number | null>;

export async function launch(
  app: App,
  options?: { runAsAdmin: boolean }
): Promise<number | null> {
  let output;

  // Only classic apps can be run as admin, and we use PowerShell's
  // Start-Process with "-Verb RunAs" to do so
  if (options?.runAsAdmin && app.type === 'classic') {
    const args =
      app.startMenuLink || app.targetArguments.length === 0
        ? ''
        : `-ArgumentList "${escapeQuotes(app.targetArguments)}"`;

    output = await command(
      `Start-Process -FilePath "${
        app.startMenuLink ?? app.targetPath
      }" ${args} -Verb RunAs`
    );
  } else {
    // All other apps can be launched with Explorer from the shell:appsFolder,
    // using the appUserModelId. This applies for both classic and store apps,
    // with or without arguments, since the app shortcuts in the shell:appsFolder
    // already have AppUserModelIDs for all apps, and include all the arguments
    // needed to launch the app.
    output = await command(
      `explorer.exe "shell:appsFolder\\${app.appUserModelId}"`
    );
  }

  return output.exitCode;
}
