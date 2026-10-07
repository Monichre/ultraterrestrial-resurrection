"""Copy the UFO files from a Modal Volume to Google Drive, server side.

Nothing passes through your laptop or a Claude container: Modal mounts the
volume and rclone streams it straight to Drive.

One-time setup (on your Mac):
  1. brew install rclone && rclone config
       -> new remote named "gdrive", type "drive", scope "drive", finish the browser OAuth
  2. modal secret create rclone-gdrive RCLONE_CONF="$(cat ~/.config/rclone/rclone.conf)"
  3. modal volume list        # find the volume the earlier run wrote to

Run:
  UFO_VOLUME=<volume-name> modal run scripts/ufo-files/backup_to_drive.py --dry-run
  UFO_VOLUME=<volume-name> modal run scripts/ufo-files/backup_to_drive.py --dest "gdrive:UFO Files"
"""

import os
import subprocess

import modal

VOLUME_NAME = os.environ.get("UFO_VOLUME", "ufo-files")
MOUNT = "/data"

app = modal.App("ufo-files-drive-backup")
image = modal.Image.debian_slim().apt_install("rclone")
volume = modal.Volume.from_name(VOLUME_NAME)


@app.function(
    image=image,
    volumes={MOUNT: volume},
    secrets=[modal.Secret.from_name("rclone-gdrive")],
    timeout=6 * 60 * 60,
)
def backup(dest: str, dry_run: bool) -> None:
    conf_path = "/tmp/rclone.conf"
    with open(conf_path, "w") as f:
        f.write(os.environ["RCLONE_CONF"])

    subprocess.run(["du", "-sh", MOUNT], check=False)
    cmd = [
        "rclone", "copy", MOUNT, dest,
        "--config", conf_path,
        "--transfers", "8",
        "--checkers", "16",
        "--drive-chunk-size", "64M",
        "--stats", "30s",
        "--stats-one-line",
        "-v",
    ]
    if dry_run:
        cmd.append("--dry-run")
    subprocess.run(cmd, check=True)
    subprocess.run(["rclone", "size", dest, "--config", conf_path], check=False)


@app.local_entrypoint()
def main(dest: str = "gdrive:UFO Files", dry_run: bool = False) -> None:
    backup.remote(dest, dry_run)
