import os
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Member:
    id: int
    first_name: str
    last_name: str
    town_city: str
    county: str
    country: str | None
    postcode: str
    location: tuple[float, float] | None
    date_joined: datetime | None
    years_of_membership: int | None
    length_of_membership: int | None
    lifetime_member: bool | None
    date_of_birth: datetime | None
    age: int | None
    gender: str | None
    renewal_date: datetime | None
