from collections import Counter
from datetime import datetime

import pandas as pd
import seaborn as sns
from matplotlib.axes import Axes

from members.charts.consts import NAMES_TO_GENDER
from members.member import Member


def plot_age_distribution(ax: Axes, members: list[Member]):
    ages = [member.age for member in members if member.date_of_birth]
    sns.histplot(ages, bins=range(0, 110, 10), edgecolor='skyblue', color='skyblue', ax=ax)
    ax.set_title('Age Distribution of Members')
    ax.set_xlabel('Age')
    ax.set_ylabel('Number of Members')


def plot_age_and_gender_distribution(ax: Axes, members: list[Member]):
    df_members = pd.DataFrame.from_records([m.__dict__ for m in members])
    sns.histplot(data=df_members, x='age', hue='gender', ax=ax, bins=range(0, 110, 10), multiple='stack', palette='coolwarm')
    ax.set_title('Age & Gender Distribution of Members')
    ax.set_xlabel('Age')
    ax.set_ylabel('Number of Members')


def plot_length_of_membership_distribution(ax: Axes, members: list[Member]):
    lengths_of_membership = [member.length_of_membership for member in members if member.length_of_membership]
    sns.histplot(lengths_of_membership, edgecolor='skyblue', color='skyblue', binwidth=3, ax=ax)
    ax.set_title('Length of Membership Distribution')
    ax.set_xlabel('Years of Membership')
    ax.set_ylabel('Number of Members')
    ax.set_xticks(range(0, max(lengths_of_membership), 5))
    ax.grid(axis='y', linestyle='--', alpha=0.7)

def plot_pie_of_life_members(ax: Axes, members: list[Member]):
    lifetime_members = [member for member in members if member.lifetime_member]
    num_lifetime_members = len(lifetime_members)
    num_non_lifetime_members = len(members) - num_lifetime_members
    ax.pie([num_lifetime_members, num_non_lifetime_members], labels=['Life Members', 'Non-Life Members'],
           autopct='%1.1f%%', startangle=90)
    ax.set_title('Proportion of Life Members')

def plot_renewal_dates(ax: Axes, members: list[Member]):
    renewal_dates = [member.renewal_date for member in members if member.renewal_date]
    sns.histplot(renewal_dates, edgecolor='skyblue', color='skyblue', ax=ax)
    ax.set_title('Renewal Dates')
    ax.set_xlabel('Date')
    ax.set_ylabel('Number of Members')
    ax.set_xlim(datetime.now(), max(renewal_dates))
    ax.grid(axis='y', linestyle='--', alpha=0.7)

def plot_gender_distibution_pie(ax: Axes, members: list[Member]):
    genders = [NAMES_TO_GENDER[member.first_name] for member in members if member.first_name in NAMES_TO_GENDER]
    c = dict(Counter(genders))
    ax.pie(c.values(), labels=c.keys(), autopct='%1.1f%%', startangle=90)
    ax.set_title("Gender Distribution of Members")