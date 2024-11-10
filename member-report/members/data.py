import os
from datetime import datetime
from typing import List

import gmplot
from cache_decorator import Cache

from members.charts.consts import NAMES_TO_GENDER
from members.member import Member

google_maps_api_key = os.getenv('GOOGLE_API_KEY')

def load_members(file_path: str) -> List[Member]:
    # Load CSV file and return a list of Member objects

    members = []
    with open(file_path, 'r') as file:
        for line in file:
            data = line.strip().split(',')
            if data[1] == '':
                continue
            member = Member(
                id=int(data[1]),
                first_name=data[2],
                last_name=data[3],
                town_city=data[4],
                county=data[5],
                country=data[7] if str.strip(data[7]) != "" else "England",
                postcode=data[6],
                date_joined=None,
                years_of_membership=None,
                life_member=False,
                date_of_birth=None,
                renewal_date=None,
                length_of_membership=None,
                age=None,
                gender=None,
                location=None
            )
            try:
                member.date_joined = datetime.strptime(data[8], '%d/%m/%Y')
            except ValueError:
                pass

            try:
                member.years_of_membership = int(data[9])
            except ValueError:
                if data[9] == 'LIFE':
                    member.life_member = True
                else:
                    member.life_member = False
            
            try:
                member.date_of_birth = datetime.strptime(data[10], '%d/%m/%Y')
            except ValueError:
                pass

            try:
                member.renewal_date = datetime.strptime(data[11], '%d/%m/%Y')
            except ValueError:
                pass

            if member.date_of_birth:
                member.age = datetime.now().year - member.date_of_birth.year

            member.gender = NAMES_TO_GENDER.get(member.first_name, "Unknown")

            if member.date_joined:
                member.length_of_membership = datetime.now().year - member.date_joined.year

            member.location = geocode_address(f"{member.town_city}, {member.county}, {member.country}, {member.postcode}")

            members.append(member)

    return members

@Cache(cache_dir="/tmp")
def geocode_address(address: str) -> tuple[float, float]:
    return gmplot.GoogleMapPlotter.geocode(address, apikey=google_maps_api_key)

