import sys
from pyresparser import ResumeParser
import os
from docx import Document
import docx2txt
# from resume_parser import resumeparse

#File format should be in .txt, .docx or .pdf only

# filed = input('./uploads/resume-user.pdf')

# data = resumeparse.read_file('./uploads/resume-user.pdf')

# print(data);

data = ResumeParser('./uploads/resume-lzolouy.docx')

print(data)

# try:
#     doc = Document()
#     with open(filed, 'r') as file:
#         doc.add_paragraph(file.read())
#     doc.save('text.docx')
#     data = ResumeParser('text.docx').get_extracted_data()
#     print(data['skills'])
# except:
#     data = ResumeParser(filed).get_extracted_data()
#     print(data['skills'])        


