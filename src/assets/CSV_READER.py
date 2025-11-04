import os
import json

# --- File paths ---
base_dir = os.path.dirname(__file__)
csv_path = os.path.join(base_dir, "Roster.csv")
output_path = os.path.join(base_dir, "ClassData.json")

# --- Step 1: Read CSV manually ---
with open(csv_path, "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip()]

headers = lines[0].split(",")
rows = [dict(zip(headers, line.split(","))) for line in lines[1:]]

# --- Step 2: Helper functions ---
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
    """Convert grade or keywords to readable period names."""
    course_lower = course.lower()
    if "enrichment" in course_lower:
        return "Enrichment"
    if "colonial compass" in course_lower:
        return "Colonial Compass"
    grade = grade.strip()
    mapping = {"6": "6th Grade", "7": "7th Grade", "8": "8th Grade"}
    return mapping.get(grade, "Enrichment")

def shared_period(course):
    """Return True if this course should appear in both A and B days."""
    c = str(course).lower()
    return "enrichment" in c or "colonial compass" in c

# --- Step 3: Parse and clean students ---
students = []
for row in rows:
    first = row.get("First Name", "").strip()
    last = row.get("Last Name", "").strip()
    name = f"{first} {last}".strip()
    if not name:
        continue

    course = row.get("Course", "")
    grade = row.get("Grade", "")

    if shared_period(course):
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

# --- Step 4: Remove duplicates (same student + period + day) ---
unique_students = []
seen = set()
for s in students:
    key = (s["name"].lower(), s["period"], s["day"])
    if key not in seen:
        seen.add(key)
        unique_students.append(s)

# --- Step 5: Build JSON structure ---
result = {"A": [], "B": []}
period_order = ["6th Grade", "7th Grade", "8th Grade", "Enrichment", "Colonial Compass"]

def sort_by_lastname(lst):
    return sorted(lst, key=lambda x: x["name"].split()[-1].lower())

for day in ["A", "B"]:
    day_periods = {p: [] for p in period_order}
    for s in unique_students:
        if s["day"] == day:
            day_periods[s["period"]].append({"name": s["name"]})

    result[day] = [
        {"period": p, "students": sort_by_lastname(studs)}
        for p, studs in day_periods.items() if studs
    ]

# --- Step 6: Write JSON file ---
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2)

print(f"✅ JSON created at: {output_path}")
