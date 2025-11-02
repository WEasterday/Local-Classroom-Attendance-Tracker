import os
import json

# --- File paths ---
base_dir = os.path.dirname(__file__)
csv_path = os.path.join(base_dir, "Roster.csv")
output_path = os.path.join(base_dir, "ClassData.json")

# --- Read CSV manually ---
with open(csv_path, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip()]

headers = lines[0].split(",")
rows = [dict(zip(headers, line.split(","))) for line in lines[1:]]

# --- Helper functions ---
def get_day(course):
    """Determine if the course belongs to A or B day (odd = A, even = B)."""
    if not course:
        return None
    parts = course.split("-")
    last = parts[-1]
    digits = "".join([c for c in last if c.isdigit()])
    if not digits:
        return None
    return "A" if int(digits) % 2 == 1 else "B"

def get_period(grade, course):
    """Convert grade number or enrichment keyword to readable period name."""
    if "enrichment" in course.lower():
        return "Enrichment"
    grade = grade.strip()
    mapping = {"6": "6th Grade", "7": "7th Grade", "8": "8th Grade"}
    if grade in mapping:
        return mapping[grade]
    return "Enrichment"

def is_enrichment_course(course):
    """Return True if this row represents an Enrichment class."""
    return "enrichment" in str(course).lower()

# --- Parse and clean student list ---
students = []
for row in rows:
    first = row.get("First Name", "").strip()
    last = row.get("Last Name", "").strip()
    name = f"{first} {last}".strip()
    if not name:
        continue

    course = row.get("Course", "")
    grade = row.get("Grade", "")

    # Enrichment goes in both A and B days
    if is_enrichment_course(course):
        days = ["A", "B"]
    else:
        d = get_day(course)
        days = [d] if d else []

    for day in days:
        students.append({
            "name": name,
            "first": first,
            "last": last,
            "period": get_period(grade, course),
            "day": day,
        })

# --- Remove duplicates (same student + period + day) ---
unique_students = []
seen = set()

for s in students:
    key = (s["name"].lower(), s["period"], s["day"])
    if key not in seen:
        seen.add(key)
        unique_students.append(s)

# --- Build A/B structure ---
result = {"A": [], "B": []}
period_order = ["6th Grade", "7th Grade", "8th Grade", "Enrichment"]

def sort_by_lastname(lst):
    return sorted(lst, key=lambda x: x["name"].split()[-1].lower())

for day in ["A", "B"]:
    day_periods = {p: [] for p in period_order}

    for s in unique_students:
        if s["day"] == day:
            day_periods[s["period"]].append({"name": s["name"]})

    # Sort and structure
    result[day] = [
        {"period": p, "students": sort_by_lastname(studs)}
        for p, studs in day_periods.items() if studs
    ]

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2)

print(f"✅ JSON created at: {output_path}")
