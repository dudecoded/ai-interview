import io
import re
from pathlib import Path

from docx import Document
from pypdf import PdfReader


# Basic skills dictionary.
# We can expand this later based on your project's needs.
SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "sql",
    "html",
    "css",
    "react",
    "node.js",
    "fastapi",
    "django",
    "flask",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "mongodb",
    "postgresql",
    "mysql",
    "sqlite",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "machine learning",
    "deep learning",
    "nlp",
    "rest api",
    "tailwind",
    "next.js",
    "vite",
}


def extract_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file."""

    reader = PdfReader(io.BytesIO(file_bytes))

    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""
        pages.append(text)

    return "\n".join(pages).strip()


def extract_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file."""

    document = Document(io.BytesIO(file_bytes))

    paragraphs = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            paragraphs.append(paragraph.text)

    return "\n".join(paragraphs).strip()


def extract_text(filename: str, file_bytes: bytes) -> str:
    """Choose the correct extractor based on file extension."""

    extension = Path(filename).suffix.lower()

    if extension == ".pdf":
        return extract_pdf(file_bytes)

    if extension == ".docx":
        return extract_docx(file_bytes)

    raise ValueError("Only PDF and DOCX files are supported")


def extract_skills(text: str) -> list[str]:
    """Find known skills mentioned in resume text."""

    lowered = text.lower()

    found = []

    for skill in SKILLS:
        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(skill)
            + r"(?![a-z0-9])"
        )

        if re.search(pattern, lowered):
            found.append(skill)

    return sorted(set(found))


def extract_profile(text: str) -> dict:
    """Create the basic structured resume profile."""

    return {
        "skills": extract_skills(text),
    }