SCHEMA_HINT = """
name: string
contact: { email: string, phone: string, location: string, links: [string] }
summary: string
skills: [string]
experience: [
  { role: string, company: string, location: string, start: string, end: string, bullets: [string] }
]
projects: [
  { name: string, tech: [string], bullets: [string] }
]
education: [ { degree: string, school: string, year: string } ]
certifications: [string]
"""
