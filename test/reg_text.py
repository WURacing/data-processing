import re
run_file = 'RUN001.CSV'
name_match = re.match(r"RUN\d{4}.CSV$", run_file, re.IGNORECASE)
