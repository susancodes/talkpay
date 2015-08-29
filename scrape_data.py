import requests
from bs4 import BeautifulSoup




def get_bls_data():
	"""Based on bls url, get data from soup"""

	the_url = 'http://www.bls.gov/cps/cpsaat39.htm'
	result = requests.get(the_url, auth=('user', 'pass'))
	content= result.content
	soup = BeautifulSoup(content, "html.parser")

	soup.prettify()#Turns the soup into a nicely formated Unicode string
		
	return soup

def get_title(soup):
	"""	Get all the position titles as a dictionary"""

	bls_data = []

	table = soup.find("table", {"class": "regular"})
	for th in table.find_all("th"):
		for title in th.find_all(text=True):
			bls_data.append(title.encode('utf-8'))

	bls_data =bls_data[11:] 
	return bls_data


def get_median(soup):
	"""Get average salary of men and women for each occupation """

	table = soup.find("table", {"class": "regular"})
	
	count = 0
	track = {}
	for row in table.find_all("tr"):
		for data in row.find_all("span", {"class": "datavalue"}):
			raw = data.contents[0].encode('utf-8')
			if raw == "-":
				raw = None
			elif raw.isdigit() == False:
				raw = raw.replace(',', '')
				raw = int(raw.replace('$', ''))*52
			else:
				raw = int(raw)*52
			track.setdefault(count, []).append(raw)
			# track.setdefault(count, []).append(data.contents[0].encode('utf-8'))
		count += 1

	salaries = []	
	for key, salary in sorted(track.items()):
		salaries.append(salary)	

	return salaries

def get_title_and_salaries():
	"""Return a dictionary {title: [0, 1, 2, 3, 4, 5]}
	index 1, 3, 5 are salary of both gender, men, and women respectively """
	soup = get_bls_data()
	title = get_title(soup)
	track = get_median(soup)
	results = dict(zip(title, track))
	return  results

get_title_and_salaries()










