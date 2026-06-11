# Brain MRI Segmentation

A small, dependency-light Python script that segments a 3D structural brain MRI
volume into **brain** and **skull** masks using [nibabel](https://nipy.org/nibabel/)
and [scikit-image](https://scikit-image.org/).

## What it does

Given a NIfTI volume (`.nii` / `.nii.gz`), the pipeline writes binary masks:

| Mask  | Meaning |
|-------|---------|
| `*_brain_mask.nii.gz` | Extracted brain parenchyma (morphological skull-strip) |
| `*_skull_mask.nii.gz` | Outer head shell that is not brain (skull + scalp) |
| `*_head_mask.nii.gz`  | Whole head (foreground vs. background air) |

Pipeline:

1. **Otsu threshold** — separate head from background air.
2. **Hole filling + largest component** — produce a solid head mask.
3. **Erode → largest component → dilate → fill** — classical morphological
   brain extraction (snaps the thin meningeal bridges, keeps the brain blob).
4. **head AND NOT brain** — the skull / outer-shell mask.

> **A note on MRI and bone:** cortical bone is nearly signal-free on conventional
> T1/T2 MRI, so a true bone segmentation requires CT. The "skull" mask here is the
> practical outer rim of head tissue left after removing the brain — a robust
> heuristic, not a clinical bone segmentation.

## Install

```bash
pip install -r requirements.txt
```

## Usage

```bash
# Basic
python segment_brain_mri.py input.nii.gz --output-dir ./out

# Tune the morphological skull-strip aggressiveness
python segment_brain_mri.py t1.nii --erosion 3 --dilation 3

# Brain mask only
python segment_brain_mri.py t1.nii.gz --no-skull --no-head
```

| Flag | Default | Description |
|------|---------|-------------|
| `-o, --output-dir` | `.` | Output directory for masks |
| `--erosion` | `2` | Erosion radius (voxels) for brain extraction |
| `--dilation` | `2` | Dilation radius (voxels) to restore brain volume |
| `--no-skull` | off | Skip writing the skull mask |
| `--no-head` | off | Skip writing the head mask |

Output masks are written as `uint8` NIfTI images that preserve the input's
affine and header, so they overlay correctly on the source volume.
