# launch-start-app

> Launch Start Menu apps retrieved by [@josephuspaye/start-apps](https://github.com/JosephusPaye/start-apps).

This project is part of [#CreateWeekly](https://twitter.com/JosephusPaye/status/1214853295023411200), my attempt to create something new publicly every week in 2020.

## Installation

```sh
npm install -g @josephuspaye/launch-start-app
```

## Examples

### Launch an app

The following program gets the first app from the Start Menu using [@josephuspaye/start-apps](https://github.com/JosephusPaye/start-apps) and launches it:

```js
import { getApps } from '@josephuspaye/start-apps';
import { launch } from '@josephuspaye/launch-start-app';

async function main() {
  const apps = await getApps();
  const launcherExitCode = await launch(apps[0]);
  console.log(launcherExitCode); // 0 on a successful launch
}

main();
```

### Launch a classic app as administrator

The following program finds Notepad using [@josephuspaye/start-apps](https://github.com/JosephusPaye/start-apps) and launches it as administrator:

```js
import { getApps } from '@josephuspaye/start-apps';
import { launch } from '@josephuspaye/launch-start-app';

async function main() {
  const apps = await getApps();
  const notepad = apps.find((app) => app.name === 'Notepad');

  if (notepad) {
    const launcherExitCode = await launch(notepad, { runAsAdmin: true });
    console.log(launcherExitCode); // 0 on a successful launch
  }
}

main();
```

## API

```ts
interface ClassicApp {
  type: 'classic';
  appUserModelId: string;
  targetPath: string;
  targetArguments: string;
  startMenuLink?: string;
  [others: string]: any;
}

interface StoreApp {
  type: 'store';
  appUserModelId: string;
  [others: string]: any;
}

/**
 * Launch the given store app. Returns a Promise that resolves with the
 * exit code of the launching process (not the app launched).
 */
function launch(app: StoreApp): Promise<number | null>;

/**
 * Launch the given classic app, optionally as an administrator. Returns a
 * Promise that resolves with the exit code of the launching process (not
 * the app launched).
 */
function launch(
  app: ClassicApp,
  options?: { runAsAdmin: boolean }
): Promise<number | null>;
```

## Licence

[MIT](LICENCE)
