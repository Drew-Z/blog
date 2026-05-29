from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "output" / "project-videos" / "source-playtests"
OUTPUT_DIR = ROOT / "output" / "project-videos" / "playtests"
PUBLIC_VIDEO_DIR = ROOT / "public" / "videos" / "projects"
PUBLIC_POSTER_DIR = ROOT / "public" / "images" / "projects"

WIDTH = 1920
HEIGHT = 1080
FPS = 30
SECONDS = 8.0

PROJECTS = [
    {
        "slug": "first-tetris",
        "title": "Game First Tetris",
        "subtitle": "经典俄罗斯方块循环 / 自动试玩录制",
        "source": "first-tetris-source.avi",
        "accent": (0, 120, 212),
    },
    {
        "slug": "next-spacewar",
        "title": "Game Next Spacewar",
        "subtitle": "单局太空射击展示 / 中文默认流程",
        "source": "next-spacewar-source.avi",
        "accent": (0, 169, 157),
    },
    {
        "slug": "intespace",
        "title": "intespace",
        "subtitle": "竖屏自动射击 Roguelite 原型",
        "source": "intespace-source.avi",
        "accent": (255, 122, 89),
    },
    {
        "slug": "raiden",
        "title": "Raiden Prototype",
        "subtitle": "竖屏弹幕射击试玩录制",
        "source": "raiden-source.avi",
        "accent": (219, 178, 73),
    },
    {
        "slug": "space-war",
        "title": "Space War",
        "subtitle": "Space Impact 风格横版射击",
        "source": "space-war-source.avi",
        "accent": (50, 170, 120),
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


TITLE_FONT = font(70, True)
SUBTITLE_FONT = font(31)
LABEL_FONT = font(24, True)
SMALL_FONT = font(22)
TINY_FONT = font(18, True)


def rounded_image(image: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)
    out = Image.new("RGBA", image.size, (255, 255, 255, 0))
    out.paste(image, (0, 0), mask)
    return out


def fit_contain(image: Image.Image, box: tuple[int, int]) -> Image.Image:
    bw, bh = box
    scale = min(bw / image.width, bh / image.height)
    size = (max(1, int(image.width * scale)), max(1, int(image.height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def draw_wrapped(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], font_obj: ImageFont.ImageFont, fill: tuple[int, int, int, int], max_width: int, line_gap: int = 8) -> int:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        if draw.textbbox((0, 0), test, font=font_obj)[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font_obj, fill=fill)
        y += draw.textbbox((0, 0), line, font=font_obj)[3] + line_gap
    return y


def background(accent: tuple[int, int, int], progress: float) -> Image.Image:
    small_w, small_h = 320, 180
    img = Image.new("RGB", (small_w, small_h), (239, 247, 252))
    pixels = img.load()
    ax = int(small_w * (0.74 + 0.04 * math.sin(progress * math.tau)))
    ay = int(small_h * 0.18)
    bx, by = int(small_w * 0.12), int(small_h * 0.88)
    for y in range(small_h):
        for x in range(small_w):
            d1 = max(0.0, 1.0 - math.hypot(x - ax, y - ay) / 148)
            d2 = max(0.0, 1.0 - math.hypot(x - bx, y - by) / 130)
            r = int(239 + accent[0] * 0.09 * d1 + 255 * 0.03 * d2)
            g = int(247 + accent[1] * 0.08 * d1 + 169 * 0.04 * d2)
            b = int(252 + accent[2] * 0.08 * d1 + 157 * 0.04 * d2)
            pixels[x, y] = (min(r, 255), min(g, 255), min(b, 255))
    img = img.resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)
    draw = ImageDraw.Draw(img, "RGBA")
    offset = int(progress * 48)
    for x in range(-48 + offset, WIDTH, 48):
        draw.line((x, 0, x, HEIGHT), fill=(0, 120, 212, 18), width=1)
    for y in range(-48 + offset, HEIGHT, 48):
        draw.line((0, y, WIDTH, y), fill=(0, 120, 212, 16), width=1)
    return img


def render_frame(project: dict[str, object], raw_frame: np.ndarray, frame_index: int, total_frames: int) -> Image.Image:
    progress = frame_index / max(1, total_frames - 1)
    accent = project["accent"]  # type: ignore[assignment]
    frame = background(accent, progress).convert("RGBA")
    draw = ImageDraw.Draw(frame, "RGBA")

    draw.rounded_rectangle((72, 68, 1848, 1012), radius=24, fill=(255, 255, 255, 176), outline=(34, 91, 130, 42), width=2)
    draw.rounded_rectangle((112, 118, 582, 902), radius=18, fill=(255, 255, 255, 206), outline=(34, 91, 130, 36), width=2)
    draw.text((148, 158), "本地试玩录屏", font=LABEL_FONT, fill=(0, 95, 184, 255))
    title_bottom = draw_wrapped(draw, str(project["title"]), (148, 218), TITLE_FONT, (7, 24, 39, 255), 380, 10)
    draw_wrapped(draw, str(project["subtitle"]), (150, title_bottom + 22), SUBTITLE_FONT, (74, 90, 108, 255), 372, 8)

    pill_y = 576
    draw.rounded_rectangle((148, pill_y, 408, pill_y + 50), radius=10, fill=(*accent, 42), outline=(*accent, 92), width=2)
    draw.text((170, pill_y + 13), "GODOT 实机试玩", font=SMALL_FONT, fill=(0, 95, 184, 245))
    draw.text((148, pill_y + 86), "真实局内过程", font=TINY_FONT, fill=(98, 114, 135, 255))
    draw.text((148, pill_y + 116), "8 秒 MP4 / 1920x1080", font=SMALL_FONT, fill=(45, 62, 82, 255))

    bar_x, bar_y, bar_w = 148, 822, 360
    draw.rounded_rectangle((bar_x, bar_y, bar_x + bar_w, bar_y + 14), radius=999, fill=(0, 120, 212, 35))
    draw.rounded_rectangle((bar_x, bar_y, bar_x + int(bar_w * progress), bar_y + 14), radius=999, fill=(*accent, 215))

    shot = Image.fromarray(raw_frame).convert("RGBA")
    box = (1140, 774)
    shot_fit = fit_contain(shot, box)
    shot_fit = rounded_image(shot_fit, 20)
    card_x, card_y = 640, 132
    card_w, card_h = 1152, 816
    draw.rounded_rectangle((card_x + 18, card_y + 24, card_x + card_w + 18, card_y + card_h + 24), radius=28, fill=(20, 68, 110, 38))
    draw.rounded_rectangle((card_x, card_y, card_x + card_w, card_y + card_h), radius=28, fill=(255, 255, 255, 238), outline=(34, 91, 130, 46), width=2)
    inner_x = card_x + (card_w - shot_fit.width) // 2
    inner_y = card_y + (card_h - shot_fit.height) // 2
    frame.alpha_composite(shot_fit, (inner_x, inner_y))

    draw.rounded_rectangle((card_x + 34, card_y + card_h - 58, card_x + card_w - 34, card_y + card_h - 42), radius=999, fill=(0, 120, 212, 30))
    draw.rounded_rectangle((card_x + 34, card_y + card_h - 58, card_x + 34 + int((card_w - 68) * progress), card_y + card_h - 42), radius=999, fill=(*accent, 190))
    return frame.convert("RGB")


def read_capture_frames(path: Path, target_frames: int) -> list[np.ndarray]:
    reader = imageio.get_reader(path)
    meta = reader.get_meta_data()
    source_fps = float(meta.get("fps") or FPS)
    duration = float(meta.get("duration") or SECONDS)
    source_count = max(1, int(source_fps * duration))
    frames: list[np.ndarray] = []
    for out_index in range(target_frames):
        progress = out_index / max(1, target_frames - 1)
        source_index = min(source_count - 1, int(progress * (source_count - 1)))
        try:
            frames.append(reader.get_data(source_index))
        except Exception:
            if frames:
                frames.append(frames[-1])
            else:
                raise
    reader.close()
    return frames


def render_project(project: dict[str, object]) -> None:
    slug = str(project["slug"])
    source = SOURCE_DIR / str(project["source"])
    target_frames = int(FPS * SECONDS)
    frames = read_capture_frames(source, target_frames)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_POSTER_DIR.mkdir(parents=True, exist_ok=True)

    output = OUTPUT_DIR / f"{slug}-playtest.mp4"
    public_output = PUBLIC_VIDEO_DIR / f"{slug}-playtest.mp4"
    poster = PUBLIC_POSTER_DIR / f"{slug}-playtest-poster.png"

    poster_frame = render_frame(project, frames[min(len(frames) - 1, int(FPS * 1.2))], int(FPS * 1.2), target_frames)
    poster_frame.save(poster)

    with imageio.get_writer(
        output,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=1,
        pixelformat="yuv420p",
    ) as writer:
        for index, raw_frame in enumerate(frames):
            writer.append_data(np.asarray(render_frame(project, raw_frame, index, target_frames)))

    public_output.write_bytes(output.read_bytes())
    print(public_output)


def main() -> None:
    for project in PROJECTS:
        render_project(project)


if __name__ == "__main__":
    main()
