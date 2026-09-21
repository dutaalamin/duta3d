"""
Compress an FBX character for the web and export a lightweight GLB.

Why this exists
---------------
`public/models/fighter-character.fbx` is ~50 MB. Analysis showed ~98% of that is
6 embedded PNG textures at ~8 MB each (4K resolution). The mesh and the 3
animation clips are a small fraction.

This script resizes every texture, re-packs it into the model, and exports a
Draco-compressed GLB. Expected result: ~50 MB -> ~2-5 MB.

How to use
----------
1. Install Blender (free): https://www.blender.org/download/
2. Open Blender -> top tab "Scripting"
3. Click "Open" and select this file
4. Adjust the settings below if needed
5. Press "Run Script" (or Alt+P)
6. The .glb appears next to the source file

You can delete this script afterwards.
"""

import os

import bpy

# --------------------------------------------------------------------------
# Settings
# --------------------------------------------------------------------------

SOURCE = r"D:\duta3d\public\models\fighter-character.fbx"
OUTPUT = r"D:\duta3d\public\models\fighter-character.glb"

# 4096 -> 2048 cuts texture bytes roughly 4x. 1024 is even smaller and still
# looks fine for a character that is rendered at moderate size on screen.
MAX_TEXTURE_SIZE = 2048

# 'WEBP' gives the smallest files (Blender 3.6+). Use 'JPEG' if your Blender
# build complains, or 'AUTO' to keep the original format.
IMAGE_FORMAT = "WEBP"

# Draco compresses mesh geometry (not textures). Nearly free size win.
DRACO = True
DRACO_LEVEL = 6

# The site only ever plays the FIRST animation clip (`fbx.animations[0]`).
# Set to True to delete the other clips. Verify the character still animates
# correctly afterwards -- if it T-poses, set this back to False.
TRIM_ANIMATIONS = False

# --------------------------------------------------------------------------


def check_paths():
    if not os.path.isfile(SOURCE):
        raise SystemExit(f"Source file not found:\n  {SOURCE}")


def fresh_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_model():
    print(f"Importing {SOURCE}")
    bpy.ops.import_scene.fbx(filepath=SOURCE)


def shrink_textures():
    """Downscale every image bigger than MAX_TEXTURE_SIZE."""
    resized = []
    for img in bpy.data.images:
        if img.size[0] == 0 or img.size[1] == 0:
            continue  # generated/render-result images have no pixels

        w, h = img.size
        largest = max(w, h)
        if largest <= MAX_TEXTURE_SIZE:
            print(f"  keep    {img.name} ({w}x{h})")
            continue

        factor = MAX_TEXTURE_SIZE / largest
        new_w = max(1, round(w * factor))
        new_h = max(1, round(h * factor))

        before = img.packed_file.size if img.packed_file else 0
        img.scale(new_w, new_h)
        img.pack()
        after = img.packed_file.size if img.packed_file else 0

        resized.append(img.name)
        print(
            f"  resize  {img.name}: {w}x{h} -> {new_w}x{new_h}"
            f"  ({before / 1e6:.2f} MB -> {after / 1e6:.2f} MB)"
        )

    print(f"Resized {len(resized)} texture(s)")


def trim_animations():
    """Keep only the first action; the site plays just that one."""
    actions = list(bpy.data.actions)
    if len(actions) <= 1:
        print("Only one animation - nothing to trim")
        return

    # Keep the action that the site reads as animations[0]. FBX import order
    # is not guaranteed to match, so double-check the result visually.
    keep = actions[0]
    print(f'Keeping animation "{keep.name}", removing {len(actions) - 1} other(s)')

    for action in actions:
        if action is keep:
            continue
        for obj in bpy.data.objects:
            ad = obj.animation_data
            if not ad or ad.action is not action:
                continue
            ad.action = None
        bpy.data.actions.remove(action)


def export_glb():
    print(f"Exporting {OUTPUT}")
    kwargs = {
        "filepath": OUTPUT,
        "export_format": "GLB",
        "use_selection": False,
        "export_apply": True,
        "export_animations": True,
        "export_yup": True,
    }

    # Older Blender builds do not accept every option, so try the full set
    # first and fall back to a minimal one.
    try:
        bpy.ops.export_scene.gltf(
            **kwargs,
            export_image_format=IMAGE_FORMAT,
            export_draco_mesh_compression_enable=DRACO,
            export_draco_mesh_compression_level=DRACO_LEVEL,
        )
    except TypeError:
        print("  (this Blender build lacks some options, retrying minimal)")
        bpy.ops.export_scene.gltf(**kwargs)


def report():
    if not os.path.isfile(OUTPUT):
        print("Export did not produce a file")
        return
    before = os.path.getsize(SOURCE) / 1e6
    after = os.path.getsize(OUTPUT) / 1e6
    saved = 100 - (after / before * 100)
    print("-" * 52)
    print(f"  FBX : {before:8.2f} MB")
    print(f"  GLB : {after:8.2f} MB")
    print(f"  saved {saved:.1f}%")
    print("-" * 52)


def main():
    check_paths()
    fresh_scene()
    import_model()
    shrink_textures()
    if TRIM_ANIMATIONS:
        trim_animations()
    export_glb()
    report()


if __name__ == "__main__":
    main()
