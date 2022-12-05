import sys
import docx2txt
import re

data = docx2txt.process(sys.argv[1])
pattern = re.compile(r'[a-zA-Z0-9-\.]+@[a-zA-Z-\.]*\.(com|edu|net)')
matches = pattern.finditer(data)

pattern_number = re.compile(r'\+\d\d\d\d\d\d\d\d\d\d\d\d')
pattern_number2 = re.compile(r'\d\d\d\d\d\d\d\d\d\d')
matches_number = pattern_number.finditer(data)


for x in matches:
    print(x.group(0))
    break

for x in matches_number:
    print(x.group(0))
    break