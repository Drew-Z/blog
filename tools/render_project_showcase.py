from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
CAPTURE_DIR = ROOT / "output" / "project-captures" / "finals"
OUTPUT = ROOT / "output" / "project-videos" / "project-showcase.mp4"

WIDTH = 1920
HEIGHT = 1080
FPS = 30
SECONDS_PER_PROJECT = 2.4

PROJECTS = [
    {
        "title": "Game First Tetris",
        "subtitle": "Rogue loop / touch-ready prototype",
        "image": "first-tetris.png",
        "accent": (0, 120, 212),
    },
    {
        "title": "Game Next Spacewar",
        "subtitle": "Single-run showcase build",
        "image": "next-spacewar.png",
        "accent": (0, 169, 157),
    },
    {
        "title": "intespace",
        "subtitle": "Vertical auto-shooter Roguelite hub",
        "image": "intespace.png",
        "accent": (255, 122, 89),
    },
    {
        "title": "Raiden Prototype",
        "subtitle": "RC-0.4 public demo preparation",
        "image": "raiden.png",
        "accent": (219, 178, 73),
    },
    {
        "title": "Space War",
        "subtitle": "Nokia Space Impact-inspired release",
        "image": "space-war.png",
        "accent": (110, 230, 120),
    },
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


TITLE_FONT = font(76, True)
SUBTITLE_FONT = font(34)
LABEL_FONT = font(24, True)
SMALL_FONT = font(22)


def rounded_image(image: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)
    out = Image.new("RGBA", image.size, (255, 255, 255, 0))
    out.paste(image, (0, 0), mask)
    return out


def fit_image(image: Image.Image, box: tuple[int, int], zoom: float) -> Image.Image:
    bw, bh = box
    scale = min(bw / image.width, bh / image.height) * zoom
    size = (max(1, int(image.width * scale)), max(1, int(image.height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def background(accent: tuple[int, int, int], progress: float) -> Image.Image:
    small_w, small_h = 320, 180
    img = Image.new("RGB", (small_w, small_h), (239, 247, 252))
    pixels = img.load()
    ax, ay = int(small_w * (0.74 + 0.04 * math.sin(progress * math.tau))), int(small_h * 0.18)
    bx, by = int(small_w * 0.18), int(small_h * 0.84)
    for y in range(small_h):
        for x in range(small_w):
            d1 = max(0.0, 1.0 - math.hypot(x - ax, y - ay) / 140)
            d2 = max(0.0, 1.0 - math.hypot(x - bx, y - by) / 126)
            r = int(239 + accent[0] * 0.08 * d1 + 0 * d2)
            g = int(247 + accent[1] * 0.07 * d1 + 169 * 0.04 * d2)
            b = int(252 + accent[2] * 0.07 * d1 + 157 * 0.04 * d2)
            pixels[x, y] = (min(r, 255), min(g, 255), min(b, 255))
    img = img.resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)
    draw = ImageDraw.Draw(img, "RGBA")
    grid = (0, 120, 212, 20)
    offset = int(progress * 42)
    for x in range(-42 + offset, WIDTH, 42):
        draw.line((x, 0, x, HEIGHT), fill=grid, width=1)
    for y in range(-42 + offset, HEIGHT, 42):
        draw.line((0, y, WIDTH, y), fill=grid, width=1)
    return img


def render_slide(project: dict[str, object], local_frame: int, frames_per_slide: int, index: int) -> Image.Image:
    progress = local_frame / max(1, frames_per_slide - 1)
    accent = project["accent"]  # type: ignore[assignment]
    frame = background(accent, progress).convert("RGBA")
    draw = ImageDraw.Draw(frame, "RGBA")

    draw.rounded_rectangle((86, 82, 1834, 998), radius=28, fill=(255, 255, 255, 185), outline=(34, 91, 130, 46), width=2)
    draw.text((130, 124), "Biau Playlab / Project Case", font=LABEL_FONT, fill=(0, 95, 184, 255))
    draw.text((130, 188), str(project["title"]), font=TITLE_FONT, fill=(7, 24, 39, 255))
    draw.text((134, 292), str(project["subtitle"]), font=SUBTITLE_FONT, fill=(71, 88, 108, 255))

    pill = (130, 372, 428, 426)
    draw.rounded_rectangle(pill, radius=10, fill=(*accent, 38), outline=(*accent, 90), width=2)
    draw.text((154, 386), f"0{index + 1} / 05  RUNNING BUILD", font=SMALL_FONT, fill=(255, 255, 255, 232))

    shot = Image.open(CAPTURE_DIR / str(project["image"])).convert("RGBA")
    box_w, box_h = 1040, 720
    zoom = 1.0 + 0.025 * progress
    shot_fit = fit_image(shot, (box_w, box_h), zoom)
    shot_fit = rounded_image(shot_fit, 20)

    shadow_box = (760, 172, 760 + box_w, 172 + box_h)
    draw.rounded_rectangle((shadow_box[0] + 20, shadow_box[1] + 26, shadow_box[2] + 20, shadow_box[3] + 26), radius=26, fill=(20, 68, 110, 36))
    draw.rounded_rectangle(shadow_box, radius=26, fill=(255, 255, 255, 235), outline=(34, 91, 130, 42), width=2)
    px = shadow_box[0] + (box_w - shot_fit.width) // 2
    py = shadow_box[1] + (box_h - shot_fit.height) // 2
    frame.alpha_composite(shot_fit, (px, py))

    bar_w = 520
    draw.rounded_rectangle((130, 902, 130 + bar_w, 916), radius=999, fill=(0, 120, 212, 35))
    draw.rounded_rectangle((130, 902, 130 + int(bar_w * progress), 916), radius=999, fill=(*accent, 210))
    return frame.convert("RGB")


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    frames_per_slide = int(FPS * SECONDS_PER_PROJECT)
    with imageio.get_writer(
        OUTPUT,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=1,
        pixelformat="yuv420p",
    ) as writer:
        for index, project in enumerate(PROJECTS):
            for local_frame in range(frames_per_slide):
                writer.append_data(np.asarray(render_slide(project, local_frame, frames_per_slide, index)))

    print(OUTPUT)


if __name__ == "__main__":
    main()
