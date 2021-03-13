# ![](https://raw.githubusercontent.com/hoobs-org/HOOBS/master/docs/logo.png)

This is the official HOOBS User Interface.

## Installing
The HOOBS GUI is part of a software stack. To use this you will need to install hoobsd.

First add the HOOBS repository to your sources.

```sh
wget -qO- https://support.hoobs.org/setup | sudo -E bash -
```

Then install hoobsd and the HOOBS GUI.

```sh
sudo apt install -y hoobsd hoobs-gui
```

If you have the HOOOBS CLI installed, you can simply run this command.

```
sudo hoobs extention add gui
```

## Service
The GUI will not be available right away, you will need to restart the hoobsd service.

```
sudo hoobsd service restart
```

## Legal
HOOBS and the HOOBS logo are registered trademarks of HOOBS Inc. Copyright (C) 2020 HOOBS Inc. All rights reserved.
