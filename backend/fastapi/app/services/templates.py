import re
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup
from pathlib import Path

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"
env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)), autoescape=select_autoescape(['html','xml']))

def nl2br(value: str) -> str:
    """Convert newlines in ``value`` to HTML ``<br>`` tags."""
    return Markup(value.replace('\n', '<br>\n'))

env.filters['nl2br'] = nl2br

def render_letter(template_name: str, context: dict) -> str:
    """Render a letter template with the provided ``context``."""
    return env.get_template(template_name).render(**context)
