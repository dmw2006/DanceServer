import csv
import os
from pathlib import Path

# Folder paths
SCRIPT_DIR = Path(__file__).parent
INPUT_FOLDER = SCRIPT_DIR / "input"
OUTPUT_FOLDER = SCRIPT_DIR / "output"

# File names
INPUT_CSV = "rptCOIEDI.csv"
OUTPUT_TXT = "rptCOIEDI_fixed.txt"

# Field layout: (column_name, width, pad_type)
FIELDS = [
    ("CICOI_ID", 10, "z"),
    ("CICOI_STATUS_CODE", 2, "r"),
    ("CICOI_DOC_TYP", 3, "r"),
    ("CICOI_DUNS_NUM", 9, "z"),
    ("CICOI_LESSEE_NUM", 6, "z"),
    ("CICOI_NR_NUM", 6, "z"),
    ("CICOI_DISTRICT", 5, "z"),
    ("CICOI_LOC_CD", 5, "z"),
    ("CICOI_FIS_CUST", 6, "z"),
    ("CICOI_CUS_NAME", 40, "r"),
    ("CICOI_VEH_NUM", 6, "z"),
    ("CICOI_VEH_VIN_NUM", 17, "r"),
    ("CICOI_POLICY_NUM", 20, "r"),
    ("CICOI_CSL", 8, "z"),
    ("CICOI_CUST_SIGN_DATE", 8, "z"),
    ("CICOI_COVER_DMGLIBBOTH", 1, "r"),
    ("CICOI_PD_EXPIRATION_DATE", 8, "z"),
    ("CICOI_LIAB_EXPIRATION_DATE", 8, "z"),
    ("CICOI_DAMG_DEDUCTABLE", 6, "z"),
    ("CICOI_LIAB_DEDUCTABLE", 6, "z"),
    ("CICOI_DUAL_OR_CSL", 1, "r"),
    ("CICOI_SUB_FLAG_LIAB", 1, "r"),
    ("CICOI_SUB_FLAG_PD", 1, "r"),
    ("CICOI_HAZMAT", 1, "r"),
    ("CICOI_EXCESS_UMBRELLA_FLAG", 1, "r"),
    ("CICOI_EXCESS_UMBRELLA", 1, "r"),
    ("CICOI_SELF_INSURED", 1, "r"),
    ("CICOI_INSURANCE_PROVIDER1", 40, "r"),
    ("CICOI_INSURANCE_PROVIDER2", 40, "r"),
    ("CICOI_AM_BEST_RATING", 1, "r"),
    ("CICOI_AGENT_NAME", 40, "r"),
    ("CICOI_AGENT_ADDRESS1", 40, "r"),
    ("CICOI_AGENT_ADDRESS2", 40, "r"),
    ("CICOI_AGENT_ADDRESS3", 40, "r"),
    ("CICOI_AGENT_PHONE", 14, "r"),
    ("CICOI_AGENT_FAX", 14, "r"),
    ("CICOI_AGENT_EMAIL", 50, "r"),
    ("CICOI_LETTER_PREFERENCE", 1, "r"),
    ("CICOI_ASSOCIATE_LESSEE_TO_NR", 1, "r"),
    ("CICOI_CREATE_BY_USER", 10, "r"),
    ("CICOI_COMMENTS", 100, "r"),
    ("CICOI_SCAN_DATE", 8, "z"),
    ("CICOI_SCAN_TIME", 6, "z"),
    ("CICOI_SUCCESS_FAIL", 1, "r"),
    ("CICOI_ERROR_MESSAGE", 100, "r"),
    ("CICOI_ID_REF", 10, "z"),
    ("CICOI_PROCESS_FLAG", 1, "r"),
    ("SharepointID", 10, "z"),
]

def pad(value, width, pad_type):
    """Pad a value to specified width.
    
    Args:
        value: The value to pad
        width: Target width
        pad_type: 'z' for zero-fill, 'r' for right-pad with spaces
    """
    value = (value or "").strip()
    if len(value) > width:
        return value[:width]
    if pad_type == "z":
        return value.zfill(width)
    return value.ljust(width)

def main():
    # Create folders if they don't exist
    INPUT_FOLDER.mkdir(exist_ok=True)
    OUTPUT_FOLDER.mkdir(exist_ok=True)
    
    input_path = INPUT_FOLDER / INPUT_CSV
    output_path = OUTPUT_FOLDER / OUTPUT_TXT
    
    # Check if input file exists
    if not input_path.exists():
        print(f"ERROR: Input file not found: {input_path}")
        print(f"Please place {INPUT_CSV} in the {INPUT_FOLDER} folder")
        return
    
    with open(input_path, newline="", encoding="utf-8") as csvfile, \
         open(output_path, "w", encoding="latin-1", newline="\r\n") as outfile:

        reader = csv.DictReader(csvfile)
        row_count = 0

        for row in reader:
            line = "".join(
                pad(row.get(col), width, pad_type)
                for col, width, pad_type in FIELDS
            )
            outfile.write(line + "\r\n")
            row_count += 1

    print(f"✓ Fixed-width file created: {output_path}")
    print(f"✓ Processed {row_count} rows")

if __name__ == "__main__":
    main()
