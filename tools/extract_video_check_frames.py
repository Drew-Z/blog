from __future__ import annotations

import sys
from pathlib import Path

import imageio.v2 as imageio
from PIL import Image


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit("usage: extract_video_check_frames.py <video> <frame> [<frame>...]")
    video = Path(sys.argv[1])
    reader = imageio.get_reader(video)
    try:
        for value in sys.argv[2:]:
            frame_index = int(value)
            out = video.with_name(f"{video.stem}-check-{frame_index}.png")
            Image.fromarray(reader.get_data(frame_index)).save(out)
            print(out)
    finally:
        reader.close()


if __name__ == "__main__":
    main()
