"""Utility to regenerate the OpenAPI specification for the FastAPI backend."""
from pathlib import Path
import importlib.metadata as importlib_metadata

import yaml

# Patch importlib.metadata.version so Pydantic doesn't require the real
# ``email-validator`` package when generating schemas in environments without
# internet access.
_orig_version = importlib_metadata.version


def _patched_version(dist_name: str) -> str:
    if dist_name == "email-validator":
        return "2"
    return _orig_version(dist_name)


importlib_metadata.version = _patched_version

from fastapi.openapi.utils import get_openapi

from app.main import app


def generate_spec() -> None:
    """Generate an OpenAPI YAML file under the repository's openapi/ directory."""
    schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )
    out_path = Path(__file__).resolve().parents[2] / "openapi" / "openapi.yml"
    out_path.write_text(yaml.safe_dump(schema, sort_keys=False))


if __name__ == "__main__":
    generate_spec()
