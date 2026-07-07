"""Pagination helpers."""

from flask import request


def get_pagination(default: int = 20, max_per_page: int = 100) -> tuple[int, int]:
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", default, type=int)
    page = max(page, 1)
    per_page = min(max(per_page, 1), max_per_page)
    return page, per_page


def paginate_query(query, page: int, per_page: int) -> dict:
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return {
        "items": items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page if total else 0,
        },
    }
