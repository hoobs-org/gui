# ![](https://raw.githubusercontent.com/hoobs-org/HOOBS/master/docs/logo.png)

This is the official HOOBS User Interface.

## Installing
The HOOBS GUI is part of a software stack. To install and use this you will need to install hoobsd and the CLI first.

Install hoobsd. HOOBS recommends Yarn.

```sh
yarn global add --unsafe-perm @hoobs/hoobsd
```

Or using NPM.

```sh
npm install -g --unsafe-perm @hoobs/hoobsd
```

To manage the HOOBS daemon, you will need to install the CLI.

```sh
yarn global add --unsafe-perm @hoobs/cli
```

Or using NPM.

```sh
npm install -g --unsafe-perm @hoobs/cli
```

> The `--unsafe-perm` flag needs to be used so the install can add a symlink in `/usr/bin`.

## Enabling the GUI
To enable this GUI, you need to use the `extention` command in the CLI.

```
sudo hoobs extention add gui
```

This command will install and configure this GUI.
