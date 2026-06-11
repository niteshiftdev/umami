#!/usr/bin/env python3
"""Segment a brain MRI volume into brain and skull masks.

This script loads a 3D structural MRI volume (NIfTI: .nii / .nii.gz), separates
the head from the background, performs a morphological brain extraction
(skull-stripping), and writes out three binary masks:

    * head  - everything that is tissue (head) rather than air/background
    * brain - the extracted brain parenchyma
    * skull - the outer head shell that is not brain (skull + scalp region)

A note on MRI physics: bone produces almost no signal in conventional MRI, so a
true "skull" segmentation requires CT or specialised sequences. On a standard
T1/T2 volume the practical definition used here is the outer rim of head tissue
left over once the brain is removed (head minus brain). This is a robust,
dependency-light heuristic, not a clinical-grade bone segmentation.

The pipeline is intentionally classical and transparent:

    1. Otsu threshold        -> foreground (head) vs background
    2. Hole filling + cleanup -> solid head mask
    3. Erode -> largest connected component -> dilate -> fill
                               -> brain mask (morphological skull strip)
    4. head AND NOT brain     -> skull / outer-shell mask

Example
-------
    python segment_brain_mri.py input.nii.gz --output-dir ./out
    python segment_brain_mri.py t1.nii --erosion 3 --no-skull
"""

from __future__ import annotations

import argparse
import os
import sys

import numpy as np

try:
    import nibabel as nib
except ImportError:  # pragma: no cover - dependency guidance
    sys.exit(
        "nibabel is required. Install it with:\n"
        "    pip install -r requirements.txt\n"
        "or: pip install nibabel scikit-image scipy"
    )

try:
    from scipy import ndimage as ndi
    from skimage import filters, measure, morphology
except ImportError:  # pragma: no cover - dependency guidance
    sys.exit(
        "scikit-image and scipy are required. Install them with:\n"
        "    pip install -r requirements.txt\n"
        "or: pip install nibabel scikit-image scipy"
    )


def normalize(volume: np.ndarray) -> np.ndarray:
    """Scale intensities to [0, 1], ignoring NaNs/infs."""
    data = np.nan_to_num(volume.astype(np.float64), nan=0.0, posinf=0.0, neginf=0.0)
    lo, hi = np.percentile(data, [0.5, 99.5])
    if hi <= lo:
        lo, hi = float(data.min()), float(data.max())
    if hi <= lo:
        return np.zeros_like(data)
    return np.clip((data - lo) / (hi - lo), 0.0, 1.0)


def head_mask(volume: np.ndarray) -> np.ndarray:
    """Segment the whole head (foreground) from the background air."""
    norm = normalize(volume)
    threshold = filters.threshold_otsu(norm)
    mask = norm > threshold

    # Fill internal holes (ventricles, sinuses) slice-wise and in 3D so the
    # head becomes a single solid blob.
    mask = ndi.binary_fill_holes(mask)

    # Remove small disconnected speckle (table, noise, coil artefacts) and keep
    # only the largest object: the head.
    mask = keep_largest_component(mask)
    mask = ndi.binary_fill_holes(mask)
    return mask


def keep_largest_component(mask: np.ndarray) -> np.ndarray:
    """Return a mask containing only the single largest connected component."""
    labels = measure.label(mask, connectivity=1)
    if labels.max() == 0:
        return mask.astype(bool)
    counts = np.bincount(labels.ravel())
    counts[0] = 0  # ignore background
    largest = counts.argmax()
    return labels == largest


def brain_mask(volume: np.ndarray, erosion: int = 2, dilation: int = 2) -> np.ndarray:
    """Extract the brain via classical morphological skull-stripping.

    The brain is connected to the skull/scalp only by thin bridges (meninges,
    optic nerves, brainstem). Eroding the head mask snaps those bridges, the
    largest remaining component is the brain, and dilating restores its volume.
    """
    head = head_mask(volume)

    eroded = ndi.binary_erosion(head, structure=morphology.ball(erosion))
    eroded = keep_largest_component(eroded)

    brain = ndi.binary_dilation(eroded, structure=morphology.ball(dilation))

    # Constrain the dilated brain back inside the head and fill ventricles.
    brain = brain & head
    brain = ndi.binary_fill_holes(brain)
    brain = keep_largest_component(brain)
    return brain


def skull_mask(volume: np.ndarray, brain: np.ndarray) -> np.ndarray:
    """Outer head shell that is not brain (skull + scalp region)."""
    head = head_mask(volume)
    return head & ~brain


def save_mask(mask: np.ndarray, reference: "nib.Nifti1Image", path: str) -> None:
    """Write a binary mask as a NIfTI image, preserving spatial metadata."""
    img = nib.Nifti1Image(mask.astype(np.uint8), reference.affine, reference.header)
    img.header.set_data_dtype(np.uint8)
    nib.save(img, path)


def segment(
    input_path: str,
    output_dir: str,
    erosion: int = 2,
    dilation: int = 2,
    write_skull: bool = True,
    write_head: bool = True,
) -> dict:
    """Run the full segmentation pipeline and write output masks.

    Returns a dict of {name: output_path} for the masks written.
    """
    img = nib.load(input_path)
    data = img.get_fdata()
    if data.ndim == 4:  # collapse a trailing singleton time/channel axis
        data = data[..., 0]
    if data.ndim != 3:
        raise ValueError(f"Expected a 3D volume, got shape {data.shape}")

    os.makedirs(output_dir, exist_ok=True)
    stem = os.path.basename(input_path)
    for ext in (".nii.gz", ".nii"):
        if stem.endswith(ext):
            stem = stem[: -len(ext)]
            break

    brain = brain_mask(data, erosion=erosion, dilation=dilation)

    written: dict = {}

    brain_path = os.path.join(output_dir, f"{stem}_brain_mask.nii.gz")
    save_mask(brain, img, brain_path)
    written["brain"] = brain_path

    if write_skull:
        skull = skull_mask(data, brain)
        skull_path = os.path.join(output_dir, f"{stem}_skull_mask.nii.gz")
        save_mask(skull, img, skull_path)
        written["skull"] = skull_path

    if write_head:
        head = head_mask(data)
        head_path = os.path.join(output_dir, f"{stem}_head_mask.nii.gz")
        save_mask(head, img, head_path)
        written["head"] = head_path

    voxels = data.size
    print(f"Input:  {input_path}  shape={data.shape}")
    print(f"Brain:  {int(brain.sum()):>10,d} voxels ({100 * brain.sum() / voxels:.1f}%)")
    if write_skull:
        skull = nib.load(written["skull"]).get_fdata() > 0
        print(f"Skull:  {int(skull.sum()):>10,d} voxels ({100 * skull.sum() / voxels:.1f}%)")
    for name, path in written.items():
        print(f"  wrote {name}: {path}")
    return written


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Segment a brain MRI volume into brain and skull masks.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("input", help="Input MRI volume (.nii or .nii.gz)")
    parser.add_argument(
        "-o", "--output-dir", default=".", help="Directory to write output masks"
    )
    parser.add_argument(
        "--erosion", type=int, default=2, help="Erosion radius (voxels) for brain extraction"
    )
    parser.add_argument(
        "--dilation", type=int, default=2, help="Dilation radius (voxels) to restore brain volume"
    )
    parser.add_argument("--no-skull", action="store_true", help="Do not write the skull mask")
    parser.add_argument("--no-head", action="store_true", help="Do not write the head mask")
    return parser


def main(argv: list | None = None) -> int:
    args = build_parser().parse_args(argv)
    if not os.path.isfile(args.input):
        print(f"error: input file not found: {args.input}", file=sys.stderr)
        return 1
    segment(
        args.input,
        args.output_dir,
        erosion=args.erosion,
        dilation=args.dilation,
        write_skull=not args.no_skull,
        write_head=not args.no_head,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
